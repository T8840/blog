---
title: Git命令
author: T8840
date: '2023-01-15'
---

## Git常用命令




## SSH连接GIthub
```sh
#主机上输入命令
 ssh-keygen -t rsa -C email@github.com #github注册的邮箱
# 一路为空获得“id_rsa.pub"中的内容复制到GitHub中
cat ~/.ssh/id_rsa.pub
# 测试是否可以连接：输入：
ssh -vT git@github.com
```