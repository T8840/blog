---
title: 语句
author: T8840
date: '2023-01-15'
---
Go语言是站在C语言等的肩膀之上诞生与成长起来的。Go语言继承了
C语言的很多语法，这里就包括控制结构。但Go也不是全盘照搬，而是在继承的基础上又加上了自己的一些优化与改进，比如：
- Go坚持“一件事情仅有一种做法的理念”，只保留了for这一种循环结构，去掉了C语言中
- 的while和do-while循环结构；
- Go填平了C语言中switch分支结构中每个case语句都要以break收尾的“坑”；
- Go支持了type switch特性，让“类型”信息也可以作为分支选择的条件；
- Go的switch控制结构的case语句还支持表达式列表，让相同处理逻辑的多个分支可以合并为一个分支，等等。

## 条件语句

### 单分支结构的if语句
```go
if boolean_expression {
 // 新分支
}
// 原分支
```
- if语句的布尔表达式整体不需要用括号包裹
```go
if runtime.GOOS == "linux" {
 println("we are on linux os") 
}
```
- 如果判断的条件比较多需要用多个逻辑操作符连接起多个条件判断表达式
```go
if (runtime.GOOS == "linux") && (runtime.GOARCH == "amd64") &&
 (runtime.Compiler != "gccgo") {
 println("we are using standard go compiler on linux os for amd64")
}
```
逻辑操作符包括&&、||、！

### 二分支结构的if语句
```go
if boolean_expression {
// 分支1
} else {
// 分支2
}
```

### 多分支结构的if语句
```go
if boolean_expression1 {
// 分支1
} else if boolean_expression2 {
// 分支2
... ...
} else if boolean_expressionN {
// 分支N
} else {
// 分支N+1
}

```

### 支持声明if语句的自用变量
在if后的布尔表达式前，进行一些变量的声明，在if布尔表达式前声明的变量，我叫它if语句的自用变量。顾名思义，这些变量只可以在if语句的代码块范围内使用
```go
func main() {
 if a, c := f(), h(); a > 0 {
 println(a)
 } else if b := f(); b > 0 {
 println(a, b)
 } else {
 println(a, b, c)
 }
}
```
## if语句的“快乐路径”原则
在日常编码中要减少多分支结构，甚至是二分支结构的使用，这会有助于我们编写出优雅、简洁、易读易维护且不易错的代码。
所谓“快乐路径”也就是成功逻辑的代码执行路径，它的特点是这样的：
- 仅使用单分支控制结构；
- 当布尔表达式求值为false时，也就是出现错误时，在单分支中快速返回；
- 正常逻辑在代码布局上始终“靠左”，这样读者可以从上到下一眼看到该函数正常逻辑全貌；
- 函数执行到最后一行代表一种成功状态


## 循环语句
### for语句的经典使用形式
```go
var sum int
for i := 0; i < 10; i++ {
 sum += i
}
println(sum)
```
### for循环语句的第二种形式:保留循环判断条件表达式
```go
i := 0
for i < 10 {
 println(i)
 i++
} 

// 无限循环
for true {
 // 循环体代码
}

```

### for range循环形式与变形
```go
for i, v := range sl {
 fmt.Printf("sl[%d] = %d\n", i, v)
}

// 变种一：当我们不关心元素的值时，我们可以省略代表元素值的变量v，只声明代表下标值的变量i
for i := range sl {
// ... 
}

// 变种二：如果我们不关心元素下标，只关心元素值，那么我们可以用空标识符替代代表下标值的变量i
for _, v := range sl {
// ... 
}

// 变种三：不关心元素下标，也不关心元素值
for range sl {
// ... 
}

```

### for range string类型
for range对于string类型来说，每次循环得到的v值是一个Unicode字符码点，也
就是rune类型值，而不是一个字节，返回的第一个值i为该Unicode字符码点的内存编码
（UTF-8）的第一个字节在字符串内存序列中的位置
```go
var s = "中国人"
for i, v := range s {
 fmt.Printf("%d %s 0x%x\n", i, string(v), v)
}

// 输出
/*
0 中 0x4e2d
3 国 0x56fd
6 人 0x4eba
*/

```

