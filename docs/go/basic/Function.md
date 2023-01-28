---
title: 函数
author: T8840
date: '2023-01-15'
---

## 函数定义
在 Go 语言中，函数是唯一一种基于特定输入，实现特定任务并可返回任务执行结果的代码块（Go 语言中的方法本质上也是函数）。 
如果忽略 Go 包在 Go 代码组织层面的作用，我们可以说 Go 程序就是一组函数的集合，实际上，我们日常的 Go 代码编写大多都集中在实现某个函数上。 
Go 语言函数定义格式如下：
```go
func function_name( [parameter list] ) [return_types] {
   函数体
}

func Fprintf(io.Writer, string, ...interface{}) (int, error) {
    函数体
}
```
一个 Go 函数的声明由五部分组成
- 第一部分是关键字 func，Go 函数声明必须以关键字 func 开始。
- 第二部分是函数名。函数名是指代函数定义的标识符，函数声明后，我们会通过函数名这个标识符来使用这个函数。在同一个 Go 包中，函数名应该是唯一的，并且它也遵守 Go 标识符的导出规则(首字母大写的函数名指代的函数是可以在包外使用的，小写的就只在包内可见)
- 第三部分是参数列表。参数列表中声明了我们将要在函数体中使用的各个参数。参数列表紧接在函数名的后面，并用一个括号包裹。它使用逗号作为参数间的分隔符，而且每个参数的参数名在前，参数类型在后，这和变量声明中变量名与类型的排列方式是一致的。另外，Go 函数支持变长参数，也就是一个形式参数可以对应数量不定的实际参数。函数对变长参数的支持（第三个形式参数可以是一个变长参数，而且变长参数与普通参数在声明时的不同点，就在于它会在类型前面增加了一个“…”符号。)
- 第四部分是返回值列表。返回值承载了函数执行后要返回给调用者的结果，返回值列表声明了这些返回值的类型，返回值列表的位置紧接在参数列表后面，两者之间用一个空格隔开。如果函数的返回值列表不仅声明了返回值的类型，还声明了返回值的名称，这种返回值被称为具名返回值。多数情况下，我们不需要这么做，只需声明返回值的类型即可。
- 第五部分是函数体，函数的具体实现都放在这里。不过，函数声明中的函数体是可选的。如果没有函数体，说明这个函数可能是在 Go 语言之外实现的，比如使用汇编语言实现，然后通过链接器将实现与声明中的函数名链接到一起。


## 函数参数与参数传递
在函数声明阶段，我们把参数列表中的参数叫做形式参数（Parameter，简称形参），在函数体中，我们使用的都是形参；而在函数实际调用时传入的参数被称为实际参数（Argument，简称实参）。
Go 语言中，函数参数传递采用是值传递的方式。 所谓“值传递”，就是将实际参数在内存中的表示逐位拷贝（Bitwise Copy）到形式参数中。
- 对于像整型、数组、结构体这类类型，它们的内存表示就是它们自身的数据内容，因此当这些类型作为实参类型时，值传递拷贝的就是它们自身，传递的开销也与它们自身的大小成正比。 
- 但是像 string、切片、map 这些类型就不是了，它们的内存表示对应的是它们数据内容的“描述符”。当这些类型作为实参类型时，值传递拷贝的也是它们数据内容的“描述符”，不包括数据内容本身，所以这些类型传递的开销是固定的，与数据内容大小无关。这种只拷贝“描述符”，不拷贝实际数据内容的拷贝过程，也被称为“浅拷贝”。
- 不过函数参数的传递也有两个例外，当函数的形参为接口类型，或者形参是变长参数时，简单的值传递就不能满足要求了，这时 Go 编译器会介入：对于类型为接口类型的形参，Go 编译器会把传递的实参赋值给对应的接口类型形参；对于为变长参数的形参，Go 编译器会将零个或多个实参按一定形式转换为对应的变长形参。

