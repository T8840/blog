---
title: 测试用例管理与导入模块
author: T8840
date: '2023-01-15'
---

## 测试用例模板
测试用例应该有其标准形式，以提供一个标准的模板给测试开发者使用。  
大多数测试平台，会建议或定义一些默认的基本步骤，比如RFT（Rational Function Test)中的三步测试法：
1. Setup：用来进行测试过程的配置
2. Test：具体的测试过程
3. Cleanup：恢复测试的配置，使测试对象恢复初始状态。

## 该平台测试用例为python脚本
形式与pytest脚本形式类似

### 测试用例的基类设计
case/base.py
```python
"""
The Test Case Base File for the Test engine
"""

from abc import abstractmethod, ABCMeta
from enum import IntEnum

class TestType(IntEnum):
    UNIT = 1
    SANITY = 2
    FEATURE = 4
    REGRESSION = 8
    SYSTEM = 16
    ALL = 255

class TestCaseBase(metaclass=ABCMeta):
    """
    The test case base class
    User should implement the below 3 methods:
        setup: for test setup
        test: The main test body
        cleanup: Clean the test
    """
    def __init__(self, reporter):
        self.reporter = reporter
        self._output_var = dict()
        self.setting = None
        self.logger = reporter.case_logger
        self.test_data_var = dict()
        self.result = None

    @abstractmethod
    def collect_resource(self, pool):
        """
        Collect Test Resource
        """
        pass

    @abstractmethod
    def setup(self, *args):
        pass

    @abstractmethod
    def test(self, *args):
        pass

    @abstractmethod
    def cleanup(self, *args):
        pass

    @property
    def output_var(self):
        """
        The test case output variable
        Can be collected by Test Engine
        :return:
        """
        return self._output_var

    def get_setting(self, setting_path, setting_file):
        """
        Get test case setting instance
        """
        for k,v in self.__class__.__dict__.items():
            if hasattr(v, "__base__") and v.__base__.__name__ == "TestSettingBase":
                self.setting = v(setting_path, setting_file)
                self.setting.load()

```

### 使用类装饰器装饰类实现属性的输入增加测试用例对象的属性

case/decorator.py
```python
"""
The decorators for the test case
case: the base decorator
data_provider: for data driven
"""

from functools import wraps
from core.result.reporter import StepResult
from .base import TestType
import inspect
import os
import json
import re

class TestDataFileNotFound(Exception):
    pass

class MethodNotFoundError(Exception):
    pass


def case(priority =0,
         test_type=TestType.ALL,
         feature_name=None,
         testcase_id=None,
         pre_tests = None,
         skip_if_high_priority_failed=False):
    """
    The Decorator for the test cases
    """
    def decorator(cls):
        setattr(cls, "priority", priority)  # 测试用例的优先级
        setattr(cls, "test_type", test_type)  # 测试用例的类型
        setattr(cls, "feature_name", feature_name)  # 测试用例测试的功能
        setattr(cls, "testcase_id", testcase_id)  # 测试用例对应的测试用例ID
        setattr(cls, "pre_tests", pre_tests if pre_tests else list())
        setattr(cls, "skip_if_high_priority_failed", skip_if_high_priority_failed)
        return cls
    return decorator


def _replace_value(obj, test_case):
    if not isinstance(obj, dict):
        return
    for key, value in obj.items():
        if isinstance(value, str):
            # 替换字符串
            obj[key] = value % test_case.test_data_var
            # 查找方法并执行
            res = re.findall(r"<func:(.+?)>", obj[key])
            if any(res):
                if hasattr(test_case, res[0]):
                    obj[key] = getattr(test_case, res[0])()
                else:
                    raise MethodNotFoundError(f"method: {res[0]} not found")

        elif isinstance(value, dict):
            _replace_value(value, test_case)
        elif isinstance(value, list):
            for item in value:
                _replace_value(item, test_case)
        else:
            continue


def data_provider(filename=None, stop_on_error=False):
    """
    The data provider for test method in test case
    :param filename: the test data file, default case name is script name + ".json"
    :param stop_on_error: If true, the case will stop if 1 data iteration failed.
    :return:
    """
    def outer(func):
        @wraps(func)
        def wrapper(*args):
            test_case = locals()["args"][0]
            case_file = inspect.getfile(test_case.__class__)
            if filename:
                case_file = filename
            test_data_file = case_file + ".json"
            if not os.path.exists(test_data_file):
                raise TestDataFileNotFound(f"Cannot found test data for case {test_case.__class__.__name__}")
            with open(test_data_file) as file:
                test_data = json.load(file)
            iteration = 1
            for data in test_data["data"]:
                header = data.get("header", f"Iteration {iteration}")
                try:
                    iteration += 1
                    test_case.reporter.add_step_group(header)
                    _replace_value(data, test_case)
                    func(*args, data)
                except Exception as ex:
                    if not stop_on_error:
                        test_case.reporter.add(StepResult.EXCEPTION, f"Exception on {header}")
                    else:
                        raise ex
                finally:
                    test_case.reporter.end_step_group()
        return wrapper
    return outer

```
属性输入装饰器的使用：
```python
@case(priority=1, test_type=TestType.SANITY,feature_name="Test",testcase_id="1")
class HelloWorldTest(TestCaseBase):
    pass
```



