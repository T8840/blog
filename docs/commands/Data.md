---
title: 增删改查
author: T8840
date: '2023-01-15'
---
针对表中数据进行增删改查操作如下：

## 增加命令

语法结构
```sql
INSERT INTO 表名 [(字段名 [,字段名] ...)] VALUES (值的列表);

```

## 修改命令

语法结构
```sql
UPDATE 表名
SET 字段名=值
WHERE 条件
```


## 删除命令

语法结构
```sql
DELETE FROM 表名 WHERE 条件

```

## 查询命令
语法结构
```sql
SELECT *|字段列表
FROM 数据源
WHERE 条件
GROUP BY 字段
HAVING 条件
ORDER BY 字段
LIMIT 起始点，行数
```

- ORDER BY的作用，是告诉MySQL，查询结果如何排序。ASC表示升序，DESC表示降序
- LIMIT的作用是告诉MySQL只显示部分查询的结果
### 条件查询
WHERE是直接对表中的字段进行限定，来筛选结果；  
HAVING则需要跟分组关键字GROUPBY一起使用，通过对分组字段或分组计算函数进行限定，来筛选结果。
```sql
select  system_code,component  from sf_sonarqube_static WHERE component like '%IBU-IUOP-ICCSP%';

UPDATE sf_sonarqube_static set system_code = 'IBU-IUOP-ICCSP'   WHERE component like '%IBU-IUOP-ICCSP%';
```


### 连接查询
把分散在多个不同的表里的数据查询出来的操作，就是多表查询。  

在MySQL中，有2种类型的连接，分别是内连接（INNER JOIN）和外连接（OUTERJOIN）。  
- 内连接表示查询结果只返回符合连接条件的记录，这种连接方式比较常用；
   在MySQL里面，关键字JOIN、INNER JOIN、CROSS JOIN的含义是一样的，都表示内连接。  
- 外连接则不同，表示查询结果返回某一个表中的所有记录，以及另一个表中满足连接条件的记录.  
    外连接包括两类： 
    1. 左连接，一般简写成LEFT JOIN，返回左边表中的所有记录，以及右表中符合连接条件的记
录   
    2. 右连接，一般简写成RIGHT JOIN，返回右边表中的所有记录，以及左表中符合连接条件的记录。

在MySQL中，外键约束不是关联查询的必要条件，但有了它，MySQL系统才会保护你的数据，避免出现误删的情况，从而提高系统整体的可靠性。
为什么在MySQL里，没有外键约束也可以进行关联查询呢？
原因是外键约束是有成本的，需要消耗系统资源。对于大并发的SQL操作，有可能会不适合。比如大型网站的中央数据库，可能会因为外键约束的系统开销而变得非常慢。所以，MySQL允许不使用系统自带的外键约束，在应用层面完成检查数据一致性的逻辑。也就是说，即使你不用外键约束，也要想办法通过应用层面的附加逻辑，来实现外键约束的功能，确保数据的一致性。