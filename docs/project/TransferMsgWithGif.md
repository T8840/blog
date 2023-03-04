---
title: 转账信息显示动图
author: T8840
date: '2023-02-15'
---

视频：
## 智能合约与Goerli测试网络
- 智能合约 /contracts/Transactions.sol
```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
  
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
```

- 获取Goerli测试网络中ETH
方式1. 连接获得：https://faucet.quicknode.com/ethereum/goerli
方式2. 网页挂机挖矿获得：https://goerli-faucet.pk910.de/
获得后可去查询Etherscan： https://goerli.etherscan.io/
- 部署合约到Goerli测试网络
Alchemy - https://alchemy.com
1. 在Alchemy上创建App，获取API
2. 获取小狐狸私钥
3. 配置在hardhat.config.js中
```javascript
module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/HhfUvZcf0a63Gtt9Nt9hFc7fkJMNlLTm',
      accounts: ['2f99db8cdb04655028eee1dc98230925202f6b3e010e43fad2883b4bea90a1a3'],
    },
  },
};
```
4. 部署脚本 /scripts/deploy.js
```javascript
const main = async () => {
  const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.deployed();

  console.log("Transactions address: ", transactionsContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

5. 执行命令部署
```sh
npx hardhat run scripts/deploy.js --network goerli
```
执行完成后会获得一个发布到链上的合约地址Transactions address:  0x280d697ba045b40b1b61e81a9f6CC54aECdA6237
## ABI
部署完成后，在artifacts/contracts/存在对应的abi文件
如：Transactions.sol/Transactions.json
可供前端使用，

## 连接钱包与调用钱包
这里涉及"ether.js"的相关知识

