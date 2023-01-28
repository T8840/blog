---
title: 通道
author: T8840
date: '2023-01-15'
---


Go在语法层面将并发原语channel作为一等公民对待。这意味着我们可以像使用普通变量那样使用channel，比如，定义channel类型变量、给channel变量赋值、将channel作为参数传递给函数/方法、将channel作为返回值从函数/方法中返回，甚至将channel发送到其他channel中。

## channel的操作

### 创建channel
- 方式一：声明一个元素为int类型的channel类型变量ch
```go
var ch chan int
```
如果channel类型变量在声明时没有被赋予初值，那么它的默认值为nil。
- 方式二：使用make这个Go预定义的函数为channel类型变量赋初值
```go
ch1 := make(chan int) // 无缓冲
ch2 := make(chan int, 5) // 带缓冲
```
声明了两个元素类型为int的channel类型变量ch1和ch2，并给这两个变量赋了初值。
第一行我们通过make(chan T)创建的、元素类型为T的channel类型，是无缓冲channel  
第二行中通过带有capacity参数的make(chan T, capacity)创建的元素类型为T、缓冲区长度为capacity的channel类型，是带缓冲channel
这两种类型的变量关于发送（send）与接收（receive）的特性是不同的

### 发送与接收
Go提供了<-操作符用于对channel类型变量进行发送与接收操作：
```go
ch1 <- 13 // 将整型字面值13发送到无缓冲channel类型变量ch1中
n := <- ch1 // 从无缓冲channel类型变量ch1中接收一个整型值存储到整型变量n中
ch2 <- 17 // 将整型字面值17发送到带缓冲channel类型变量ch2中
m := <- ch2 // 从带缓冲channel类型变量ch2中接收一个整型值存储到整型变量m中

```
在理解channel的发送与接收操作时，你一定要始终牢记：channel是用于Goroutine间通信的，所以绝大多数对channel的读写都被分别放在了不同的Goroutine中。

使用操作符<-，我们还可以声明只发送channel类型（send-only）和只接收channel类型。
试图从一个只发送channel类型变量中接收数据，或者向一个只接
收channel类型发送数据，都会导致编译错误。。
```go
ch1 := make(chan<- int, 1) // 只发送channel类型
ch2 := make(<-chan int, 1) // 只接收channel类型
<-ch1 // invalid operation: <-ch1 (receive from send-only type chan<- int)
ch2 <- 13 // invalid operation: ch2 <- 13 (send to receive-only type <-chan int)
```
通常只发送channel类型和只接收channel类型，会被用作函数的参数类型或返回值，用于限制对channel内的操作，或者是明确可对channel进行的操作的类型，如下：
```go
func produce(ch chan<- int) {
 for i := 0; i < 10; i++ {
    ch <- i + 1
    time.Sleep(time.Second)
 }
 close(ch)
}
func consume(ch <-chan int) {
 for n := range ch {
 println(n)
 }
}
func main() {
 ch := make(chan int, 5)
 var wg sync.WaitGroup
 wg.Add(2)
 go func() {
 produce(ch)
 wg.Done()
 }()
 go func() {
 consume(ch)
  wg.Done()
 }()
 wg.Wait()
}
```
在这个例子中，我们启动了两个Goroutine，分别代表生产者（produce）与消费者（consume）。生产者只能向channel中发送数据，我们使用chan<- int作为produce函
数的参数类型；消费者只能从channel中接收数据，我们使用<-chan int作为consume函
数的参数类型。
在消费者函数consume中，我们使用了for range循环语句来从channel中接收数据，for
range会阻塞在对channel的接收操作上，直到channel中有数据可接收或channel被关闭循环，才会继续向下执行。channel被关闭后，for range循环也就结束了
#### 无缓冲发送与接收
对无缓冲channel类型的发送与接收操作，一定要放在两个不同的Goroutine中进行，否则会导致deadlock。
```go
func main() {
 ch1 := make(chan int)
 go func() {
    ch1 <- 13 // 将发送操作放入一个新goroutine中执行
    }()
 n := <-ch1
 println(n)
}
```
下面这个报错：
```go
func main() {
 ch1 := make(chan int)
 ch1 <- 13 // fatal error: all goroutines are asleep - deadlock!
 n := <-ch1
 println(n)
}
```
#### 带缓冲发送与接收
和无缓冲channel相反，带缓冲channel的运行时层实现带有缓冲区，因此，对带缓冲
channel的发送操作在缓冲区未满、接收操作在缓冲区非空的情况下是异步的（发送或接收不需要阻塞等待）。  
也就是说，对一个带缓冲channel来说，在缓冲区未满的情况下，对它进行发送操作的
Goroutine并不会阻塞挂起；在缓冲区有数据的情况下，对它进行接收操作的Goroutine也不会阻塞挂起。但当缓冲区满了的情况下，对它进行发送操作的Goroutine就会阻塞挂起；当缓冲区为空的情况下，对它进行接收操作的Goroutine也会阻塞挂起。
```go
ch2 := make(chan int, 1)
n := <-ch2 // 由于此时ch2的缓冲区中无数据，因此对其进行接收操作将导致goroutine挂起
ch3 := make(chan int, 1)
ch3 <- 17 // 向ch3发送一个整型数17
ch3 <- 27 // 由于此时ch3中缓冲区已满，再向ch3发送数据也将导致goroutine挂起
```


### 关闭channel

采用不同接收语法形式的语句，在channel被关闭后的返回值的情况
```go
n := <- ch // 当ch被关闭后，n将被赋值为ch元素类型的零值
m, ok := <-ch // 当ch被关闭后，m将被赋值为ch元素类型的零值, ok值为false
for v := range ch { // 当ch被关闭后，for range循环结束
 ... ...
}
```
注意：
- 一般，发送端负责关闭channel。为什么要在发送端关闭channel呢？这是因为发送端没有像接受端那样的、可以安全判断channel是否被关闭了的方法
- 一旦向一个已经关闭的channel执行发送操作，这个操作就会引发panic

## 无缓冲channel的惯用法

无缓冲channel兼具通信和同步特性，在并发程序中应用颇为广泛。以下应用示例：
### 第一种用法：用作信号传递


### 第二种用法：用于替代锁机制


## 带缓冲channel的惯用法

### 第一种用法：用作消息队列

### 第二种用法：用作计数信号量（counting semaphore）

## len(channel)的应用

len是Go语言的一个内置函数，它支持接收数组、切片、map、字符串和channel类型的参
数，并返回对应类型的“长度”，也就是一个整型值。
针对channel ch的类型不同，len(ch)有如下两种语义：
这样一来，针对带缓冲channel的len调用似乎才是有意义的。那我们是否可以使用len函数来
实现带缓冲channel的“判满”、“判有”和“判空”逻辑呢？
当ch为无缓冲channel时，len(ch)总是返回0；
当ch为带缓冲channel时，len(ch)返回当前channel ch中尚未被读取的元素个数

## nil channel的应用
如果一个channel类型变量的值为nil，我们称它为nil channel。nil channel有一个特性，那就是对nil channel的读写都会发生阻塞。
