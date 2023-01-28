module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/go/',
    locales: {
        '/': {
          lang: 'zh-CN'
        }
      },
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { 
                text: 'T8840 博客', 
                items: [
                    { text: 'Github', link: 'https://github.com/t8840' },
                ]
            }
        ],
        subSidebar: 'auto',
        sidebar: [
            {
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                children: [
                    { title: "学前必读", path: "/" }
                ]
            },
            {
              title: "基础学习",
              path: '/basic/DesignPhilosophy',
              collapsable: false, // 不折叠
              children: [
                { title: "设计哲学", path: "/basic/DesignPhilosophy" },
                { title: "安装方法", path: "/basic/InstallMethod" },
                { title: "数据类型", path: "/basic/DataStructure" },
                { title: "变量常量", path: "/basic/VariableConstants" },
                { title: "字符串", path: "/basic/String" },
                { title: "数组切片", path: "/basic/List" },
                { title: "Map", path: "/basic/Map" },
                { title: "指针", path: "/basic/Pointer" },
                { title: "结构体", path: "/basic/Structure" },
                { title: "运算符", path: "/basic/Operator" },
                { title: "语句", path: "/basic/Statement" },
                { title: "函数", path: "/basic/Function" },
                { title: "方法", path: "/basic/Method" },
                { title: "接口", path: "/basic/Interface" },
                { title: "错误处理", path: "/basic/Error" },
                { title: "异常", path: "/basic/Panic" },
                { title: "包管理", path: "/basic/GoModule" },
                { title: "项目布局", path: "/basic/Layout" },
                
              ],
            },
            {
              title: "并发编程",
              path: '/concurrent/Goroutine',
              collapsable: false, // 不折叠
              children: [
                { title: "Goroutine", path: "/concurrent/Goroutine" },
                { title: "channel通道", path: "/concurrent/Channel" },
  
              ],
            },
            {
              title: "进阶学习",
              path: '/advance/Generics',
              collapsable: false, // 不折叠
              children: [
                { title: "泛型", path: "/advance/Generics" },
                { title: "反射", path: "/advance/Reflect" },
                
              ],
            },
            {
              title: "常用依赖",
              path: '/lib/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/lib/Summary" },
                { title: "DBTools", path: "/lib/DBTools" },
                { title: "FileTools", path: "/lib/FileTools" },  
              ],
            },
            {
              title: "网络编程",
              path: '/net/Tcp',
              collapsable: false, // 不折叠
              children: [
                { title: "TCP", path: "/net/Tcp" },
                { title: "HTTPServer", path: "/net/HttpServer" },
                { title: "HttpClient", path: "/net/HttpClient" },
                { title: "Gin框架", path: "/net/Gin" },
                { title: "Beego框架", path: "/net/Beego" },
  
              ],
            },
            {
              title: "项目",
              path: '/project/CmdTool',
              collapsable: false, // 不折叠
              children: [
                { title: "命令行工具", path: "/project/CmdTool" },
                { title: "Api网关", path: "/project/ApiGateway" },
                { title: "SimpleRpc", path: "/project/SimpleRpc" },
                { title: "SimpleRedis", path: "/project/SimpleRedis" },
  
              ],
            },
            {
              title: "源码解读",
              path: '/code/Etcd',
              collapsable: false, // 不折叠
              children: [
                { title: "Etcd源码解读", path: "/code/Etcd" },
                { title: "Docker源码解读", path: "/code/Docker" },
              ],
            }
          ]
    }
  }