```go
func myAppend(sl []int, elems ...int) []int {
    fmt.Printf("%T\n", elems) // []int
    if len(elems) == 0 {
        println("no elems to append")
        return sl
    }

    sl = append(sl, elems...)
    return sl
}
func add(params ...int) (sum int) {
    for _, v := range params {
        sum +=v
    }
    return
}

func main() {
    sl := []int{1, 2, 3}
    sl = myAppend(sl) // no elems to append
    fmt.Println(sl) // [1 2 3]
    sl = myAppend(sl, 4, 5, 6)
    fmt.Println(sl) // [1 2 3 4 5 6]

    s2 := add(1,2,3, 4, 5, 6)
    fmt.Println(s2) // 21
    slice := []int{1,2,3, 4, 5, 6}
    fmt.Println(add(slice...)) // 21 ,使用slice打散的方式，这种同上面的区别：slice是一种类型而且是引用传递
    fmt.Println(slice) // [1 2 3 4 5 6]
```
## 函数返回值
函数返回值列表从形式上看主要有三种：
```go
func foo() // 无返回值
func foo() error // 仅有一个返回值
func foo() (int, string, error) // 有2或2个以上返回值
```
在函数声明的返回值列表中，我们仅列举返回值的类型，但我们也可以像 fmt.Fprintf 函数的返回值列表那样，为每个返回值声明变量名，这种带有名字的返回值被称为具名返回值（Named Return Value）。这种具名返回值变量可以像函数体中声明的局部变量一样在函数体内使用。
那么在日常编码中，我们究竟该使用普通返回值形式，还是具名返回值形式呢？
- Go 标准库以及大多数项目代码中的函数，都选择了使用普通的非具名返回值形式。
- 但在一些特定场景下，具名返回值也会得到应用。
比如，当函数使用 defer，而且还在 defer 函数中修改外部函数返回值时，具名返回值可以让代码显得更优雅清晰。再比如，当函数的返回值个数较多时，每次显式使用 return 语句时都会接一长串返回值，这时，我们用具名返回值可以让函数实现的可读性更好一些，比如下面 Go 标准库 time 包中的 parseNanoseconds 函数就是这样
```go

// $GOROOT/src/time/format.go
func parseNanoseconds(value string, nbytes int) (ns int, rangeErrString string, err error) {
    if !commaOrPeriod(value[0]) {
        err = errBad
        return
    }
    if ns, err = atoi(value[1:nbytes]); err != nil {
        return
    }
    if ns < 0 || 1e9 <= ns {
        rangeErrString = "fractional second"
        return
    }

    scaleDigits := 10 - nbytes
    for i := 0; i < scaleDigits; i++ {
        ns *= 10
    }
    return
}
```

## Go函数的特点

### 特征一：Go 函数可以存储在变量中
```go
var (
    myFprintf = func(w io.Writer, format string, a ...interface{}) (int, error) {
        return fmt.Fprintf(w, format, a...)
    }
)

func main() {
    fmt.Printf("%T\n", myFprintf) // func(io.Writer, string, ...interface {}) (int, error)
    myFprintf(os.Stdout, "%s\n", "Hello, Go") // 输出Hello，Go
}
```
### 特征二：支持在函数内创建并通过返回值返回。
Go 函数不仅可以在函数外创建，还可以在函数内创建。而且由于函数可以存储在变量中，所以函数也可以在创建后，作为函数返回值返回。我们来看下面这个例子：
```go

func setup(task string) func() {
    println("do some setup stuff for", task)
    return func() {
        println("do some teardown stuff for", task)
    }
}

func main() {
    teardown := setup("demo")
    defer teardown()
    println("do some bussiness stuff")
}

```
在这个例子中，我们在 setup 函数中创建了这次执行的上下文拆除函数，并通过返回值的形式，将这个拆除函数返回给了 setup 函数的调用者。setup 函数的调用者，在执行完对应这次执行上下文的重要逻辑后，再调用 setup 函数返回的拆除函数，就可以完成对上下文的拆除了。
从这段代码中我们也可以看到，setup 函数中创建的拆除函数也是一个匿名函数，但和前面我们看到的匿名函数有一个不同，这个不同就在于这个匿名函数使用了定义它的函数 setup 的局部变量 task，这样的匿名函数在 Go 中也被称为闭包（Closure）。
闭包本质上就是一个匿名函数或叫函数字面值，它们可以引用它的包裹函数，也就是创建它们的函数中定义的变量。然后，这些变量在包裹函数和匿名函数之间共享，只要闭包可以被访问，这些共享的变量就会继续存在。显然，Go 语言的闭包特性也是建立在“函数是一等公民”特性的基础上的.
匿名函数更多例子：
```go
result := func(a,b int)int {
    return a+b
} (1,2)
fmt.Println(result)
```

