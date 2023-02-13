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
                { title: "数据类型", path: "/concept/DataBase" },
                { title: "索引", path: "/concept/Indexing" },
                { title: "事务", path: "/concept/Affairs" },
                { title: "锁", path: "/concept/Lock" },
                { title: "约束", path: "/concept/Constraint" },
                { title: "视图", path: "/concept/View" },
                { title: "存储过程", path: "/concept/Procedure" },
                { title: "游标", path: "/concept/Cursor" },
                { title: "触发器", path: "/concept/Trigger" },
                { title: "权限管理", path: "/concept/Security" },
                { title: "日志管理", path: "/concept/Log" },
                { title: "数据库规范", path: "/concept/Standard" },
                { title: "ER图", path: "/concept/ER" },
                { title: "范式", path: "/concept/Design" },
                { title: "ORM", path: "/concept/ORM" },
              ],
            },
            {
              title: "CRUD",
              path: '/commands/Create',
              collapsable: false, // 不折叠
              children: [
                { title: "数据库操作", path: "/commands/Datebase" },
                { title: "表操作", path: "/commands/Table" },
                { title: "数据操作", path: "/commands/Data" },
                { title: "函数", path: "/commands/Function" },
                { title: "语句", path: "/commands/Statement" },
              ],
            },
            {
              title: "性能优化",
              path: '/performance/Benchmark',
              collapsable: false, // 不折叠
              children: [
                { title: "性能指标", path: "/performance/Metric" },
                { title: "基准测试", path: "/performance/Benchmark" },
                { title: "查询优化", path: "/performance/Query" },
              ],
            },
             {
              title: "常用数据模型",
              path: '/model/User',
              collapsable: false, // 不折叠
              children: [
                { title: "用户表", path: "/model/User" },
                { title: "商品表", path: "/model/Goods" },
                { title: "订单表", path: "/model/Order" },
                { title: "OA", path: "/model/OA" },

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