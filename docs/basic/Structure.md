---
title: 结构体
author: T8840
date: '2023-01-15'
---

## 结构体定义
结构体是由一系列具有相同类型或不同类型的数据构成的数据集合。

结构体定义需要使用 type 和 struct 语句。struct 语句定义一个新的数据类型，结构体中有一个或多个成员。type 语句设定了结构体的名称。结构体的格式如下：
```go
type struct_variable_type struct {
   member definition
   member definition
   ...
   member definition
}
// 一旦定义了结构体类型，它就能用于变量的声明，语法格式如下：
// 直接赋值
variable_name := structure_variable_type {value1, value2...valuen}
// 或 k-v形式
variable_name := structure_variable_type { 
    key1: value1, 
    key2: value2..., 
    keyn: valuen
}
```
如果结构体类型只在它定义的包内使用，那么我们可以将类型名的首字母小写；  
还可以用空标识符“_”作为结构体类型定义中的字段名称。这样以空标识符为名称的字
段，不能被外部包引用，甚至无法被结构体所在的包使用。

## 使用结构体
```go
type Course struct {
	Name string
	Price int
}
```
### 空结构体
定义一个空结构体，也就是没有包含任何字段的结构体类型
```go
type Empty struct{} // Empty是一个不包含任何字段的空结构体类型
var s Empty
println(unsafe.Sizeof(s)) // 0
```
输出的空结构体类型变量的大小为0，也就是说，空结构体类型变量的内存占用为0。基于空结构体类型内存零开销这样的特性，我们在日常Go开发中会经常使用空结构体类型元素，作为一种“事件”信息进行Goroutine之间的通信。
```go
var c = make(chan Empty) // 声明一个元素类型为Empty的channel
c<-Empty{} // 向channel写入一个“事件”
```
这种以空结构体为元素类建立的channel，是目前能实现的、内存占用最小的Goroutine间通信方式。

### 零值结构体和nil结构体
如果不给结构体赋值，go语言会默认给每个字段采用默认值。
零值结构体是会实实在在占用内存空间的，只不过每个字段都是零值。如果结构体里面字段非常多，那么这个内存空间占用肯定也会很大。

而nil 结构体是指结构体指针变量没有指向一个实际存在的内存。这样的指针变量只会占用 1 个指针的存储空间，也就是一个机器字的内存大小。 

多种方式零值初始结构体
```go
var d1 Course = Course{}
var d2 Course
var d3 *Course = new(Course) // 使用new()函数来创建一个零值结构体
var d4 *Course = &Course{}
fmt.Println(d1.Price,d2.Price,d3.Price,d4.Price)
// 下面这种方式会报异常是因为只申明不赋值默认值是nil
var d5 *Course
fmt.Println(d5.Price) // panic: runtime error: invalid memory address or nil pointer dereference
```
如果一种类型采用零值初始化得到的零值变量，是有意义的，而且是直接可用的，我称这种类型为“零值可用”类型。可以说，定义零值可用类型是简化代码、改善开发者使用体验的一种重要的手段。  
在Go语言标准库和运行时的代码中，有很多践行“零值可用”理念的好例子，最典型的莫过
于sync包的Mutex类型了。Mutex是Go标准库中提供的、用于多个并发Goroutine之间进行同步的互斥锁。  

在Go语言中，我们只需要这几行代码就可以了：
```go
var mu sync.Mutex
mu.Lock()
mu.Unlock()
```
Go标准库的设计者很贴心地将sync.Mutex结构体的零值状态，设计为可用状态，这样开发者便可直接基于零值状态下的Mutex进行lock与unlock操作，而且不需要额外显式地对它进行初始化操作了。  

Go标准库中的bytes.Buffer结构体类型，也是一个零值可用类型的典型例子
```go
var b bytes.Buffer
b.Write([]byte("Hello, Go"))
fmt.Println(b.String()) // 输出：Hello, Go
```
我们不需要对bytes.Buffer类型的变量b进行任何显式初始化，就可以直接通过
处于零值状态的变量b，调用它的方法进行写入和读取操作。  

