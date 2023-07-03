---
title: 模块
author: T8840
date: '2023-07-01'
---


## 引用本地模块

### 与main.rs同级目录
如果 my_submodule.rs 与 main.rs 在同一目录级别，你仍然可以在 main.rs 中引用它。这是你的项目结构：
```
src/
  main.rs
  my_submodule.rs
```  
在这种情况下，你可以在 main.rs 中这样引用 my_submodule.rs：
```
mod my_submodule;

fn main() {
    my_submodule::your_function();
}
```
这里，mod my_submodule 告诉 Rust 编译器你想在 main.rs 中使用名为 my_submodule 的模块。这个模块的内容定义在 my_submodule.rs 文件中。

然后，你可以使用 my_submodule::your_function() 来调用这个模块中的 your_function 函数。记住，你需要在 my_submodule.rs 中将 your_function 函数标记为 pub，这样它才可以在其他模块中使用。例如：

```
// 在 my_submodule.rs 中
pub fn your_function() {
    println!("Hello from my_submodule!");
}
```
然后在你的 main.rs 中使用它：

```
mod my_submodule;

fn main() {
    my_submodule::your_function();
}
```
当你运行这个程序时，你应该能够看到 "Hello from my_submodule!" 被打印出来




### 与main.rs不同级目录

假设你有一个文件夹结构如下：

```
src/
  main.rs
  my_module/
    mod.rs
```    
你的 my_module/mod.rs 可能是这样的：

```
pub fn hello() {
    println!("Hello from my_module!");
}
```
你可以在 main.rs 中使用 mod 关键字引用这个模块，并使用 use 关键字来引入其公开的函数：

```
mod my_module;

fn main() {
    my_module::hello();
}
```
上面的代码中，mod my_module 声明了一个叫做 my_module 的模块，它的内容来自于 my_module/mod.rs 文件。然后，我们就可以使用 my_module::hello() 来调用这个模块中的 hello 函数。

如果你的模块是在同一目录下的另一个文件，例如 my_module.rs，那么你只需要在 main.rs 中写 mod my_module 即可，无需将其放在子目录和 mod.rs 文件中。

如果你的模块有子模块，你也可以在 mod.rs 中使用 mod 关键字来声明子模块。例如，如果你有这样一个文件结构：
```
src/
  main.rs
  my_module/
    mod.rs
    my_submodule.rs
```    
你可以在 my_module/mod.rs 中这样声明子模块：
```
mod my_submodule;
```
然后你就可以在 main.rs 中使用 my_module::my_submodule 来引用这个子模块。

### 非main.rs的文件间引用
如在opDB.rs文件中引入config.rs文件
1. 首先main.rs文件中，确保有以下代码：

```
mod config;
mod opDB;
```

2. 然后，你的 opDB.rs 文件可以使用 use crate::config 来引用 config 模块。这种方式将从你的包或二进制项目的根（也就是 main.rs 或 lib.rs 文件）开始查找 config 模块。
```rust
use mysql::*;
use mysql::prelude::*;

use crate::config;

pub fn create_table_if_not_exists() {
    let settings = config::load_config();
    ...
}
...
```