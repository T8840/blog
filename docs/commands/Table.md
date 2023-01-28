---
title: 表操作
author: T8840
date: '2023-01-15'
---

## 创建表命令
```sql
CREATE TABLE <表名>（
<字段名1> <数据类型>(<数据长度>),
<字段名2> <数据类型>(<数据长度>),
....
<字段名n> <数据类型>(<数据长度>)
）;
```
```sql
CREATE TABLE student(id int(10),stu_name char(20),gender char(10));
```
- SHOW TABLES; # 查询所有数据表

## 查询命令
### 条件查询命令

```sql
select  system_code,component  from sf_sonarqube_static WHERE component like '%IBU-IUOP-ICCSP%';

UPDATE sf_sonarqube_static set system_code = 'IBU-IUOP-ICCSP'   WHERE component like '%IBU-IUOP-ICCSP%';
```
### 多表查询命令
#### 连接查询