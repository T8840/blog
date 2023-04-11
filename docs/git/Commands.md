---
title: Git命令
author: T8840
date: '2023-01-15'
---

## Git常用命令


## 本地目录中的文件提交到git上一个新的分支
```sh
# 1.在终端中，进入包含要提交文件的目录。
cd your_directory
# 2.使用 git init 命令初始化一个新的 Git 存储库。
git init
# 3.使用 git add 命令将文件添加到索引中。
git add .
# 4.使用 git commit 命令将文件提交到本地仓库。
git commit -m "feat:initial commit"
# 5.将您的远程 Git 仓库添加为远程仓库（通常名为 "origin"）,请将 your_remote_repository_url 替换为您的远程 Git 仓库 URL。
git remote add origin your_remote_repository_url
# 6.在本地创建一个新的分支并切换到它。
git checkout -b your_new_branch
# 7.将本地分支推送到远程 Git 仓库。
git push -u origin your_new_branch
```

## SSH连接GIthub
```sh
#主机上输入命令
 ssh-keygen -t rsa -C email@github.com #github注册的邮箱
# 一路为空获得“id_rsa.pub"中的内容复制到GitHub中
cat ~/.ssh/id_rsa.pub
# 测试是否可以连接：输入：
ssh -vT git@github.com
```