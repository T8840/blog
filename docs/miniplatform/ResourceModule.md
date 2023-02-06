---
title: 测试资源管理模块
author: T8840
date: '2023-01-15'
---


## 测试资源形式
文本形式的配置文件：XML/JSON/YAML
数据库：MySQL


## 使用拓扑结构的测试资源抽象模型
拓扑结构可以抽象为测试资源的静态属性及其连接信息，如：一台电脑通过网线连接另一台电脑。
这种抽象模型比较适合运维。
下面的代码完全使用python编写资源的模型并保存在文件中并从文件中获取，该数据模型没有使用MySQL专门的数据库。


### 测试资源的序列化/反序列化
就是模型与文件或mysql的转化操作。

### 资源池
管理测试资源的序列化/反序列化，以及资源的占用管理。   
pool.py 代码如下：
```python
"""
资源池对象，包括了资源池、资源以及资源端口的定义，序列化以及反序列化的方法
"""
import json
import os
import time
from abc import ABCMeta, abstractmethod
from core.config.setting import static_setting, SettingBase


# 存放用户注册的配置接口对象类型
_resource_device_mapping = dict()
_resource_port_mapping = dict()


class ResourceError(Exception):
    def __init__(self, msg):
        super().__init__(msg)


class ResourceNotMeetConstraint(Exception):
    def __init__(self, constraints):
        super().__init__("Resource Not Meet Constraints")
        self.description = ""
        for constraint in constraints:
            self.description += constraint.description + "\n"


class ResourceDevice:
    """
    代表所有测试资源设备的配置类，字段动态定义
    """
    def __init__(self, name="", **kwargs):
        self.name = name
        self.type = kwargs.get("type", None)
        self.description = kwargs.get("description", None)
        self.pre_connect = False
        self.ports = dict()
        self._instance = None

    def add_port(self, name, *args, **kwargs):
        if name in self.ports:
            raise ResourceError(f"Port Name {name} already exists")
        self.ports[f"{name}"] = DevicePort(self, name, **kwargs)

    def get_port_count(self, **kwargs):
        return len(self.ports)

    def to_dict(self):
        ret = dict()
        for key, value in self.__dict__.items():
            if key == "__instance":
                continue
            if key == "ports":
                ret[key] = dict()
                for port_name, port in value.items():
                    ret[key][port_name] = port.to_dict()
            else:
                ret[key] = value
        return ret

    def get_comm_instance(self, new=False):
        if self.type not in _resource_device_mapping:
            raise ResourceError(f"type {self.type} is not registered")
        if not new and self._instance:
            return self._instance
        else:
            self._instance = _resource_device_mapping[self.type](self)
        return self._instance

    @staticmethod
    def from_dict(dict_obj):
        ret = ResourceDevice()
        for key, value in dict_obj.items():
            if key == "ports":
                ports = dict()
                for port_name, port in value.items():
                    ports[port_name] = DevicePort.from_dict(port, ret)
                setattr(ret, "ports", ports)
            else:
                setattr(ret, key, value)
        return ret


class DevicePort:
    """
    代表设备的连接端口
    """
    def __init__(self, parent_device=None, name="", **kwargs):
        self.parent = parent_device
        self.type = kwargs.get("type", None)
        self.name = name
        self.description = kwargs.get("description", None)
        self.remote_ports = list()
        self._instance = None

    def get_comm_instance(self, new=False):
        if self.type not in _resource_port_mapping:
            raise ResourceError(f"type {self.type} is not registered")
        if not new and self._instance:
            return self._instance
        else:
            self._instance = _resource_port_mapping[self.type](self)
        return self._instance

    def to_dict(self):
        ret = dict()
        for key, value in self.__dict__.items():
            if key == "__instance":
                continue
            if key == "parent":
                ret[key] = value.name
            elif key == "remote_ports":
                ret[key] = list()
                for remote_port in value:
                    #使用device的名称和port的名称来表示远端的端口
                    #在反序列化的时候可以方便地找到相应的对象实例
                    ret[key].append(
                        {
                            "device": remote_port.parent.name,
                            "port": remote_port.name
                        }
                    )
            else:
                ret[key] = value
        return ret

    @staticmethod
    def from_dict(dict_obj, parent):
        ret = DevicePort(parent)
        for key, value in dict_obj.items():
            if key == "remote_ports" or key == "parent":
                continue
            setattr(ret, key, value)
        return ret


def register_resource(category, resource_type, comm_callback):
    """
    注册配置接口实例化的方法或者类。
    """
    if category == "device":
        _resource_device_mapping[resource_type] = comm_callback
    elif category == "port":
        _resource_port_mapping[resource_type] = comm_callback


class ResourcePool:
    """
    资源池类，负责资源的序列化和反序列化以及储存和读取
    """
    def __init__(self):
        self.topology = dict()
        self.reserved = None
        self.information = dict()
        self.file_name = None
        self.owner = None

    def add_device(self, device_name, **kwargs):
        if device_name in self.topology:
            raise ResourceError(f"device {device_name} already exists")
        self.topology[device_name] = ResourceDevice(device_name, **kwargs)

    def reserve(self):
        """占用"""
        if self.file_name is None:
            raise ResourceError("load a resource file first")
        self.load(self.file_name, self.owner)
        self.reserved = {"owner": self.owner, "date": time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())}
        self.save(self.file_name)

    def release(self, owner):
        """释放"""
        if self.file_name is None:
            raise  ResourceError("load a resource file first")
        self.load(self.file_name, owner)
        self.reserved = None
        self.save(self.file_name)

    def collect_device(self, device_type, count, constraints=list()):
        ret = list()
        for key, value in self.topology.items():
            if value.type == device_type:
                for constraint in constraints:
                    if not constraint.is_meet(value):
                        break
                else:
                    ret.append(value)
            if len(ret) >= count:
                return ret
        else:
            return list()

    def collect_all_device(self, device_type, constraints=list()):
        ret = list()
        for key, value in self.topology.items():
            if value.type == device_type:
                for constraint in constraints:
                    if not constraint.is_meet(value):
                        break
                else:
                    ret.append(value)
        return ret

    def collect_connection_route(self, resource, constraints=list()):
        """
        获取资源连接路由
        """
        # 限制类必须是连接限制ConnectionConstraint
        for constraint in constraints:
            if not isinstance(constraint, ConnectionConstraint):
                raise ResourceError(
                    "collect_connection_route only accept ConnectionConstraints type")
        ret = list()
        for constraint in constraints:
            conns = constraint.get_connection(resource)
            if not any(conns):
                raise ResourceNotMeetConstraint([constraint])
            for conn in conns:
                ret.append(conn)
        return ret

    def load(self, filename, owner):
        # 检查文件是否存在
        if not os.path.exists(filename):
            raise ResourceError(f"Cannot find file {filename}")
        self.file_name = filename

        # 初始化
        self.topology.clear()
        self.reserved = False
        self.information = dict()

        #读取资源配置的json字符串
        with open(filename) as file:
            json_object = json.load(file)

        #判断是否被占用
        if "reserved" in json_object and \
            json_object['reserved'] is not None and \
                json_object['reserved']['owner'] != owner:
            raise ResourceError(f"Resource is reserved by {json_object['reserved']['owner']}")

        self.owner = owner

        if "info" in json_object:
            self.information = json_object['info']
        for key, value in json_object['devices'].items():
            device = ResourceDevice.from_dict(value)
            self.topology[key] = device

        # 映射所有设备的连接关系
        for key, device in json_object['devices'].items():
            for port_name, port in device['ports'].items():
                for remote_port in port['remote_ports']:
                    remote_port_obj = \
                        self.topology[remote_port["device"]].\
                            ports[remote_port["port"]]
                    self.topology[key].ports[port_name].\
                        remote_ports.append(remote_port_obj)

    def save(self, filename):
        """

        """
        with open(filename, mode="w") as file:
            root_object = dict()
            root_object['devices'] = dict()
            root_object['info'] = self.information
            root_object['reserved'] = self.reserved
            for device_key, device in self.topology.items():
                root_object['devices'][device_key] = device.to_dict()
            json.dump(root_object, file, indent=4)


class Constraint(metaclass=ABCMeta):
    """
    资源选择器限制条件的基类
    """
    def __init__(self):
        self.description = None

    @abstractmethod
    def is_meet(self, resource, *args, **kwargs):
        pass


class ConnectionConstraint(Constraint, metaclass=ABCMeta):
    """
    用户限制获取Remote Port的限制条件。
    """
    @abstractmethod
    def get_connection(self, resource, *args, **kwargs):
        pass


@static_setting.setting("ResourceSetting")
class ResourceSetting(SettingBase):
    file_name = "resource_setting.setting"
    resource_path = os.path.join(os.getcwd(), ".")
    auto_connect = False


def get_resource_pool(filename, owner):
    ResourceSetting.load()
    full_name = os.path.join(ResourceSetting.resource_path, filename)
    rv = ResourcePool()
    rv.load(full_name, owner)
    return rv


if __name__ == "__main__":
    ## 设备连接形式1
    switch = ResourceDevice(name="switch1")
    switch.add_port("ETH1/1")
    switch.add_port("ETH1/2")

    switch2 = ResourceDevice(name="switch2")
    switch2.add_port("ETH1/1")
    switch2.add_port("ETH1/2")

    switch.ports['ETH1/1'].remote_ports.append(switch2.ports['ETH1/1'])
    switch2.ports['ETH1/1'].remote_ports.append(switch.ports['ETH1/1'])

    rp = ResourcePool()
    rp.topology['switch1'] = switch
    rp.topology['switch2'] = switch2
    rp.save("test.json")
    rp.load("test.json","michael")
    rp.reserve()
    # rp2 = ResourcePool()
    # rp2.load("test.json", "jason")
    # print("done")

    ## 设备连接形式2
    HuaweiP50 = ResourceDevice(name="Huawei p50",type="Android")
    HuaweiP40 = ResourceDevice(name="Huawei p40",type="Android")
    HuaweiP30 = ResourceDevice(name="Huawei p30",type="Android")
    device_pool = ResourcePool()
    for device in [HuaweiP50,HuaweiP40,HuaweiP30]:
        device.add_port("WIFI")
        device.add_port("People")
        device_pool.topology[device.name] = device

    Developer = ResourceDevice(name="Developer",type="Department")
    Tester = ResourceDevice(name="Tester",type="Department")
    for department in [Developer, Tester]:
        department.add_port("WIFI")
        department.add_port("People")
        device_pool.topology[department.name] = department

    HuaweiP50.ports["WIFI"].remote_ports.append(Developer.ports["WIFI"])
    Developer.ports["WIFI"].remote_ports.append(HuaweiP50.ports["WIFI"])

    device_pool.save("device.json")

    device_pool.load("device.json","michael")
    device_pool.reserve()
    device_pool.release("michael")
    device_pool.load("device.json","json")
    device_pool.reserve()
    print([x.name for x in device_pool.collect_all_device(device_type="Android")])
    print([x.name for x in device_pool.collect_all_device(device_type="Department")])

```


