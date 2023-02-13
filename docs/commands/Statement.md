---
title: 语句
author: T8840
date: '2023-01-15'
---

## 条件处理语句
条件处理语句的语法结构：

```sql
DECLARE 处理方式 HANDLER FOR 问题 操作；
```


## 条件判断语句

### IF语句
```sql
IF 表达式1 THEN 操作1
[ELSEIF 表达式2 THEN 操作2]……
[ELSE 操作N]
END IF

```
这里“[]”中的内容是可选的。IF语句的特点是，不同的表达式对应不同的操作

### CASE语句
```sql
CASE 表达式
WHEN 值1 THEN 操作1
[WHEN 值2 THEN 操作2]……
[ELSE 操作N]
END CASE;
```
这里“[]”中的内容是可选的。CASE语句的特点是，表达式不同的值对应不同的操作。

## 流程控制语句

MySQL的流程控制语句也只能用于存储程序。主要有3类。
1. 跳转语句：ITERATE和LEAVE语句。
2. 循环语句：LOOP、WHILE和REPEAT语句。
3. 条件判断语句：IF语句和CASE语句。

### 跳转语句
1. ITERATE语句：只能用在循环语句内，表示重新开始循环。
2. LEAVE语句：可以用在循环语句内，或者以BEGIN和END包裹起来的程序体内，表示跳出
循环或者跳出程序体的操作。

### LOOP循环语句

```sql
标签：LOOP
操作
END LOOP 标签;

```
关于这个语句，需要注意的是，LOOP循环不能自己结束，需要用跳转语句ITERATE或者LEAVE来进行控制。

### WHILE语句
```sql
WHILE 条件 DO
操作
END WHILE;
```
WHILE循环通过判断条件是否为真来决定是否继续执行循环中的操作，你要注意一点，WHILE循环是先判断条件，再执行循环体中的操作。

### REPEAT语句
```sql
REPEAT
操作
UNTIL 条件 END REPEAT；
```

EPEAT
操作
UNTIL 条件 END REPEAT；


## 查询分析语句

查询分析语句的语法结构是：  
{ EXPLAIN | DESCRIBE | DESC }查询语句;  

## 