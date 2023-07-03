---
title: Rust配置库
author: T8840
date: '2023-07-01'
---

## 配置库
- config：这个库允许你从多个来源（比如环境变量、配置文件等）加载设置，并提供了对各种文件格式（包括 JSON、YAML 和 TOML 等）的支持。
- toml：如你要处理 TOML 格式的配置文件，可以使用 toml 库。它提供了一个解析器和一个序列化器，让你可以方便地读取和写入 TOML 文件。
- serde_json：如果你的配置文件是 JSON 格式的，可以使用 serde_json 库。它基于 serde 库，可以让你轻松地序列化和反序列化 JSON 数据。
- dotenv：这个库让你可以从 .env 文件中加载环境变量，这种方法非常适合存储敏感的配置，比如数据库密码或 API 密钥。
- yaml-rust：用于处理 YAML 格式的配置文件。

## Config库的基本用法
1. 在Cargo.toml中添加对config库的依赖：
```
[dependencies]
config = "0.10.1"
```
2. 读取配置文件config.rs代码
```
use config::{Config, File, Environment};
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
pub struct Settings {
    pub debug: bool,
    pub database: Database,
}

#[derive(Debug, Deserialize)]
pub struct Database {
    pub url: String,
    pub pool: u32,
}

pub fn load_config() -> Settings {
    let mut settings = Config::default();
    let env = env::var("RUN_MODE").unwrap_or_else(|_| "development".into());

    // 首先添加默认配置
    settings.merge(File::with_name("config/default")).unwrap();

    // 根据环境变量添加特定环境的配置，比如config/development.toml
    settings.merge(File::with_name(&format!("config/{}", env)).required(false)).unwrap();

    // 添加环境变量（以APP_为前缀）
    settings.merge(Environment::with_prefix("APP")).unwrap();

    // let settings: Settings = settings.try_into().unwrap();
    // println!("{:#?}", settings);
    // // 提取数据库URL
    // let db_url = &settings.database.url;
    // println!("数据库的URL是: {}", db_url);

    settings.try_into().unwrap()
}

```

3. main.rs代码
```
mod config;

fn main() {
    let settings = config::load_config();
    let db_url = &settings.database.url;
    println!("数据库的URL是: {}", db_url);
}
```