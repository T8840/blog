# Trade Blog

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