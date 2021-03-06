## Docker Design
![](/Users/pei.feng/code/aws_training/docker_homework/docker_design.png)

##Docker的网络模式以及区别，使用场景
####1. host模式

host模式是指容器直接使用宿主机的ip和端口号

如果再启动容器时，指定了以host模式启动, 那么新创建的容器不会创建自己的虚拟网卡, 而是直接使用宿主机的网卡进和ip地址和端口号
因此, 在容器中查看ip地址就是宿主机, 访问容器的时候直接使用宿主机的ip+容器定义的端口号即可
但除网络以外的其他资源: 如, 文件系统, 系统进程等仍然是和宿主机保持隔离的

此模式由于直接使用宿主机的网络, 因此网络性能最好
但是各个容器内使用的端口不能相同, 适用于运行容器端口比较固定的业务

> 特点：
> - 共享宿主机网络
> - 网络性能无损耗
> - 网络故障排除相对简单
> - 各个容器网络无隔离
> - 网络资源无法分别统计
> - 端口管理困难: 容器产生端口冲突
> - 不支持端口映射

####2. container模式

使用container模式创建的容器指定和一个已经存在的容器共享一个网络, 而不是和宿主机共享网
新创建的容器不会创建自己的网卡也不会配置自己的ip, 而是和一个被指定的已经存在的容器共享ip和端口范围
因此这个容器的端口不能和被指定容器的端口冲突, 除了网络之外的文件系统, 进程信息等仍然保持相互隔离, 两个容器的进程可以通过lo网卡进行通信

> 特点：
> - 与宿主机网络空间隔离
> - 容器间共享网络空间
> - 适合频繁的容器间的网络通信
> - 直接使用对方的网络, 较少使用

####3. none模式

在使用none模式时，Docker容器不会进行任何网络配置, 没有网卡, 没有ip, 也没有路由
因此, 无法与外界通信, 需要手动添加网卡配置ip等, 极少使用

> 特点：
> - 默认无网络功能, 无法和外部通信

####4. bridge模式

Docker的默认模式是bridge模式，当创建容器时不指定模式, 就是使用桥接模式
在此模式下, 创建容器后会为每一个容器分配Network Namespace、设置IP等，并将一个主机上的Docker容器连接到一个虚拟网桥上

> 特点：
> - 网络资源隔离: 不同宿主机之间的容器时无法直接通信的, 各自使用独立的网络
> - 无需手动配置: 容器默认自动获取172.17.0.0/16的ip地址, 此地址可以修改
> - 可访问外网: 利用宿主机的物理网卡, 通过SNAT访问外网
> - 外部主机无法直接访问容器: 可以通过配置DNAT接受外网的访问
> - 性能较低: 因为访问需要通过NAT, 网络转换带来额外的消耗
> - 端口管理繁琐: 每个容器必须手动指定一个端口, 容易产生端口冲突

####5. custom模式

除了4种网络模式外, 还可以自定义网络, 使用自定义的网段, 网关信息等, 自定义网络其实就是利用4种网络模型的一种, 自定义其网络配置, 本质并没有变
自定义网络可以直接通过容器名进行相互的访问, 而无需使用 --link
可以使用自定义网络模式, 实现不同集群应用的独立网络管理, 而互不影响, 而且在同一个网络中, 可以直接利用容器名相互访问。


##简要描述Docker和虚拟机的对比

**虚拟机**：

传统的虚拟机需要模拟整台机器包括硬件，每台虚拟机都需要有自己的操作系统，虚拟机一旦被开启，预分配给他的资源将全部被占用。，每一个虚拟机包括应用，必要的二进制和库，以及一个完整的用户操作系统。

**Docker**：

容器技术是指与宿主机共享硬件资源及操作系统可以实现资源的动态分配。
容器包含应用和其所有的依赖包，但是与其他容器共享内核。容器在宿主机操作系统中，在用户空间以分离的进程运行。

``` 
1. docker启动快速属于秒级别。虚拟机通常需要几分钟去启动；
2. docker需要的资源更少，docker在操作系统级别进行虚拟化，docker容器和内核交互，几乎没有性能损耗，性能优于通过Hypervisor层与内核层的虚拟化；
3. docker更轻量，docker的架构可以共用一个内核与共享应用程序库，所占内存极小。同样的硬件环境，Docker运行的镜像数远多于虚拟机数量。对系统的利用率非常高；
4. 与虚拟机相比，docker隔离性更弱，docker属于进程之间的隔离，虚拟机可实现系统级别隔离；
5. 安全性： docker的安全性也更弱。Docker的租户root和宿主机root等同，一旦容器内的用户从普通用户权限提升为root权限，它就直接具备了宿主机的root权限，进而可进行无限制的操作。
   虚拟机租户root权限和宿主机的root虚拟机权限是分离的，并且虚拟机利用如Intel的VT-d和VT-x的ring-1硬件隔离技术，这种隔离技术可以防止虚拟机突破和彼此交互，而容器至今还没有任何形式的硬件隔离，这使得容器容易受到攻击；
6. 可管理性：docker的集中化管理工具还不算成熟。各种虚拟化技术都有成熟的管理工具，例如VMware vCenter提供完备的虚拟机管理能力；
7. 高可用和可恢复性：docker对业务的高可用支持是通过快速重新部署实现的。虚拟化具备负载均衡，高可用，容错，迁移和数据保护等经过生产实践检验的成熟保障机制，VMware可承诺虚拟机99.999%高可用，保证业务连续性；
8. 快速创建、删除：虚拟化创建是分钟级别的，Docker容器创建是秒级别的，Docker的快速迭代性，决定了无论是开发、测试、部署都可以节约大量时间；
9. 交付、部署：虚拟机可以通过镜像实现环境交付的一致性，但镜像分发无法体系化；Docker在Dockerfile中记录了容器构建过程，可在集群中实现快速分发和快速部署；
```


