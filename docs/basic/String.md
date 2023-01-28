---
title: String
author: T8840
date: '2023-01-15'
---

## Go字符串的组成

Go语言在看待Go字符串组成这个问题上，有两种视角。
- 一种是字节视角，也就是和所有其它支持字符串的主流语言一样，Go语言中的字符串值也是一个可空的字节序列，字节序列中的字节个数称为该字符串的长度。一个个的字节只是孤立数据，不表意。
```go
// 由“中国人”构成的字符串的字节序列长度为9。并且，仅从某一个输出的字节来看，它是不能与字符串中的任一个字符对应起来的。
var s = "中国人"
fmt.Printf("the length of s = %d\n", len(s)) // 9
for i := 0; i < len(s); i++ {
fmt.Printf("0x%x ", s[i]) // 0xe4 0xb8 0xad 0xe5 0x9b 0xbd 0xe4 0xba 0xba
}
fmt.Printf("\n")
```
- 如果要表意，我们就需要从字符串的另外一个视角来看，也就是字符串是由一个可空的字符序列构成。
```go
var s = "中国人"
fmt.Println("the character count in s is", utf8.RuneCountInString(s)) // 3
for _, c := range s {
fmt.Printf("0x%x ", c) // 0x4e2d 0x56fd 0x4eba
}
fmt.Printf("\n")
```
这段代码中，我输出了字符串中的字符数量，也输出了这个字符串中的每个字符。前面
说过，Go采用的是Unicode字符集，每个字符都是一个Unicode字符，那么这里输出的
0x4e2d、0x56fd和0x4eba就应该是某种Unicode字符的表示了。没错，以0x4e2d为例，它是汉字“中”在Unicode字符集表中的码点（Code Point）。
那么，什么是Unicode码点呢？
Unicode字符集中的每个字符，都被分配了统一且唯一的字符编号。所谓Unicode码点，就是指将Unicode字符集中的所有字符“排成一队”，字符在这个“队伍”中的位次，就是它
在Unicode字符集中的码点。也就说，一个码点唯一对应一个字符。“码点”的概念和我们
马上要讲的rune类型有很大关系。


###  rune类型与字符字面值
Go使用rune这个类型来表示一个Unicode码点。rune本质上是int32类型的别名类型，它与int32类型是完全等价的，在Go源码中我们可以看到它的定义是这样的：
```go
// $GOROOT/src/builtin.go
type rune = int32
```
在Go中，字符字面值有多种表示法，最常见的是通过单引号括起的字符字面值，比如：
```go
'a' // ASCII字符
'中' // Unicode字符集中的中文字符
'\n' // 换行字符
'\'' // 单引号字符

// 还可以使用Unicode专用的转义字符\u或\U作为前缀，来表示一个Unicode字符
'\u4e2d' // 字符：中
'\U00004e2d' // 字符：中
'\u0027' // 单引号字符

// 由于表示码点的rune本质上就是一个整型数，所以我们还可用整型值来直接作为字符字面值给rune变量赋值
'\x27' // 使用十六进制表示的单引号字符
'\047' // 使用八进制表示的单引号字符
```
要注意，\u后面接四个十六进制数。如果是用四个十六进制数无法表示的
Unicode字符，我们可以使用\U，\U后面可以接八个十六进制数来表示一个Unicode字符。


### 字符串字面值
字符串是多个字符，所以我们需要把表示单个字符的单引号，换为表示多个字符组成的字符串的双引号就可以了。
```go
"abc\n"
"中国人"
"\u4e2d\u56fd\u4eba" // 中国人
"\U00004e2d\U000056fd\U00004eba" // 中国人
"中\u56fd\u4eba" // 中国人，不同字符字面值形式混合在一起
"\xe4\xb8\xad\xe5\x9b\xbd\xe4\xba\xba" // 十六进制表示的字符串字面值：中国人，这个字节序列实际上是“中国人”这个Unicode字符串的UTF-8编码值
```
将单个Unicode字符字面值一个接一个地连在一起，并用双引号包裹起来就构成了字符串字面值。甚至，我们也可以像倒数第二行那样，将不同字符字面值形式混合在一起，构成一个字符串字面值。



## Go字符串类型的常见操作
### 第一个操作：下标操作。
在字符串的实现中，真正存储数据的是底层的数组。字符串的下标操作本质上等价于底层数组的下标操作。
```go
var s = "中国人"
fmt.Printf("0x%x\n", s[0]) // 0xe4：字符“中” utf-8编码的第一个字节
```

