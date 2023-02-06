---
title: 造数工具
author: T8840
date: '2023-01-15'
---



## 造数工具

### SQLAuto
https://github.com/TommyLemon/SQLAuto
demo: http://apijson.cn/sql/
原理:
 如果 SQL 语句是 INSERT 插入语句，则可以快速生成 1000+ 条测试数据(表记录)，方便前后端联调接口，可按规则生成。 例如
```sql
INSERT INTO sys.apijson_user(id, sex, name) VALUES(${id}, ${sex}, ${name})
```
1000 次参数注入 Random Test：
```sql
id: new Date().getTime()  // 当前时间毫秒值
sex: RANDOM_IN(0, 1)  // 随机从 0, 1 中取值
name: 'Test ' + new Date().toLocaleTimeString()  // 通过代码自定义
```