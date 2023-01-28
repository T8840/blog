---
title: Go泛型
author: T8840
date: '2023-01-15'
---
## Go泛型引入版本
Version 1.18+


## Go泛型最适合应用的场景
编写通用数据结构、编写操作 Go 原生容器类型时以及不同类型实现一些方法的逻辑看起来相同时。  
除此之外的其他场景下，如果你要使用泛型，务必慎重并深思熟虑。

## Demo
### 01 目标
假设我们要实现一个blog系统，在该系统中有以下两个结构体：
```go
type Category struct {
    ID int32
    Name string
    Slug string
}

type Post struct {
    ID int32
    Categories []Category
    Title string
    Text string
    Slug string
}
```
为了提高系统的性能，我们需要实现一个缓存系统，该缓存可以用于缓存各种类型，在该示例中我们限定为只能缓存Category和Post类型。
### 02 实现
根据Go泛型使用的三步曲提到的：类型参数化、定义类型约束、类型实例化我们一步步来定义我们的缓存结构体。
第一步：定义类型约束
这里我们先定义类型约束。因为在泛型中对类型参数进行约束是必要条件。所以要先定义类型约束。
因为要对分类Category类型和文章Post类型进行缓存，所以我们这里的缓存类型约束限制在了这两个类型上。约束接口定义如下：
```go
type cacheable interface {
    Category | Post
}
```
第二步：对类型进行参数化
现在我们创建一个名为cache的泛型结构体，并使用cacheable对其进行约束。
```go
type cache[T cacheable] struct {
    data map[string]T
}
```
我们看到cache的底层实际上是用map来进行存储数据的，map的key是具体的类型字符串，而map的值是参数化的类型T，即要在具体使用时根据需要对该参数T进行实例化。
为了能够在cache结构体中存储和获取数据，我们再定义两个方法如下：
```go
func (c *cache[T]) Set(key string, value T) {
    c.data[key] = value
}

func (c *cache[T]) Get(key string) (v T) {
    if v, ok := c.data[key]; ok {
        return v
    }

    return
}
```
这里需要大家注意的是在泛型结构体类型中，定义方法的时候，也需要将类型参数T带上的。因为只有在调用时对类型参数实例化后结构体中的类型才是明确的。
第三步：类型实例化
为了实例化cache结构体，我们创建了一个New函数来专门构造cache的实例。
```go 
func New[T cacheable]() *cache[T]{
	c := cache[T]{}
	c.data = make(map[string]T)

	return &c
}
```
这里大家需要注意的是因为我们使用了泛型结构体类型cache，所以函数New也必须是泛型函数，只有这样才能将泛型类型T的具体值传递到泛型结构体类型中。
当然，这里还有另外一种实例化的cache的方法就是直接使用，这样就不需要使用泛型函数New了。如下：
```
c := &cache[Category]{
    data: make(map[string]T)
}
```
最终代码：
```go
package main

import (
	"fmt"
)
type Category struct {
    ID int32
    Name string
    Slug string
}

type Post struct {
    ID int32
    Categories []Category
    Title string
    Text string
    Slug string
}
type cacheable interface {
    Category | Post
}

type cache[T cacheable] struct {
    data map[string]T
}

func main() {
	// create a new category
	category := Category{
		ID: 1,
		Name: "Go Generics",
		Slug: "go-generics",
	}
	// create cache for blog.Category struct
	cc := New[Category]()
	// add category to cache
	cc.Set(category.Slug, category)
	fmt.Printf("cp get:%+v\n", cc.Get(category.Slug))
	// create a new post
	post := Post{
		ID: 1,
		Categories: []Category{
			{ID: 1, Name: "Go Generics", Slug: "go-generics"},
		},
		Title: "Generics in Golang structs",
		Text: "Here go's the text",
		Slug: "generics-in-golang-structs",
	}
	// create cache for blog.Post struct
	cp := New[Post]()
	// add post to cache
	cp.Set(post.Slug, post)

	fmt.Printf("cp get:%+v\n", cp.Get(post.Slug))
}
```