### 资源选择器
资源限制条件，资源获取路由

```python
from core.resource.pool import Constraint, ConnectionConstraint, ResourceDevice, DevicePort, ResourcePool

class PhoneMustBeAndroidConstraint(Constraint):
    """
    判断手机必须是安卓系统，可以附带版本大小判断
    """
    def __init__(self, version_op=None, version=None):
        super().__init__()
        self.version = version
        self.version_op = version_op
        if self.version_op is not None:
            self.description = \
                f"Phone Type must be android and version {self.version_op} {self.version}"
        else:
            self.description = "Phone Type must be android"

    def is_meet(self, resource, *args, **kwargs):

        # 首先判断资源类型是Resource Device，并且type是Android
        if isinstance(resource, ResourceDevice) and \
                resource.type == "Android":
            if self.version_op:
                # 判断资源是否有version字段和值
                device_version = getattr(resource, "version")
                if device_version is None:
                    return False
                if self.version_op == "=":
                    return device_version == self.version
                elif self.version_op == ">":
                    return device_version > self.version
                elif self.version_op == "<":
                    return device_version < self.version
                elif self.version_op == ">=":
                    return device_version >= self.version
                elif self.version_op == "<=":
                    return device_version <= self.version
                elif self.version_op == "!=":
                    return device_version != self.version
                else:
                    return False
            else:
                # 没有版本判断操作符，则资源满足条件
                return True
        # 不满足条件
        return False


class DeviceMustHaveTrafficGeneratorConnected(ConnectionConstraint):
    """
    判断AP必须有测试仪表连接
    """
    def __init__(self, speed_constraint=None, port_count=1):
        super().__init__()
        self.speed = speed_constraint
        self.port_count = port_count
        self.description = \
            f"AP Must have {port_count} Traffic Generator Port(s) Connected"
        if speed_constraint:
            self.description += f", {speed_constraint.description}"

    def is_meet(self, resource, *args, **kwargs):
        return any(self.get_connection(resource))

    def get_connection(self, resource, *args, **kwargs):
        if not isinstance(resource, ResourceDevice):
            return False
        meet_ports = list()
        for port_key, port in resource.ports.items():
            # 假设测试仪表端口连在ETH端口上，跳过非ETH端口的判断
            if port.type != "ETH":
                continue
            #遍历Remote ports
            for remote_port in port.remote_ports:
                if remote_port.parent.type == "TrafficGen":
                    # 如果有速度限制，则调用该限制实例
                    if self.speed:
                        if self.speed.is_meet(remote_port):
                            meet_ports.append(remote_port)
                    else:
                        meet_ports.append(remote_port)
        if len(meet_ports) >= self.port_count:
            return meet_ports[0: self.port_count]
        return list()


class TrafficGeneratorSpeedMustBeGraterThan(Constraint):
    """
    判断测试仪表端口速率必须大于速度
    """
    def __init__(self, speed):
        super().__init__()
        self.speed = speed
        self.description = f"Traffic Generator Port Speed Must Grater Than {speed}M"

    def is_meet(self, resource, *args, **kwargs):
        if not isinstance(resource, DevicePort) or resource.parent.type != "TrafficGen":
            return False
        return getattr(resource, "speed", None) is not None and \
               getattr(resource, "speed") >= self.speed


class ApMustHaveStaConnected(ConnectionConstraint):
    """
    判断AP必须有STA连接
    """
    def __init__(self, sta_constraints=list(), sta_count=1):
        super().__init__()
        # 将constraint分类
        self.sta_constraints = list()
        self.sta_conn_constraints = list()
        for sta_constraint in sta_constraints:
            if isinstance(sta_constraint, ConnectionConstraint):
                self.sta_conn_constraints.append(sta_constraint)
            else:
                self.sta_constraints.append(sta_constraint)
        self.sta_count = sta_count
        self.description = f"AP must have {sta_count} STA connected"
        for sta_constraint in self.sta_constraints:
            self.description += f"\n{sta_constraint.description}"

    def is_meet(self, resource, *args, **kwargs):
        return any(self.get_connection(resource))

    def get_connection(self, resource, *args, **kwargs):
        if not isinstance(resource, ResourceDevice) or resource.type != "AP":
            return False
        for port_key, port in resource.ports.items():
            if port.type != "WIFI":
                continue
            ret = list()
            for remote_port in port.remote_ports:
                if remote_port.parent.type == 'STA':
                    # 用STA Constraint判断远端端口的STA设备是否符合条件
                    meet_all = True
                    for sta_constraint in self.sta_constraints:
                        if not sta_constraint.is_meet(remote_port.parent):
                            meet_all = False
                            break

                    # 如果没有基本的限制条件，不继续测试Connection条件
                    if not meet_all:
                        continue

                    # 对于connection的条件，返回对端的所有端口
                    conn_remote = list()
                    meet_connection = True
                    for sta_conn_constraint in self.sta_conn_constraints:
                        conns = sta_conn_constraint.get_connection(remote_port.parent)
                        # 不满足Connection条件
                        if not any(conns):
                            meet_connection = False
                            break
                        for conn in conns:
                            conn_remote.append(conn)

                    # 没有满足Connection条件，跳过。
                    if not meet_connection:
                        continue

                    ret.append((remote_port, conn_remote))

            if len(ret) >= self.sta_count:
                return ret[0: self.sta_count]
        return list()


if __name__ == "__main__":
    ap1 = ResourceDevice(name="ap1", type="AP")
    ap1.add_port("ETH1/1", type="ETH")
    ap1.add_port("ETH1/2", type="ETH")
    ap1.add_port("WIFI", type="WIFI")

    sta1 = ResourceDevice(name="sta1", type="STA")
    sta1.add_port("WIFI", type="WIFI")
    sta1.add_port("ETH1/1", type="ETH")
    sta1.add_port("ETH1/2", type="ETH")

    sta2 = ResourceDevice(name="sta2", type="STA")
    sta2.add_port("WIFI", type="WIFI")
    sta2.add_port("ETH1/1", type="ETH")
    sta2.add_port("ETH1/2", type="ETH")

    sta3 = ResourceDevice(name="sta3", type="STA")
    sta3.add_port("WIFI", type="WIFI")
    sta3.add_port("ETH1/1", type="ETH")
    sta3.add_port("ETH1/2", type="ETH")

    traffic_gen = ResourceDevice(name="trafficGen", type="TrafficGen")
    traffic_gen.add_port("PORT1/1/1", type="ETH")
    setattr(traffic_gen.ports['PORT1/1/1'], "speed", 1000)
    traffic_gen.add_port("PORT1/1/2", type="ETH")
    setattr(traffic_gen.ports['PORT1/1/2'], "speed", 1000)
    traffic_gen.add_port("PORT1/1/3", type="ETH")
    setattr(traffic_gen.ports['PORT1/1/3'], "speed", 1000)
    traffic_gen.add_port("PORT1/1/4", type="ETH")
    setattr(traffic_gen.ports['PORT1/1/4'], "speed", 1000)


    # AP和Traffic Generator之间的连接
    ap1.ports['ETH1/1'].remote_ports.append(traffic_gen.ports['PORT1/1/1'])
    traffic_gen.ports['PORT1/1/1'].remote_ports.append(ap1.ports['ETH1/1'])

    #建立ap和STA之间的连接
    ap1.ports['WIFI'].remote_ports.append(sta1.ports['WIFI'])
    sta1.ports['WIFI'].remote_ports.append(ap1.ports['WIFI'])

    ap1.ports['WIFI'].remote_ports.append(sta2.ports['WIFI'])
    sta2.ports['WIFI'].remote_ports.append(ap1.ports['WIFI'])

    ap1.ports['WIFI'].remote_ports.append(sta3.ports['WIFI'])
    sta3.ports['WIFI'].remote_ports.append(ap1.ports['WIFI'])

    #建立 STA 和 Traffic Generator之间的连接
    sta1.ports['ETH1/1'].remote_ports.append(traffic_gen.ports['PORT1/1/2'])
    traffic_gen.ports['PORT1/1/2'].remote_ports.append(sta1.ports['ETH1/1'])

    sta2.ports['ETH1/1'].remote_ports.append(traffic_gen.ports['PORT1/1/3'])
    traffic_gen.ports['PORT1/1/3'].remote_ports.append(sta2.ports['ETH1/1'])

    sta3.ports['ETH1/1'].remote_ports.append(traffic_gen.ports['PORT1/1/4'])
    traffic_gen.ports['PORT1/1/4'].remote_ports.append(sta3.ports['ETH1/1'])


    rp = ResourcePool()
    rp.topology['ap1'] = ap1
    rp.topology['sta1'] = sta1
    rp.topology['sta2'] = sta2
    rp.topology['sta3'] = sta3
    rp.topology['trafficGen'] = traffic_gen
    rp.save("test.json")

    # AP必须有STA的连接
    constraint1 = ApMustHaveStaConnected()

    # AP必须至少有3个STA连接
    constraint2 = ApMustHaveStaConnected(sta_count=3)

    # AP必须至少有4个STA连接
    constraint3 = ApMustHaveStaConnected(sta_count=4)


    # 设备必须有10000M速率的测试仪表端口连接
    constraint5 = DeviceMustHaveTrafficGeneratorConnected(
        speed_constraint=TrafficGeneratorSpeedMustBeGraterThan(10000))

    # 设备必须有1000M速率的测试仪表端口连接
    constraint4 = DeviceMustHaveTrafficGeneratorConnected(
        speed_constraint=TrafficGeneratorSpeedMustBeGraterThan(1000))

    # AP必须有至少3个STA连接，并且STA必须有1000M以上速率的测试仪表连接
    constraint6 = ApMustHaveStaConnected(sta_constraints=[constraint4], sta_count=3)

    ap = rp.collect_device(
        "AP",
        1,
        constraints=[
            constraint4,
            constraint6
        ]
    )

    traffic_gen = rp.collect_connection_route(ap1, [constraint4])

    sta_connection = rp.collect_connection_route(ap1, [constraint6])

    for port in traffic_gen:
        print(port.parent.name)

    for connection in sta_connection:
        print(connection[0].parent.name)
        for traffic_port in connection[1]:
            print(f"    {traffic_port.name}")
```

