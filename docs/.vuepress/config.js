module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
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
              path: '/go/basic/DesignPhilosophy',
              collapsable: false, // 不折叠
              children: [
                { title: "设计哲学", path: "/go/basic/DesignPhilosophy" },
                { title: "安装方法", path: "/go/basic/InstallMethod" }
              ],
            }
          ]
    }
  }