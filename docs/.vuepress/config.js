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
              title: "Web3最佳编程实践指南",
              path: '/best/BestWeb3TechIntroduce',
              collapsable: false, // 不折叠
              children: [
                { title: "Web3最佳编程实践指南", path: "/best/BestWeb3TechIntroduce" },
                
              ],
            },
            {
              title: "基础",
              path: '/basic/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/basic/Introduce" },
                { title: "初步了解Solidity", path: "/basic/FirstMetSolidity" },
                { title: "SoliditybyExample", path: "/basic/SoliditybyExample" },
              ],
            },
            {
              title: "教程:professional-solidity",
              path: '/professional-solidity/Contents',
              collapsable: true, // 不折叠
              children: [
                { title: "目录", path: "/professional-solidity/Contents" },
                { title: "数据", path: "/professional-solidity/02.type-of-data" },
                { title: "变量", path: "/professional-solidity/03.variable" },
                { title: "函数", path: "/professional-solidity/04.function" },
                { title: "操作符", path: "/professional-solidity/05.operator" },
                { title: "错误处理", path: "/professional-solidity/06.error" },
                { title: "流程控制", path: "/professional-solidity/07.control-flow" },
                { title: "循环与迭代", path: "/professional-solidity/08.loops-and-iteration" },
                { title: "事件", path: "/professional-solidity/09.event" },
                { title: "继承", path: "/professional-solidity/10.inheritance" },
                { title: "合约调用合约", path: "/professional-solidity/11.call-other" },
                { title: "合约部署合约", path: "/professional-solidity/12.deploy" },
                { title: "接口", path: "/professional-solidity/13.interface" },
                { title: "库", path: "/professional-solidity/14.library" },
                { title: "算法", path: "/professional-solidity/15.algorithm" },
                { title: "内联汇编", path: "/professional-solidity/16.assembly" },
                { title: "元数据", path: "/professional-solidity/17.metadata" },
                { title: "ABI编码", path: "/professional-solidity/18.abi" },
                { title: "变量布局", path: "/professional-solidity/19.layout" },
                { title: "安全", path: "/professional-solidity/20.safe" },
                { title: "gas优化", path: "/professional-solidity/21.gas" },
                { title: "合约编码规范", path: "/professional-solidity/22.styleguide" },
              ],
            },
            {
              title: "教程:openzeppelin-learn",
              path: '/openzeppelin-learn/Introduce',
              collapsable: true, // 不折叠
              children: [
                { title: "介绍", path: "/openzeppelin-learn/Introduce" },
              ],
            },
            {
              title: "Relay",
              path: '/openzeppelin-learn/Introduce',
              collapsable: true, // 不折叠
              children: [
                { title: "介绍", path: "/openzeppelin-learn/Introduce" },
              ],
            },
            {
              title: "Go",
              path: '/openzeppelin-learn/Introduce',
              collapsable: true, // 不折叠
              children: [
                { title: "介绍", path: "/openzeppelin-learn/Introduce" },
              ],
            },
            {
              title: "项目",
              path: '/project/Summary',
              collapsable: true, // 不折叠
              children: [
                { title: "汇总", path: "/project/Summary" },
              ],
            },
          ]
    }
  }