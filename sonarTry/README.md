<small>博客链接：https://blog.csdn.net/m0_47420894/article/details/126687140</small>

### 环境配置

#### 确认环境依赖

https://docs.sonarqube.org/latest/requirements/requirements/

sonarqube运行依赖Java环境

![image-20220823135056845](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823135056845.png)

推荐Java 11

目前涉及的功能中并未使用到数据库，暂无教程

#### 安装本体

1. 下载

   https://www.sonarqube.org/downloads/

   版本：Community Edition 9.6，8.9.x LTS版本也可

2. 初始化

   1. 运行sonar

      以windows环境为例，启动文件在以下目录

      ![image-20220823130332254](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823130332254.png)

      出现以下语句即为启动成功

      ![image-20220823130429661](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823130429661.png)

   2. 启动成功后，访问以下host：

      ```
      http://localhost:9000/
      ```

   3. 登陆，用户创建

      首次登陆，默认用户是admin，密码是admin

      ![img](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/dbff476f93aaeae3e810f60a7333592b.png)

      首次登录后，会要求更改密码，与初始密码不能一致

      进入界面即可

#### 下载sonar-scanner

1. 下载

   https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

   ![image-20220823135417530](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823135417530.png)

2. 配置环境变量

   1. 添加系统变量SONAR_RUNNER_HOME

      ![image-20220823135759240](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823135759240.png)

   2. 添加path变量

      ![image-20220823135900937](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823135900937.png)

   3. 测试：

      在CMD中，运行：

      ```bash
      sonar-scanner -v
      ```

      ![image-20220823140058663](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823140058663.png)



#### 安装插件

sonar插件的安装方法是将\<插件名称\>.jar文件放在以下目录：

\<你的sonar根目录\>\extensions\plugins

然后重新启动sonar

附：官方插件列表https://docs.sonarqube.org/latest/instance-administration/plugin-version-matrix/

![image-20220823141630062](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823141630062.png)



##### 中文包

官网：https://github.com/xuhuisheng/sonar-l10n-zh/releases

下载jar文件后放在插件目录即可



##### PDF生成插件

最新版本：https://gitee.com/zzulj/sonar-pdf-plugin/releases/tag/v4.0.0

下载jar文件后放在插件目录即可

注：官网说明中最新支持到8.9.1，但是实际上9.6版本也可以正常使用



### 运行测试

#### 创建项目

在创建项目中，选择Mannual，输入自定义的项目名称和key

![image-20220823130737124](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823130737124.png)

在这一步完成后，该项目就已经创建成功

#### 创建测试配置文件

打开要测试项目的根目录

在要测试的目录下，创建sonar的配置文件==sonar-project.properties==

```properties
#sonarqube服务器地址，默认为9000
sonar.host.url=http://localhost:9000
#sonarqube用户名
sonar.login=<替换为你的用户名>
#sonarqube密码
sonar.password=<替换为你设置的密码>
#项目唯一标识（不能出现重复）
sonar.projectKey=<替换为你项目的key>
#项目名称
sonar.projectName=<替换为你的项目名称>
#源代码目录
sonar.sources=<你的源码目录>
# 用逗号分割来指定多个目录
# sonar.sources=src, tests
# 测试代码目录
sonar.tests = <你的测试代码目录>
#语言
sonar.language=js
# sonar.language=javascript
#源代码文件编码
sonar.sourceEncoding=UTF-8

# 更多参数：https://docs.sonarqube.org/latest/analysis/analysis-parameters/
```

请注意内容的替换

更多配置参数：https://docs.sonarqube.org/latest/analysis/analysis-parameters/



#### 运行scanner

在根目录下运行：

```bash
sonar-scanner
```

等待扫描完毕，打开9000就可以查看扫描结果

![image-20220823131554110](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823131554110.png)

![image-20220823131616875](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823131616875.png)



#### 报告生成

在已经进行测试的项目中，选择More下的Download Pdf Report即可

![image-20220823142124365](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823142124365.png)

报告样本见leafletDemo.pdf



### sonar规则

#### sonar为项目特制规则集

参考资料：https://sqa.stackexchange.com/questions/24734/how-to-deactivate-a-rule-in-sonarqube/36023#36023

说明：