### 赋值结构体
Go语言并不推荐我们按字段顺序对一个结构体类型变量进行显式初始化，甚至Go官
方还在提供的go vet工具中专门内置了一条检查规则：“composites”，用来静态检查代码中结构体变量初始化是否使用了这种方法，一旦发现，就会给出警告。  
Go推荐我们用“field:value”形式的复合字面值，对结构体类型变量进行显式初始化，这种方式可以降低结构体类型使用者和结构体类型设计者之间的耦合，这也是Go语言的惯用法。“field:value”形式字面值中的字段可以以任意次序出现。未显式出现在字面值中的结构体字段（比如上面例子中的F5）将采用它对应类型的零值。  
比较少使用new这一个Go预定义的函数来创建结构体变量实例。
```go
type T struct {
 F1 int
 F2 string
 f3 int
 F4 int
 F5 int
}
// 字段顺序赋值不推荐用法
var t = T{11, "hello", 13} // 错误：implicit assignment of unexported field 'f3' in T literal
或
var t = T{11, "hello", 13, 14, 15} // 错误：implicit assignment of unexported field 'f3' in T literal

// 推荐用法：复合字面值
var t = T{
 F2: "hello",
 F1: 11,
 F4: 14,
}

// 比较少使用
tp := new(T)
```

### 使用特定的构造函数
使用特定的构造函数创建并初始化结构体变量的例子，并不罕见。在Go标准库中就有
很多，其中time.Timer这个结构体就是一个典型的例子
```go
// $GOROOT/src/time/sleep.go
type runtimeTimer struct {
 pp uintptr
 when int64
 period int64
 f func(interface{}, uintptr) 
 arg interface{}
 seq uintptr
 nextwhen int64
 status uint32
}
type Timer struct {
 C <-chan Time
 r runtimeTimer
}

// $GOROOT/src/time/sleep.go
func NewTimer(d Duration) *Timer {
 c := make(chan Time, 1)
 t := &Timer{
 C: c,
 r: runtimeTimer{
 when: when(d),
 f: sendTime,
 arg: c,
 },
 }
 startTimer(&t.r)
 return t
}
```
Timer结构体中包含了一个非导出字段r，r的类型为另外一个结构体类型
runtimeTimer。这个结构体更为复杂，而且我们一眼就可以看出来，这个runtimeTimer结构体不是零值可用的，那我们在创建一个Timer类型变量时就没法使用显式复合字面值的方式了。这个时候，Go标准库提供了一个Timer结构体专用的构造函数NewTimer。NewTimer这个函数只接受一个表示定时时间的参数d，在经过一个复杂的初始化
过程后，它返回了一个处于可用状态的Timer类型指针实例。

像这类通过专用构造函数进行结构体类型变量创建、初始化，它们的专用构造函数大多都符合这种模式：
```go
func NewT(field1, field2, ...) *T {
 ... ...
}
```
NewT是结构体类型T的专用构造函数，它的参数列表中的参数通常与T定义中的导出字段相对应，返回值则是一个T指针类型的变量。T的非导出字段在NewT内部进行初始化，一些
需要复杂初始化逻辑的字段也会在NewT内部完成初始化。这样，我们只要调用NewT函数就
可以得到一个可用的T指针类型变量了。

### 访问结构体成员

```go
c1 :=Course{Name:"Python",Price:1000}
fmt.Println(c1.Name,c1.Price)

c2 :=&Course{Name:"Go",Price:1000}
fmt.Println(c2.Name,c2.Price) // 这里其实是go语言的语法糖,go语言内部会将c2.Name转换成(*c2).Name
// fmt.Println((*c2).Name,(*c2).Price)
c3 :=Course{}
fmt.Println(c3.Name,c3.Price) // 0
```