### for range map类型
在Go语言中，我们要对map进行循环操作，for range是唯一的方法。每次循环，循环变量k和v分别会被赋值为map键值对集合中一个元素的key值和value值。而且，map类型中没有下标的概念。
```go

var m = map[string]int {
"Rob" : 67,
 "Russ" : 39,
 "John" : 29,
}
for k, v := range m {
 println(k, v)
}
/*
John 29
Rob 67
Russ 39
*/
```

### for range channel类型
当channel类型变量作为for range语句的迭代对象时，for
range会尝试从channel中读取数据，使用形式是这样的
```go
var c = make(chan int)
for v := range c {
 // ... 
}
```
for range每次从channel中读取一个元素后，会把它赋值给循环变量v，并进入循环体。当channel中没有数据可读的时候，for range循环会阻塞在对channel的读操作上。直到channel关闭时，for range循环才会结束，这也是for range循环与channel配合时
隐含的循环判断条件。

## 带label的continue语句

Go语言中的continue在C语言continue语义的基础上又增加了对label的支持.
label语句的作用，是标记跳转的目标。带label的continue语句，通常出现于嵌套循环语句中，被用于跳转到外层循环并继续执行外层循环语句的下一个迭代，比如下面这段代码：
```go
func main() {
 var sl = [][]int{
 {1, 34, 26, 35, 78},
 {3, 45, 13, 24, 99},
 {101, 13, 38, 7, 127},
 {54, 27, 40, 83, 81},
 }
outerloop:
 for i := 0; i < len(sl); i++ {
    for j := 0; j < len(sl[i]); j++ {
    if sl[i][j] == 13 {
    fmt.Printf("found 13 at [%d, %d]\n", i, j)
    continue outerloop
    }
    }
 }
```
在这段代码中，变量sl是一个元素类型为[]int的切片（二维切片），其每个元素切片中至多包含一个整型数13。main函数的逻辑就是在sl的每个元素切片中找到13这个数字，并输出它的具体位置信息。
如果我们用不带label的continue能不能完成这一功能呢？答案是不能。因为它只能中断内层循环的循环体，并继续开启内层循环的下一次迭代。而带label的continue语句是这个场景下的“最佳人选”，它会直接结束内层循环的执行，并回到外层循环继续执行。
这一行为就好比在外层循环放置并执行了一个不带label的continue语句。它会中断外层循中当前迭代的执行，执行外层循环的后置语句（i++），然后再对外层循环的循环控制条件语句进行求值，如果为true，就将继续执行外层循环的新一次迭代.

## break语句的使用
终结整个循环语句的执行
和continue语句一样，Go也break语句增加了对label的支持。而且，和前面continue语句一样，如果遇到嵌套循环，break要想跳出外层循环，用不带label的break是不够，因为不带label的break仅能跳出其所在的最内层循环。要想实现外层循环的跳出，我们还需给break加上label。我们来看一个具体的例子：
```go
var gold = 38
func main() {
 var sl = [][]int{
 {1, 34, 26, 35, 78},
 {3, 45, 13, 24, 99},
 {101, 13, 38, 7, 127},
 {54, 27, 40, 83, 81},
 }
outerloop:
 for i := 0; i < len(sl); i++ {
    for j := 0; j < len(sl[i]); j++ {
        if sl[i][j] == gold {
            fmt.Printf("found gold at [%d, %d]\n", i, j)
            break outerloop
 }
 }
 }
}
```
main函数的逻辑就是，在sl这个二维切片中找到38这个数字，并输出它的位置信息。整个二维切片中至多有一个值为38的元素，所以只要我们通过嵌套循环发现了38，我们就不需要继续执行这个循环了。这时，我们通过带有label的break语句，就可以直接终结外层循环，从而从复杂多层次的嵌套循环中直接跳出，避免不必要的算力资源的浪费

