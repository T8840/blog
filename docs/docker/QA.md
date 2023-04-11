---
title: 常见问题
author: T8840
date: '2023-01-15'
---



## Docker常见问题
### 主机文件权限问题报错
```sh
...
jekyll_1  | There was an error while trying to write to `/srv/jekyll/Gemfile.lock`. It is
jekyll_1  | likely that you need to grant write permissions for that path.
```
解决方案：chmod a+w Gemfile.lock