### 结构体的拷贝
- 结构体之间可以相互赋值，它在本质上是一次浅拷贝操作，拷贝了结构体内部的所有字段。
- 结构体指针之间也可以相互赋值，它在本质上也是一次浅拷贝操作，不过它拷贝的仅仅是指针地址值，结构体的内容是共享的
```go
c4:=c1
c1.Price = 3000
fmt.Println(c1.Name,c1.Price) // Python 3000
fmt.Println(c4.Name,c4.Price) // Python 1000
c5:=c2
c2.Price = 4000
fmt.Println(c2.Name,c2.Price) // Go 4000
fmt.Println(c5.Name,c5.Price) // Go 4000
```
### 结构体绑定方法
Go 语言的结构体方法里面没有 self 和 this 这样的关键字来指代当前的对象，它是用户自己定义的变量名称，通常我们都使用单个字母来表示。 
例子：给Course结构体添加查询方法
```go
type Course struct {
	Name string
	Price int
}
// 函数值传递
func(c Course) printCourseInfo() {
    fmt.Printf("课程名：%s, 课程价格：%d",c.Name,c.Price)
}

func(c Course) setCoursePrice(price int) {
    c.Price = price
}
// 函数指针传递
func(c *Course) setCPrice(price int) {
    c.Price = price
}

func main() {
    e1 := Course{"Java",3000}
    e1.printCourseInfo()
    // 使用函数值传递无法修改结构体值
    e1.setCoursePrice(1000)
    e1.printCourseInfo()
    // 使用函数指针传递可修改结构体值
    e1.setCPrice(2000)
    e1.printCourseInfo()

}

```
结构体的接收者有两种形式
- 值传递
- 指针传递  
如果想修改结构体的值或结构体的数据很大，使用指针传递。  
结构体指针方法和值方法在调用时形式上是没有区别的，只不过一个可以改变结构体内部状态，而另一个不会。指针方法使用结构体值变量可以调用，值方法使用结构体指针变量也可以调用。结构体的值类型和指针类型访问内部字段和方法在形式上是一样的。这点不同于 C++ 语言，在 C++ 语言里，值访问使用句点 . 操作符，而指针访问需要使用箭头 -> 操作符。     
通过指针访问内部的字段需要 2 次内存读取操作，第一步是取得指针地址，第二部是读取地址的内容，它比值访问要慢。但是在方法调用时，指针传递可以避免结构体的拷贝操作，结构体比较大时，这种性能的差距就会比较明显。     
还有一些特殊的结构体它不允许被复制，比如结构体内部包含有锁时，这时就必须使用它的指针形式来定义方法，否则会发生一些莫名其妙的问题。  

另一个例子
```go
package main

import "fmt"
import "math"

type Circle struct {
 x int
 y int
 Radius int
}

// 面积
func (c Circle) Area() float64 {
 return math.Pi * float64(c.Radius) * float64(c.Radius)
 // Go 语言不喜欢类型的隐式转换，所以需要将整形显示转换成浮点型，不是很好看，不过这就是 Go 语言的基本规则，显式的代码可能不够简洁，但是易于理解。
}

// 周长
func (c Circle) Circumference() float64 {
 return 2 * math.Pi * float64(c.Radius)
}

func (c *Circle) expand() {
  c.Radius *= 2
}
func main() {
 var c = Circle {Radius: 50}
 fmt.Println(c.Area(), c.Circumference())
 // 指针变量调用方法形式上是一样的
 var pc = &c
 fmt.Println(pc.Area(), pc.Circumference())
}
```
### 通过内嵌结构体实现继承效果
go语言不支持结构体继承，但可以通过组合这种设计模式达到继承效果。  
例子： 
```go
type Teacher struct {
	Name string
	Age int
}
type Course struct {
    Teacher Teacher
	Name string
	Price int
}
func main() {

f1 := Course{
    Teacher: Teacher{
        Name : "Tom",
        Age: 18,
    },
    Name: "Go",
	Price: 3900,
}
fmt.Printf("课程名：%s, 课程价格：%d, 授课老师姓名：%s",f1.Name,f1.Price,f1.Teacher.Name)
	
```
#### 匿名嵌套
优化上面的例子  
```go
type Teacher struct {
	Name string
	Age int
}
type Course struct {
    Teacher // 主要改动这里
	Name string
	Price int
}
func main() {

f1 := Course{
     Teacher: Teacher{
        Name : "Tom",
        Age: 18,
    },
    Name: "Go",
	Price: 3900,
}
// 内部类型属性可以被提升到外部属性
fmt.Printf("课程名：%s, 课程价格：%d, 授课老师姓名：%s,授课老师年龄：%d",f1.Name,f1.Price,f1.Teacher.Name,f1.Age) // Course没有Age字段可以直接使用f1.Age来代替f1.Teacher.Age
```
### 结构体标签
结构体的字段除了名字和类型外，还可以有一个可选的标签（tag）：它是一个附属于字段的字符串，可以是文档或其他的重要标记。  
比如在我们解析json或生成json文件时，常用到encoding/json包，它提供一些默认标签，例如：omitempty标签可以在序列化的时候忽略0值或者空值。而-标签的作用是不进行序列化，其效果和和直接将结构体中的字段写成小写的效果一样。
```go
type Info struct {
    Name string
    Age  int `json:"age,omitempty"`
    Sex  string
}

```
在序列化和反序列化的时候，也支持类型转化等操作。如

