module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/devops/',
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
              title: "Devops",
              path: '/devops/Basic',
              collapsable: false, // 不折叠
              children: [
                { title: "概念", path: "/devops/Basic" },
                
              ],
            },
            {
              title: "Git",
              path: '/git/Commands',
              collapsable: false, // 不折叠
              children: [
                { title: "常用命令", path: "/git/Commands" },
                
              ],
            },
            {
              title: "Docker",
              path: '/docker/Commands',
              collapsable: false, // 不折叠
              children: [
                { title: "安装方法", path: "/docker/InstallMethod" },
                { title: "常用命令", path: "/docker/Commands" },
                { title: "常用镜像", path: "/docker/Image" },
                { title: "K8s", path: "/docker/K8s" },
  
              ],
            }
          ]
    }
  }