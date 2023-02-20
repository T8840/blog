module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/web3/',
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
              title: "Web3基本介绍",
              path: '/basic/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "宏景图", path: "/basic/Introduce" },
                
              ],
            },
            {
              title: "比特币",
              path: '/bitcoin/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "比特币介绍", path: "/bitcoin/Introduce" },
  
              ],
            },
            {
              title: "以太坊",
              path: '/eth/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "以太坊介绍", path: "/eth/Introduce" },
                { title: "Arbitrum", path: "/eth/Arbitrum" },

              ],
            },
            {
              title: "DApp",
              path: '/dapp/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/dapp/Summary" },
                { title: "WebSite", path: "/eth/WebSite" },

              ],
            },
            {
              title: "NFT",
              path: '/nft/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/nft/Summary" },
                { title: "Mint", path: "/nft/Mint" },

              ],
            },
            {
              title: "代币",
              path: '/coin/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/coin/Introduce" },
                
              ],
            },
          ]
    }
  }