下面一个示例：
```go
func main() {
 var sl = []int{5, 19, 6, 3, 8, 12}
 var firstEven int = -1
 // find first even number of the interger slice
 for i := 0; i < len(sl); i++ {
 switch sl[i] % 2 {
 case 0:
 firstEven = sl[i]
 break
 case 1:
 // do nothing
 } 
 } 
 println(firstEven) 
}
// 输出：12 而不是预期的6
```
Go语言规范中明确规定，不带label的break语句中断执行并跳出的，是
同一函数内break语句所在的最内层的for、switch或select。所以，上面这个例子的break语句实际上只跳出了switch语句，并没有跳出外层的for循环，这也就是程序未按我们预期执行的原因。调整后代码，使实际输出为预期的6
```go
func main() {
 var sl = []int{5, 19, 6, 3, 8, 12}
 var firstEven int = -1
 // find first even number of the interger slice
 loop:
    for i := 0; i < len(sl); i++ {
        switch sl[i] % 2 {
        case 0:
            firstEven = sl[i]
            break loop
        case 1:
        // do nothing
        } 
 } 
 println(firstEven) 
}
// 输出：6
```


## for语句的常见“坑”与避坑方法
### 问题一：循环变量的重用
例子如：
```go
func main() {
 var m = []int{1, 2, 3, 4, 5} 
 
 for i, v := range m {
 go func() {
    time.Sleep(time.Second * 3)
    fmt.Println(i, v)
 }()
 }
 time.Sleep(time.Second * 10)
}
// 实际输出
/*
4 5
4 5
4 5
4 5
4 5
*/
```
但我们预期结果是
0 1
1 2
2 3
3 4
4 5
初学者很可能会被for range语句中的短声明变量形式“迷惑”，简单地认为每次迭代都会重新声明两个新的变量i和v。但事实上，这些循环变量在for range语句中仅会被声明一次，且在每次迭代中都会被重用。
基于隐式代码块的规则，我们可以将上面的for range语句做一个等价转换，这样可以帮助你理解for range的工作原理。等价转换后的结果是这样的
```go
 i, v := 0, 0
 for i, v = range m {
 go func() {...}
 ```
 那么如何修改代码，可以让实际输出和我们最初的预期输出一致呢？我们可以为闭包函数增加参数，并且在创建Goroutine时将参数与i、v的当时值进行绑定，看下面的修正代码:
```go
 func main() {
 var m = []int{1, 2, 3, 4, 5}
 for i, v := range m {
 go func(i, v int) {
 time.Sleep(time.Second * 3)
 fmt.Println(i, v)
 }(i, v)
 }
 time.Sleep(time.Second * 10)
}
 ```

###  问题二：参与循环的是range表达式的副本

```go
func main() {
 var a = [5]int{1, 2, 3, 4, 5}
 var r [5]int
 fmt.Println("original a =", a)
 for i, v := range a {
 if i == 0 {
 a[1] = 12
 a[2] = 13
 }
 r[i] = v
 }
 fmt.Println("after for range loop, r =", r)
 fmt.Println("after for range loop, a =", a)
}
//结果
/*
original a = [1 2 3 4 5]
after for range loop, r = [1 2 3 4 5]
after for range loop, a = [1 12 13 4 5]
*/
```
在range表达式中，我们用了a[:]替代了原先的a，也就是将数组a转换为一个切
片，作为range表达式的循环对象可
```go
for i, v := range a[:] {...}
```
###  问题三：遍历map中元素的随机性
情况一：在map循环过程中，当counter值为0时，我们删除了变量m中的一个元素：
```go
var m = map[string]int{
 "tony": 21,
 "tom": 22,
 "jim": 23,
}
counter := 0
for k, v := range m {
 if counter == 0 {
 delete(m, "tony")
 }
 counter++
 fmt.Println(k, v)
}
fmt.Println("counter is ", counter)
```
如果我们反复运行这个例子多次，会得到两个不同的结果。当k="tony"作为第一个迭代的元素时，我们将得到如下结果：
tony 21
tom 22
jim 23
counter is  3
否则，我们得到的结果是这样的：
tom 22
jim 23
counter is 2

情况二：如果我们在针对map类型的循环体中，新创建了一个map元素项，那这项元素可能出现在后续循环中，也可能不出现
```go
var m = map[string]int{
 "tony": 21,
 "tom": 22,
 "jim": 23,
}
counter := 0
for k, v := range m {
 if counter == 0 {
 m["lucy"] = 24
 }
 counter++
 fmt.Println(k, v)
}
fmt.Println("counter is ", counter)
```
这个例子执行的结果也有2个：
tony 21
tom 22
jim 23
lucy 24
counter is 4
或
tony 21
tom 22
jim 23
counter is 3

