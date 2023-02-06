---
title: 测试日志管理模块
author: T8840
date: '2023-01-15'
---

## 日志模块原理
步骤：
1. 首先实例化LoggerManager类
2. 调用register方法，该方法支持设置多种参数来满足不同需求
    - logger_name ：必填，日志中显示
    - filename：必填，日志保存的路径，可设置相对或绝对路径
    - console=True：是否输出到终端，默认是
    - default_level=logging.INFO ：日志等级，默认是INFO
    - zip：是否开启备份日志，设置为True时在触发unregister方法时才会进行备份
    - is_test: 表示该日志是一个测试用例日志，如果为True，logger_info属性则被遍历，并在日志实例的for_test为真则为该日志添加一个新的File Handler来输出该模块的日志到测试用例日志所在的目录。
    - for_test: 表示注册的模块需要在测试用例执行期间，同时向测试用例所在的日志目录输出日志信息，如：下面示例log1在记录日志的同时会向logtest和testcase两个目录输出日志信息

```python

import logging
import logging.handlers
import os
import zipfile
import time

logger_level = {
    "INFO": logging.INFO,
    "WARNING": logging.WARNING,
    "DEBUG": logging.DEBUG,
    "ERROR": logging.ERROR,
    "CRITICAL": logging.CRITICAL
}

def _zip_directory(dirpath, output_file):
    """
    将目标文件夹压缩成zip包并且输出到output_file
    并且将文件删除
    """
    zip = zipfile.ZipFile(output_file, "w", zipfile.ZIP_DEFLATED)
    for path, dirnames, filenames in os.walk(dirpath, topdown=False):
        target_path = path.replace(dirpath, '')
        for filename in filenames:
            if os.path.join(path, filename) == output_file:
                # skip self
                continue
            zip.write(os.path.join(path, filename), os.path.join(target_path, filename))
            os.remove(os.path.join(path, filename))
        if target_path != '':
            os.rmdir(path)
    zip.close()


def _check_and_create_directory(filename):
    dir_name = os.path.dirname(filename)
    if dir_name == '':
        return
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)


class LoggerManager:

    def __init__(self):
        # 用于记录logger的配置信息
        self.logger_info = dict()

    def register(self, logger_name, filename=None, console=True,
                 default_level=logging.INFO, **kwargs):
        """
        注册logger
        """
        log_format = kwargs.get("format", None)
        zip_logger = kwargs.get("zip", False)
        # 如果设置了file count，则默认一个文件大小为1M
        file_size_limit = kwargs.get("size_limit", 1024*1024)
        max_files = kwargs.get("max_files", None)
        file_mode = kwargs.get("mode", "w")
        if log_format is None:
            log_format = "[%(asctime)s][%(name)s]-<thread:%(thread)s>-(line:%(lineno)s), [%(levelname)s]: %(message)s"

        # 日志对测试用例开放
        for_test = kwargs.get("for_test", False)
        is_test = kwargs.get("is_test", False)
        # 获取新的logger 实例
        logger = logging.getLogger(logger_name)

        self.logger_info[logger_name] = dict()
        self.logger_info[logger_name]['timestamp'] = time.localtime()
        self.logger_info[logger_name]['for_test'] = for_test
        self.logger_info[logger_name]['is_test'] = is_test

        if filename:
            _check_and_create_directory(filename)
            self.logger_info[logger_name]['file_path'] = os.path.dirname(filename)
            self.logger_info[logger_name]['file_name'] = os.path.basename(filename)
            self.logger_info[logger_name]['zip'] = zip_logger
            if max_files:
                file_handler = \
                    logging.handlers.RotatingFileHandler(
                        filename=filename,
                        mode=file_mode,
                        maxBytes=file_size_limit,
                        backupCount=max_files)
            else:
                file_handler = logging.FileHandler(filename, mode=file_mode)
            file_handler.setFormatter(logging.Formatter(fmt=log_format))
            logger.addHandler(file_handler)
            if is_test:
                for llogger, lvalue in self.logger_info.items():
                    # 需要是一个注册了日志文件的模块才能向测试用例输出日志
                    if lvalue['for_test'] and "file_name" in lvalue:
                        logger_filename = os.path.join(
                            os.path.dirname(filename), f"{llogger}.log")
                        case_handler = logging.FileHandler(logger_filename, mode="w")
                        case_handler.setFormatter(logging.Formatter(fmt=log_format))
                        lvalue['case_handler'] = case_handler
                        lvalue['logger'].addHandler(case_handler)

        if console:
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(logging.Formatter(fmt=log_format))
            logger.addHandler(stream_handler)

        logger.setLevel(default_level)
        self.logger_info[logger_name]['logger'] = logger
        return logger

    def unregister(self, logger_name):
        """
        删除注册的logger，同时将需要打包的logger文件打包
        """
        if logger_name in logging.Logger.manager.loggerDict:
            logging.Logger.manager.loggerDict.pop(logger_name)
            # 如果注册了测试用例的handler，则移除
            if self.logger_info[logger_name]['is_test']:
                for llogger, lvalue in self.logger_info.items():
                    if 'case_handler' in lvalue:
                        lvalue['logger'].removeHandler(lvalue['case_handler'])
                        lvalue.pop("case_handler")
            self._achieve_files(logger_name)
            self.logger_info.pop(logger_name)

    def _achieve_files(self, logger_name):
        if self.logger_info[logger_name]['zip']:
            current = time.localtime()
            output_file = \
                "achieved_logs_%d_%d_%d_%d_%d_%d.zip" % (
                    current.tm_year, current.tm_mon, current.tm_mday,
                    current.tm_hour, current.tm_min, current.tm_sec
                )
            _zip_directory(
                self.logger_info[logger_name]['file_path'],
                os.path.join(self.logger_info[logger_name]['file_path'], output_file))

    def get_logger(self, logger_name):
        if logger_name in self.logger_info:
            return self.logger_info[logger_name]["logger"]
        raise NameError(f"No log named {logger_name}")


logger = LoggerManager()

if __name__=="__main__":
    log1 = logger.register(r"Module", "./logtest/test1.log", for_test=True)
    case_logger = logger.register("Test_Case", "./testcase/democase.log", is_test=True)
    case_logger.info("This is from Test log")
    log1.info("This is from Module Log")
    logger.unregister("Test_Case")

"""
# 输出
[2023-01-15 10:11:21,830][Test_Case]-<thread:2624>-(line:147), [INFO]: This is from Test log
[2023-01-15 10:11:21,831][Module]-<thread:2624>-(line:148), [INFO]: This is from Module Log
"""

```