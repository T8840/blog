---
title: Docker命令
author: T8840
date: '2023-01-15'
---

## Docker命令
- 基础命令
```sh
docker run -参数 "PEPOSITORY":"TAG" /bin/bash #开启容器
docker --version #查看docker版本
docker search name #搜索容器镜像
docker pull name #下载容器镜像
docker images #查看已下载的容器镜像
docker rmi "IMGAE ID" #删除镜像  或者
docker rmi "PEPOSITORY":"TAG"
docker tag "old PEPOSITORY":"old TAG" "new PEPOSITORY":"new TAG" #重命名
docker ps #查看当前运行的容器 -a/--all # 加上不论运行不运行所有容器都会显示
docker stop  "PEPOSITORY":"TAG"  # 停止容器
docker rm "CONTAINER ID" #删除容器
docker exec -it -u root 容器id sh # 使用root权限进入容器
docker inspect -f '{{.ID}}' 容器名 #
docker inspect "PEPOSITORY":"TAG" # 查看容器更多信息，如网络、配置等各种信息
docker inspect - -format='{{ .NetworkSettings.IPAddress }}' # 查看容器的ip地址
docker inspect --format='{{ .Config.Hostname }}' # 查看容器的12位的主机名
docker cp   容器ID:容器内路径  目的主机路径 #  从容器内拷贝文件到宿主机上
docker cp  主机路径  容器ID:容器内路径 # 从宿主机上拷贝文件到容器内
docker exec -t -i "PEPOSITORY":"TAG" /bin/bash # 在容器内创建一个新的bash会话
docker save -o new_name.tar.gz "PEPOSITORY":"TAG" #将镜像保存到本地
docker load -i name.tar.gz #从本地文件导入镜像
docker commit "CONTAINER ID" "new PEPOSITORY":"new TAG" #基于现有容器创建镜像,修改名称都能做到
docker logs "PEPOSITORY":"TAG" # 查看容器日志  -f # 实时打印日志
docker top  "PEPOSITORY":"TAG" # 查看容器占用主机的进程
docker exec -it  "PEPOSITORY":"TAG" ip addr # 查看分配给容器的网络ip
docker stats "PEPOSITORY":"TAG" # 查看容器的统计信息，如使用的cpu、内存等
```
- 运行容器命令
```sh
docker run -参数 "PEPOSITORY":"TAG" /bin/bash #开启容器
    - 例如：docker run -it nginx:latest /bin/bash
    - 参数：
        - -d # 后台运行
        - -name # 指定运行
        - -v # 挂载存储
        - -p # 指定映射端口
        - - -restart=always # 自动重启容器
```        

- docker exec进入停止的容器
```sh
docker ps -a
# 下面这个方法不好
docker commit 837ffa1d4 user/temp # 随便为失败镜像取一个名字 使用失败镜像的id来创建
docker run -it user/temp sh
```
- 删除中间镜像缓存命令- - 在主机磁盘空间被占满时用来清理
```sh    
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker stop
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker rm
docker images|grep none|awk '{print $3 }'|xargs docker rmi
```    


