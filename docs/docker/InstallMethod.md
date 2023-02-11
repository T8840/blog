---
title: Docker安装
author: T8840
date: '2023-01-15'
---


## Docker安装

### Linux安装
- 方式一：一键安装脚本
```sh
$ sudo wget -qO- https://get.docker.com/ | bash

$ # 如果上面的不行，执行下面两句
$ curl -fsSL https://get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh

$ # 安装成功执行下面语句，如果有类似回显，说明安装成功
$ docker --version
Docker version 23.0.1, build a5ee5b1
```
- 方式二：二进制安装

### Mac安装
下载：https://download.docker.com/mac/stable/Docker.dmg  
双击安装

### 增加普通用户Docker权限
- 参考：[https://www.cnblogs.com/lxsky/p/12829864.html](https://www.cnblogs.com/lxsky/p/12829864.html)
- root用户新建docker组：groupadd docker
- 使用普通用户appdeploy执行：
```sh
sudo gpasswd -a $USER docker
newgrp docker

# 没有sudo权限需要按照下面进行配置
a. 首先找到文件位置，示例中文件在/etc/sudoers位置。
whereis sudoers

b.强调内容 修改文件权限，一般文件默认为只读。
ls -l /etc/sudoers 查看文件权限
chmod -v u+w /etc/sudoers 修改文件权限为可编辑

c. 修改文件，在如下位置增加一行，保存退出。
vim /etc/sudoers 进入文件编辑器
文件内容改变如下：
root ALL=(ALL) ALL 已有行
appdeploy ALL=(ALL) ALL 新增行

d. 记得将文件权限还原回只读。
ls -l /etc/sudoers 查看文件权限
chmod -v u-w /etc/sudoers 修改文件权限为只读
```
如果上面没有生效，再重启下docker
- systemctl daemon-reload
- systemctl restart docker

## Docker-Compose安装

- 方式一：pip3安装
    - 有网络情况：  
        pip3 install docker-compose
    - 无网络情况：
        ```sh
        # 使用有网络的电脑下载并上传
        pip3 download  -d /root/software/python3.7/pippackage/ docker-compose
        # 安装
        pip3 install --no-index --find-links=/root/software/python3.7/pippackage/ docker-compose
        ```
- 方式二: 二进制安装
    - Linux安装：直接从 [https://github.com/docker/compose/releases](https://github.com/docker/compose/releases/download/1.22.0/docker-compose-) 找到合适的版本下载docker-compose-Linux-x86_64  
    - 接着上传到linux服务器  


## K8s安装