- sonar为每一种语言预定义了检查规则集(即Quality Profile)
- 在为项目运行检查的时候，sonar-scanner为当前项目绑定默认的Quality Profile
- 因此如果需要手动编辑生效和不生效的规则，需要自主新建一个Quality Profile，并设置为当前项目的默认Quality Profile

操作流程：

1. 新建自定义Quality Profile

   打开Quality Profiles标签，选择要自定义Profile的语言

   点击Copy，复制一份默认规则 (默认规则不可编辑

   为新规则集起一个好听的名字

   ![image-20220823111731659](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823111731659-16612328735471.png)

2. 编辑自定义的规则集

   进入新规则集编辑的入口可以有多个，可以这么进入：

   ![image-20220823112201142](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823112201142-16612328735482.png)

   ![image-20220823112220553](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823112220553-16612328735493.png)

   也可以这么进入(使用rules标签的筛选面板)：

   ![image-20220823113147258](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823113147258-16612328735494.png)

   点击右侧的Activate/Disactivate就可以指定生效或者不生效的规则

3. 将新规则集指定为项目的默认规则集

   在项目页面，打开项目设置的下拉框

   ![image-20220823112511898](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823112511898-16612328735495.png)

   更换默认规则

   ![image-20220823112645379](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823112645379-16612328735496.png)

   在项目下，重新运行sonar-scanner，新规则即可生效

#### sonar编辑规则

首先，要编辑规则，需要确保目前用户具有权限

在administration-security-global permission中，确认两个权限被勾选

![image-20220823101522964](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823101522964-16612328735507.png)

sonar对预定义规则的编辑自由度较为有限，仅支持以下编辑：

- 为规则扩充描述

  ![image-20220823101222414](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823101222414-16612328735508.png)

- 为规则编辑tag标签

  ![image-20220823101324667](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823101324667-16612328735509.png)

  附：预定义规则标签目录

  https://docs.sonarqube.org/latest/user-guide/built-in-rule-tags/



#### sonar新建自定义规则

##### 简单情况

简单情况下，sonar只支持从已有模板中派生规则，自由度较差

目前sonar支持自定义规则的模板有：(JS、TS、HTML、XML

![image-20220823095438640](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823095438640-166123287355010.png)

基于这些模板通常只能实现一些简单的错误检查，如对符合某正则表达式的注释的检查

案例：见demo



##### 通过插件获取规则

使用一些规则插件，可以获取更多规则

官方给的插件列表中主要针对Java，为前端相关的规则插件基本不存在

在此仅提供获取更多规则的一条思路



##### 自主编写代码规则

请见：https://docs.sonarqube.org/latest/extend/adding-coding-rules/

及：https://docs.sonarqube.org/latest/analysis/generic-issue/

(研究中



### 附1：为VSCode配置sonar环境

#### 安装sonarlint插件

在VSCode插件页搜索Sonarlint即可

![image-20220823142857757](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823142857757.png)

#### 为vscode连接sonarqube

见https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode#connected-mode



### 附2：sonar对Vue文件的支持

关于Sonar对Vue的支持，官方并没有进行详细的说明，仅在介绍页提到了支持

![image-20220823115642896](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823115642896.png)

因此为了测试Sonar检查对Vue的支持，进行了以下实验：

- vue文件html部分

  ![image-20220823124145978](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823124145978.png)

  检测成功

- vue文件script部分

  ![image-20220823124213449](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823124213449.png)

  检测成功

- vue文件style部分

  ![image-20220823124231626](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823124231626.png)

  检测成功

因此说明sonar对vue文件三个部分均可以正常检测

### 附3：sonar规则不起效的原因

在demo的初步扫描中，switch嵌套的问题似乎并没有被检查出来

![image-20220823102128491](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823102128491-166123287355011.png)

可能原因：

- 错误的检查是逐步的，需要改正现有错误以后才能进一步发现其他错误 ×

- 相关的rule没有activate √

  默认情况下，switch嵌套的检查未被activate

  ![image-20220823115010154](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823115010154-166123287355012.png)

- 重新运行后，错误被检查出来了

  ![image-20220823115405679](https://rsdonkeyrepo1.oss-cn-hangzhou.aliyuncs.com/imgs/Sonar%E6%96%87%E6%A1%A3.assets/image-20220823115405679-166123287355013.png)