考虑到上述这种随机性，我们日常编码遇到遍历map的同时，还需要对map进行修改的场景
的时候，要格外小心

## switch语句

Go语言中switch语句的一般形式：
```go
switch initStmt; expr {
 case expr1:
 // 执行分支1
 case expr2:
 // 执行分支2
 case expr3_1, expr3_2, expr3_3:
 // 执行分支3
 case expr4:
 // 执行分支4
 ... ...
 case exprN:
 // 执行分支N
 default: 
 // 执行默认分支
}
```
Go是按什么次序对各个case表达式进行求值，并且与switch表达式（expr）进行比较的
- Go先对switch expr表达式进行求值，然后再按case语句的出现顺序，从上到下进行逐一求值。
- 在带有表达式列表的case语句中，Go会从左到右，对列表中的表达式进行求值。
- 无论default分支出现在什么位置，它都只会在所有case都没有匹配上的情况下才会被执行的。
###  Go switch语句的灵活性
- switch语句各表达式的求值结果可以为各种类型值，只要它的类型支持比较操作就可
以了
- switch语句支持声明临时变量
- case语句支持表达式列表  
- 取消了默认执行下一个case代码逻辑的语义
Go语言中的Swith语句就修复了C语言的这个缺陷，取消了默认执行下一个case代码逻辑
的“非常规”语义，每个case对应的分支代码执行完后就结束switch语句。  
如果在少数场景下，你需要执行下一个case的代码逻辑，你可以显式使用Go提供的关键字
fallthrough来实现，这也是Go“显式”设计哲学的一个体现。
```go
func case1() int {
 println("eval case1 expr")
 return 1
}
func case2() int {
 println("eval case2 expr")
 return 2
}
func switchexpr() int {
 println("eval switch expr")
 return 1
}
func main() {
 switch switchexpr() {
 case case1():
 println("exec case1")
 fallthrough
 case case2():
 println("exec case2")
 fallthrough
 default:
println("exec default")
 }
}
/* //输出结果
eval switch expr
eval case1 expr
exec case1
exec case2
exec default
*/
```
switch expr的求值结果与case1匹配成功，Go执行了case1对应的代码分支。而
且，由于case1代码分支中显式使用了fallthrough，执行完case1后，代码执行流并没有离开switch语句，而是继续执行下一个case，也就是case2的代码分支。
这里有一个注意点，由于fallthrough的存在，Go不会对case2的表达式做求值操作，而会直接执行case2对应的代码分支。而且，在这里case2中的代码分支也显式使用了fallthrough，于是最后一个代码分支，也就是default分支对应的代码也被执行了。还有一点要注意的是，如果某个case语句已经是switch语句中的最后一个case了，并且它的后面也没有default分支了，那么这个case中就不能再使用fallthrough，否则编译器就会报错。

## type switch
- 使用interface{}这种接口类型的变量，Go中所有类型都实现了interface{}类型，所以case后面可以是任意类型信息

```go
func main() {
 var x interface{} = 13
 switch v := x.(type) { // 千万不要认为变量v存储的是类型信息，其实v存储的是变量x的动态类型对应的值信息
 case nil:
 println("v is nil")
 case int:
 println("the type of v is int, v =", v)
 case string:
 println("the type of v is string, v =", v)
 case bool:
 println("the type of v is bool, v =", v)
 default:
 println("don't support the type")
 }
}
// 输出：the type of v is int, v = 13

```
- 如果在switch后面使用了某个特定的接口类型I，那么case后面就只能使用实现了接口类型I的类型了，否则Go编译器会报错.在这段代码中，只有类型T实现了接口类型I，Go原生类型int与string都没有实现接口I，于是在编译上述代码时，编译器会报出如下错误信息

```go
 type I interface {
 M()
 }
 
 type T struct {
 }
 
 func (T) M() {
 }
 func main() {
 var t T
 var i I = t
 switch i.(type) {
 case T:
 println("it is type T")
 case int:
 println("it is type int")
 case string:
 println("it is type string")
 }
 }
 /*impossible type switch case: int i (variable of type I) cannot have dynamic type int (missing M method)
 impossible type switch case: i (type I) cannot have dynamic type string (missing M method
 */

```