### 特征三：作为参数传入函数。
既然函数可以存储在变量中，也可以作为返回值返回，那我们可以理所当然地想到，把函数作为参数传入函数也是可行的。比如我们在日常编码时经常使用、标准库 time 包的 AfterFunc 函数，就是一个接受函数类型参数的典型例子。
下面这行代码，这里通过 AfterFunc 函数设置了一个 2 秒的定时器，并传入了时间到了后要执行的函数。这里传入的就是一个匿名函数：
```go
time.AfterFunc(time.Second*2, func() { println("timer fired") })
```

### 特征四：拥有自己的类型。
每个函数声明定义的函数仅仅是对应的函数类型的一个实例，就像var a int = 13这个变量声明语句中的 a，只是 int 类型的一个实例一样。换句话说，每个函数都和整型值、字符串值等一等公民一样，拥有自己的类型，也就是我们讲过的函数类型。我们甚至可以基于函数类型来自定义类型，就像基于整型、字符串类型等类型来自定义类型一样。下面代码中的 
```go
// $GOROOT/src/net/http/server.go
type HandlerFunc func(ResponseWriter, *Request)

// $GOROOT/src/sort/genzfunc.go
type visitFunc func(ast.Node) ast.Visitor
```

## Go函数的高效应用
### 应用一：函数类型的妙用  
Go 函数是“一等公民”，也就是说，它拥有自己的类型。而且，整型、字符串型等所有类型都可以进行的操作，比如显式转型，也同样可以用在函数类型上面，也就是说，函数也可以被显式转型。并且，这样的转型在特定的领域具有奇妙的作用，一个最为典型的示例就是标准库 http 包中的 HandlerFunc 这个类型。
看一个使用了这个类型的例子：
```go

func greeting(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome, Gopher!\n")
}                    

func main() {
    http.ListenAndServe(":8080", http.HandlerFunc(greeting))
}
```

这我们日常最常见的、用 Go 构建 Web Server 的例子。它的工作机制也很简单，就是当用户通过浏览器，或者类似 curl 这样的命令行工具，访问 Web server 的 8080 端口时，会收到“Welcome, Gopher!”这样的文字应答。
看一下 http 包的函数 ListenAndServe 的源码：
```go

// $GOROOT/src/net/http/server.go
func ListenAndServe(addr string, handler Handler) error {
    server := &Server{Addr: addr, Handler: handler}
    return server.ListenAndServe()
}
```
函数 ListenAndServe 会把来自客户端的 http 请求，交给它的第二个参数 handler 处理，而这里 handler 参数的类型 http.Handler，是一个自定义的接口类型，它的源码是这样的：
```go
// $GOROOT/src/net/http/server.go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```
这个接口只有一个方法 ServeHTTP，他的函数类型是func(http.ResponseWriter, *http.Request)。这和我们自己定义的 http 请求处理函数 greeting 的类型是一致的，但是我们没法直接将 greeting 作为参数值传入，否则编译器会报错：

func(http.ResponseWriter, *http.Request) does not implement http.Handler (missing ServeHTTP method)  

这里，编译器提示我们，函数 greeting 还没有实现接口 Handler 的方法，无法将它赋值给 Handler 类型的参数。现在我们再回过头来看下代码，代码中我们也没有直接将 greeting 传给 ListenAndServe 函数，而是将http.HandlerFunc(greeting)作为参数传给了 ListenAndServe。那这个 http.HandlerFunc 究竟是什么呢？我们直接来看一下它的源码：
```go
// $GOROOT/src/net/http/server.go
type HandlerFunc func(ResponseWriter, *Request)

// ServeHTTP calls f(w, r).
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
        f(w, r)
}
```
通过它的源码我们看到，HandlerFunc 是一个基于函数类型定义的新类型，它的底层类型为函数类型func(ResponseWriter, *Request)。这个类型有一个方法 ServeHTTP，然后实现了 Handler 接口。  
也就是说http.HandlerFunc(greeting)这句代码的真正含义，是将函数 greeting 显式转换为 HandlerFunc 类型，后者实现了 Handler 接口，满足 ListenAndServe 函数第二个参数的要求。  
另外，之所以http.HandlerFunc(greeting)这段代码可以通过编译器检查，正是因为 HandlerFunc 的底层类型是func(ResponseWriter, *Request)，与 greeting 函数的类型是一致的，这和下面整型变量的显式转型原理也是一样的：
```go
type MyInt int
var x int = 5
y := MyInt(x) // MyInt的底层类型为int，类比HandlerFunc的底层类型为func(ResponseWriter, *Request)
```

