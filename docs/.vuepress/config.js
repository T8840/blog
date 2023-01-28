module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/mysql/',
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
              title: "概念",
              path: '/concept/Indexing',
              collapsable: false, // 不折叠
              children: [
                { title: "索引", path: "/concept/Indexing" },
                { title: "事务", path: "/concept/Affairs" },
                { title: "锁", path: "/concept/Lock" },
              ],
            },
            {
              title: "常用命令",
              path: '/commands/Create',
              collapsable: false, // 不折叠
              children: [
                { title: "数据库操作", path: "/commands/Datebase" },
                { title: "表操作", path: "/commands/Table" },
                { title: "函数", path: "/commands/Function" },
                { title: "语句", path: "/commands/Statement" },
              ],
            },
            
            {
              title: "性能优化",
              path: '/performance/Conf',
              collapsable: false, // 不折叠
              children: [
                { title: "配置优化", path: "/performance/Conf" },
              ],
            },
            {
              title: "辅助工具",
              path: '/tools/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/tools/Summary" },
              ],
            },
            {
              title: "源码解读",
              path: '/code/Reading',
              collapsable: false, // 不折叠
              children: [
                { title: "MySQL源码解读", path: "/code/Reading" },
              ],
            }
          ]
    }
  }