## 从资源类对象获取资源配置接口
### 通用配置接口
下面这种方式是常见的接口使用方式，如果有不同的接口，这种使用方式就不够灵活
```python
   class SshServer:
        def __init__(self, ip, port, username, password):
            pass

    resource = ResourcePool()
    resource.load("test.json","neal")
    ssh_device = resource.collect_device(device_type="ssh_server")[0]
    ssh_comm = SshServer(
        ssh_device.management["ip"],
        ssh_device.management["port"],
        ssh_device.management["username"],
        ssh_device.management["password"]
    )
```

### 利用回调机制进行优化
回调就是将函数或方法作为参数，传递给另一个函数或方法
```python
def testA(method):
    method("hello")

def method1(str):
    print(str)

def method2(str)
    print(str *2)

testA(method1)
testA(method2)
```

### 统一注册机制
利用委托设计模式
统一的注册入口create_conn.py
```python
"""
注册实例化方法，和测试资源模块的耦合点
"""
from thirdpart.commandline.telnet import TelnetClient
from thirdpart.commandline.ssh import SshClient
from core.resource.pool import register_resource, ResourcePool


def create_telnet(resource):
    ip = resource.management.get("ip", "")
    port = resource.management.get("port", 23)
    username = resource.management.get("username", "")
    password = resource.management.get("password", "")

    return TelnetClient(ip, port, username, password)


def create_ssh(resource):
    ip = resource.management.get("ip", "")
    port = resource.management.get("port", 23)
    username = resource.management.get("username", "")
    password = resource.management.get("password", "")

    return SshClient(ip, port, username, password)


register_mapping = (
    ("device", "telnet", create_telnet),
    ("device", "ssh", create_ssh),
)

for mapping in register_mapping:
    register_resource(mapping[0], mapping[1], mapping[2])


rp = ResourcePool()

rp.add_device("TelnetServer1", type="telnet")
setattr(rp.topology["TelnetServer1"], "management", {"ip": "192.168.1.100", "port":23, "username": "admin", "password": "admin"})
# rp.save("telnet.json")

telnet_resource = rp.collect_device(device_type="telnet", count=1)[0]
telnet_client = telnet_resource.get_comm_instance()
print(telnet_client.host)
```


