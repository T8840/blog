---
title: 数据库操作
author: T8840
date: '2023-01-15'
---

## 数据库操作命令
- 创建数据库 CREATE DATABASE mysql_test;
- 查看当前数据库 SHOW DATABASES;
- 删除数据库 DROP DATABASE mysql_test;
- SHOW TABLES; # 查询所有数据表

## MySQL分区
1. 确认MySQL服务器是否支持分区表：SHOW PLUGINS；  
其中，partition的Status为ACTIVE；  
2. MySQL分区种类：  
- 按HASH分区
根据MOD（分区键，分区数）的值把数据存储行存储到表的不同分区中。数据可以平均的分布在各个分区中。
```sql
...
PARTITION BY HASH(customer_id)
    PARTITIONS 4;
# 时间处理
...
PARTITION BY HASH(UNIX_TIMESTAMP(login_time))
    PARTITIONS 4;
```
- 按范围分区  
根据分区键值的范围把数据行存储到表的不同分区中；
多个分区的范围要连续，但是不能重叠；
默认情况下使用VALUES LESS THAN属性，即每个分区不包括指定的那个值。
```sql
...
PARTITION BY RANGE(customer_id)
    PARTITION p0 VALUES LESS THAN (10000),
    PARTITION p1 VALUES LESS THAN (20000),
    PARTITION p2 VALUES LESS THAN (30000),
    PARTITION p3 VALUES LESS THAN MAXVALUE
```
适用场景：分区键为日期或是时间类型；所有查询中都包括分区键；定期按分区范围清理历史数据。
- 按LIST分区  
按分区键取值的列表进行分区；  
同范围分区一样，各分区的列表值不能重复；  
每一行数据必须能找到对应的分区列表，否则数据插入失败。
```sql
...
PARTITION BY LIST(login_type)
    PARTITION p0 VALUES in (1,3,5,7,9),
    PARTITION p1 VALUES in (2,4,6,8)
```
3. 使用分区表的注意事项
- 结合业务场景选择分区键，避免跨分区查询；
- 对分区表进行查询最好在WHERE从句中包含分区键
- 具有主键或唯一索引的表，主键或唯一索引必须是分区键的一部分


## 导入sql文件进行数据恢复

- 第一种方式，使用“mysql”命令行客户端工具，进行数据恢复的命令
```sql
H:\>mysql -u root -p demo < test.sql
Enter password: *****
```

- 第二种方式，使用“SOURCE”语句恢复数据
```sql
use db;
source D:\Demo.sql;
```

## 数据备份

MySQL的数据备份有2种，一种是物理备份，通过把数据文件复制出来，达到备份的目的；另外一种是逻辑备份，通过把描述数据库结构和内容的信息保存起来，达到备份的目的。逻辑备份这种方式是免费的，广泛得到使用；而物理备份的方式需要收费，用得比较少。重点是逻辑备份。  

用于数据备份的工具mysqldump。它总共有三种模式：  
1. 备份数据库中的表；
2. 备份整个数据库；
3. 备份整个数据库服务器

### 备份数据库

mysqldump备份数据库的语法结构是：
```sql
mysqldump -h 服务器 -u 用户 -p 密码 --databases 数据库名称 … > 备份文件名
```

### 备份数据库中的表
mysqldump备份数据库中的表的语法结构是：

```sql
mysqldump -h 服务器 -u 用户 -p 密码 数据库名称 [表名称 … ] > 备份文件名称
```

### 备份整个数据库服务器
mysqldump备份整个数据库服务器的语法结构是：

```sql
mysqldump -h 服务器 -u 用户 -p 密码 --all-databases > 备份文件名
```
