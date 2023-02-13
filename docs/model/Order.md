---
title: 订单模型
author: T8840
date: '2023-01-15'
---

## 订单实体



## 订单表设计

### 订单主表
```sql
CREATE TABLE `order_master` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_sn` bigint unsigned NOT NULL COMMENT '订单编号 yyyymmddnnnnnnnn',
  `customer_id` int unsigned NOT NULL COMMENT '下单人ID',
  `shipping_user` varchar(10) NOT NULL COMMENT '收货人姓名',
  `province` smallint NOT NULL COMMENT '收货人所在省',
  `city` smallint NOT NULL COMMENT '收货人所在市',
  `district` smallint NOT NULL COMMENT '收货人所在区',
  `address` varchar(100) NOT NULL COMMENT '收货人详细地址',
  `payment_method` tinyint NOT NULL COMMENT '支付方式:1现金,2余额,3网银,4支付宝,5微信',
  `order_money` decimal(8,2) NOT NULL COMMENT '订单金额',
  `district_money` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `shipping_money` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '运费金额',
  `payment_money` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `shipping_comp_name` varchar(10) DEFAULT NULL COMMENT '快递公司名称',
  `shipping_sn` varchar(50) DEFAULT NULL COMMENT '快递单号',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `shipping_time` datetime DEFAULT NULL COMMENT '发货时间',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `receive_time` datetime DEFAULT NULL COMMENT '收货时间',
  `order_status` tinyint NOT NULL DEFAULT '0' COMMENT '订单状态',
  `order_point` int unsigned NOT NULL DEFAULT '0' COMMENT '订单积分',
  `invoice_title` varchar(100) DEFAULT NULL COMMENT '发票抬头',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `ux_ordersn` (`order_sn`)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='订单主表';
```


### 订单详情表
```sql
CREATE TABLE `order_detail` (
  `order_detail_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键ID,订单详情表ID',
  `order_id` int unsigned NOT NULL COMMENT '订单表ID',
  `product_id` int unsigned NOT NULL COMMENT '订单商品ID',
  `product_name` varchar(50) NOT NULL COMMENT '商品名称',
  `product_cnt` int NOT NULL DEFAULT '1' COMMENT '购买商品数量',
  `product_price` decimal(8,2) NOT NULL COMMENT '购买商品单价',
  `average_cost` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '平均成本价格',
  `weight` float DEFAULT NULL COMMENT '商品重量',
  `fee_money` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '优惠分摊金额',
  `w_id` int unsigned NOT NULL COMMENT '仓库ID',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`order_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1  COMMENT='订单详情表';
```


### 购物车表
```sql
CREATE TABLE `order_cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `customer_id` int unsigned NOT NULL COMMENT '用户ID',
  `product_id` int unsigned NOT NULL COMMENT '商品ID',
  `product_amount` int NOT NULL COMMENT '加入购物车商品数量',
  `price` decimal(8,2) NOT NULL COMMENT '商品价格',
  `add_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入购物车时间',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB  COMMENT='购物车表';
```

### 商品库存表
```sql
CREATE TABLE `warehouse_proudct` (
  `wp_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '商品库存ID',
  `product_id` int unsigned NOT NULL COMMENT '商品id',
  `w_id` smallint unsigned NOT NULL COMMENT '仓库ID',
  `currnet_cnt` int unsigned NOT NULL DEFAULT '0' COMMENT '当前商品数量',
  `lock_cnt` int unsigned NOT NULL DEFAULT '0' COMMENT '当前占用数据',
  `in_transit_cnt` int unsigned NOT NULL DEFAULT '0' COMMENT '在途数据',
  `average_cost` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '移动加权成本',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`wp_id`)
) ENGINE=InnoDB  COMMENT='商品库存表';
```

### 用户地址表
```sql
CREATE TABLE `order_customer_addr` (
  `customer_addr_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `customer_id` int unsigned NOT NULL COMMENT 'customer_login表的自增ID',
  `zip` int NOT NULL COMMENT '邮编',
  `province` int NOT NULL COMMENT '地区表中省份的id',
  `city` int NOT NULL COMMENT '地区表中城市的id',
  `district` int NOT NULL COMMENT '地区表中的区id',
  `address` varchar(200) NOT NULL COMMENT '具体的地址门牌号',
  `is_default` tinyint NOT NULL COMMENT '是否默认',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`customer_addr_id`)
) ENGINE=InnoDB COMMENT='用户地址表';
```


### 物流公司信息表
```sql
CREATE TABLE `shipping_info` (
  `ship_id` tinyint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `ship_name` varchar(20) NOT NULL COMMENT '物流公司名称',
  `ship_contact` varchar(20) NOT NULL COMMENT '物流公司联系人',
  `telphone` varchar(20) NOT NULL COMMENT '物流公司联系电话',
  `price` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '配送价格',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`ship_id`)
) ENGINE=InnoDB COMMENT='物流公司信息表';
```

### 地区信息表
```sql
CREATE TABLE `region_info` (
  `region_id` smallint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `parent_id` smallint NOT NULL DEFAULT '0' COMMENT '上级地区id',
  `region_name` varchar(150) NOT NULL COMMENT '城市名称',
  `region_level` tinyint(1) NOT NULL COMMENT '级别',
  PRIMARY KEY (`region_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1  COMMENT='地区信息表';
```

### 仓库信息表
```sql
CREATE TABLE `warehouse_info` (
  `w_id` smallint unsigned NOT NULL AUTO_INCREMENT COMMENT '仓库ID',
  `warehouse_sn` char(5) NOT NULL COMMENT '仓库编码',
  `warehouse_name` varchar(10) NOT NULL COMMENT '仓库名称',
  `warehouse_phone` varchar(20) NOT NULL COMMENT '仓库电话',
  `contact` varchar(10) NOT NULL COMMENT '仓库联系人',
  `province` smallint NOT NULL COMMENT '省',
  `city` smallint NOT NULL COMMENT '市',
  `district` smallint NOT NULL COMMENT '区',
  `address` varchar(100) NOT NULL COMMENT '仓库地址',
  `warehouse_status` tinyint NOT NULL DEFAULT '1' COMMENT '仓库状态:0禁用,1启用',
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  PRIMARY KEY (`w_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COMMENT='仓库信息表';
```

