---
title: 测试配置管理模块
author: T8840
date: '2023-01-15'
---


## 测试配置基本分类
- 静态配置  
一些配置选项参数化，保存在一个外部资源(文本文件或数据库等)中。
- 动态配置  
配置文件并不是固定不变，会随着业务变化而增加或减少。这些配置并不是应用于整个平台或者某次执行中，而可能作用于某个测试平台的对象，比如测试列表和测试用例。
- 带逻辑功能的配置  
使用场景： 
    1. 设备版本检测  
    检测某些测试设备的版本是否满足测试需要，如果不满足可以对其进行一些操作，比如从测试资源池中移除该设备或在开发过程中有些不稳定版本在测试时不想使用，但又不想修改测试资源或测试用例，则可以添加该模块来对这些版本的资源进行过滤。
    2. 控制口错误监测  
    用于检测控制口的输出是否包含某些特定的错误关键词信息，以此来判断执行过程中是否有测试用例不能抓到的错误存在。
    3. 服务器资源监测  
    4. 测试设备重启  
    用于在测试用例结束后对设备进行重启操作。可能会因为某些缺陷导致配置无法清理到初始状态，通过这个模块的加载就可以在不修改测试用例的情况下对设备进行重新启动操作。  
    等
## 可扩展的静态与动态配置
参考Django静态配置设计

### 静态配置的设计原理
StaticSettingManager作为静态配置的管理类  
使用步骤：
1. 使用类装饰器@static_setting.setting("TestStaticSetting")针对自定义的配置类，如class TestStaticSettingClass(SettingBase)
2. 自定义的配置类可配置配置文件名与指定路径，不然会使用默认路径
3. 使用自定义配置类时要用自定义配置类继承的静态方法.load()加载

另外，引用被类装饰器@static_setting.setting的模块，下面这段代码就会自动在当前目录 "settingfile"中没有会自动创建对应的配置文件
```python
static_setting.setting_path = "settingfile"
static_setting.load_all()
```

### 灵活的动态配置
使用的是类中类与类装饰器。  
每个类中类都会保存为一个单独的以类命名的配置文件。  
注意：由于配置是动态生成的，所以生成动态配置文件中的配置一直会与类中类中的设置保持一致  


