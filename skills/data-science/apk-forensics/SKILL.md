---
name: apk-forensics
description: "APK 逆向取证完整方法论 — 加固识别、伪加密突破、bkcrack已知明文攻击、Flutter AOT快照分析、代码提取、API发现、动态抓包。涵盖模拟器选型、真机部署、Frida/mitmproxy配置、支付逻辑取证。"
triggers:
  - "破解apk"
  - "反向编译apk"
  - "分析apk"
  - "付费逻辑"
  - "收款地址"
  - "非法软件"
  - "apk加固"
  - "zip加密"
  - "加壳脱壳"
  - "adb手机"
  - "frida抓包"
  - "mitmproxy"
---

# APK 逆向取证方法论

## 0. 取证准备

```bash
# 固定证据
md5sum target.apk && sha256sum target.apk
file target.apk
```

## 1. 加固/加密诊断

### 1.1 快速诊断（并行三工具）
```bash
apktool d -f target.apk -o apktool_out    # 判断是否能解资源
jadx -d jadx_out target.apk               # 判断DEX是否可读
d2j-dex2jar.sh target.apk -o out.jar      # 判断DEX魔数
```

### 1.2 ZIP 加密检测（关键！）
```bash
unzip -l target.apk | head -30            # 看文件列表是否乱码
unzip -t target.apk 2>&1 | head -5        # 测试是否需密码
```

**常见 ZIP 加密标志含义**:
- `flag bit0=1` → 可能伪加密（只设标志，数据未加密）← **最常见**
- `flag bit6=1` → AES 强加密（需密码）
- `flag bit3=1` → 数据描述符在数据后

### 1.3 伪加密突破（最重要的技巧）

APK 常设加密标志但不加密数据。直接 zlib 解压即可。

```python
import struct, zlib
with open('target.apk', 'rb') as f:
    data = f.read()
# 找 classes.dex 的 ZIP local header
idx = data.find(b'classes.dex')
for i in range(idx-80, idx):
    if data[i:i+4] == b'PK\x03\x04':
        flag = struct.unpack_from('<H', data, i+6)[0]
        method = struct.unpack_from('<H', data, i+8)[0]
        comp_size = struct.unpack_from('<I', data, i+18)[0]
        name_len = struct.unpack_from('<H', data, i+26)[0]
        extra_len = struct.unpack_from('<H', data, i+28)[0]
        dstart = i + 30 + name_len + extra_len
        raw = data[dstart:dstart+comp_size]
        try:
            dex = zlib.decompress(raw, -15)
            print(f'DEX {len(dex)} bytes, magic: {dex[:8]}')
        except:
            print('真加密，需要密码')
        break
```

### 1.4 bkcrack 已知明文攻击（真加密时）

安装 bkcrack:
```bash
curl -L -o bkcrack.zip "https://github.com/kimci86/bkcrack/releases/download/v1.7.1/bkcrack-1.7.1-win64.zip"
unzip bkcrack.zip
```

攻击示例:
```bash
# DEX offset 32-43 的已知数据: file_size + header_size + endian_tag
printf '\xc0\x15\x66\x00\x70\x00\x00\x00\x78\x56\x34\x12' > plain.bin
bkcrack -C target.apk -c classes.dex -p plain.bin -o 32
```

## 2. 代码提取

### 2.1 DEX to JAR (dex2jar)
```bash
d2j-dex2jar.sh -f classes.dex -o classes.jar
```

### 2.2 JAR 字符串搜索
```python
import zipfile
all_strings = set()
with zipfile.ZipFile('classes.jar') as zf:
    for name in zf.namelist():
        if name.endswith('.class'):
            data = zf.read(name)
            current = b''
            for byte in data:
                if 32 <= byte < 127:
                    current += bytes([byte])
                else:
                    if len(current) >= 6:
                        all_strings.add(current.decode('ascii', errors='ignore'))
                    current = b''
```

### 2.3 Flutter APK 特殊处理

Flutter 应用核心逻辑在 `lib/arm64-v8a/libapp.so` (Dart AOT 快照)。
Java 层仅包含 Flutter shell + 第三方 SDK。

