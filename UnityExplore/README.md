<small>博客链接:https://blog.csdn.net/m0_47420894/article/details/126688523</small>

## Unity战场模拟探索

- 要在Unity项目中引入真实地图，有两种途径：
  - 通过地图SDK
  - 通过Unity的资源商店购买一些地图资源及支撑代码

- 当前Unity引擎下的地图SDK有：

  - ArcGIS SDK for Unity (免费，不支持WebGL

  - MapBox SDK for Unity (付费，宣称支持WebGL平台

  - Google Map SDK for Unity (已停止维护，将在12月停止服务

  - Bing Map SDK for Unity (使用人数较少，不支持WebGL

  - **SuperMap SDK for Game Engine**

    超图为Unity和Unreal Engine都开发了地图SDK (可以后续尝试

- 目前而言，所有免费的Unity地图SDK都具有以下特点：

  - **要求项目为HDRP，至少为URP**

  - 暂不支持WebGL平台，[参考原因](https://community.esri.com/t5/arcgis-maps-sdks-ideas/enable-support-in-the-unity-arcgis-sdk-for/idi-p/1191544)

  - 因此如果使用这些地图SDK引入地图，项目将无法打包为Web


- 如果使用Unity Asset购买地图资源，目前最成熟的插件为[online-maps](https://assetstore.unity.com/packages/tools/integration/online-maps-v3-138509)

  - 官方收费，但是通过https://unityassets4free.com/白嫖资源成功
  - 使用online-maps添加地图，可以成功
  - 但是使用online-maps引入的地图都为二维地图，而且仅作为简单图层，并没有给后续添加图层设计接口，所以暂时不太符合使用需求

### STEP 1：配置Unity及项目环境

#### 下载Unity Hub

一个Dashboard，用来管理引擎版本和Unity项目

https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup.exe

#### 下载Unity Editor

打开Unity Hub，下载Unity Editor

![image-20220902143129823](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902143129823.png)

建议下载LTS稳定版本：https://unity3d.com/unity/qa/lts-releases

![image-20220902143052743](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902143052743.png)

#### 创建项目

安装Unity Editor完成后，创建项目

![image-20220902145622691](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902145622691.png)

创建项目完成后，为项目指定开发平台

![image-20220902150546233](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902150546233.png)

![image-20220902150633674](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902150633674.png)

切换完毕后，需要配置一些选项，否则最终Web项目不能直接运行 (不清楚具体原因，与压缩有关

![image-20220902151231619](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902151231619.png)

![image-20220902153134839](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153134839.png)



### STEP 2：配置Unity SDK及外部插件

#### 配置SuperMap SDK for Unity

package已经放在了资源文件夹内

在Unity Editor里选择Assets-Import Package

![image-20220902153436389](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153436389.png)

选择SuperMap SDK的unitypackage

![image-20220902153536517](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153536517.png)

加载完成后全部引入

![image-20220902153658535](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153658535.png)

#### 配置ArcGIS SDK for Unity

在Windows标签里打开包管理窗口

![image-20220902153805007](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153805007.png)

然后点击加号，选择从tar包内引入

![image-20220902153839694](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153839694.png)

选择资源里的tgz文件

![image-20220902153926755](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902153926755.png)

等待加载完毕后，也许需要重启生效

#### 配置online-maps资源

方法与添加SuperMap SDK for Unity的一致，参考上面

### STEP 3：添加地图

#### 使用ArcGIS SDK添加地图

首先你需要有一个ArcGIS API Key，申请方法：

https://developers.arcgis.com/javascript/latest/get-started/#2-get-an-api-key

将你的key添加到SDK中

![image-20220902154143997](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154143997.png)

![image-20220902154224753](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154224753.png)

选择图层、高程、相机等

![image-20220902154420278](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154420278.png)

点击添加

![image-20220902154450390](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154450390.png)

缩放到一定大小后就可以看到

![image-20220902154543738](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154543738.png)

#### 使用online-maps添加地图

请确保online-maps已经添加完毕

在Hierarchy窗口右键

![image-20220902154715962](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154715962.png)

选择地图提供者和地图类型即可

![image-20220902154757630](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902154757630.png)

**online-map添加的地图并不能直接看到，需要运行后才能渲染**(点击播放



此外，并不是所有Provider都可以使用，实测ArcGIS和Google Map可以正常加载

### STEP 4：项目构建与打包

在选择平台的界面，选择build，指定输出目录即可

![image-20220902155132028](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/img/image-20220902155132028.png)

### 附：重要的外部链接及文档

#### [Unity Manual](https://docs.unity3d.com/Manual/index.html)

Unity官方文档，所有环境配置问题都需要在这里查看

※ 主要需要用到的是WebGL平台开发部分

https://docs.unity3d.com/Manual/webgl.html

#### [online-maps插件](https://infinity-code.com/assets/online-maps)

- [官方Doc](https://infinity-code.com/documentation/online-maps.pdf)
- [API参考](https://infinity-code.com/en/docs/api/online-maps)

#### [ArcGIS SDK for Unity](https://developers.arcgis.com/unity/)

#### SuperMap SDK for Unity文档

请见安装资源包内



另外，如果需要更换至UE引擎(目前较流行，Cesium有SDK)，有以下连接可以参考：

[Unreal Engine 5 Doc](https://docs.unrealengine.com/5.0/en-US/)

[Cesium for Unreal Engine](https://cesium.com/platform/cesium-for-unreal/)
