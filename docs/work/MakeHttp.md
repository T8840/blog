---
title: HTTP相关
author: T8840
date: '2023-01-15'
---


### PyScript
python代码可以在浏览器中执行
https://github.com/pyscript/pyscript


### hug
通过一行命令将python文件中的函数方法转换为http服务
https://github.com/hugapi/hug


```python
# filename: happy_birthday.py
"""A basic (single function) API written using hug"""
import hug


@hug.get('/happy_birthday')
def happy_birthday(name, age:hug.types.number=1):
    """Says happy birthday to a user"""
    return "Happy {age} Birthday {name}!".format(**locals())
```
Terminal中执行：hug -f happy_birthday.py

You can access the example in your browser at: localhost:8000/happy_birthday?name=hug&age=1. Then check out the documentation for your API at localhost:8000/documentation


### transfer.sh
通过一行命令来进行文件的上传与下载
Easy and fast file sharing from the command-line. This code contains the server with everything you need to create your own instance.
https://github.com/dutchcoders/transfer.sh/

```sh
Upload:
$ curl -v --upload-file ./hello.txt https://transfer.sh/hello.txt

Encrypt & Upload:
$ cat /tmp/hello.txt|gpg -ac -o-|curl -X PUT --upload-file "-" https://transfer.sh/test.txt

Download & Decrypt:
$ curl https://transfer.sh/1lDau/test.txt|gpg -o- > /tmp/hello.txt
```
## http测速
基于curl进行http相关统计
https://github.com/reorx/httpstat

## Mock

### wiremock
https://github.com/wiremock/wiremock
带Record功能
文档：https://wiremock.org/

## vcrpy
https://github.com/kevin1024/vcrpy
原理：对于同一个 HTTP 请求，第一次是一个完整的到服务器的 HTTP 请求，VCR.py 会记录下来，从第二次开始，VCR.py 会拦截这些相同请求，并读取磁带，返回第一次请求的数据，第二次实际上不会产生 HTTP 通信。

这样有以下好处：
- 可以离线工作，不依赖网络
- 确定的服务响应值，不受服务影响
- 加快测试执行速度
- 如果服务器修改了API，导致数据内容或格式变化，只需要删除磁带文件，再次运行测试即可。
