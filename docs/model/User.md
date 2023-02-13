---
title: 用户模型
author: T8840
date: '2023-01-15'
---

## 用户模型
用户模型是网站最基础的数据模型.

### 用户实体

## 用户表设计
如果只用一张表来存储用户的属性，那么会造成如下问题：
1. 数据插入异常
2. 数据更新异常
要修改某一行的值时不得不遍历整体数据；
3. 数据删除异常  
删除某一数据时不得不同时删除另一数据；  
4. 数据存在冗余，数据表过宽会影响修改表结构的效率

解决方式：使用数据库设计范式设计，至少要满足第三范式的要求。  
第三范式（3NF）定义：一个表中的列和其他列之间既不包含部分函数依赖关系，也不包含传递函数依赖关系，那么这个表的设计就符合第三范式。   

尽量做到冷热数据分离，减小表的宽度。

### 用户登录表
```sql
CREATE TABLE `customer_login` (
  `customer_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `login_name` varchar(20) NOT NULL COMMENT '用户登陆名',
  `password` char(32) NOT NULL COMMENT 'md5加密的密码',
  `user_stats` tinyint NOT NULL DEFAULT '1' COMMENT '用户状态',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='用户登陆表';
```

### 用户信息表
```sql
CREATE TABLE `customer_inf` (
  `customer_inf_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `customer_id` int unsigned NOT NULL COMMENT 'customer_login表的自增ID',
  `customer_name` varchar(20) NOT NULL COMMENT '用户真实姓名',
  `identity_card_type` tinyint NOT NULL DEFAULT '1' COMMENT '证件类型：1 身份证,2军官证,3护照',
  `identity_card_no` varchar(20) DEFAULT NULL COMMENT '证件号码',
  `mobile_phone` int unsigned DEFAULT NULL COMMENT '手机号',
  `customer_email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `gender` char(1) DEFAULT NULL COMMENT '性别',
  `user_point` int NOT NULL DEFAULT '0' COMMENT '用户积分',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '注册时间',
  `birthday` datetime DEFAULT NULL COMMENT '会员生日',
  `customer_level` tinyint NOT NULL DEFAULT '1' COMMENT '会员级别:1普通会员,2青铜会员,3白银会员,4黄金会员,5钻石会员',
  `user_money` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '用户余额',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`customer_inf_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='用户信息表';
```


### 用户余额变动表
```sql
CREATE TABLE `customer_balance_log` (
  `balance_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '余额日志id',
  `customer_id` int unsigned NOT NULL COMMENT '用户ID',
  `source` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '记录来源:1订单,2退货单',
  `source_sn` int unsigned NOT NULL COMMENT '相关单据ID',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录生成时间',
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '变动金额',
  PRIMARY KEY (`balance_id`)
) ENGINE=InnoDB  COMMENT='用户余额变动表';
```

### 用户积分日志表
```sql
CREATE TABLE `customer_point_log` (
  `point_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '积分日志ID',
  `customer_id` int unsigned NOT NULL COMMENT '用户ID',
  `source` tinyint unsigned NOT NULL COMMENT '积分来源:0订单,1登录,2活动',
  `refer_number` int unsigned NOT NULL DEFAULT '0' COMMENT '积分来源相关编号',
  `change_point` smallint NOT NULL DEFAULT '0' COMMENT '变更积分数',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '积分日志生成时间',
  PRIMARY KEY (`point_id`)
) ENGINE=InnoDB  COMMENT='用户积分日志表';
```

### 用户登录日志表
```sql
CREATE TABLE `customer_login_log` (
  `login_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '登录日志ID',
  `customer_id` int unsigned NOT NULL COMMENT '登录用户ID',
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用户登录时间',
  `login_ip` int unsigned NOT NULL COMMENT '登录IP',
  `login_type` tinyint NOT NULL COMMENT '登录类型:0未成功 1成功',
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB COMMENT='用户登录日志表';
```


### 用户级别信息表
```sql
CREATE TABLE `customer_level_inf` (
  `customer_level` tinyint  NOT NULL AUTO_INCREMENT COMMENT '会员级别ID',
  `level_name` VARCHAR(10)	NOT NULL COMMENT '会员级别名称',
  `min_point` int UNSIGNED 	NOT NULL DEFAULT 0 COMMENT '该级别最低积分',
	`max_point` int UNSIGNED 	NOT NULL DEFAULT 0 COMMENT '该级别最高积分',
	`modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY pk_levelid (`customer_level`)
) ENGINE=InnoDB  COMMENT='用户级别信息表';
```

### 用户地址表
```sql
CREATE TABLE `customer_addr` (
  `customer_addr_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `customer_id` int unsigned NOT NULL COMMENT '用户ID',
  `zip` smallint  NOT NULL COMMENT '邮编',
  `province` smallint  NOT NULL  COMMENT '地区表中省份的id',
	`city` smallint  NOT NULL  COMMENT '地区表中城市的id',
	`district` smallint  NOT NULL  COMMENT '地区表中区的id',
	`address` VARCHAR(200)  NOT NULL  COMMENT '具体的地址门牌号',
	`is_default` tinyint  NOT NULL  COMMENT '是否默认',
	`modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY pk_customeraddid(`customer_addr_id`)
) ENGINE=InnoDB  COMMENT='用户积分日志表';
```

## 用户表优化

### 用户登录日志表的优化
业务场景：  
用户每次登录都会记录customer_login_log日志，用户登录日志保存一年，一年后可以删除

### 登录日志表进行分区优化

登录日志表使用RANGE分区，以login_time作为分区键  
分区后的用户登录日志表：

### 用户登录日志表
```sql
CREATE TABLE `customer_login_log` (
  `login_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '登录日志ID',
  `customer_id` int unsigned NOT NULL COMMENT '登录用户ID',
  `login_time` DATETIME NOT NULL ,
  `login_ip` int unsigned NOT NULL COMMENT '登录IP',
  `login_type` tinyint NOT NULL COMMENT '登录类型:0未成功 1成功',
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB 
PARTITION BY RANGE (YEAR(login_time))(
    PARTITION p0 VALUES LESS THAN (2020),
    PARTITION p1 VALUES LESS THAN (2021),
    PARTITION p2 VALUES LESS THAN (2022)
);
```