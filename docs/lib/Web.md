---
title: WEB
author: T8840
date: '2023-07-01'
---


## WEB框架

## 使用Rocket框架进行WEB开发
- Github
[Github](https://github.com/SergioBenitez/Rocket)
- Doc
[参考文档](https://rocket.rs/v0.5-rc/guide/getting-started/)
- 使用Rocket框架创建 REST API

### 示例1：
1. Cargo.toml 文件中引入依赖
```
[dependencies]
rocket = "=0.5.0-rc.3"
```

2. 同时需要执行这个命令,切换到特定版本
```
 rustup default nightly
```
3. api.rs中代码
```
// 在 api.rs 中
#![feature(decl_macro)]
use rocket::{FromForm, Rocket, form::Form};

#[derive(FromForm)]
pub struct Task {
    description: String,
}

#[get("/")]
pub fn index() -> &'static str {
    "Hello, world!"
}

#[post("/task", data = "<task>")]
pub fn new_task(task: Form<Task>) -> String {
    format!("New task: {}", task.description)
}

// 返回带有所有路由的 Rocket 实例
pub fn rocket() -> Rocket {
    rocket::build().mount("/", routes![index, new_task])
}
```
4. main.rs中代码
```

```