### 第二个操作：字符迭代
Go有两种迭代形式：常规for迭代与for range迭代。你要注意，通过这两种形式的迭代对字符串进行操作得到的结果是不同的。
- 通过常规for迭代对字符串进行的操作是一种字节视角的迭代，每轮迭代得到的的结果都是组成字符串内容的一个字节，以及该字节所在的下标值，这也等价于对字符串底层数组的迭代
比如下面代码：运行这段代码，我们会看到，经过常规for迭代后，我们获取到的是字符串里字符的UTF-8编码中的一个字节：
```go
var s = "中国人"
for i := 0; i < len(s); i++ {
fmt.Printf("index: %d, value: 0x%x\n", i, s[i])
}
// index: 0, value: 0xe4 ...
```
- 使用for range迭代
```go
var s = "中国人"
for i, v := range s {
 fmt.Printf("index: %d, value: 0x%x\n", i, v)
}
// index: 0, value: 0x4e2d ...
```
通过for range迭代，我们每轮迭代得到的是字符串中Unicode字符的码点值，以及该字符在字符串中的偏移值。我们可以通过这样的迭代，获取字符串中的字符个数，而通过Go提供的内置函数len，我们只能获取字符串内容的长度（字节个数）。当然了，获取字符
串中字符个数更专业的方法，是调用标准库UTF-8包中的RuneCountInString函数

### 第三个操作：字符串连接
Go原生支持通过+/+=操作符进行字符串连接
```go
s := "Rob Pike, "
s = s + "Robert Griesemer, "
s += " Ken Thompson"
fmt.Println(s) // Rob Pike, Robert Griesemer, Ken Thompso
```

### 第四个操作：字符串比较
Go字符串类型支持各种比较关系操作符，包括= =、!= 、>=、<=、> 和 <。在字符串的比较上，Go采用字典序的比较策略，分别从每个字符串的起始处，开始逐个字节地对两个字符串类型变量进行比较。
当两个字符串之间出现了第一个不相同的元素，比较就结束了，这两个元素的比较结果就会做为串最终的比较结果。如果出现两个字符串长度不同的情况，长度比较小的字符串会用空元素补齐，空元素比其他非空元素都小。
```go
func main() {
    // ==
    s1 := "世界和平"
    s2 := "世界" + "和平"
    fmt.Println(s1 == s2) // true
    // !=
    s1 = "Go"
    s2 = "C"
    fmt.Println(s1 != s2) // true
    // < and <=
    s1 = "12345"
    s2 = "23456"
    fmt.Println(s1 < s2) // true
    fmt.Println(s1 <= s2) // true
    // > and >=
    s1 = "12345"
    s2 = "123"
    fmt.Println(s1 > s2) // true
    fmt.Println(s1 >= s2) // true
}
```


### 第五个操作：字符串转换
Go支持字符串与字节切片、字符串与rune切片的双向转换，并且这种转换无需调
用任何函数，只需使用显式类型转换就可以了
```go
var s string = "中国人"
 
// string -> []rune
rs := []rune(s) 
fmt.Printf("%x\n", rs) // [4e2d 56fd 4eba]
 
// string -> []byte
bs := []byte(s) 
fmt.Printf("%x\n", bs) // e4b8ade59bbde4baba
 
// []rune -> string
s1 := string(rs)
fmt.Println(s1) // 中国人
 
// []byte -> string
s2 := string(bs)
fmt.Println(s2) // 中国人
```


## Go原生支持字符串
在Go中，字符串类型为string。Go语言通过string类型统一了对“字符串”的抽象。这样无论是字符串常量、字符串变量或是代码中出现的字符串字面值，它们的类型都被统一设置为string。
```go
const (
    GO_SLOGAN = "less is more" // GO_SLOGAN是string类型常量
    s1 = "hello, gopher" // s1是string类型常量
)
var s2 = "I love go" // s2是string类型变量
```
第一点：string类型的数据是不可变的，提高了字符串的并发安全性和存储利用率。
第二点：没有结尾’\0’，而且获取长度的时间复杂度是常数时间，消除了获取字符串长度
的开销。
第三点：原生支持“所见即所得”的原始字符串，大大降低构造多行字符串时的心智负担。
第四点：对非ASCII字符提供原生支持，消除了源码在不同环境下显示乱码的可能。





## Go字符串类型的内部表示原理

string类型其实是一个“描述符”，它本身并不真正存储字符串数据，而仅是
由一个指向底层存储的指针和字符串的长度字段组成的。