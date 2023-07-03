---
title: Rust Http Client库
author: T8840
date: '2023-07-01'
---


## HTTP Client

## reqwest库的基本使用
配置Cargo.toml文件
```
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
```

### 示例
- Get方法
```
use reqwest::Error;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let response = reqwest::get("https://www.baidu.com").await?;
    let body = response.text().await?;
    println!("body = {:?}", body);
    Ok(())
}
```
- POST方法
```
use reqwest::Error;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let client = reqwest::Client::new();
    let res = client.post("http://httpbin.org/post")
        .body("the exact body that is sent")
        .send()
        .await?;
    println!("response = {:?}", res);
    Ok(())
}

```