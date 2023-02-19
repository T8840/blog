---
title: 特定时间策略
author: T8840
date: '2023-02-15'
---


## 特定时间策略

天天观察K线，可能会形成对特定时间的观察和感知。如，经过我多天观察：  
- 在一天当中：
1. 北京时间早晨6点~7点会形成上涨趋势，就是如果这个时间段做多的话后续在上午都有合适的位置卖出  
2. 北京时间凌晨4点~5点会形成下降趋势，就是如果这个时间段做空的话后续在5点~6点都有合适的位置卖出  

另外，晚上9：00 ~ 5：00 有大量的成交额

- 节假日：
周日晚12点~4点大概率是上涨趋势；
除夕会有暴涨;
春节也有一波大的行情;  


要确保的是，有足够的数据样本来支撑
## 回测该策略

下面拿1分钟K线数据举例，如：从Bybit下载2023年1分钟K线数据：  
https://public.bybit.com/kline_for_metatrader4/BTCUSDT/2023/

BTCUSDT_1_2023-01-01_2023-01-31.csv.gz
打开后，文件内容如下格式：
```sh
start_at,open,high,low,close,volume
2023.01.01 00:00,16581.000000,16581.000000,16580.500000,16581.000000,1.881000
2023.01.01 00:01,16581.000000,16584.000000,16580.500000,16584.000000,38.549000
2023.01.01 00:02,16584.000000,16584.000000,16583.500000,16583.500000,4.009000
2023.01.01 00:03,16583.500000,16584.000000,16583.500000,16584.000000,1.148000
2023.01.01 00:04,16584.000000,16584.000000,16583.500000,16584.000000,0.698000
...
```

### 使用pandas进行粗略计算做多时间段
1分钟K线数据放在同级目录data目录中  
指定plan_buy_time与plan_sell_time的时间段进行计算  
做多时的价格取的平均值，可在观察一段时间的低点做多  
卖出时机一定要比做多价格高出一定价格后迅速卖出  

day_time_bull_strategy.py
```python
import pandas as pd
import os
import pprint
import matplotlib.pyplot as plt
# 自定义生成数据
# i = pd.date_range('2020-01-01', periods=10000, freq='1min')
# order_data= pd.DataFrame({"start_at":i,'value': np.arange(0,10000)})
path= ( r'./data')
file_list = os.listdir (path)
summary = list()

plan_buy_time = ["06:00", "07:00"]
plan_sell_time = ["08:00", "12:00"]
for file_name in file_list:

    order_data = pd.read_csv('data/' + file_name
                             , parse_dates = ['start_at']  # 待转换为**datetime64[ns]**格式的列→col1
                             , infer_datetime_format=True  #  将parse_dates指定的列转换为时间
                             )


    ## 获取某天这个时间段的平均值
    for i in range(1,31):

        d_day = order_data[order_data["start_at"].dt.day==i]
        ts1 = d_day.set_index("start_at").between_time(plan_buy_time[0],plan_buy_time[1])
        six_clock_price = ts1.head(1)["close"].mean()
        seven_clock_price = ts1.tail(1)["close"].mean()

        ts2 = d_day.set_index("start_at").between_time(plan_sell_time[0],plan_sell_time[1])

        if ts1.empty is False and ts2.empty is False:
            plan_buy_time_mean = ts1["close"].mean()
            plan_sell_time_high = ts2["high"].max()
            plan_sell_time_mean = ts2["close"].mean()
            summary.append({"file":file_name,"day":i,"plan_buy_time_mean":plan_buy_time_mean,"six_clock_price": six_clock_price ,"seven_clock_price": seven_clock_price ,"plan_sell_time_high":plan_sell_time_high,"plan_sell_time_mean":plan_sell_time_mean})

pprint.pprint(summary)
X,Y1,Y2 = [],[],[]
for item in summary:
    X.append(item.get("day"))
    Y1.append(item.get("plan_buy_time_mean"))
    Y2.append(item.get("plan_sell_time_high"))

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

fig ,ax1 = plt.subplots()
plt.xticks(rotation=45)

ax1.plot(X,Y1,color="blue",label="buy price")
ax1.set_ylabel("价格")

ax2 = ax1.twinx()
ax2.plot(X,Y2,color="red",label="sell price")
ax2.set_ylabel("价格")

fig.legend(loc="upper right",bbox_to_anchor=(1,1),bbox_transform=ax1.transAxes)
plt.show()


```

### 使用pandas进行粗略计算做空时间段


day_time_short_strategy.py
```python
import pandas as pd
import os
import pprint
import matplotlib.pyplot as plt

path= ( r'./data')
file_list = os.listdir (path)
summary = list()

plan_buy_time = ["04:00", "05:00"]
plan_sell_time = ["05:00", "06:00"]
for file_name in file_list:

    order_data = pd.read_csv('data/' + file_name
                             , parse_dates = ['start_at']  # 待转换为**datetime64[ns]**格式的列→col1
                             , infer_datetime_format=True  #  将parse_dates指定的列转换为时间
                             )


    for i in range(1,31):

        d_day = order_data[order_data["start_at"].dt.day==i]
        ts1 = d_day.set_index("start_at").between_time(plan_buy_time[0],plan_buy_time[1])
        ts2 = d_day.set_index("start_at").between_time(plan_sell_time[0],plan_sell_time[1])

        if ts1.empty is False and ts2.empty is False:
            plan_buy_time_mean = ts1["close"].mean()
            plan_sell_time_low = ts2["low"].min()
            plan_sell_time_mean = ts2["close"].mean()
            summary.append({"file":file_name,"day":i,"plan_buy_time_mean":plan_buy_time_mean,"plan_sell_time_low":plan_sell_time_low,"plan_sell_time_mean":plan_sell_time_mean})

pprint.pprint(summary)
X,Y1,Y2 = [],[],[]
for item in summary:
    X.append(item.get("day"))
    Y1.append(item.get("plan_buy_time_mean"))
    Y2.append(item.get("plan_sell_time_low"))

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

fig ,ax1 = plt.subplots()
plt.xticks(rotation=45)

ax1.plot(X,Y1,color="blue",label="buy price")
ax1.set_ylabel("价格")

ax2 = ax1.twinx()
ax2.plot(X,Y2,color="red",label="sell price")
ax2.set_ylabel("价格")

fig.legend(loc="upper right",bbox_to_anchor=(1,1),bbox_transform=ax1.transAxes)
plt.show()
```

## 总结
从数据结果看，早晨6点~7点会形成上涨趋势 优于 4点~5点会形成下降趋势