**libapp.so 字符串提取** (Dart 快照中字符串是碎片化的):
```python
path = 'libapp.so'
strings = set()
current = b''
for byte in data:
    if 32 <= byte < 127:
        current += bytes([byte])
    else:
        if len(current) >= 5:
            strings.add(current.decode('ascii', errors='ignore'))
        current = b''
```

**从 libapp.so 可提取**: API 路由、服务器域名、支付字段名、第三方 SDK 信息。

### 2.4 MANIFEST.MF 分析
```bash
grep "^Name:" META-INF/MANIFEST.MF | cut -d' ' -f2-
```

## 3. API 与服务器发现

### 3.1 关键词搜索优先级
1. `https?://` / `api.` / `.com/`
2. `merchant` / `appid` / `app_key` / `secret`
3. `alipay` / `wxpay` / `payment`
4. `notify_url` / `callback` / `return_url`
5. `Bearer ` / `Authorization` / `token`

### 3.2 可疑域名特征
- 键盘随机敲击 (`qwertyuioplkjhg`, `ghjklpqmnbvcrst`)
- 随机字母数字 (`pkxhejfxu5`, `podqrwsss5`)
- 非标端口 (`:5187`, `:3547`, `:4725`)
- 配置下发 (`linesp5_pro.txt`, `MtNoticep5_pro.txt`)

## 4. 服务器探测

```bash
# 批量检测
for host in $(cat domains.txt); do
  curl -sk -o /dev/null -w "%{http_code}" --connect-timeout 5 "https://$host"
done

# 无鉴权接口
curl -sk -X POST "$API/user/guest/register" -H "Content-Type: application/json" -d '{}'
curl -sk -X POST "$API/system-config/appInfo" -H "Content-Type: application/json" -d '{}'
```

**判断后端**: 405=Method Not Allowed(接口存在), Spring Boot错误=`Jackson/HttpInputMessage/timestamp`

## 5. 动态分析

### 5.1 模拟器选型
| 模拟器 | 适合场景 |
|--------|---------|
| 物理手机 | 首选，完美支持 arm64 |
| BlueStacks | 仅 x86+armv7a |
| AVD x86 | 同上 |
| AVD arm64 | 需 ARM 硬件 |

**Windows x86 无法运行纯 arm64-v8a APK。** 直接上真机。

### 5.2 真机部署

ADB 连接后:
```bash
# MSYS路径陷阱: 推送文件必须用 Windows 原生命令
cmd //c "adb -s DEVICE_ID push C:\path\to\file /data/local/tmp/file"

# Frida (版本必须匹配!)
frida --version                                    # tools 版
# 下载对应版本 frida-server
cmd //c "adb push frida-server /data/local/tmp/fs"
adb shell "chmod 755 /data/local/tmp/fs"
adb shell "/data/local/tmp/fs -D &"                # 后台启动
```

### 5.3 Frida 限制
- 无需 root: `frida-ps -U` 可枚举进程
- 需要 root 才能 spawn: `frida -U -f package`
- SSL bypass: Hook `TrustManager` + `OkHttp CertificatePinner`

### 5.4 mitmproxy 抓包

```bash
mitmdump -p 8080 -w capture.flow
adb reverse tcp:8080 tcp:8080
adb shell settings put global http_proxy 127.0.0.1:8080
```

**Flutter 应用不遵循系统 HTTP 代理！** Dart HTTP 客户端 (dio) 忽略系统代理设置。

## 6. 支付逻辑取证要点

1. 充值 API: `/recharge/*/add`
2. 支付渠道: `payChannel` / `paywayWebview`
3. 服务器端验证 — 无法本地伪造
4. 本地存储: SharedPreferences (`isLogin`) + SQLite (`cacheObject`)

## 7. 进度报告规则

长任务每 30s 轮询：
```
sleep 30 && du -sh /path && echo "---"
process(action='poll', session_id='proc_xxx')
```

## 8. MSYS/ADB 路径陷阱

Windows git-bash 中 MSYS 自动转换路径:
- `/data/local/tmp/` → `C:/Users/.../git/data/local/tmp/` (错误!)
- 解决: `cmd //c "adb push C:\path\to\file /data/local/tmp/file"`
- 或 `MSYS_NO_PATHCONV=1` 或双斜杠 `//data/local/tmp/file`
