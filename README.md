# Rust Blog

- 下载依赖
```sh
npm i -D
```

- 本地调试
```sh
npm run docs:dev 
```

- 构建后使用server运行
```sh
npm run docs:build
python -m http.server -d docs\.vuepress\dist 8080
```

- 出现错误“Error: error:0308010C:digital envelope routines::unsupported”可执行命令
```
export NODE_OPTIONS=--openssl-legacy-provider
```
参考：https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported