# OpenScore — Multi-Agent 协同编程体系

> 一套基于 Hermes Agent 的多模型协作架构，包含代码编写与数学建模的工作流

<div align="center">

![Skills](https://img.shields.io/badge/Skills-30-2563eb?style=flat-square)
![Models](https://img.shields.io/badge/Models-4-16a34a?style=flat-square)
![Architectures](https://img.shields.io/badge/Architectures-7-e11d48?style=flat-square)
![Contests](https://img.shields.io/badge/Contests-MCM%2FCUMCM-8b5cf6?style=flat-square)
![Benchmark](https://img.shields.io/badge/Benchmark-55%E9%A2%98%E5%AE%9E%E6%B5%8B-2ea44f?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-6b7280?style=flat-square)

**不同模型擅长不同的事，按任务分派到最合适的 Agent，并行执行，不互相等待。**

</div>

> 如何快速部署：下载安装包以后丢给ai，“你给我部署好这个”，就可以了(

---

## 🏗️ 五套核心架构

### 1. math-brainstorm — 数模三人脑暴

快速发散，收集不同模型的独立见解。

```
GLM 5.2 + DeepSeek V4 + Kimi K3 → 并行构思
    → 每完成一方立即展示方案 + 优缺点
    → 三方汇总：共识 / 差异 / 优先级排序
    → 用户审阅后再进入编码
```

- **场景**："给个思路""怎么建模""方案设计"
- **深度**：★☆☆（1 轮发散）
- **时间**：约 6 分钟

### 2. brute-force-think — 暴力思考迭代求解

多轮互评、吸收优点、迭代收敛。

```
Round 0: 三方独立深度思考
Round 1: 三向交叉互评（GLM↔DeepSeek↔Kimi）
Round 2: 基于反馈修订方案
Round 3: 收敛判断（差异 <20%），不收敛最多 3 轮
```

- **场景**："正式解题""竞赛求解""深度分析"
- **深度**：★★★（多轮迭代）
- **时间**：约 15 分钟

### 3. multi-agent-pipeline — 多 Agent 协同编程流水线 ⭐

将编码任务拆成分析→编码→审查→集成四阶段，每个阶段用最合适的模型。

```
Phase 1: GLM (代码架构) + Kimi K3 (UI视觉架构) 并行分析
Phase 2: Kimi K2.7 逐文件编码（独立文件并行、依赖文件串行）
Phase 3: GLM (代码审查) + Kimi K3 (browser_vision截图对比) 并行审查
Phase 4: DeepSeek 汇总两类意见 → 应用修复 → 集成验证
```

- **Kimi K3 视觉审查触发条件**：HTML/CSS/SVG/图表生成代码/图片文件
- **10+ 文件策略**：仅 Phase 1，跳过 Phase 2-3，Solo 编码（context 成本 > 并行收益）
- **GLM 特殊降级**：30s 无输出 → 重启一次 → 再 30s 仍无输出 → kill 切 Solo

### 4. mathmodel-v2-pipeline — 数模竞赛全流程融合架构 ⭐ NEW

> 吸收 12+ 开源数模 Agent 项目与泛竞赛/科研 Agent 经验后的理想编排，产出可直接提交的论文（DOCX/PDF）。

```
PHASE -1  模式选择   —— 全自动暴力解题 or 逐题人工把关？→ mode.json
PHASE 0   六维选题   —— 数学类型/数据可得/算法复杂度/评价清晰度/写作难度/团队匹配
PHASE 1   问题解析   —— 题目结构化 / 问题分类 / 数据画像（三线并行）
PHASE 2   建模辩论   —— 建模手 A/B/C + 假设官 → 收敛门（差异<20%，≤3 轮）
PHASE 3   编码求解   —— 写→跑→修（≤30 轮）+ 反思器 + 完成度检查 + 基线对照
PHASE 3.5 基准反馈   —— 交叉验证 vs 基线 ⟲ 不达标回环 PHASE 2（≤2 轮）
PHASE 4   证据链     —— 🔢数值验证 → 🔏证据门禁(SHA-256) → 🛡诚信门控(7类) → 👁K3视觉审查
PHASE 5   论文写作   —— 论文手(全局) + 微单元扩写 → final_paper_source.md
PHASE 6   评审门禁   —— 五人评审团(≥65 分) + 🔍格式门禁 + Rebuttal 修订(≤3 轮)
PHASE 7   排版交付   —— LaTeX→OMML 原生公式 + 三线表 → DOCX/PDF + 提交包 ZIP
```

- **双模式**：Autopilot（全自动暴力解题）/ Manual（Friendly Mode 编号选项人工把关）
- **环形架构**：内部基准反馈环——结果质量驱动迭代，不是单向流水线
- **确定性验证**：数值验证门禁（随机采样/sympy 符号比对）取代 LLM 自查，「可证性 > 概率性」
- 详见 `skills/data-science/mathmodel-v2-pipeline/SKILL.md`

### 5. APK 取证模式

针对 Android APK 逆向工程的专业工作流。

```
反编译 (Apktool + JADX) → DEX 提取
    → 线索提取：API 端点、支付地址 (BTC/ETH/TRX)、服务器域名
    → 动态分析：Frida Hook + mitmproxy 抓包
    → 支付取证：付费逻辑、收款地址
```

- **场景**："APK 分析""APK 取证""逆向"
- **关键规则**：ZIP 伪加密 → zlib.decompress / MSYS 路径 → cmd //c 绕过 / Flutter APP → VPN 代理

### 6. mathmodel-pipeline-v3 — 数模管线执行手册（全题型实证版）⭐ NEW

> **55 题全量实战批测驱动升级**：2016-2025 全部真题独立求解 + 七维评委打分（平均 80.4，O×2/M×47/H×6），用真实失败数据反推硬规则。

```
实战发现（54 份报告统计）：
  🔴 灵敏度不完整 93% → 规则C: ≥6参数 × ±20% 完整矩阵 + 排序稳健性声明
  🔴 无真实数据 91%   → 规则D: 无数据题三选一辩护（官方数据/合成+锚点/机理+解析互证）
  🔴 假设辩护弱 87%   → 规则E: 自查清单纳入交付物（七维自评+HARD FAIL十项+数字核对）
  🔴 图密度 100% 不足 → 规则B: 图密度门禁 ≥5 张（O奖均值21图），每图编号+引用+结论标题
  🟡 交付中断 ~20%   → 规则A: 交付优先序反转（先报告框架→建模→补图），2022B 补报告 43→70 分
```

- **全题型六路线判别**：A机理/B工程/C数据/D网络/E环境/F社科 → 路线决定建模方法（437 篇 O 奖实证）
- **O 档配方**（2017D/2021D 两个 91 分反推）：真数据 + 双模型互证（偏差<5%）+ 外部锚点验证 + 核对脚本 + 图≥5
- 详见 `skills/data-science/mathmodel-pipeline-v3/SKILL.md`（含流程图 flowchart.html/png）

### 7. mathmodel-judge-perspective — 数模评委视角评价 ⭐ NEW

> **站在评委立场反向审视论文**：437 篇 O 奖全量精读（2012-2025 全题型，18 组 287KB 笔记）+ 官方评审指南实证 + 55 题实战校准。

```
七维评分体系（权重经验估计）：
  摘要15% / 建模25% / 完整性20% / 验证15% / 写作10% / 图表10% / 创新5%
HARD FAIL 红线（任一命中直接降档）：
  🔴 编造数据/引用不实 / 摘要正文数字不一致 / 子问题漏答
  🔴 仅1模型无基线对照 / 摘要零数字 / 灵敏度只声明不量化（437篇实证铁律）
16/16 组全票铁律：多模型互证100% / 数字摘要100% / 验证弱100% / 数据缺100%
```

- **美赛+国赛双视角**：美赛四段式摘要 vs 国赛逐问回答式（2015A 特等奖实证）
- **评分校准**：真数据+双模型+锚点+核对脚本 → 85+ 起评；仅合成数据+灵敏度齐全 → 78-82
- 详见 `skills/data-science/mathmodel-judge-perspective/SKILL.md`

---

## 🤖 四个模型 Profile

| Profile | 模型 | 角色 | 核心能力 |
|---------|------|------|---------|
| **default** | DeepSeek V4 Pro | 🎯 编排者 | 派发任务、汇总结果、集成验证、最终交付 |
| **glm-review** | GLM 5.2 | 🧠 架构师+审查员 | 项目架构分析、数学推理、代码逻辑审查 |
| **kimi-coder** | Kimi K2.7 Coder | ⌨️ 编码员 | 代码生成（仅编码，禁用推理） |
| **kimi-ocr** | Kimi K3 | 👁️ 视觉守门人 | UI/视觉架构分析、browser_vision 截图对比审查 |

**混用禁区**：Kimi K3 视觉审查 ≠ K2.7 编码，绝不能互换。

---

## 📦 Skills 清单（30 个）

### 🏗️ 自建核心架构

| Skill | 用途 | 位置 |
|-------|------|------|
| **mathmodel-v2-pipeline** ⭐ | 数模竞赛全流程融合架构 v2.2（双模式/反馈环/确定性验证） | `skills/data-science/mathmodel-v2-pipeline/` |
| **mathmodel-pipeline-v3** ⭐ | 数模管线执行手册 v3.1（55 题实战批测驱动：交付优先序/图密度≥5/灵敏度矩阵/数据辩护） | `skills/data-science/mathmodel-pipeline-v3/` |
| **mathmodel-judge-perspective** ⭐ | 数模评委视角评价 v2.1（437 篇 O 奖精读 + 七维评分 + HARD FAIL 红线） | `skills/data-science/mathmodel-judge-perspective/` |
| **multi-agent-pipeline** | 多 Agent 协同编程流水线（v2，含 Kimi K3） | `skills/multi-agent-pipeline/` |
| **math-brainstorm** | 数模三人脑暴 | `skills/data-science/math-brainstorm/` |
| **brute-force-think** | 暴力思考迭代收敛 | `skills/data-science/brute-force-think/` |
| **apk-forensics** | APK 取证分析 | `skills/data-science/apk-forensics/` |
| **apk-reverse-engineering** | APK 逆向全流程环境搭建 | `skills/software-development/apk-reverse-engineering/` |

### 📐 数模工作流全家桶（6 阶段链）

| Skill | 阶段 | 用途 |
|-------|------|------|
| **1start-mathmodel** | ① 启动 | 生成 plan.md + todo.md |
| **2analysis-modeling** | ② 分析 | 赛题分析与建模设计 |
| **3coding-visual** | ③ 编码 | 代码实现 + 数据图表 |
| **4drawio** | ③ 作图 | 流程图/架构图 |
| **5writing** | ④ 论文 | Typst/LaTeX 撰写（含步骤 0.5 环境预检硬规则） |
| **6verity** | ⑤ 验收 | 结构/数值/编译/视觉验收 |
| **doctor** | 🔧 | 环境诊断修复 |
| **typst-author** | 📝 | Typst 排版 |
| **mathmodel-figure-templates** | 🎨 | 科研图表模板 |
| **_references** | 📋 | 共享规范知识库 |

### 🔧 软件工程工具

| Skill | 用途 |
|-------|------|
| **multi-model-orchestration** | 多模型编排参考文档 |
| **hermes-model-management** | 模型配置与 API 密钥管理 |
| **prisma-sqlite-patterns** | Prisma + SQLite 安全模式（共享 DB / 中文编码 / DateTime） |
| **cli-anything-hermes** | CLI-Anything 集成 |

---

## 📜 SOUL.md — 全局行为宪法

`SOUL.md` 是每次新对话加载的 system prompt，定义了 Agent 的全部行为规范。296 行，14KB，23 个章节。

### 三层防线设计

```
第一层（预防层）→ clarify 结构化确认 + 老练程序员守则 + 30s 进度透明度
    ↓ 防止用户生气
第二层（检测层）→ 逃生口模糊匹配情绪信号
    ↓ 识别不满
第三层（止损层）→ 切 Solo，零依赖直接出活
```

### SOUL.md 核心规则速览

| 规则 | 说明 |
|------|------|
| **编码前确认** | 未授权时用 `clarify` 工具逐条确认需求（附带方案优缺点 + 保留"其他"选项） |
| **老练程序员守则** | 不乱加功能、不乱改文件、最小改动、尊重现有代码、先问后做、改完即止 |
| **30s 进度汇报** | 每 30 秒 poll 并输出 `⏳/✅` 状态，禁止静默执行 |
| **delegate_task 优先** | 3+ 独立任务优先用 delegate_task（隔离上下文并行，不阻塞主进程） |
| **GLM 30s 降级** | GLM 派发后 30s 无输出 → 重启一次 → 再 30s 无输出 → kill 切 Solo |
| **10+ 文件策略** | 仅执行 Phase 1 架构分析，跳过 Phase 2-3，Solo 编码 |
| **不编造结果** | 三重防线：上下文规范 + 验证闭环 + 交付标准——编造 = 交付失败 |
| **Kimi Bug 清单** | 5 个已知 bug 写完自动检查（Prisma 解构、queryRaw 插值等） |
| **SOUL.md 同步规则** | 架构/模型/Skill/Profile 变更 → 立即同步更新 SOUL.md |

---

## 🔄 架构选择逻辑

| 用户意图 | 选用架构 | 说明 |
|---------|---------|------|
| "给个思路""怎么建模""方案设计" | math-brainstorm | 1 轮并行脑暴 |
| "正式解题""竞赛求解""深度分析" | brute-force-think | 多轮迭代收敛 |
| **"数模全流程""从题到论文""自动写论文"** | **mathmodel-v2-pipeline ⭐** | **10 阶段融合架构（双模式/反馈环/确定性验证）** |
| "写代码""实现""开发""重构" | multi-agent-pipeline | 4 阶段流水线 |
| **10+ 文件重写/重构** | **仅 Phase 1** | context 成本 > 并行收益 |
| "全流程""从题到论文" | 6 阶段 Pipeline | 分析→编码→画图→论文→验收 |
| "APK 分析""APK 取证""逆向" | apk-forensics 模式 | 反编译→线索→动态→支付 |

---

## 🛠️ 浏览器工具使用规范

Kimi K3 视觉审查依赖浏览器工具：

| 工具 | 用途 | 时机 |
|------|------|------|
| `browser_navigate` | 打开页面 | 服务启动后 |
| `browser_snapshot` | 获取文本结构（快速、低成本） | DOM 检查首选 |
| `browser_vision` | 截图分析 | 仅 Kimi K3 视觉审查时 |
| `browser_console` | JS 错误/日志 | 前端排错 |

**硬规则**：截图前等 1-2s 确保渲染完成 / snapshot 优先 / 每次截图附带对比基准。

---

## 🪟 Windows 环境注意事项

本体系针对 Windows + git-bash (MSYS) 环境优化：

- **路径转换**：MSYS 自动转换可能破坏 adb 命令 → `cmd //c` 绕过
- **进程管理**：`taskkill //F //PID`，**绝对禁用** `//IM node.exe`（会杀 Hermes）
- **中文编码**：Windows SQLite 参数化传中文乱码 → `$executeRawUnsafe` 嵌 SQL
- **路径写法**：patch/write_file 用 Windows 绝对路径 `C:\Users\...`

---

## 📁 仓库结构

```
openscore/
├── README.md                         ← 本文件
├── SOUL.md                           ← 全局行为宪法（296行）
├── docs/
│   └── batch-55-scores-2026-08.md    ← 55题全量实战批测成绩单
├── profiles/
│   ├── glm-review/config.yaml        ← GLM 5.2 配置
│   ├── kimi-coder/config.yaml        ← Kimi K2.7 配置
│   └── kimi-ocr/config.yaml          ← Kimi K3 配置
└── skills/
    ├── multi-agent-pipeline/         ← 核心架构（v2，25 references）
    │   ├── SKILL.md
    │   └── references/              ← 实战经验沉淀库
    ├── data-science/
    │   ├── mathmodel-v2-pipeline/    ← 数模全流程融合架构（v2.2 ⭐）
    │   ├── mathmodel-pipeline-v3/    ← 数模管线执行手册（v3.1 ⭐，含流程图）
    │   ├── mathmodel-judge-perspective/ ← 数模评委视角（v2.1 ⭐）
    │   ├── math-brainstorm/          ← 数模脑暴
    │   ├── brute-force-think/        ← 暴力思考
    │   ├── apk-forensics/            ← APK 取证
    │   ├── 1start-mathmodel/         ← 数模启动器
    │   ├── 2analysis-modeling/       ← 分析建模
    │   ├── 3coding-visual/           ← 编码+图表
    │   ├── 4drawio/                  ← 流程图
    │   ├── 5writing/                 ← 论文撰写（环境预检 + LaTeX QA references）
    │   ├── 6verity/                  ← 验收
    │   ├── doctor/                   ← 环境诊断
    │   ├── typst-author/             ← Typst 排版
    │   ├── mathmodel-figure-templates/ ← 图表模板
    │   └── _references/             ← 共享规范
    ├── software-development/
    │   ├── multi-model-orchestration/
    │   ├── hermes-model-management/
    │   ├── prisma-sqlite-patterns/
    │   └── apk-reverse-engineering/
    └── cli-anything-hermes/
```

---

## 🚀 部署方式

### 前置条件

- Hermes Agent Desktop 已安装
- 四个 Profile 已配置：`hermes profile list` 应显示 `default / glm-review / kimi-coder / kimi-ocr`
- **（可选但推荐）LaTeX 编译环境**：数模论文排版需要。无 LaTeX 时 5writing 的步骤 0.5 环境预检会自动检测并引导安装 MiKTeX 便携版（见 `skills/data-science/5writing/references/latex-mcm-compile-qa.md`，清华镜像两步安装，免管理员）；临时兜底可用 Edge headless 打印 HTML → PDF

### 安装步骤

```bash
# 1. 克隆仓库
git clone <repo-url> openscore

# 2. 复制 SOUL.md 到 Hermes 全局目录
cp openscore/SOUL.md ~/AppData/Local/hermes/SOUL.md

# 3. 复制 Skills 到 Hermes skills 目录
cp -r openscore/skills/* ~/AppData/Local/hermes/skills/

# 4. 复制 Profile 配置（需要手动填入 API Key）
cp openscore/profiles/glm-review/config.yaml ~/AppData/Local/hermes/profiles/glm-review/
cp openscore/profiles/kimi-coder/config.yaml ~/AppData/Local/hermes/profiles/kimi-coder/
cp openscore/profiles/kimi-ocr/config.yaml ~/AppData/Local/hermes/profiles/kimi-ocr/

# 5. 验证
hermes profile list
# 应显示: default, glm-review, kimi-coder, kimi-ocr 四个 Profile

# 6. 新开 session（/reset）加载 SOUL.md
```

> ⚠️ Profile config.yaml 中的 API Key 需手动填入。此仓库不含密钥。

---

## 📊 设计演进历程

| 时间 | 里程碑 |
|------|--------|
| 2026-07-02 | 安装 Hermes Desktop，搭建 multi-agent-pipeline v1 |
| 2026-07-02 | 安装数模工作流全家桶（10 个 skill），设计 6 阶段论文流水线 |
| 2026-07-02 | 完成 MCM Problem C 完整解题（Task 1-4 建模思路） |
| 2026-07-02 | 编写 SOUL.md 全局宪法，定义三架构选择逻辑 |
| 2026-07-11 | 实战 ColorTransfer 项目（Flask + Kimi OCR + HLS） |
| 2026-07-11 | 加入"编码前确认原则"+"老练程序员守则" |
| 2026-07-15 | 搭建 APK 取证环境（JADX/Apktool/Frida/mitmproxy） |
| 2026-07-15 | 完成首个 APK 逆向取证实战（支付逻辑 + API 渗透测试） |
| 2026-07-20 | Kimi K2.6 → K3 模型升级 |
| 2026-07-20 | 安装 CLI-Anything 集成 |
| 2026-07-27 | multi-agent-pipeline v2：Kimi K3 接管多模态视觉审查 |
| 2026-07-27 | SOUL.md 大规模审计修复（9 项 P1/P2 缺陷修复） |
| 2026-08-04 | SOUL.md 瘦身 14KB→6KB 任务路由版；新增开发前调研硬规则 |
| 2026-08-09 | **mathmodel-v2-pipeline：数模全流程融合架构 v2.2**（调研 12+ 开源项目后沉淀：双模式/基准反馈环/数值验证门禁/五人评审团） |
| 2026-08-10 | **评委 skill v1.0→v2.0 全题型版：437 篇 O 奖论文全量精读**（2012-2025，18 组 287KB 笔记；多模型互证/数字摘要/验证弱/数据缺 100% 铁律；HARD FAIL 扩展 10 项；题型差异速查 A-F） |
| 2026-08-11 | **管线 v2.3→v3.0：六路线判别 A-F + 评审权重校准**（84→437 篇全量精读驱动，网络科学路线细化 2-A1~2-A6，数据预处理独立成章，多模型对比强制） |
| 2026-08-12 | **🔥 55 题全量实战批测（管线 v3.1）**：2016-2025 全部真题独立求解 + 评委打分（平均 80.4，O×2），真实失败数据反推 6 条硬规则（交付优先序/图密度≥5/灵敏度矩阵/数据辩护/自查清单/分步落盘）——成绩单见 `docs/batch-55-scores-2026-08.md` |
| 2026-08-12 | **🔥 实战验证闭环**：用 v2 架构 + 管线 v3.1 独立求解 2026 MCM Problem C（DWTS 粉丝投票反演），产出 19 页 LaTeX 模板论文；评委 skill v2.1 自评 92/100（O 档候选），发现并修复 4 类排版问题（代码块黑底/孤立页/图内中文/TotalPages） |
| 2026-08-12 | **5writing 新增步骤 0.5 环境预检硬规则**：排版前强制检查 LaTeX/Typst 工具与模板可用性（缺则按 references 装 MiKTeX 便携版）；沉淀 LaTeX 编译 QA 全流程（黑底 bug/孤立页/数字一致性/Edge 兜底） |

---

## ⚖️ 许可

本仓库为个人 Agent 配置体系的存档和分享。Skills 和 SOUL.md 可自由使用和修改。Profile 配置文件中的 API 端点信息需遵守对应服务商的使用条款。
