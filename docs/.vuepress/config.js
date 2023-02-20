module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/solidity/',
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
              title: "初步了解",
              path: '/first/FirstMetSolidity',
              collapsable: false, // 不折叠
              children: [
                { title: "初步了解", path: "/first/FirstMetSolidity" },
                
              ],
            },
            {
              title: "基础",
              path: '/basic/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/basic/Introduce" },

              ],
            },
           
          ]
    }
  }