```python
import os
import importlib
import json
from abc import ABCMeta
from functools import wraps, update_wrapper

# 使用环境变量作为默认路径
# _DEFAULT_PATH = os.path.join(os.environ['HOME'], "test_config")
# 使用相对路径作为默认路径
_DEFAULT_PATH = os.path.join(os.getcwd(), ".")


class SettingError(Exception):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class SettingBase(metaclass=ABCMeta):
    file_name = None
    setting_path = _DEFAULT_PATH

    @classmethod
    def _get_full_path(cls):
        filename = cls.file_name if cls.file_name else cls.__name__ + ".setting"
        return os.path.join(cls.setting_path, filename)

    @classmethod
    def save(cls):
        if not os.path.exists(cls.setting_path):
            os.makedirs(cls.setting_path)
        with open(cls._get_full_path(), "w") as file:
            obj = dict()
            for key, value in cls.__dict__.items():
                if key.startswith("_") or key == "setting_path"\
                        or key == "file_name":
                    continue
                obj[key] = value
            json.dump(obj, file, indent=4)

    @classmethod
    def load(cls):
        if os.path.exists(cls._get_full_path()):
            with open(cls._get_full_path()) as file:
                obj = json.load(file)
            for key, value in obj.items():
                setattr(cls, key, value)
        else:
            cls.save()



class TestSettingBase(SettingBase):

    def __init__(self, setting_path, file_name):
        self.__class__.file_name = file_name
        self.__class__.setting_path = setting_path


class StaticSettingManager:
    """
    静态配置管理类
    """
    def __init__(self):
        self.settings = dict()
        self._setting_path = _DEFAULT_PATH

    def add_setting(self, setting_name, setting_class):
        if hasattr(setting_class, "__base__"):
            if setting_class.__base__.__name__ != "SettingBase":
                raise SettingError("注册的配置必须是SettingBase的子类")
        else:
            raise SettingError("注册的配置必须是SettingBase的子类")
        self.settings[setting_name] = setting_class
        setting_class.setting_path = self._setting_path

    def setting(self, setting_name, *args, **kwargs):
        """
        配置文件的注册装饰器
        """
        def wrapper(cls):
            self.add_setting(setting_name, cls)
            return cls
        return wrapper

    @property
    def setting_path(self):
        return self._setting_path

    @setting_path.setter
    def setting_path(self, value):
        self._setting_path = value
        for key, setting in self.settings.items():
            setting.setting_path = value

    def sync_path(self):
        """
        同步所有配置的路径
        """
        for key, setting in self.settings.items():
            setting.setting_path = self._setting_path

    def save_all(self):
        """
        保存所有配置
        """
        self.sync_path()
        for key, setting in self.settings.items():
            setting.save()

    def load_all(self):
        """
        读取所有配置
        """
        self.sync_path()
        for key, setting in self.settings.items():
            setting.load()

def dynamic_setting(cls):
    """动态配置类装饰器"""
    @wraps(cls)
    def inner(*args, **kwargs):
        rv = cls(*args, **kwargs)
        for key, value in cls.__dict__.items():
            if hasattr(value, "__base__") and value.__base__.__name__ == "SettingBase":
                setattr(rv, "setting", value)
                if hasattr(rv, "setting_path"):
                    value.setting_path = rv.setting_path
                if hasattr(rv, "setting_file") and rv.setting_file is not None:
                    value.file_name = rv.setting_file
                else:
                    if value.file_name is None:
                        value.file_name = f"{cls.__name__}_{value.__name__}.setting"
                    else:
                        value.file_name = f"{cls.__name__}_{value.file_name}.setting"
                value.load()
        return rv
    return inner


static_setting = StaticSettingManager()
if __name__ == "__main__":

    # ----------静态配置使用----------
    ## 自定义配置类
    @static_setting.setting("TestStaticSetting")
    class TestStaticSettingClass(SettingBase):
        """设置配置文件路径，不存在会自动创建"""
        file_name = "test_static_setting.setting"
        test_static_setting_path = os.path.join(os.getcwd(),".")
        # 可以添加配置会自动添加到配置文件中
        field1 = 1


    @static_setting.setting("TestStaticSetting2")
    class TestStaticSettingClass2(SettingBase):
        """设置配置文件路径，不存在会自动创建"""
        file_name = "test_static_setting2.setting"
        test_static_setting_path = os.path.join(os.getcwd(), ".")
        # 可以添加配置会自动添加到配置文件中
        field2 = 2

    # 使用前先注册
    TestStaticSettingClass.load()
    TestStaticSettingClass2.load()
    ## 获取配置文件中全部配置
    print(TestStaticSettingClass.__dict__)
    ## 获取某key配置
    print(TestStaticSettingClass.field1)

    ## 可使用static_setting来获取注册进来的配置类, 配置路径用于另存配置
    static_setting.setting_path = "./conf" # 会在当前conf目录下出现2个自定义类的配置文件，并可自定义向某配置文件中添加配置不影响之前配置文件中配置
    TestStaticSettingClass2.filed5 = 5
    print(static_setting.__dict__)
    static_setting.save_all()

    # ---------动态配置----------
    @dynamic_setting
    class TestDynamicSettingClass:
        def __init__(self, *args, **kwargs):
            self.setting_path = kwargs.get("setting_path", ".")
            self.setting_file = kwargs.get("setting_file", None)
        class MySetting(SettingBase):

            field1 = 1
            field2 = 2
        class MySetting2(SettingBase):

            field1 = 1
            field2 = 2
    tc = TestDynamicSettingClass(setting_path=".")
    print(tc.MySetting.field1)

```