### 应用二：利用闭包简化函数调用
Go 闭包是在函数内部创建的匿名函数，这个匿名函数可以访问创建它的函数的参数与局部变量。我们可以利用闭包的这一特性来简化函数调用。
例子：
```go
func times(x, y int) int {
  return x * y
}

times(2, 5) // 计算2 x 5
times(3, 5) // 计算3 x 5
times(4, 5) // 计算4 x 5

```
在上面的代码中，times 函数用来进行两个整型数的乘法。我们使用 times 函数的时候需要传入两个实参，比如：times(2, 5) 
不过，有些场景存在一些高频使用的乘数，这个时候我们就没必要每次都传入这样的高频乘数了。那我们怎样能省去高频乘数的传入呢? 
我们看看下面这个新函数 
```go
func partialTimes(x int) func(int) int {
  return func(y int) int {
    return times(x, y)
  }
}
```
这里，partialTimes 的返回值是一个接受单一参数的函数，这个由 partialTimes 函数生成的匿名函数，使用了 partialTimes 函数的参数 x。按照前面的定义，这个匿名函数就是一个闭包。
partialTimes 实质上就是用来生成以 x 为固定乘数的、接受另外一个乘数作为参数的、闭包函数的函数。当程序调用 partialTimes(2) 时，partialTimes 实际上返回了一个调用 times(2,y) 的函数，这个过程的逻辑类似于下面代码：timesTwo = func(y int) int { return times(2, y)}
这个时候，我们再看看如何使用 partialTimes，分别生成以 2、3、4 为固定高频乘数的乘法函数，以及这些生成的乘法函数的使用方法：
```go
func main() {
  timesTwo := partialTimes(2)   // 以高频乘数2为固定乘数的乘法函数
  timesThree := partialTimes(3) // 以高频乘数3为固定乘数的乘法函数
  timesFour := partialTimes(4)  // 以高频乘数4为固定乘数的乘法函数
  fmt.Println(timesTwo(5))   // 10，等价于times(2, 5)
  fmt.Println(timesTwo(6))   // 12，等价于times(2, 6)
  fmt.Println(timesThree(5)) // 15，等价于times(3, 5)
  fmt.Println(timesThree(6)) // 18，等价于times(3, 6)
  fmt.Println(timesFour(5))  // 20，等价于times(4, 5)
  fmt.Println(timesFour(6))  // 24，等价于times(4, 6)
}
```

## 使用 defer 简化函数实现
defer 是 Go 语言提供的一种延迟调用机制，defer 的运作离不开函数。这句话至少有以下两点含义：
- 在 Go 中，只有在函数（和方法）内部才能使用 defer；
- defer 关键字后面只能接函数（或方法），这些函数被称为 deferred 函数。
defer 将它们注册到其所在 Goroutine 中，用于存放 deferred 函数的栈数据结构中，这些 deferred 函数将在执行 defer 的函数退出前，按后进先出（LIFO）的顺序被程序调度执行。

而且，无论是执行到函数体尾部返回，还是在某个错误处理分支显式 return，又或是出现 panic，已经存储到 deferred 函数栈中的函数，都会被调度执行。  
所以说，deferred 函数是一个可以在任何情况下为函数进行收尾工作的好“伙伴”。

