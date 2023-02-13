---
title: 触发器
author: T8840
date: '2023-01-15'
---


在实际开发中，我们经常会遇到这样的情况：有2个或者多个相互关联的表，如商品信息和库存信息分别存放在2个不同的数据表中，我们在添加一条新商品记录的时候，为了保证数据的完整性，必须同时在库存表中添加一条库存记录。
这样一来，我们就必须把这两个关联的操作步骤写到程序里面，而且要用事务包裹起来，确保这两个操作成为一个原子操作，要么全部执行，要么全部不执行。要是遇到特殊情况，可能还需要对数据进行手动维护，这样就很容易忘记其中的一步，导致数据缺失。
这个时候，其实咱们可以使用触发器。你可以创建一个触发器，让商品信息数据的插入操作
自动触发库存数据的插入操作。这样一来，就不用担心因为忘记添加库存数据而导致的数据
缺失了。

## 触发器操作

### 创建触发器
创建触发器的语法结构是：

```sql
CREATE TRIGGER 触发器名称 {BEFORE|AFTER} {INSERT|UPDATE|DELETE}
ON 表名 FOR EACH ROW 表达式；
```
在创建时，你一定要注意触发器的三个要素:
- 表名：表示触发器监控的对象。
- INSERT|UPDATE|DELETE：表示触发的事件。INSERT表示插入记录时触发；UPDATE表示更新记录时触发；DELETE表示删除记录时触发。
- BEFORE|AFTER：表示触发的时间。BEFORE表示在事件之前触发；AFTER表示在事件之后
触发。

### 查看触发器
SHOW TRIGGERS\G;

### 删除触发器
```sql
DROP TRIGGER 触发器名称;
```
## 触发器的优缺点

### 优点
1. 触发器可以确保数据的完整性
2. 触发器可以帮助我们记录操作日志
3. 触发器还可以用在操作数据前，对数据进行合法性检查

### 缺点
- 触发器最大的一个问题就是可读性差。
因为触发器存储在数据库中，并且由事件驱动，这就意味着触发器有可能不受应用层的控
制。这对系统维护是非常有挑战的。
- 另外，相关数据的变更，特别是数据表结构的变更，都可能会导致触发器出错，进而影响数
据操作的正常运行。这些都会由于触发器本身的隐蔽性，影响到应用中错误原因排查的效
率
## 触发器示例

会员编号是2的会员李四，到超市的某家连锁店购买了一条烟，消费了150元。
这个过程用SQL表示：
1. 第一步，查询出编号是2的会员卡的储值金额是多少
```sql
mysql> SELECT memberdeposit
-> FROM demo.membermaster
-> WHERE memberid = 2;
+---------------+
| memberdeposit |
+---------------+
| 200.00 |
+---------------+
1 row in set (0.00 sec)
```
2. 把会员编号是2的会员的储值金额减去150
```sql
mysql> UPDATE demo.membermaster
-> SET memberdeposit = memberdeposit - 150
-> WHERE memberid = 2;
```

3. 读出会员编号是2的会员当前的储值金额
```sql
mysql> SELECT memberdeposit
-> FROM demo.membermaster
-> WHERE memberid = 2;
+---------------+
| memberdeposit |
+---------------+
| 50.00 |
+---------------+
1 row in set (0.00 sec)
```

4. 把会员编号和前面查询中获得的储值起始金额、储值余额和储值金额变化值，写入会员储值历史表。
```sql
mysql> INSERT INTO demo.deposithist
-> (
-> memberid,
-> transdate,
-> oldvalue,
-> newvalue,
-> changedvalue
-> )
-> SELECT 2,NOW(),200,50,-150;
Query OK, 1 row affected (0.02 sec)
Records: 1 Duplicates: 0 Warnings: 0
```

### 用触发器的代码
```sql
DELIMITER //
CREATE TRIGGER demo.upd_membermaster BEFORE UPDATE -- 在更新前触发
ON demo.membermaster
FOR EACH ROW -- 表示每更新一条记录，触发一次
BEGIN -- 开始程序体
IF (new.memberdeposit <> old.memberdeposit) -- 如果储值金额有变化
THEN
INSERT INTO demo.deposithist
(
memberid,
transdate,
oldvalue,
newvalue,
changedvalue
)
SELECT
NEW.memberid,
NOW(),
OLD.memberdeposit, -- 更新前的储值金额
NEW.memberdeposit, -- 更新后的储值金额
NEW.memberdeposit-OLD.memberdeposit; -- 储值金额变化值
END IF;
END
//
DELIMITER ;

```