第三方ssh.py
```python
from .base import CommandLine
import time
import paramiko


class SshClient(CommandLine):
    def __init__(self, host, port, username, password, **kwargs):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.ssh = None
        self.session = None


    def connect(self):
        if self.ssh is None:
            try:
                self.ssh = paramiko.SSHClient()
                self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                self.ssh.connect(self.host, self.port, self.username, self.password)
                trans = self.ssh.get_transport()
                self.session = trans.open_session()
                self.session.get_pty()
                self.session.invoke_shell()
                if not self._login():
                    self.disconnect()
            except Exception as ex:
                self.ssh = None
                self.session = None


    def disconnect(self):
        if self.ssh:
            try:
                self.ssh.close()
            finally:
                self.ssh = None
                self.session = None

    def send(self, string):
        self.session.send(string.encode())

    def send_and_wait(self, string, waitfor, timeout=60, **kwargs):
        self.send(string)
        return self._wait_for(waitfor, timeout=timeout)

    def receive(self):
        return self.session.recv(256).decode()

    def receive_binary(self):
        return self.session.recv(256)

    def send_binary(self, binary):
        self.session.send(binary.encode())

    def _login(self):
        return self._wait_for("$", timeout=10)

    def _wait_for(self, string, timeout):
        rcv = ""
        recent = time.time()
        while time.time() - recent < timeout:
            rcv += self.session.recv(256).decode()
            if string in rcv:
                return rcv
            else:
                time.sleep(0.1)
        return None

```