```go
type Info struct {
    Name string
    Age  int   `json:"age,string"`
    //这样生成的json对象中，age就为字符串
    Sex  string
}
```
示例：
```go
type People struct {
    Name string `json:"name"` // 输出的时候key转为name
    Age  int    `json:"age,omitempty"` // 在序列化的时候忽略0值或者空值
    Sex  string `json:"sex,required"`
	Height  int    `json:"height,string"` // 在序列化的时候转换为string
	Hobby  string   `json:"-"` // 不输出

}

person :=People {
		Name: "Lucy",
        Age:  0,
        Sex:  "male",
		Height: 180,
		Hobby: "love music",
}

re,_ :=json.Marshal(person)
fmt.Println("Json:", string(re)) // {"name":"Lucy","sex":"male","height":"180"}

```

#### 用反射获取到自定义的结构体标签

现在来了解下如何设置自定义的标签，以及如何像官方包一样，可以通过标签，对字段进行自定义处理。要实现这些，我们要用到reflect包。

```go
package main

import (
    "fmt"
    "reflect"
)

const tagName = "Testing"

type Info struct {
    Name string `Testing:"-"`
    Age  int    `Testing:"age,min=17,max=60"`
    Sex  string `Testing:"sex,required"`
}

func main() {
    info := Info{
        Name: "benben",
        Age:  23,
        Sex:  "male",
    }

    //通过反射，我们获取变量的动态类型
    t := reflect.TypeOf(info)
    fmt.Println("Type:", t.Name())
    fmt.Println("Kind:", t.Kind())

    for i := 0; i < t.NumField(); i++ {
        field := t.Field(i) //获取结构体的每一个字段
        tag := field.Tag.Get(tagName)
        fmt.Printf("%d. %v (%v), tag: '%v'\n", i+1, field.Name, field.Type.Name(), tag)
    }
}    
```
#### 常用的结构体标签键
常用的结构体标签Key，指的是那些被一些常用的开源包声明使用的结构体标签键。在这里总结了一些，都是一些我们平时会用到的包，它们是：
- json:  由encoding/json 包使用，详见json.Marshal()的使用方法和实现逻辑。
- xml :  由encoding/xml包使用，详见xml.Marshal()。
- bson:  由gobson包，和mongo-go包使用。
- protobuf:  由github.com/golang/protobuf/proto 使用，在包文档中有详细说明。
- yaml:  由gopkg.in/yaml.v2 包使用，详见yaml.Marshal()。
- gorm:  由gorm.io/gorm包使用，示例可以在GORM的文档中找到。


### 结构体占用内存的大小
#### 使用Sizeof来查看对象占用的长度
```go
fmt.Println(unsafe.Sizeof(c1)) // c1结构体包含1个字符串和1个int64类型，在64机器上字符串占用16字节，int64占用8字节，合起来为结构体占用大小
```

### 结构体类型的内存布局
结构体类型是既数组类型之后，又一个以平铺形式存放在连续内存块中的类型。不过与数组类型不同，由于内存对齐的要求，结构体类型各个相邻字段间可能存在“填充物”，结构体的尾部同样可能被Go编译器填充额外的字节，满足结构体整体对齐的约束。正是因为这点，我们在定义结构体时，一定要合理安排字段顺序，要让结构体类型对内存空间的占用最小。


##  Go语言内置的高级数据结构都是由结构体来完成的
通过观察 Go 语言的底层源码，可以发现所有的 Go 语言内置的高级数据结构都是由结构体来完成的。
### string本质是结构体
```go
type slice struct {
    Data uintptr // 指针占8个长度
    Len int // 长度，64位系统占8个长度
    
}
```
在64位机器上将会占用 16 个字节

