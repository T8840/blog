---
title: 集合
author: T8840
date: '2023-01-15'
---

## Map定义
map是Go语言提供的一种抽象数据类型，它表示一组无序的键值对。Map 最重要的一点是通过 key 来快速检索数据，key 类似于索引，指向数据的值。
Map 是一种集合，所以我们可以像迭代数组和切片那样迭代它。不过，Map 是无序的，我们无法决定它的返回顺序，这是因为 Map 是使用 hash 表来实现的。

### 创建Map方式
可以使用内建函数 make 也可以使用 map 关键字来定义 Map:
```go
/* 声明变量，默认 map 是 nil */
var map_variable map[key_data_type]value_data_type
/* 使用 make 函数 */
map_variable := make(map[key_data_type]value_data_type)

var m map[string]int // 一个map[string]int类型的变量
m["key"] = 1 // 发生运行时异常：panic: assignment to entry in nil map
```
如果不初始化 map，那么就会创建一个 nil map。nil map 不能用来存放键值”。所以，如果我们对处于零值状态的map变量直接进行操作，就会导致运行时异常（panic），从而导致程序进程异常退出。


map类型对key元素的类型是有约束的，它要求key元素的类型必须支持"==“和”!="两个比
较操作符。value元素的类型可以是任意的。在Go语言中，函数类型、map类型自身，以及切片只支持与nil的比较，而不支持同类型两个变量的比较。如果像下面代码这样，进行这些类型的比较，Go编译器将会报错
```go
s1 := make([]int, 1)
s2 := make([]int, 2)
f1 := func() {}
f2 := func() {}
m1 := make(map[int]string)
m2 := make(map[int]string)
println(s1 == s2) // 错误：invalid operation: s1 == s2 (slice can only be compared to nil)
println(f1 == f2) // 错误：invalid operation: f1 == f2 (func can only be compared to nil)
println(m1 == m2) // 错误：invalid operation: m1 == m2 (map can only be compared to nil)
```
因此在这里，你一定要注意：函数类型、map类型自身，以及切片类型是不能作为map的
key类型的。

### 赋值Map方式

和切片一样，为map类型变量显式赋值有两种方式：一种是使用复合字面值；另外一种是使用make这个预声明的内置函数。

方法一：使用复合字面值初始化map类型变量。
```go
m1 := map[int][]string{
 1: []string{"val1_1", "val1_2"},
 3: []string{"val3_1", "val3_2", "val3_3"},
 7: []string{"val7_1"},
}
type Position struct { 
 x float64 
 y float64
}

m2 := map[Position]string{
 Position{29.935523, 52.568915}: "school",
 Position{25.352594, 113.304361}: "shopping-mall",
 Position{73.224455, 111.804306}: "hospital",
}
```
方法二：使用make为map类型变量进行显式初始化。
```go
m1 := make(map[int]string) // 未指定初始容量
m2 := make(map[int]string, 8) // 指定初始容量为8
```
map类型的容量不会受限于它的初始容量值，当其中的键值对数量超过初始容量后，
Go运行时会自动增加map类型的容量，保证后续键值对的正常插入
## 操作Map

### 操作一：插入新键值对
面对一个非nil的map类型变量，我们可以在其中插入符合map类型定义的任意新键值对。插入新键值对的方式很简单，我们只需要把value赋值给map中对应的key就可以了,如果我们插入新键值对的时候，某个key已经存在于map中了，那我们的插入操作就会
用新值覆盖旧值
```go
m := make(map[int]string)
m[1] = "value1"
m[2] = "value2"
m[3] = "value3"
```

### 操作二：获取键值对数量
和切片一样，map类型也可以通过内置函数len，获取当前变量已经存储的键值对数量
```go
m := map[string]int {
"key1" : 1,
"key2" : 2,
}
fmt.Println(len(m)) // 2
m["key3"] = 3 
fmt.Println(len(m)) // 3
```
我们不能对map类型变量调用cap，来获取当前容量，这是map类型与切片类型的一个不同点
### 操作三：查找和数据读取
所谓查找，就是判断某个key是否存在于某个map中。
Go语言的map类型支持通过用一种名为“comma ok”的惯用法，进行对某个key的查询。
```go
m := make(map[string]int)
v, ok := m["key1"]
if !ok {
 // "key1"不在map中
}
// "key1"在map中，v将被赋予"key1"键对应的value
```
如果我们并不关心某个键对应的value，而只关心某个键是否在于map中，我们可以使
用空标识符替代变量v

