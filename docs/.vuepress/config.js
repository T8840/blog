module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/rust/',
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
                { title: "基础知识", path: "/basic/BasicLearning" },
                { title: "安装方法", path: "/basic/InstallMethod" },
                { title: "模块", path: "/basic/Module" },

              ],
            },
            {
              title: "依赖库",
              path: '/lib/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/lib/Introduce" },
                { title: "DB库", path: "/lib/DBTools" },
              ],
            }
            {
              title: "项目",
              path: '/project/CmdTool',
              collapsable: false, // 不折叠
              children: [
                { title: "命令行工具", path: "/project/CmdTool" },
                { title: "Api测试", path: "/project/ApiTest" },
                { title: "Web开发", path: "/project/Web" },  
              ],
            }
          ]
    }
  }