### slice本质是结构体
```go
type slice struct {
    array unsafe.Pointer // 底层数组的地址
    len int // 长度
    cap int // 容量
}
```
切片头的结构体形式如下，它在64位机器上将会占用 24 个字节。 
```go
s1 := []string{"python","go","java","cplus"}
fmt.Println(unsafe.Sizeof(s1)) 
```
slice的函数传递本质上也是值传递。

### map本质是结构体
在64位机器上map将会占用8个字节
```go
m1 := map[string]string{
    "course1":"python",
    "course2":"go",
    "course3":"java",
    "course4":"cplus",
}
fmt.Println(unsafe.Sizeof(m1)) 
```
## 大小写在go语言中的重要性
大小写在go语言中起到是否可见的作用：
- 一个包中的变量或者结构体如果首字母是小写，那么对于另一个包不可见
- 结构体定义的名称以及属性首字母大写很重要


## type关键字

type关键字的作用常用以下5钟情况

### 作用1：给一个类型定义为别名
类型别名的形式只是多了一个等号，但正是这个等号让新类型T与原类型S完全等价。完全等价的意思就是，类型别名并没有定义出新类型，T与S实际上就是同一种类型，它们只是一种类型的两个名字罢了，就像一个人有一个大名、一个小名一样。  
如：byte，本质上仍然是uint8，但go定义为byte是为了代码的可读性，强调我们现在处理的对象是字节类型.
```go
// 形式
type T = S // type alias

type MyByte = byte
var m MyByte
fmt.Printf("%T",m) // uint8
```
### 作用2：基于一个已有的类型定义一个新的类型
```go
// 形式
// 在这里，S可以是任何一个已定义的类型，包括Go原生类型，或者是其他已定义的自定义类型
type T S // 定义一个新类型T

type MyInt int
var n MyInt
fmt.Printf("%T",n) // main.MyInt

// 这段代码中，新类型T1是基于Go原生类型int定义的新自定义类型，而新类型T2则是基于刚刚定义的类型T1，定义的新类型
type T1 int 
type T2 T1
```
引入一个新概念，底层类型。如果一个新类型是基于某个Go原生类型定义的，那么我们就叫Go原生类型为新类型的底层类型（Underlying Type)。比如这个例子中，类型int就是类型T1的底层类型。
这里，T2是基于T1类型创建的，那么T2类型的底层类型就是T1的底层类型，而T1的底层类型我们已经知道了，是类型int，那么T2的底层类型也是类型int。  
为什么我们要提到底层类型这个概念呢？因为底层类型在Go语言中有重要作用，它被用来判断两个类型本质上是否相同（Identical）。  
在上面例子中，虽然T1和T2是不同类型，但因为它们的底层类型都是类型int，所以它们在本质上是相同的。而本质上相同的两个类型，它们的变量可以通过显式转型进行相互赋值，相反，如果本质上是不同的两个类型，它们的变量间连显式转型都不可能，更不要说相互赋值了。
```go
type T1 int
type T2 T1
type T3 string
func main() {
 var n1 T1
 var n2 T2 = 5
 n1 = T1(n2) // ok
 
 var s T3 = "hello"
 n1 = T1(s) // 错误：cannot convert s (type T3) to type T1
}
```

### 作用3：基于类型字面值定义一个新的类型
基于类型字面值来定义新类型，这种方式多用于自定义一个新的复合类型，比如：
```go
type M map[int]string
type S []string
```
、




### 作用4：定义结构体
见本章

### 作用5：定义接口
见Interface章节

### 作用6：定义函数别名

## go语言特殊地方
go语言不支持面向对象与不是面向对象语言在于它的结构体不支持多态，它不能算是一个严格的面向对象语言。
面向对象几个基本特征：
- 封装
- 继承  
go使用嵌套方式可以实现继承。所谓的继承仅仅是形式上的语法糖，c.show() 被转换成二进制代码后和 c.Point.show() 是等价的，c.x 和 c.Point.x 也是等价的。
- 多态  
多态是指父类定义的方法可以调用子类实现的方法，不同的子类有不同的实现，从而给父类的方法带来了多样的不同行为。但是go语言支持鸭子类型，使用接口的方式可以实现多态。
- 方法重载
- 抽象基类  
定义struct时由于go语言没有class概念对新学习编程的人会少理解很多面向对象的概念  