### 操作四：删除数据
在Go中，我们需要借助内置函数delete来从map中删除数据。使用delete函数的情况下，传入的第一个参数是我们的map类型变量，第二个参数就是我们想要删除的键.
```go
m := map[string]int {
"key1" : 1,
"key2" : 2,
}
fmt.Println(m) // map[key1:1 key2:2]
delete(m, "key2") // 删除"key2"
fmt.Println(m) // map[key1:1]
```
delete函数是从map中删除键的唯一方法。即便传给delete的键在map中并不存在，delete函数的执行也不会失败，更不会抛出运行时的异常.

### 操作五：遍历map中的键值数据
在Go中，遍历map的键值对只有一种方法，那就是像对待切片那样通过for range语句对map数据进行遍历
```go
m := map[int]int{
 1: 11,
 2: 12,
 3: 13,
 }
 
for k, v := range m {
 fmt.Printf("[%d, %d] ", k, v)
}

// 只关心每次迭代的键, 将v替换为空标识符，或使用下面更地道方式
for k := range m {
// 使用k
}
// 只关心每次迭代返回的键所对应的value
for _, v := range m {
// 使用v
}

```
注意，程序逻辑千万不要依赖遍历map所得到的的元素次序

## map变量的传递开销
和切片类型一样，map也是引用类型。这就意味着map类型变量作为参数被传递给函数或方
法的时候，实质上传递的只是一个“描述符”，而不是整个map的数据拷贝，所以这个传递的开销是固定的，而且也很小。

当map变量被传递到函数或方法内部后，我们在函数内部对map类型参数的修改在函
数外部也是可见的，如：
```go
package main
 
import "fmt"
func foo(m map[string]int) {
 m["key1"] = 11
 m["key2"] = 12
}
func main() {
 m := map[string]int{
 "key1": 1,
 "key2": 2,
 }
 fmt.Println(m) // map[key1:1 key2:2] 
 foo(m)
 fmt.Println(m) // map[key1:11 key2:12] 
}
```

## map扩容
map会对底层使用的内存进行自动管理。因此，在使用过程中，当插入元素个数超出一定数值后，map一定会存在自动扩容的问题，也就是怎么扩充bucket的数量，并重新在bucket间均衡分配数据的问题。
Go运行时的map实现中引入了一个LoadFactor（负载因子），当count > LoadFactor * 2^B或overflow bucket过多时，运行时会自动对map进行扩容。目前Go最新1.17版本LoadFactor设置为6.5（loadFactorNum/loadFactorDen）。

这两方面原因导致的扩容，在运行时的操作其实是不一样的。
- 如果是因为overflow bucket过多导致的“扩容”，实际上运行时会新建一个和现有规模一样的bucket数组，然后在assign和delete时做排空和迁移。
- 如果是因为当前数据数量超出LoadFactor指定水位而进行的扩容，那么运行时会建立一个两倍于现有规模的bucket数组，但真正的排空和迁移工作也是在assign和delete时逐步进行的。原bucket数组会挂在hmap的oldbuckets指针下面，直到原buckets数组中所有数据都迁移到新数组后，原buckets数组才会被释放。

考虑到map可以自动扩容，map中数据元素的value位置可能在这一过程中发生变化，所以Go不允许获取map中value的地址，这个约束是在编译期间就生效的。下面这段代码就展示了Go编译器识别出获取map中value地址的语句后，给出的编译错误：
```go
p := &m[key] // cannot take the address of m[key]
fmt.Println(p)
```

## map与并发
map实例不是并发写安全的，也不支持并发读写。如果我们对map实例进行并发读写，程序运行时就会抛出异常。
不过，如果我们仅仅是进行并发读，map是没有问题的。而且，Go 1.9版本中引入了支持并发写安全的sync.Map类型，可以在并发读写的场景下替换掉map。

## map内部实现原理