## 带逻辑功能的配置实现原理
ModuleManager的实现：  
1. ModuleBase默认需要传入报告对象与资源对象
2. 示例DemoModule继承ModuleBase
3. 针对其他情况需要调整ModuleBase
4. ModuleManager在方法中组合使用传入的module实例
5. 通过load获取ModuleManager实例，add_module与save方法保存传入的module对象
6. 通过run_module方法进行逻辑调用（可批量针对测试前、中、后进行逻辑处理）
```python

import json
from enum import Enum
from abc import ABCMeta, abstractmethod
from core.result.reporter import ResultReporter
from core.resource.pool import ResourcePool
from core.config.setting import static_setting, SettingBase
from threading import Thread
from importlib import import_module
import os


class ModuleType(Enum):
    """
    PRE测试用例前运行该模块
    PARALLEL和测试用例同步执行
    POST测试用例执行完毕后执行
    """
    PRE = 1
    PARALLEL = 2
    POST = 3


class ModuleBase(metaclass=ABCMeta):
    """
    逻辑配置模块的基类
    """
    module_type = None
    priority = 99

    def __init__(self, report: ResultReporter, resource: ResourcePool):
        self.reporter = report
        self.resource = resource
        self.thread = None

    @abstractmethod
    def action(self):
        """
        实现该方法来实现模块的逻辑功能
        """
        pass

    def do(self):
        if self.module_type == ModuleType.PARALLEL:
            self.thread = Thread(target=self.action)
            self.thread.start()
        else:
            self.action()

    @abstractmethod
    def stop(self):
        """
        实现该方法来实现模块逻辑功能的终止方法
        """
        pass


@static_setting.setting("LogicModule")
class ModuleSetting(SettingBase):

    module_list_file = "./modules/modulelist.json"
    module_setting_path = "./modules/settings"


class ModuleManager:
    """
    配置模块的管理
    """
    def __init__(self):
        self.modules = dict()

    def load(self):
        """
        从模块列表装载所有模块类
        """
        if not os.path.exists(ModuleSetting.module_list_file):
            # 如果没有找到模块配置文件，则不做任何操作
            return
        with open(ModuleSetting.module_list_file) as file:
            obj = json.load(file)

        for item in obj['modules']:
            try:
                # 配置条目格式：
                # {
                #     "name": "modulename",
                #     "package":"module path",
                #     "setting_file": "setting filename",
                #     "setting_path": "setting path"
                # }
                module_name = item['name']
                module_package = item['package']
                setting_file = item.get("setting_file", None)
                setting_path = item.get('setting_path', ModuleSetting.module_setting_path)
                m = import_module(module_package)
                for element, value in m.__dict__.items():
                    if element == module_name:
                        self.modules[module_name] = {
                            "class": value,
                            "setting_file": setting_file,
                            "setting_path": setting_path
                        }
            except Exception:
                pass

    def add_module(self, module_class, setting_file=None, setting_path=None):
        """
        添加模块
        """
        obj = {
            "class": module_class,
            "setting_file": setting_file,
            "setting_path": setting_path
        }
        self.modules[module_class.__name__] = obj

    def get_module_instances(self, module_type, result_reporter, resources):
        """
        获取模块的实例化列表
        """
        rv = list()
        for mkey, mvalue in self.modules.items():
            print(mvalue['class'].module_type)
            print(module_type)
            if mvalue['class'].module_type.value == module_type.value:
                rv.append(mvalue['class'](result_reporter, resources))
        return rv

    def save(self):
        """
        保存所有模块到模块配置列表
        """
        obj = dict()
        obj['modules'] = list()
        for mkey, mvalue in self.modules.items():
            obj['modules'].append({
                "name": mkey,
                "package": mvalue["class"].__module__,
                "setting_file": mvalue['setting_file'],
                "setting_path": mvalue['setting_path']
            })
        file_dir = os.path.dirname(ModuleSetting.module_list_file)
        if not os.path.exists(file_dir):
            os.makedirs(file_dir)
        with open(ModuleSetting.module_list_file, "w") as file:
            json.dump(obj, file, indent=4)

    def run_module(self, module_type):
        """
       对模块的实例化列表进行执行
       """

        if module_type == ModuleType.PRE or module_type == ModuleType.POST:
            for mkey, mvalue in self.modules.items():
                if mvalue['class'].module_type.value == module_type.value:
                    mvalue['class'].action(self)
        elif module_type == ModuleType.PARALLEL:
            pass
        else:
            raise Exception

    def stop_module(self):
        or mkey, mvalue in self.modules.items():
                if mvalue['class'].module_type.value == module_type.value:
                    mvalue['class'].stop(self)
if __name__ == "__main__":
    from core.config.module import DemoModule ,DemoModule2 ,DemoModule3
    mm = ModuleManager()
    mm.load()
    mm.add_module(DemoModule)
    mm.add_module(DemoModule2)
    mm.add_module(DemoModule3)
    mm.save()
    
    mm.load()
    post_module = mm.get_module_instances(ModuleType.POST, None, None)
    pre_module = mm.get_module_instances(ModuleType.PRE, ".", None)
    mm.run_module(ModuleType.PRE)
    print(post_module)
```


示例DemoModule From config.demomodule.py
```python
from core.config.logicmodule import ModuleBase, ModuleType
from core.config.setting import dynamic_setting, SettingBase
from core.resource.pool import ResourcePool
from core.result.reporter import ResultReporter, StepResult


@dynamic_setting
class DemoModule(ModuleBase):
    """
    示例模块，在测试用例执行前输出一个INFO信息
    """
    module_type = ModuleType.PRE
    priority = 0


    def __init__(self, report: ResultReporter, resource: ResourcePool, **kwargs):
        super().__init__(report, resource)
        self.setting_path = kwargs.get("setting_path", ".")
        self.setting_file = kwargs.get(None)

    def action(self):
        # self.reporter.add(StepResult.INFO, "This is a demo module")
        print("DemoModule action!")
    def stop(self):
        pass

    class ModuleSetting(SettingBase):
        setting_value = "module setting 1"
```