# Multi-Agent — Hermes 多智能体体系（通用工具 + 体系编排）

> ⚠️ **2026-08-15 项目已拆分**：数模管线与协同编码管线已迁入独立仓库：
>
> | 管线 | 仓库 |
> |---|---|
> | 数模竞赛解题管线（6 阶段 + 脑暴/暴力思考 + 评委视角 + 管线 v5） | [Multi-agent-mathematical-modeling](https://github.com/xtr0928/Multi-agent-mathematical-modeling) |
> | 协同编码管线（规划→路由→编码→评审→视觉验收） | [Multi-agent-programming-pipeline](https://github.com/xtr0928/Multi-agent-programming-pipeline) |
>
> 本仓库保留：通用开发工具 skills（prisma-sqlite-patterns / cli-anything-hermes）、网安个人兴趣（apk-reverse-engineering / apk-forensics）、体系编排（SOUL.md / profiles）。拆分细则见 docs/pipelines-split-2026-08.md。

<div align="center">

![Skills](https://img.shields.io/badge/Skills-4-2563eb?style=flat-square)
![Models](https://img.shields.io/badge/Models-4-16a34a?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-6b7280?style=flat-square)

**不同模型擅长不同的事，按任务分派到最合适的 Agent，并行执行，不互相等待。**

</div>

---

## 📦 Skills 清单（4 个）

| Skill | 用途 | 位置 |
|-------|------|------|
| **prisma-sqlite-patterns** | Prisma + SQLite 安全模式（共享 DB / 中文编码 / DateTime） | `skills/software-development/prisma-sqlite-patterns/` |
| **cli-anything-hermes** | CLI-Anything 集成 | `skills/cli-anything-hermes/` |
| **apk-reverse-engineering** | APK 逆向全流程环境搭建 | `skills/software-development/apk-reverse-engineering/` |
| **apk-forensics** | APK 取证分析 | `skills/data-science/apk-forensics/` |

## 🤖 四个模型 Profile

| Profile | 模型 | 角色 |
|---------|------|------|
| **default** | DeepSeek V4 Pro | 🎯 编排者 |
| **glm-review** | GLM 5.2 | 🧠 架构师+审查员 |
| **kimi-coder** | Kimi K2.7 Coder | ⌨️ 编码员 |
| **kimi-ocr** | Kimi K3 | 👁️ 视觉守门人 |

## 📁 仓库结构

```
Multi-Agent/
├── README.md                            ← 本文件
├── SOUL.md                              ← 全局行为宪法（体系编排）
├── docs/
│   └── pipelines-split-2026-08.md       ← 三仓库拆分细则
├── profiles/
│   ├── glm-review/config.yaml
│   ├── kimi-coder/config.yaml
│   └── kimi-ocr/config.yaml
└── skills/
    ├── data-science/
    │   └── apk-forensics/               ← APK 取证
    ├── software-development/
    │   ├── prisma-sqlite-patterns/      ← Prisma + SQLite 模式
    │   └── apk-reverse-engineering/     ← APK 逆向
    └── cli-anything-hermes/             ← CLI-Anything
```

## 🚀 部署方式

```bash
# 1. 克隆仓库
git clone https://github.com/xtr0928/Multi-Agent.git

# 2. 复制 SOUL.md 到 Hermes 全局目录
cp Multi-Agent/SOUL.md ~/AppData/Local/hermes/SOUL.md

# 3. 复制 Skills 到 Hermes skills 目录
cp -r Multi-Agent/skills/* ~/AppData/Local/hermes/skills/

# 4. 复制 Profile 配置（API Key 需手动填入）
cp Multi-Agent/profiles/*/config.yaml ~/AppData/Local/hermes/profiles/<name>/

# 5. 验证 + 新开 session 加载 SOUL.md
hermes profile list
```

> ⚠️ Profile config.yaml 中的 API Key 需手动填入。此仓库不含密钥。
>
> 数模管线与编码管线的 skills 部署见各自仓库的 README。

---

## ⚖️ 许可

本仓库为个人 Agent 配置体系的存档和分享。Skills 和 SOUL.md 可自由使用和修改。Profile 配置文件中的 API 端点信息需遵守对应服务商的使用条款。
