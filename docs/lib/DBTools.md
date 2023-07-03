---
title: Rust DB库
author: T8840
date: '2023-07-01'
---

### mysql库的基本使用

1. 需要在 Cargo.toml 文件中添加 mysql 库的依赖：
```
[dependencies]
mysql = "20.0.0"
```
2. main.rs脚本如下
```
use mysql::*;
use mysql::prelude::*;

#[derive(Debug, PartialEq, Eq)]
struct User {
    id: u32,
    username: String,
    password: String,
}

fn main() ->  std::result::Result<(), Box<dyn std::error::Error>> {
    // 使用你自己的用户名，密码，主机，数据库名
    let url = "mysql://root:123456@localhost:3306/rust";
    let pool = Pool::new(url)?;
    let mut conn = pool.get_conn()?;

    // 创建表
    conn.query_drop(
        r"CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username TEXT,
            password TEXT
        )"
    )?;

    // 插入数据
    conn.exec_drop(
        r"INSERT INTO users (username, password) VALUES (:username, :password)",
        params! {
            "username" => "user1",
            "password" => "password1"
        }
    )?;

    // 获取数据
    let selected_users: Vec<User> = conn.query_map(
        "SELECT id, username, password FROM users",
        |(id, username, password)| User { id, username, password },
    )?;

    // 打印数据
    for user in selected_users {
        println!("{:?}", user);
    }

    Ok(())
}

```
3. 执行检查结果
```
cargo build
cargo run
# 结果为: User { id: 1, username: "user1", password: "password1" }
```