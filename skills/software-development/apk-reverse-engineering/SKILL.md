---
name: apk-reverse-engineering
description: Android APK 逆向工程全流程 — 环境搭建、多源并发下载、Apktool/JADX/dex2jar/Frida 工具链安装配置、APK 反编译与分析。
tags: [android, reverse-engineering, security, apk, decompile, cordova]
trigger_words: [反编译, APK, 逆向, decompile, apktool, jadx, smali, 安卓逆向, 脱壳]
---

# APK 逆向工程工具链

## 触发条件
用户提到 APK 反编译、逆向、Android 应用分析、APK 安全审计等关键词。

## 环境依赖（按序安装）

### 0. 前置检查
```bash
java -version && python --version && which winget
```
若 Java 未安装，先装 JDK 17（JADX/Apktool/Ghidra 均依赖）。

### 1. JDK 17（核心依赖）
优先级：winget > 华为镜像 > 清华镜像 > 腾讯镜像。多源并发，先完成的用。

```bash
# 方案A: winget（可能慢）
winget install EclipseAdoptium.Temurin.17.JDK --accept-package-agreements

# 方案B: 华为镜像 curl 下载（推荐国内）
curl -L -o OpenJDK17.zip \
  "https://mirrors.huaweicloud.com/openjdk/17.0.2/openjdk-17.0.2_windows-x64_bin.zip"
unzip -qo OpenJDK17.zip -d /c/tools/jdk17
```

> ⚠️ 清华 Adoptium 镜像会重定向到 HTML（153 字节），不可用。
> JDK 路径示例：`/c/tools/jdk17/jdk-17.0.2`

### 2. Android SDK Platform-Tools（ADB）
```bash
curl -L -o platform-tools.zip \
  "https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
unzip -qo platform-tools.zip -d /c/tools/platform-tools
```
⚠️ 注意解压嵌套：可能产生 `platform-tools/platform-tools/`，需手动扁平化。

### 3. JADX（主力反编译器，自带JRE不依赖系统JDK）
```bash
curl -L -o jadx.zip \
  "https://github.com/skylot/jadx/releases/download/v1.5.1/jadx-1.5.1.zip"
# 备用镜像
# curl -L -o jadx.zip "https://ghproxy.net/https://github.com/skylot/jadx/releases/download/v1.5.1/jadx-1.5.1.zip"
unzip -qo jadx.zip -d /c/tools/jadx
```

### 4. Apktool（资源+Smali反编译）
```bash
mkdir -p /c/tools/apktool
curl -L -o /c/tools/apktool/apktool.jar \
  "https://github.com/iBotPeaches/Apktool/releases/download/v2.10.0/apktool_2.10.0.jar"
```

### 5. dex2jar（dex→jar 转换）
```bash
mkdir -p /c/tools/dex2jar
curl -L -o /c/tools/dex2jar/dex2jar.zip \
  "https://github.com/pxb1988/dex2jar/releases/download/v2.4/dex-tools-v2.4.zip"
unzip -qo dex2jar.zip -d /c/tools/dex2jar
# 注意：解压后路径是 dex-tools-v2.4/ 子目录
```

### 6. Frida + Objection（动态 Hook）
```bash
python -m pip install frida-tools objection
```
若 `pip` 不可用（venv 未装 pip）：
```bash
python -m ensurepip --upgrade
```

### 7. 环境变量配置
写入 `~/.bashrc`：
```bash
export JAVA_HOME="/c/tools/jdk17/jdk-17.0.2"
export PATH="$JAVA_HOME/bin:$PATH"
export PATH="/c/tools/platform-tools:$PATH"
export PATH="/c/tools/apktool:$PATH"
export PATH="/c/tools/dex2jar/dex-tools-v2.4:$PATH"
export PATH="/c/tools/jadx/bin:$PATH"
```

## APK 反编译三步法

### 步骤1：Apktool（资源+Smali）
```bash
java -jar /c/tools/apktool/apktool.jar d -f input.apk -o ./apktool_out
```
输出：AndroidManifest.xml、res/、assets/、smali*/（所有 dex 反编译的 Smali）

### 步骤2：JADX（Java 源码）
```bash
/c/tools/jadx/bin/jadx -d ./jadx_out --show-bad-code --threads-count 4 input.apk
```
输出：可直接阅读的 .java 文件，按包名组织在 `sources/` 下。
也可用 GUI：`/c/tools/jadx/bin/jadx-gui.bat input.apk`

### 步骤3：dex2jar（备用，配合 JD-GUI）
```bash
sh /c/tools/dex2jar/dex-tools-v2.4/d2j-dex2jar.sh -f input.apk -o output.jar
```

### 并行执行
三个步骤互不依赖，可同时运行（各占一个后台进程）。

## 分析技巧

### Cordova 混合应用识别
- AndroidManifest 中 Activity 继承 `CordovaActivity`
- `assets/www/` 包含 `cordova.js`、`index.html`
- 业务逻辑在 WebView 中（80MB+ 的 index.html 常有）
- Java 层极薄（仅 MainActivity）
- 重点分析 `custom_cordova_additions.js` 和 `cordova_plugins.js`

### 关键信息提取
1. `apktool.yml` → versionCode、versionName、minSdk、targetSdk
2. `AndroidManifest.xml` → 包名、权限、Activity/Service/Receiver 声明
3. `assets/www/index.html` → Web 层入口（可能 webpack 打包）
4. `smali/` → 修改后重打包的入口

## 输出报告模板
反编译完成后，输出包含：
- APK 基本信息表（包名/版本/架构/权限/调试标志）
- 代码结构树（Java 层 + Web 层 + 原生库）
- 统计数据（dex数/类数/smali数）
- 后续分析建议（GUI浏览/Smali修改/动态Hook）

## 相关文件
- `references/chinese-mirrors.md` — 国内镜像源实测清单
- `references/pitfalls.md` — 常见坑与解决方案