- 限制容器对主机资源使用的命令
    - [https://www.bbsmax.com/A/GBJrmRpKz0/](https://www.bbsmax.com/A/GBJrmRpKz0/)
    - 内存限制
        - 与操作系统类似，容器可使用的内存包括两部分：物理内存和 swap。 Docker 通过下面两组参数来控制容器内存的使用量。
            
            `-m` 或 `--memory`：设置内存的使用限额，例如 100M, 2G。
            
            `--memory-swap`：设置 **内存+swap** 的使用限额。
            
        - 当我们执行如下命令：docker run -m 200M --memory-swap=300M ubuntu
            - 其含义是允许该容器最多使用 200M 的内存和 100M 的 swap。默认情况下，上面两组参数为 -1，即对容器内存和 swap 的使用没有限制。

- 运行中的容器新增映射目录三种方式
    - 运行中的容器新增映射目录
        - [https://www.cnblogs.com/poloyy/p/13993832.html](https://www.cnblogs.com/poloyy/p/13993832.html)
        - **问题背景**
        ```jsx
        docker run -d -p 9999:8080 -i --name tomcat7 -v /usr/local/webapps:/usr/local/tomcat/webapps tomcat:7
        ```
        
        - 创建容器时，指定了目录映射（-v）
        - 如果容器运行之后发现目录映射需要改怎么办？
        - 一、**删除原有容器，重新创建新的容器**
            - **删除容器** `docker rm -f 容器ID/名字`
            - **重新创建容器**`docker run -d -p 9999:8080 -i --name tomcat7 -v /usr/local/tomcat/webapps:/usr/local/tomcat/webapps tomcat:7`
            - 重新指定需要映射的目录
            - **优点**
                
                简单粗暴，在测试环境用的更多
                
            - **缺点**
                
                如果是数据库、服务器相关的容器，创建新的容器，又得重新配置相关东西了
                
        - 二、**修改容器配置文件（重点）**
            - **暂停 Docker 服务**`systemctl stop docker`
            - **进入 Docker 容器配置文件目录下**`cd /var/lib/docker/containers/`
                - ls
                - docker ps -aq (容器id就是一个文件夹）
            - **进入某个容器的配置文件目录下**
                
                容器ID 就是文件夹名称，可通过 docker ps -aq 来查看，不过这是缩写，对照起来看就行`cd c614b6db4aed0c8d0c742baa09ff4e2c24761703586460b68633d7b66e62c633ls`
                
            - **修改 config.v2.json**`vim config.v2.json`
                - Source对应主机上的目录 2处要保持一致
                - MountPoints Target Destination 对应容器上的目录 3处要保持一致
                
                输入 / ，搜索映射的目录（webapps）
                
                - 也可以找到 MountPoints
                - 若需要重新指定**主机上**的映射目录，则改**绿圈**的两个地方
                - 若需要重新指定**容器上**的映射目录，则改**蓝圈**的两个地方
            - **MountPoints 节点**
                - 其实是一个 json 结构的数据，下图
            - **重新启动 Docker 服务**`systemctl stop dockerdocker start tomcat7cd /usr/local/tomcat/webappsls`
                
                重新映射目录成功！！
                
            - **注意**
                - 如果想修改 Docker 容器随着 Docker 服务启动而自启动，可看：[https://www.cnblogs.com/poloyy/p/13985567.html](https://www.cnblogs.com/poloyy/p/13985567.html)
                - 如果想修改 Docker 的映射端口，可看：[https://www.cnblogs.com/poloyy/p/13940554.html](https://www.cnblogs.com/poloyy/p/13940554.html)
                - 改 hostconfig.json 并不会成功哦
            - **优点** 直接操作配置文件没有副作用，算简单
            - **缺点** 需要暂停 Docker 服务，会影响其他正常运行的 Docker 容器
        - 三、**使用 docker commit 命令**
            - **停止 Docker 容器**`docker stop tomcat7`
            - **使用 commit 构建新镜像**`docker commit tomcat7 new_tomcat7`
            - **使用新镜像重新创建一个 Docker 容器**
                
                 `docker run -d -p 9999:8080 -i --name tomcat77 -v /usr/local/tomcat/webapps:/usr/local/tomcat/webapps tomcat:7`
                
            - **修改新容器的名字**
                
                如果新容器想用回旧容器的名字，需要先删了旧容器，再改名`docker rm -f tomcat7
                docker rename tomcat77 tomcat7
                docker ps`
                
            - **优点**
                - 无需停止 Docker 服务，不影响其他正在运行的容器
                - 旧容器有的配置和数据，新容器也会有，不会造成数据或配置丢失，对新旧容器都没有任何影响
            - **缺点** 需要生成新的镜像和容器，管理镜像和容器的时间成本会上升

## Dockerfile编写与构建镜像

- dockerfile文件编写
    - 参考博客：[https://www.cnblogs.com/regit/p/8295712.html](https://www.cnblogs.com/regit/p/8295712.html)
    - Doerfile分为四部分：1.基础镜像信息 2.维护者信息 3.镜像操作指令 4.容器启动时执行指令
        - FROM：指定 base 镜像。
        - MAINTAINER：设置镜像的作者，可以是任意字符串。
        - COPY：将文件从 build context 复制到镜像。
            - COPY 支持两种形式：
            - COPY src dest
            - COPY ["src", "dest"]注意：src 只能指定 build context 中的文件或目录。
        - ADD：与 COPY 类似，从 build context 复制文件到镜像。不同的是，如果 src 是归档文件（tar, zip, tgz, xz 等），文件会被自动解压到 dest。
        - ENV：设置环境变量，环境变量可被后面的指令使用。例如：...ENV MY_VERSION 1.3RUN apt-get install -y mypackage=$MY_VERSION...EXPOSE：指定容器中的进程会监听某个端口，Docker 可以将该端口暴露出来。我们会在容器网络部分详细讨论。
        - VOLUME：将文件或目录声明为volume。
        - WORKDIR：为后面的 RUN, CMD, ENTRYPOINT, ADD 或 COPY 指令设置镜像中的当前工作目录。
        - RUN：在容器中运行指定的命令，RUN指令通常用于安装应用和软件包。
        - CMD：容器启动时运行指定的命令。Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效。CMD 可以被 docker run 之后的参数替换。
        - ENTRYPOINT：设置容器启动时运行的命令，可让容器以应用程序或者服务的形式运行。Dockerfile 中可以有多个 ENTRYPOINT 指令，但只有最后一个生效。CMD 或docker run 之后的参数会被当做参数传递给 ENTRYPOINT。
- 基于Dockerfile文件创建Docker镜像
    1. 先创建一个名为Dockerfile #必须为这个名字 的文件并且写入参数
        - [root@cicd~]# cat /root/dockerfile
        ```python
            FROM centos:7
            RUN yum install -y vim
            copy hello.txt /root/
        ```
    2. 然后创建images
        - docker build  -f /root/docker/Dockerfile -t centostest .
            - 或者：docker build -t centostest .
            - build：创建镜像-t：为镜像指定名字.：指明 build context 为当前目录，我们也可以通过 -f 参数指定 Dockerfile 的位置
        - **不使用缓存构建镜像**
            - docker build --no-cache -t name .
            
## Docker-Compose命令

```sh
docker-compose up -d # 后台启动，已启动会进行更新
docker-compose down
```

## K8s命令