### 测试用例参数
测试用例配置：
- 默认规则
- 动态规则：使用动态配置


## 测试用例形式
testcase/testlist.py

## 测试列表即TestList
测试列表是一组测试用例的集合。
case/testlist.py
```python
import os
import json

from core.config.setting import SettingBase, dynamic_setting
from core.case.base import TestType


class TestListError(Exception):
    """
    用来描述测试列表的一系列错误异常
    """
    def __init__(self, message, ex=None):
        super().__init__("测试列表异常:" + message)
        self.parent = ex


@dynamic_setting
class TestList:
    """
    测试列表类
    filepath 默认内容
    {
    "name": "",
    "description": "",
    "setting_path": "",
    "cases": [],
    "sublist": []
    }
    """
    def __init__(self, filepath):
        self.filepath = filepath
        self.setting_file_path = None
        self.test_list_name = ""
        self.description = ""
        self.test_cases = list()
        self.sub_list = list()
        self.load()
        self.setting_path = os.path.dirname(self.setting_file_path)
        self.setting_file = os.path.basename(self.setting_file_path)

    def load(self):
        """
        读取测试列表
        """
        if not os.path.exists(self.filepath):
            raise TestListError("%s 无法找到" % self.filepath)
        try:
            testlist_file = open(self.filepath)
            testlist_obj = json.load(testlist_file)
            self.test_list_name = testlist_obj['name']
            self.description = testlist_obj['description']
            self.setting_file_path = testlist_obj['setting_path']
            if not self.setting_file_path:
                self.setting_file_path = \
                    os.path.join(os.path.dirname(self.filepath),
                                 os.path.basename(self.filepath) + ".settings")

            for testcase in testlist_obj['cases']:
                self.test_cases.append(testcase)
            for sublist in testlist_obj['sublist']:
                fullpath = os.path.join(os.path.dirname(self.filepath), sublist)
                temp_list = TestList(fullpath)
                try:
                    temp_list.load()
                    self.sub_list.append(temp_list)
                except:
                    pass

        except Exception as ex:
            raise TestListError("打开文件%s错误" % self.filepath, ex)

    def save(self):
        """
        将测试列表保存成json格式的文件
        """
        json_obj = dict()
        json_obj['name'] = self.test_list_name
        json_obj['description'] = self.description
        json_obj['setting_path'] = self.setting_file_path
        json_obj['cases'] = list()
        for testcase in self.test_cases:
            json_obj['cases'].append(testcase)
        json_obj['sublist'] = list()
        for sublist in self.sub_list:
            try:
                sublist.save()
                json_obj['sublist'].append(os.path.basename(sublist.filepath))
            except:
                pass
        try:
            testlist_file = open(self.filepath, mode="w")
            json.dump(json_obj, testlist_file, indent=4)
        except Exception as ex:
            raise TestListError("无法保存测试列表%s" % self.filepath, ex)

    class TestListSetting(SettingBase):
        """
        filepath.settings 默认配置
        {
            "random_seed": 0,
            "skip_if_high_priority_failed": true,
            "follow_priority": true,
            "run_type": 255,
            "priority_to_run": []
        }
        """
        random_seed = 0
        case_setting_path = ""
        skip_if_high_priority_failed = True
        follow_priority = True
        run_type = TestType.ALL
        priority_to_run = list()

if __name__ == "__main__":
    # 使用时需在该目录下新建demo_list1.testlist、demo_list2.testlist，并填入上面的初始值
    # 配置文件这里有个bug：在Windows下无法自动创建，如在windows下调试需创建demo_list1.testlist.settings、demo_list2.testlist.settings并填入上面的初始值
    t1 = TestList("demo_list1.testlist")
    t1.test_list_name = "A Demo Test List"
    t1.description = "Description"
    t1.test_cases.append("case1")
    t1.test_cases.append("case2")
    # t1.setting_file_path = "."
    t2 = TestList("demo_list2.testlist")
    t2.test_list_name = "Demo sub list"
    t1.sub_list.append(t2)
    t1.save()
    t1.load()
    print(t1)

```


