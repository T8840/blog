---
title: 接口
author: T8840
date: '2023-01-15'
---

## 接口定义

Go 语言提供了另外一种数据类型即接口，它把所有的具有共性的方法定义在一起，任何其他类型只要实现了这些方法就是实现了这个接口。
接口就是一个协议，也是一种抽象类型，是用来定义行为的类型。这些被定义的行为不由接口直接实现，而是通过方法由用户定义的类型实现。  
如果用户定义的类型实现了某个接口类型声明的一组方法，那么这个用户定义的类型的值就可以赋给这个接口类型的值。这个赋值就把用户定义的类型的值存入接口类型的值。 
对接口值方法的调用会秩序接口值里存储的用户定义的类型的值对应的方法。因为任何用户定义的类型都可以实现任何接口，所以对接口值方法的调用自然是一种多态。在这个关系里，用户定义的类型通常叫做实体类型，原因是如果离开内部存储的用户定义的类型的值的实现，接口值并没有具体的行为。
实体值赋值后接口值的简图：

``` go
/* 定义接口 */
type interface_name interface {
   method_name1 [return_type]
   method_name2 [return_type]
   method_name3 [return_type]
   ...
   method_namen [return_type]
}

/* 定义结构体 */
type struct_name struct {
   /* variables */
}

/* 实现接口方法 */
func (struct_name_variable struct_name) method_name1() [return_type] {
   /* 方法实现 */
}
// ...
func (struct_name_variable struct_name) method_namen() [return_type] {
   /* 方法实现*/
}
```

示例：
```go

package main

import (
	"fmt"
)

// notifier是一个定义了通知类行为的接口
type notifier interface {
	notify()
}

// user在程序里定义一个用户类型
type user struct {
	name string
	email string
}
// notify使用指针接收者实现了notifier接口
func (u *user) notify() {
	fmt.Printf("Sending user email to %s<%s>\n",u.name,u.email)
}

// admin在程序里定义管理员
type admin struct {
	name string
	email string
}
// notify使用指针接收者实现了notifier接口
func (a *admin) notify() {
	fmt.Printf("Sending admin email to %s<%s>\n",a.name,a.email)
}

// 多态函数提供多态的行为，这个函数接受一个实现了notifer接口的值作为参数。
func sendNotification(n notifier) {
	n.notify()
}

func main() {
	// 创建一个user值并传给sendNotification
	bill := user{"Bill", "bill@email.com"}
	sendNotification(&bill)

	// 创建一个user值并传给sendNotification
	lisa := admin{"Lisa", "lisa@email.com"}
	sendNotification(&lisa)
}
```
## 空接口

## Interface的应用模式



## Go Interface的作用
那么 Interface 除了可以实现多态，比较重要的亮点。

### 用法一：依赖反转，让代码结构更整洁

我们来说一个比较常见的场景，一个 HTTP 接口，需要依赖数据库来获取用户得分并返回给调用方。比较直接的写法如下:
```go
db := orm.NewDatabaseConnection()  // 建立数据库链接
res := db.Query("select score from user where user == 'xxx'")   // 通过 SQL 语句查询数据
return HTTP.Json(res) // 通过 Json 返回给调用方
```
这样写的坏处是，让 HTTP 的接口依赖了具体数据库底层的接口及实现，在数据库查询的功能没有开发完成时，HTTP 接口是不能开始开发的。同时对于如果后续存在更换数据库的可能，也不是很容易的扩展。比较推荐的写法是下面这样:
```go
type UserDataStore interface {

    GetUserScore(ctx context.Context, id string) (int, error)
    DeleteUser(ctx context.Context, id string) error
}

// GetUserScoreHandler creates an HTTP handler that can get a user's score
func GetUserScoreHandler(userDataStore UserDataStore) http.HandlerFunc {
    return func(res http.ResponseWriter, req *http.Request) {
        id := req.Header.Get("x-user-id")
        score, err := userDataStore.GetUserScore(req.Context(), id)
        if err != nil {
            fmt.Println("userDataStore.GetUserScore: ", err)
            res.WriteHeader(500)
            return
        }

        res.Write([]byte(fmt.Sprintf("%d", score)))
    }
}
```
通过定义 Interface，将数据库与 HTTP 接口进行解耦，HTTP 接口不再依赖实际的数据库，代码可以单独的编写和编译，代码依赖和结构更加的清晰了。数据具体的实现逻辑只需按 Interface 实现对应的接口就可以了，最终实现了依赖的整体的反转。

### 用法二：提高程序的可测试性
回到刚才那个例子，如果我要对这个 HTTP 接口的逻辑做测试，我可以怎么做？如果你没有使用 Interface，那么测试肯定要依赖一个实际的 DB，我想你会去新建一个测试库，同时新建一些测试数据。
真的需要这样么？我们来一个比较好的实践。通过 Interface，可以很容易的实现一个 Mock 版本的类型，通过替换逻辑可以很方便的实现测试数据的构造。
```go
type mockUserDataStore struct {
    pendingError error
    pendingScore int
    deletedUsers []string
}

func (m *mockUserDataStore) GetUserScore(ctx context.Context, id string) (int, error) {
    return m.pendingScore, m.pendingError
}

func (m *mockUserDataStore) DeleteUser(ctx context.Context, id string) error {
    if m.pendingError != nil {
        return m.pendingError
    }

    m.deletedUsers = append(m.deletedUsers, id)
    return nil
}
```
以上就可以很方便的去控制接口调用的时候，获取用户得分和删除用户的逻辑。实际的测试也就变得简单了，也不用依赖真实的 DB，让测试更加的可靠了。
```go
func TestGetUserScoreHandlerReturnsScore(t *testing.T) {
    req := httptest.NewRequest("GET", "/idk", nil)
    res := httptest.NewRecorder()

    userDataStore := &mockUserDataStore{
        pendingScore: 3,  // mock 数据
    }

    handler := GetUserScoreHandler(userDataStore)   // 将 Mock 的方法传递到实际调用的地方，实现动态的替换
    handler(res, req)

    resultStr := string(res.Body.Bytes())
    expected := fmt.Sprintf("%d", userDataStore.pendingScore)

    if res.Code != 200 {
        t.Errorf("Expected HTTP response 200 but got %d", res.Code)
    }

    if resultStr != expected {
        t.Errorf("Expected body to contain value %q but got %q", expected, resultStr)
    }
}
```

## go的error是一个接口
//go语言本身也推荐鸭子类型  error
```go
//var err error = errors.New(fmt.Sprintf(""))
s := "文件不存在"
var err error = fmt.Errorf("错误:%s", s)
fmt.Println(err)
```

## 大小写的重要性


## Interface更多例子

https://github.com/Evertras/go-interface-examples

## 对比java接口
java里面一种类型只要继承一个接口才行，如果继承了这个接口的话，那么这个接口里面的所有的方法都必须全部实现。

## 组合

