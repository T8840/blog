---
title: Solidity语言初步认识
author: T8840
date: '2023-02-15'
---
![B站视频教程](https://www.bilibili.com/video/BV1HR4y197Ag?p=1)  
![Github](https://github.com/anbang/professional-solidity/blob/v0.0.1/docs/source/01.hello.md)

## Solidity初识
本节最有价值部分"WETH DEMO";

### 区块链基础
- 事务
- Gas
- 交易
    - From - To 消息(二进制数据/以太币)
- 地址
    - 外部地址：助记词/keystore...
    - 合约地址：solidity代码
    - 对应EVM是一样的
        - key：value
- 区块
    - 区块可能会被回滚，交易可能被作废
- 存储/内存/栈
    - 存储：256位： uint256/int256/bytes32
    - 内存：函数执行时候出现，完毕之后被销毁
    - 栈：1024个元素，每个元素256bit.
### Hello World
- demo代码
```solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Hello {
    // 3445 - gas
    string public message = "hello world"; // 状态变量

    // 3409
    function fn1() public view returns (string memory) {
        return message;
    }

    // 737
    function fn2() public pure returns(string memory) {
        return "hello world";
    }
    // 816
    function fn3() public pure returns (string memory) {
        return fn2();
    }
}
```
- remix IDE
    - 编译
    - 部署
    - 运行

### 注释
- 单行 //
- 块 /*...*/
- 描述注释
    - 演示
    - 文档
    - 继承说明
        - 重载
  ```solidity
  /// @title 合约标题
  /// @author Neal
  /// @notice 
  /// @dev  功能
  /// @custom  XXX
  ```

### 合约结构介绍
1. SPDX版权声明
    - https://spdx.org/licenses
2. 版本规则
    - pragma solidity >=0.8.2 <0.9.0; 等价于'^0.8.17'
3. contract关键字
    - 变量
    - 函数
    - this关键字
    - 合约地址/合约创建者地址/合约调用者地址
    ```solidity
    
    // this 本身代表当前的合约
    function fn4() public view returns(address) {
        return address(this); // 当前合约地址 0xf8e81D47203A594245E36C48e151709F0C19fBe8
    }

    function fn5() external view returns(address) {
        return address(this); // 当前的合约地址
    }

     function fn6() external view returns(address) {
        return this.fn5(); // external方法的调用
    }

    // 合约地址//合约调用者地址/合约创建者地址
    address public owner1;
    address public owner2;
    address public owner3;

    constructor() {
        owner1 = address(this); //合约地址
        owner2 = msg.sender;

    }
    // 谁调用, msg.sender就是谁
    function fn7() public view returns(address) {
        return msg.sender;
    }

    ```
    - 合约属性：type关键字
        - 用于调用另一个合约
            ```solidity
            
            
            contract Demo{
                function name() public pure returns(string memory) {
                    return type(Hello).name;
                }

                function creationCode() public pure returns(bytes memory) {
                    return type(Hello).creationCode;
                }

                function runtimeCode() public pure returns(bytes memory) {
                    return type(Hello).runtimeCode;
                }
            }
            ```

4. import 导入声明
```solidity
import "./hello.sol"  as Test;// 本地导入
// 遇到冲突的时候按需导入；
import xx as x from "./hello.sol";
import "https://github.com/xxx" // 导入网络文件
// 安装导入
// npm install @xxx
// import "@xxx"
```
5. interface：接口
```solidity

contract Cat {
    uint256 public age;

    function eat() public returns (string memory) {
        age++;
        return "cat eat fish";
    }

    function sleep1() public pure returns (string memory) {
        return "sleep1";
    }
}

contract Dog {
    uint256 public age;

    function eat() public returns (string memory) {
        age += 2;
        return "dog miss you";
    }

    function sleep2() public pure returns (string memory) {
        return "sleep2";
    }
}

interface AnimalEat {
    function eat() external returns (string memory);
}

contract Animal {
    function test(address _addr) external returns (string memory) {
        AnimalEat general = AnimalEat(_addr);
        return general.eat();
    }

    // 返回接口I 的 bytes4 类型的接口 ID
    function interfaceId() external pure returns (bytes4) {
        return type(AnimalEat).interfaceId;
    }
}

```
6. library：库合约
- 库与合约类似，但它的目的是在一个指定的地址，且仅部署一次，然后通过 EVM 的特性来复用代码。
```solidity
library Set{
    struct Data { mapping(uint => bool) flags ;}
    function test() external pure returns(uint256) {
        return 111;
    }
}

contract UseSet {
    function test() external pure returns (uint256) {
        return Set.test();
    }
}
```

### 全局的以太币单位

1. `wei` `gwei` `ether`
    - 最小单位 wei
    - 1 ETH =10 **9 gwei = 10**18 wei
```solidity
contract DanWei {
    // 返回true
    function test() public pure returns (bool a, bool b, bool c) {
        a = 1 wei == 1;
        b = 1 gwei == 1e9;
        c = 1 ether == 1e18;
    }

}
```
2. 变量使用以太币单位
```solidity
contract DanWei2 {
    uint256 public amount;

    constructor() {
        amount = 1;
    }

    function fnEth() public view returns (uint256) {
        return amount + 1 ether;
    }

     function fnGwei() public view returns (uint256) {
        return amount + 1 gwei;
    }

     function fnVar(uint256 amountEth) public view returns (uint256) {
        return amount + amountEth *1 ether;
    }
}
```

### 接收以太币
三个接收ETH相关的关键字： payable fallback(*需要花时间理解)  receive

- payable
    - function
    - address

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Payable {
    // payable标记函数
    function deposit1() external payable {}

    function deposit2() external {}

    // payable标记地址
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    // 通过balance属性来查看余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

}

```
- fallback
    - 语法：
        - `fallback() external [payable]`
        ```solidity
        contract Payable2 {
            event Log(string funName, address from, uint256 value, bytes data);

            function deposit() external payable {}

            // 通过balance属性来查看余额
            function getBalance() external view returns (uint256) {
                return address(this).balance;
            }

            fallback() external payable {
                emit Log("fallback", msg.sender,msg.value, msg.data);
            }

        }

        ```
        - `fallback(bytes calldata input) external [payable] returns (bytes memory output)`
        ```solidity
        contract Payable3 {
            bytes public inputData1;
            bytes public inputData2;

            fallback(bytes calldata input ) external returns (bytes memory output) {
                inputData1 = input;
                inputData2 = msg.data; // input 等于msg.data
                return input;
            }

        }
        ```
        - msg.data可以通过abi.decode解码
        ```solidity
        contract StoneCat {
            uint256 public age = 0;
            bytes public inputData1;
            bytes public inputData2;
            uint256 public c;
            uint256 public d;

            event eventFallback(string);

            fallback (bytes calldata input) external  returns (bytes memory output){
                age++;
                inputData1 = input;
                inputData2 = msg.data;
                (c, d) = abi.decode(msg.data[4:], (uint256, uint256));
                emit eventFallback("fallbak");
                return input;
            }
        }

        interface AnimalEat {
            function eat() external returns (string memory);
        }

        contract Animal {
            function test2(address _addr) external returns (bool success) {
                AnimalEat general = AnimalEat(_addr);
                (success, ) = address(general).call(abi.encodeWithSignature("eat()",123,456));
                require(success);
            }
        }
        ```
    - 回调函数在两种情况下被调用
        - 向合约转账
        - 执行合约不存在的方法
    - 带参数的fallback

- receive
    - 语法：`receive() external payable {}`
    - payable是必须的
    - 没有function关键字
        ```solidity
        contract Payable4 {
            event Log(string funName, address from, uint256 value, bytes data);

            // 通过balance属性来查看余额
            function getBalance() external view returns (uint256) {
                return address(this).balance;
            }

            receive() external payable {
                emit Log("receive", msg.sender,msg.value, "");
            }

        }
        ```
- receive和fallback共存的调用关系
/**

    调用时发送了ETH
            |
判断 msg.data 是否为空
          /     \
        是       否
是否存在 receive   fallbak()
      /   \
    存在   不存在
    /        \
receive()   fallbak()

 */
```solidity
// 这个合约会保留所有发送给它的以太币，没有办法返还。
contract Payable5 {
    uint256 public x;
    uint256 public y;

    event Log(string funName, address from, uint256 value, bytes data);

    // 纯转账调用这个函数，例如对每个空empty calldata的调用
    receive() external payable {
        x = 1;
        y = msg.value;
        emit Log("receive", msg.sender, msg.value, "");
    }

    // 除了纯转账外，所有的调用都会调用这个函数．
    // (因为除了 receive 函数外，没有其他的函数).
    // 任何对合约非空calldata 调用会执行回退函数(即使是调用函数附加以太).
    fallback() external payable {
        x = 2;
        y = msg.value;
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
```

### selfdestruct:合约自毁
- 功能
    - 1. 销毁合约
    - 2. 把合约的所有资金强制发送到目标地址
    ```solidity
    contract Kill {
        uint256 public aaa = 123;
        constructor() payable {}

        function kill() external {
            selfdestruct(payable(msg.sender));
        }

        function bbb() external pure returns(uint256) {
            return 1;
        }

        fallback() external {}
        receive() external payable {}

    }

    contract Helper {
        // 没有`fallback`和`receive`,正常没办法接收ETH主币
        function getBalance() external view returns (uint256) {
            return address(this).balance;
        }

        // kill后，此时Helper余额就会强制接收到ETH主币
        function kill(Kill _kill) external {
            _kill.kill();
        }

    }


    ```
- 除非必要，不建议销毁合约
- 使用selfdestruct与从硬盘上删除数据是不同的
- 即便一个合约的代码中没有显式地调用selfdestruct,它仍然有可能通过delegatecall或callcode执行自毁操作。

## Demo1：同志们好
- 需求
同志们好的场景：
领导说“同志们好”，回复“领导好”
领导说“同志们辛苦了”，回复“为人民服务”

- 代码

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

/// @title 一个模拟同志们好的简单演示
/// @author Anbang
/// @notice 您只能将此合约用于最基本的模拟演示
/// @dev 本章主要内容的实战练习
/// @custom:experimental 这是实验的合约。
contract HelloComrades {
    /*
     * ========================================
     * State Variables
     * ========================================
     */

    /// @notice 用于标记当前进度
    /// @dev 0:等待领导说"同志们好"，
    /// @dev 1:等待同志们说"领导好"，
    /// @dev 2:等待领导说"同志们辛苦了"
    /// @dev 3:等待同志们说"为人民服务"
    /// @dev 4:等待销毁。
    /// @return 当前进度
    uint8 public step = 0;

    /// @notice 用于标记领导地址
    /// @dev 不可变量，需要在构造函数内指定，以后就不能修改了
    /// @return 当前领导的地址
    address public immutable leader;

    /// @notice 用于遇到错误时的无脑复读机式回复
    string internal constant UNKNOWN =
        unicode"我不知道如何处理它,你找相关部门吧!";

    /*
     * ========================================
     * Events
     * ========================================
     */

    /// @notice 用于对当前 step 被修改时的信息通知
    /// @dev 只要发生 step 修改，都需要抛出此事件
    /// @param 当前修改的最新 step
    event Step(uint8);

    /// @notice 用于对当前合约的金额变动通知
    /// @dev 只要发生金额修改，都需要抛出此事件
    /// @param tag: 标记内容
    /// @param from: 当前地址
    /// @param value: 当前发送金额
    /// @param data: 当前调用的data内容
    event Log(string tag, address from, uint256 value, bytes data);

    /*
     * ========================================
     * Modifier
     * ========================================
     */

    /// @notice 检查只能领导调用
    /// @dev 用于领导专用函数
    modifier onlyLeader() {
        require(msg.sender == leader, unicode"必须领导才能说");
        _;
    }

    /// @notice 检查只能非领导调用
    /// @dev 用于非领导地址检测
    modifier notLeader() {
        require(
            msg.sender != leader,
            unicode"不需要领导回答，需要同志们来回答"
        );
        _;
    }

    /*
     * ========================================
     * Errors
     * ========================================
     */

    /// @notice 自定义的错误，这种注释内容会在错误时显示出来
    /// @dev 用于所有未知错误
    /// This is a message des info.需要上方空一行，才可以显示出来
    error MyError(string msg);

    /*
     * ========================================
     * Constructor
     * ========================================
     */

    /// @dev 用于领导地址的指定，后续不可修改
    constructor(address _leader) {
        require(_leader != address(0), "invalid address");
        leader = _leader;
    }

    /*
     * ========================================
     * Functions
     * ========================================
     */

    /// @notice 用于领导说"同志们好"
    /// @dev 只能在 step 为 0 时调用，只能领导调用，并且只能说"同志们好"
    /// @param content: 当前领导说的内容
    /// @return 当前调用的状态，true 代表成功
    function hello(string calldata content) external onlyLeader returns (bool) {
        if (step != 0) {
            revert(UNKNOWN);
        }
        if (!review(content, unicode"同志们好")) {
            revert MyError(unicode"必须说:同志们好");
        }
        step = 1;
        emit Step(step);
        return true;
    }

    /// @notice 用于同志们说"领导好"
    /// @dev 只能在 step 为 1 时调用，只能非领导调用，并且只能说"领导好"
    /// @param content: 当前同志们说的内容
    /// @return 当前调用的状态，true 代表成功
    function helloRes(string calldata content)
        external
        notLeader
        returns (bool)
    {
        if (step != 1) {
            revert(UNKNOWN);
        }
        if (!review(content, unicode"领导好")) {
            revert MyError(unicode"必须说:领导好");
        }
        step = 2;
        emit Step(step);
        return true;
    }

    /// @notice 用于领导说"同志们辛苦了"
    /// @dev 只能在 step 为 2 时调用，只能领导调用，并且只能说"同志们辛苦了",还需给钱
    /// @param content: 当前领导说的内容
    /// @return 当前调用的状态，true 代表成功
    function comfort(string calldata content)
        external
        payable
        onlyLeader
        returns (bool)
    {
        if (step != 2) {
            revert(UNKNOWN);
        }
        if (!review(content, unicode"同志们辛苦了")) {
            revert MyError(unicode"必须说:同志们辛苦了");
        }
        if (msg.value < 2 ether) {
            revert MyError(unicode"给钱！！！最少2个以太币");
        }
        step = 3;
        emit Step(step);
        emit Log("comfort", msg.sender, msg.value, msg.data);
        return true;
    }

    /// @notice 用于同志们说"为人民服务"
    /// @dev 只能在 step 为 3 时调用，只能非领导调用，并且只能说"为人民服务"
    /// @param content: 当前同志们说的内容
    /// @return 当前调用的状态，true 代表成功
    function comfortRes(string calldata content)
        external
        notLeader
        returns (bool)
    {
        if (step != 3) {
            revert(UNKNOWN);
        }
        if (!review(content, unicode"为人民服务")) {
            revert MyError(unicode"必须说:为人民服务");
        }
        step = 4;
        emit Step(step);
        return true;
    }

    /// @notice 用于领导对
    /// @dev 只能在 step 为 4 时调用，只能领导调用
    /// @return 当前调用的状态，true 代表成功
    function destruct() external onlyLeader returns (bool) {
        if (step != 4) {
            revert(UNKNOWN);
        }
        emit Log("selfdestruct", msg.sender, address(this).balance, "");
        selfdestruct(payable(msg.sender));
        return true;
    }

    /*
     * ========================================
     * Helper
     * ========================================
     */

    /// @notice 用于检查调用者说的话
    /// @dev 重复检测内容的代码抽出
    /// @param content: 当前内容
    /// @param correctContent: 正确内容
    /// @return 当前调用的状态，true 代表内容相同，通过检测
     function review(string calldata content, string memory correctContent)
     private
     pure
     returns(bool){
         return keccak256(abi.encodePacked(content)) == keccak256(abi.encodePacked(correctContent));
     }

    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }

    fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    /// @notice 用于获取当前合约内的余额
    /// @dev 一个获取当前合约金额的辅助函数
    /// @return 当前合约的余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

```
- 使用指导
``` sh
部署合约
需要输入 Leader 地址【选择一个测试钱包地址】作为参数
点击 【leader】 查看信息
点击 【destruct】 进行销毁
此时报错，因为步骤不对
【hello】
输入错的内容
输入同志们好
查看 step 值
【helloRes】
输入错的内容，此时提示，账号不对。
切换账号后输入错的内容，提示必须说:领导好
输入领导好
查看 step 值
【comfort】
输入错的内容，此时提示账号权限不对
切换账号后，输入错的内容，提示必须说:同志们辛苦了
点击【hello】，此时说提示我不知道如何处理它,你找相关部门吧!，因为 step 不对。
输入同志们辛苦了，此时提示必须给钱；（只有给了 2 个以上的以太币，才能说同志们辛苦了。）
我们给 2 个 wei，假装是 2 个 ETH，看能否通过。（结果还是不能通过）
给 2 个以太，并输入同志们辛苦了。此时可以通过了
点击【getBalance】查看合约的余额
查看 step 值
【comfortRes】
点击【helloRes】，此时说提示我不知道如何处理它,你找相关部门吧!，因为 step 不对。
切换账号后，输入错的内容，提示必须说:为人民服务
输入为人民服务
【calldata】调用
输入 1wei ，无参数直接调用；查看交易详情内的 logs，此时是 receive，余额变化多 1wei
输入 2wei，参数使用0x00调用，查看交易详情内的 logs，此时是 fallback，余额变化多 2wei
【destruct】调用，注意查看余额变化。
注意查看当前 leader 地址的余额
先使用非 leader 地址触发【destruct】，提示错误
然后是 leader 地址触发。查看交易详情种的 logs
查看 leader 地址/ balance/step，都已经是默认值
触发所有函数，此时函数都可以使用，但是都是默认值。
```


## Demo2: 存钱罐合约
- 需求
零存整取：  
所有人都可以存钱（ETH）
只有合约 owner 才可以取钱
只要取钱，合约就销毁掉 selfdestruct 
- 需求扩展：支持主币以外的资产
    - ERC20
    - ERC721

- 代码
下面是只适合一个人的存钱罐
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Bank {
    // 状态变量
    address public immutable owner;

    // 事件
    event Deposit(address _ads, uint256 amount);
    event Withdraw(uint256 amount);

    // receive
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // 构造函数
    constructor() payable {
        owner = msg.sender;
    }

    // 方法
    function withdraw() external {
        require(msg.sender == owner, "Not Owner");
        emit Withdraw(address(this).balance);
        selfdestruct(payable(msg.sender));
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}


```

## Demo3: WETH合约
WETH 是包装 ETH 主币，作为 ERC20 的合约。
标准的 ERC20 合约包括如下几个：
1. 3 个查询
- balanceOf: 查询指定地址的 Token 数量
- allowance: 查询指定地址对另外一个地址的剩余授权额度
- totalSupply: 查询当前合约的 Token 总量
2. 2 个交易
- transfer: 从当前调用者地址发送指定数量的 Token 到指定地址。  
    - 这是一个写入方法，所以还会抛出一个 Transfer 事件。
- transferFrom: 当向另外一个合约地址存款时，对方合约必须调用 transferFrom 才可以把 Token 拿到它自己的合约中。
3. 2 个事件
- Transfer
- Approval
4. 1 个授权
approve: 授权指定地址可以操作调用者的最大 Token 数量。
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WETH {
    string public name = "Wrapped Ether";
    string public symbol = "WETH";
    uint8 public decimals = 18;

    event Approval(address indexed src, address indexed delegateAds, uint256 amount);
    event Transfer(address indexed src, address indexed toAds, uint256 amount);
    event Deposit(address indexed toAds, uint256 amount);
    event Withdraw(address indexed src, uint256 amount);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;


    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }

    function approve(address delegateAds, uint256 amount) public returns (bool) {
        allowance[msg.sender][delegateAds] = amount;
        emit Approval(msg.sender, delegateAds, amount);
        return true;
    }

    function transfer(address toAds, uint256 amount) public returns (bool) {
        return transferFrom(msg.sender, toAds, amount);
    }

    function transferFrom(
        address src,
        address toAds,
        uint256 amount
    ) public returns (bool) {
        require(balanceOf[src] >= amount);

        if (src != msg.sender) {
            require(allowance[src][msg.sender] >= amount);
            allowance[src][msg.sender] -= amount;
        }

        balanceOf[src] -= amount;
        balanceOf[toAds] += amount;

        emit Transfer(src, toAds, amount);

        return true;
    }

    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }

}


```
## 问答题

1. 因为区块可以被撤回，编码时候有些需要注意的？  
会出现你发起的交易被回滚甚至从区块链中抹除掉的可能。区块链不能保证当前的交易一定包含在下一个区块中。如果你开发的合约有顺序关系，要注意这个特性。合约内的逻辑，不能将某一个块作为依赖。
2. 聊一聊存储，内存，栈的内容  
- 存储：每一个地址都有一个持久化的内存，存储是将 256 位字映射到 256 位字的键值存储区。所以数据类型的最大值是 uint256/int256/bytes32，合约只能读写存储区内属于自己的部分。  
- 内存：合约会试图为每一次消息调用获取一块被重新擦拭干净的内存实例。所以储存在内存中的数据，在函数执行完以后就会被销毁。内存是线性的，可按字节级寻址，但读的长度被限制为 256 位，而写的长度可以是 8 位或 256 位。  
- 栈：合约的所有计算都在一个被称为栈（stack）的区域执行，栈最大有 1024 个元素，每一个元素长度是 256 bit；所以调用深度被限制为 1024 ，对复杂的操作，推荐使用循环而不是递归。
3. interface 如何使用
4. string message = "Hello World!"; 这种没有明确标注可视范围的情况下，message 的可视范围是什么? 是 internal 还是 private?  
答：private
5. 变量如何使用以太币单位？  
如果想用以太币单位来计算输入参数，你可以使用乘法来转换: amountEth * 1 ether
6. receive 和 fallback 共存的调用？  
只有 msg.data 为空，并且存在 receive 的时候，才会运行 receive。
7. receive 和 fallback 区别？  
receive 只负责接收主币
调用没有的方法时候执行,因为可以设置 payable，可以接收网络主币。尽管 fallback 可以是 payable 的，但并不建议这么做，声明为 payable 之后，其所消耗的 gas 最大量就会被限定在 2300。
8. 合约没有 receive 和 fallback 可以接受以太币么？  
可以接受，可以方法标记 payable 进行转账
9. 聊一聊合约自毁 selfdestruct。  
合约代码从区块链上移除的唯一方式是合约在合约地址上的执行自毁操作selfdestruct 。selfdestruct 作用是 销毁合约，并把余额发送到指定地址类型Address。
销毁合约:它使合约变为无效，删除该地址地字节码。
它把合约的所有资金强制发送到目标地址。
如果接受的地址是合约，即使里面没有 fallback 和 receive 也会发送过去
除非必要，不建议销毁合约。
如果有人发送以太币到移除的合约，这些以太币可能将永远丢失。
如果要禁用合约，可以通过修改某个内部状态让所有函数无法执行，这样也可以达到目的。
即便一个合约的代码中没有显式地调用 selfdestruct，它仍然有可能通过 delegatecall 或 callcode 执行自毁操作。
即使一个合约被 selfdestruct 删除，它仍然是区块链历史的一部分，区块链的链条中不可能无缘无故消失一个块，这样他们就没办法做校验了。 因此，使用 selfdestruct 与从硬盘上删除数据是不同的。
10. 合约进行selfdestruct后，还可以调用状态变量和函数么？  
可以调用，但是返回默认值。如果想调用，也可以在存档节点里指定未删除的高度进行调用。  