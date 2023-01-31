module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/test/',
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
              path: '/concept/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "软件测试", path: "/concept/Test" },
                { title: "质量标准", path: "/concept/Test" },
              ],
            },
            {
              title: "测试用例",
              path: '/case/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "测试用例", path: "/case/Test" },
                { title: "测试模型", path: "/case/Model" },
                { title: "常用工具", path: "/case/Tools" },
              ],
            },
            {
              title: "白盒测试",
              path: '/ut/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "白盒测试", path: "/ut/Test" },
              ],
            },
            {
              title: "API测试",
              path: '/api/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "API测试", path: "/api/Test" },
                { title: "测试模型", path: "/api/Model" },
                { title: "常见工具", path: "/api/Tools" },
              ],
            },
            {
              title: "UI测试",
              path: '/ui/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "UI测试", path: "/ui/Test" },
                { title: "浏览器UI测试", path: "/ui/Chrome" },
                { title: "移动端UI测试", path: "/ui/Device" },
                { title: "桌面GUI测试", path: "/ui/GUI" },
                { title: "常见工具", path: "/ui/Tools" },
              ],
            },
            
            {
              title: "移动端测试",
              path: '/app/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "移动端测试", path: "/app/Test" },
              ],
            },
            {
              title: "性能测试",
              path: '/performance/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "性能测试", path: "/performance/Test" },
              ],
            },
            {
              title: "稳定性测试",
              path: '/stability/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "稳定性测试", path: "/stability/Test" },
              ],
            },
            {
              title: "精准测试",
              path: '/precise/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "精准测试", path: "/precise/Test" },
              ],
            },
            {
              title: "安全测试",
              path: '/safty/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "安全测试", path: "/safty/Test" },
              ],
            },
            {
              title: "测试报告",
              path: '/report/Test',
              collapsable: false, // 不折叠
              children: [
                { title: "测试报告", path: "/report/Test" },
                { title: "常用工具", path: "/report/Tools" },
              ],
            },
            {
              title: "工具",
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
                { title: "源码解读", path: "/code/Reading" },
              ],
            }
          ]
    }
  }