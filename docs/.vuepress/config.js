module.exports = {
    title: 'T8840 Blog',
    description: 'T8840的博客',
    theme: 'reco',
    base: '/trade/',
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
              title: "量化交易介绍",
              path: '/basic/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "量化交易介绍", path: "/basic/Introduce" },
                
              ],
            },
            {
              title: "股票",
              path: '/stock/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "市场分析", path: "/stock/Introduce" },
  
              ],
            },
            {
              title: "数字货币",
              path: '/coin/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "市场分析", path: "/coin/Introduce" },
                { title: "策略分析", path: "/coin/Strategy" },
                { title: "数据分析", path: "/coin/Data" },
              ],
            },
            {
              title: "大宗商品",
              path: '/goods/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "市场分析", path: "/goods/Introduce" },
              ],
            },
            {
              title: "策略",
              path: '/strategy/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/strategy/Introduce" },
                { title: "时间段", path: "/strategy/DayTime" },
                { title: "Kline形态", path: "/strategy/Kline" },
                { title: "双均线", path: "/strategy/DoubleMovingAverage" },
                { title: "套利", path: "/strategy/Straddle" },
                { title: "选币", path: "/strategy/TokenChoose" },
                { title: "新闻", path: "/strategy/News" },
                { title: "市场情绪", path: "/strategy/Santiment" },
                { title: "趋势", path: "/strategy/Trend" },
                { title: "周期", path: "/strategy/Cycle" },

              ],
            },
            {
              title: "回测系统",
              path: '/backtest/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "介绍", path: "/backtest/Introduce" },
                { title: "BackTrader工具", path: "/backtest/BackTrader" },

              ],
            },  
            {
              title: "交易所",
              path: '/exchange/Introduce',
              collapsable: false, // 不折叠
              children: [
                { title: "交易所介绍", path: "/exchange/Introduce" },
                { title: "接口", path: "/exchange/Api" },

              ],
            },  
            {
              title: "python实现",
              path: '/python/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/python/Summary" },
              ],
            }, {
              title: "go实现",
              path: '/go/Summary',
              collapsable: false, // 不折叠
              children: [
                { title: "汇总", path: "/go/Summary" },
              ],
            },
          ]
    }
  }