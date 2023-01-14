---
title: Go的安装
author: T8840
date: '2023-01-14'
---
#### 在Linux上安装
- 首先，我们需要下载并解压 Go Linux 安装包：
   $wget -c https://golang.google.cn/dl/go1.16.5.linux-amd64.tar.gz
- 第二步，将下载完毕的 Go 安装包解压到安装目录中：
   $tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
  执行完上面解压缩命令后，我们将在 /usr/local 下面看到名为 go 的目录，这个目录就是 Go 的安装目录，也是 Go 官方推荐的 Go 安装目录。
  我们执行下面命令可以查看该安装目录下的组成：$ls -F /usr/local/goAUTHORS CONTRIBUTORS PATENTS SECURITY.md api/ doc/ lib/ pkg/ src/CONTRIBUTING.md LICENSE README.md VERSION bin/ favicon.ico misc/ robots.txt test/
- 不过呢，为了可以在任意路径下使用 go 命令，我们需要将 Go 二进制文件所在路径加入到用户环境变量 PATH 中（以用户使用 bash 为例），具体操作是将下面这行环境变量设置语句添加到 $HOME/.profile 文件的末尾：export PATH=$PATH:/usr/local/go/bin  
然后执行下面命令使上述环境变量的设置立即生效：$source ~/.profile最后，我们可以通过下面命令验证此次安装是否成功：$go version