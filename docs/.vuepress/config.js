module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    locales: {
        '/go/': {
          lang: 'zh-CN'
        }
      },
    themeConfig: {
        nav: [
            { text: '首页', link: '/go/' },
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
                path: '/go/',
                collapsable: false, // 不折叠
                children: [
                    { title: "学前必读", path: "/go/" }
                ]
            },
            {
              title: "基础学习",
              path: '/go/basic/DesignPhilosophy',
              collapsable: false, // 不折叠
              children: [
                { title: "设计哲学", path: "/go/basic/DesignPhilosophy" },
                { title: "安装方法", path: "/go/basic/InstallMethod" },
                { title: "数据类型", path: "/go/basic/DataStructure" },
                { title: "变量常量", path: "/go/basic/VariableConstants" },
                { title: "字符串", path: "/go/basic/String" },
                { title: "数组切片", path: "/go/basic/List" },
                { title: "Map", path: "/go/basic/Map" },
                { title: "指针", path: "/go/basic/Pointer" },
                { title: "结构体", path: "/go/basic/Structure" },
                { title: "运算符", path: "/go/basic/Operator" },
                { title: "语句", path: "/go/basic/Statement" },
                { title: "函数", path: "/go/basic/Function" },
                { title: "方法", path: "/go/basic/Method" },
                { title: "接口", path: "/go/basic/Interface" },
                { title: "错误处理", path: "/go/basic/Error" },
                { title: "异常", path: "/go/basic/Panic" },
                { title: "包管理", path: "/go/basic/GoModule" },
                { title: "项目布局", path: "/go/basic/Layout" },
                
              ],
            },
            {
              title: "并发编程",
              path: '/go/concurrent/Goroutine',
              collapsable: false, // 不折叠
              children: [
                { title: "Goroutine", path: "/go/concurrent/Goroutine" },
                { title: "channel通道", path: "/go/concurrent/Channel" },
  
              ],
            },
            {
              title: "进阶学习",
              path: '/go/advance/Generics',
              collapsable: false, // 不折叠
              children: [
                { title: "泛型", path: "/go/advance/Generics" },
                { title: "反射", path: "/go/advance/Reflect" },
                
              ],
            },
            {
              title: "常用依赖",
              path: '/go/lib/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/go/lib/Summary" },
                { title: "DBTools", path: "/go/lib/DBTools" },
                { title: "FileTools", path: "/go/lib/FileTools" },  
              ],
            },
            {
              title: "网络编程",
              path: '/go/net/Tcp',
              collapsable: false, // 不折叠
              children: [
                { title: "TCP", path: "/go/net/Tcp" },
                { title: "HTTPServer", path: "/go/net/HttpServer" },
                { title: "HttpClient", path: "/go/net/HttpClient" },
                { title: "Gin框架", path: "/go/net/Gin" },
                { title: "Beego框架", path: "/go/net/Beego" },
  
              ],
            },
            {
              title: "项目",
              path: '/go/project/CmdTool',
              collapsable: false, // 不折叠
              children: [
                { title: "命令行工具", path: "/go/project/CmdTool" },
                { title: "Api网关", path: "/go/project/ApiGateway" },
                { title: "SimpleRpc", path: "/go/project/SimpleRpc" },
                { title: "SimpleRedis", path: "/go/project/SimpleRedis" },
  
              ],
            },
            {
              title: "源码解读",
              path: '/go/code/Etcd',
              collapsable: false, // 不折叠
              children: [
                { title: "Etcd源码解读", path: "/go/code/Etcd" },
                { title: "Docker源码解读", path: "/go/code/Docker" },
              ],
            }
          ]
    }
  }