第三方telnet.py
```python
from .base import CommandLine
from telnetlib import Telnet


class TelnetClient(CommandLine):
    def __init__(self, host, port, username, password, **kwargs):
        super().__init__()
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.username_prompt = kwargs.get("user_prompt", "as:")
        self.password_prompt = kwargs.get("pwd_prompt", "assword:")
        self.telnet = None

    def connect(self):
        if self.telnet:
            return
        self.telnet = Telnet()

        self.telnet.open(self.host, self.port)
        if not self._login():
            self.disconnect()

    def disconnect(self):
        if self.telnet:
            try:
                self.telnet.close()
            finally:
                self.telnet = None

    def send(self, string):
        self.telnet.write(string.encode())

    def send_and_wait(self, string, waitfor, timeout=60, **kwargs):
        self.telnet.write(string.encode())
        return self.telnet.read_until(waitfor.encode(), timeout=timeout).decode()

    def receive(self):
        return self.telnet.read_eager().decode()

    def receive_binary(self):
        return self.telnet.read_eager()

    def send_binary(self, binary):
        self.telnet.write(binary)

    def _login(self):
        ret_data = self.telnet.read_until(
            self.username_prompt.encode(), timeout=10)
        if not ret_data:
            return False
        self.telnet.write(f"{self.username}\n".encode())
        ret_data = self.telnet.read_until(
            self.password_prompt.encode(), timeout=10)
        if not ret_data:
            return False
        self.telnet.write(f"{self.password}\n".encode())
        ret_data = self.telnet.read_until("$".encode())
        if ret_data:
            return True
        else:
            return False
```


定义抽象类
```python
from abc import ABCMeta, abstractmethod
from core.resource.pool import register_resource

class CommandLine(metaclass=ABCMeta):

    @abstractmethod
    def send(self, string):
        pass

    @abstractmethod
    def send_and_wait(self, string, waitfor, timeout=60, **kwargs):
        pass

    @abstractmethod
    def receive(self):
        pass

    @abstractmethod
    def send_binary(self, binary):
        pass

    @abstractmethod
    def receive_binary(self):
        pass

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def disconnect(self):
        pass

    @abstractmethod
    def _login(self):
        pass
```
