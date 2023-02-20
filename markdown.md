## Markdown常用语法

### Markdown添加网络视频
1. 获取视频链接  
   找到你想添加的视频，点击分享按钮，复制嵌入代码。
2.  在.md文件中添加代码
  ```markdown
 <div style="position: relative; "><iframe 
  src="//www.bilibili.com/video/BV11M411P79S/?share_source=copy_web&vd_source=e96cb9e46f834740697ecc85f56bb588" allowfullscreen="allowfullscreen" width="100%" height="500" scrolling="true" frameborder="0" > 
  </iframe></div> 
  ```
  
### Markdown添加本地视频
1. 先在于.md同目录下创建一个文件夹用于放置添加的视频文件
2.  在.md文件中添加代码
  ```markdown
  <video src="/2020/07/29/hello-ultrafisher/logo.mp4" position= "absolute" width="100%" height="100%" controls="controls"></video>
  ```  
  
### Markdown添加本地图片
1. 先在于.md同目录下创建一个文件夹用于放置添加的图片文件
2.  在.md文件中添加代码
  ```markdown
  ![student](./student.png "student")
  ```  