示例
使用defer前的伪代码
```go
func doSomething() error {
    var mu sync.Mutex
    mu.Lock()

    r1, err := OpenResource1()
    if err != nil {
        mu.Unlock()
        return err
    }

    r2, err := OpenResource2()
    if err != nil {
        r1.Close()
        mu.Unlock()
        return err
    }

    r3, err := OpenResource3()
    if err != nil {
        r2.Close()
        r1.Close()
        mu.Unlock()
        return err
    }

    // 使用r1，r2, r3
    err = doWithResources() 
    if err != nil {
        r3.Close()
        r2.Close()
        r1.Close()
        mu.Unlock()
        return err
    }

    r3.Close()
    r2.Close()
    r1.Close()
    mu.Unlock()
    return nil
}
```

使用defer优化后
```go
func doSomething() error {
    var mu sync.Mutex
    mu.Lock()
    defer mu.Unlock()

    r1, err := OpenResource1()
    if err != nil {
        return err
    }
    defer r1.Close()

    r2, err := OpenResource2()
    if err != nil {
        return err
    }
    defer r2.Close()

    r3, err := OpenResource3()
    if err != nil {
        return err
    }
    defer r3.Close()

    // 使用r1，r2, r3
    return doWithResources() 
}

```
### defer使用的注意事项
#### 第一点：明确哪些函数可以作为 deferred 函数  
这里，对于自定义的函数或方法，defer 可以给与无条件的支持，但是对于有返回值的自定义函数或方法，返回值会在 deferred 函数被调度执行的时候被自动丢弃。而且，Go 语言中除了自定义函数/方法，还有 Go 语言内置的/预定义的函数。 
append、cap、len、make、new、imag 等内置函数都是不能直接作为 deferred 函数的，而 close、copy、delete、print、recover 等内置函数则可以直接被 defer 设置为 deferred 函数。不过，对于那些不能直接作为 deferred 函数的内置函数，我们可以使用一个包裹它的匿名函数来间接满足要求，以 append 为例是这样的
```go
defer func() {
  _ = append(sl, 11)
}()
```
#### 第二点：注意 defer 关键字后面表达式的求值时机
牢记一点：defer 关键字后面的表达式，是在将 deferred 函数注册到 deferred 函数栈的时候进行求值的

#### 第三点：知晓 defer 带来的性能损耗


## 函数的健壮性设计
函数健壮性的“三不要”原则：
###  原则一：不要相信任何外部输入的参数。
函数的使用者可能是任何人，这些人在使用函数之前可能都没有阅读过任何手册或文档，他们会向函数传入你意想不到的参数。因此，为了保证函数的健壮性，函数需要对所有输入的参数进行合法性的检查。一旦发现问题，立即终止函数的执行，返回预设的错误值。

### 原则二：不要忽略任何一个错误。
在我们的函数实现中，也会调用标准库或第三方包提供的函数或方法。对于这些调用，我们不能假定它一定会成功，我们一定要显式地检查这些调用返回的错误值。一旦发现错误，要及时终止函数执行，防止错误继续传播。

### 原则三：不要假定异常不会发生。
这里，我们先要确定一个认知：异常不是错误。错误是可预期的，也是经常会发生的，我们有对应的公开错误码和错误处理预案，但异常却是少见的、意料之外的。通常意义上的异常，指的是硬件异常、操作系统异常、语言运行时异常，还有更大可能是代码中潜在 bug 导致的异常，比如代码中出现了以 0 作为分母，或者是数组越界访问等情况。虽然异常发生是“小众事件”，但是我们不能假定异常不会发生。所以，函数设计时，我们就需要根据函数的角色和使用场景，考虑是否要在函数内设置异常捕捉和恢复的环节。在这三条健壮性设计原则中，做到前两条是相对容易的，也没有太多技巧可言。但对第三条异常的处理，很多初学者拿捏不好。所以在这里，我们就重点说一下 Go 函数的异常处理设计。认识 Go 语言中的异常：pa

## 函数类型

### “有名函数”和“匿名函数”
匿名函数是指在定义时使用func()语法格式，没有指定函数名。

### 函数字面量类型（未命名类型）和 函数命名类型
#### 函数字面量类型
函数字面量类型的语法表达式是func(InputTypeList)OutputTypeList  
“有名函数”和“匿名函数” 都属于函数字面量类型

#### 函数命名类型
函数命名类型的语法表达式是type NewFucType FuncLiteral


## 大小写在Go语言中的重要性

