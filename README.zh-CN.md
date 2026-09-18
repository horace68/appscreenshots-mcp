# AppScreenshots MCP

[English](README.md) · [各客户端配置](docs/clients.md) · [工具说明](docs/tools.md) · [常见问题](docs/troubleshooting.md)

让 AI Agent 在 [AppScreenshots](https://appscreenshots.net) 中创建可编辑的应用商店截图项目，使用授权素材，并通过 AI 客户端的浏览器工具检查和纠正设计，最后由用户在网站预览、导出。

> **预览阶段，线上服务待开启。** 2026 年 9 月 18 日检查时，生产环境 OAuth 发现地址返回 404。现在可以安装 Skill、准备客户端配置；登录授权和制作截图需要网站先启用 MCP。运行下方 `doctor` 可检查当前发现接口状态。尚未完成各真实客户端的端到端验证。

本仓库公开**客户端接入配置、安装辅助工具和截图制作 Skill**。MCP 服务端运行在 AppScreenshots 网站后台，网站源码、数据库、计费和渲染服务仍由原项目管理。用户无需安装服务端，也无需提供数据库权限。

## 第一步：连接 MCP

服务地址：

```text
https://appscreenshots.net/api/mcp
```

Claude Code：

```sh
claude mcp add --transport http --scope user appscreenshots https://appscreenshots.net/api/mcp
```

进入 Claude Code，运行 `/mcp` 并完成浏览器授权。

Codex：

```sh
codex mcp add appscreenshots --url https://appscreenshots.net/api/mcp
codex mcp login appscreenshots
```

登录 AppScreenshots，勾选允许访问的项目和素材，并决定是否允许创建项目。Gemini CLI、Kimi Code、ZCode、ChatGPT 的方式见[客户端说明](docs/clients.md)。普通用户无需填写 API Key。

## 第二步：安装 Skill（可选）

MCP 提供工具调用能力；Skill 指导 AI 如何设计、保留已有元素、处理冲突、检查预览和交付结果。只连接 MCP 也能使用服务。

需要 Git 和 Node.js 20 或以上，无需安装 npm 依赖：

```sh
git clone https://github.com/horace68/appscreenshots-mcp.git
cd appscreenshots-mcp
node bin/appscreenshots.mjs install-skill codex
```

Claude Code 用户将最后一行改为：

```sh
node bin/appscreenshots.mjs install-skill claude
```

安装位置分别为 `~/.agents/skills/appscreenshots` 和 `~/.claude/skills/appscreenshots`。安装器不会覆盖已有目录，也不会修改其他客户端配置。重启 Agent 后，在 Codex 使用 `$appscreenshots`，在 Claude Code 使用 `/appscreenshots`。Skill 安装不会自动完成 MCP 授权。

其他兼容客户端或项目级安装，可指定其技能父目录：

```sh
node bin/appscreenshots.mjs install-skill custom --dir /你的项目/.agents/skills --dry-run
node bin/appscreenshots.mjs install-skill custom --dir /你的项目/.agents/skills
```

目录要求以相应客户端为准。更新前保留自己对 Skill 的修改，移走旧目录后重新安装；卸载时只删除安装位置的 `appscreenshots` 目录。移除 Skill 不会撤销 OAuth 授权。

## 配置输出与诊断

```sh
node bin/appscreenshots.mjs config codex
node bin/appscreenshots.mjs config claude
node bin/appscreenshots.mjs config gemini
node bin/appscreenshots.mjs config kimi
node bin/appscreenshots.mjs doctor
```

`config` 只输出配置片段，请合并到现有配置，不要覆盖整个文件。`doctor` 不发送登录凭据，只检查 OAuth 发现接口；失败时返回非零退出码。本仓库的安装器不是 stdio MCP 服务，不能填写到 MCP 的 `command` 字段。尚未发布 npm 注册表包，请使用 GitHub 仓库安装。

## 开始制作

> 使用我授权的截图素材，从可用模板创建一组英文 App Store 截图。标题简短、布局清晰。使用可用的浏览器工具打开项目编辑器，截图检查并纠正文案溢出、裁切和布局问题；复查后给我项目链接，我在网站导出。

不支持文件传输的客户端，请先在网站上传素材，再授权项目或单独勾选素材。聊天附件不会自动变成 MCP 可读取的图片。浏览器能力由 AI 客户端提供，安装 Skill 不会自动增加浏览器工具。AI 能操作浏览器时，会打开编辑器、截图检查、通过 MCP 修改并重新截图复查；浏览器可能需要你单独登录网站。如果客户端不能操作浏览器或看图，会明确告知尚未完成视觉检查，由你在网站检查预览。

默认流程不需要云端渲染服务：MCP 保存项目，AI 用自己的浏览器工具检查，用户在网站编辑器导出。项目、模板和导出套餐权益仍然生效。详细流程见 [浏览器检查指引](skills/appscreenshots/references/browser-preview.md)。

在网站 **设置 → Connected AI tools** 调整或撤销授权；已经签发的下载链接在到期前仍可能有效。首版不开放购买、删除、站内 AI 生图或应用商店发布。

## 开发与许可

```sh
npm test
npm run check
npm pack --dry-run
```

MIT 许可适用于本仓库的接入工具、示例和 Skill，不包含网站后台、付费模板、用户素材或托管服务的使用权益。真实客户端兼容性见[验证记录](docs/clients.md#verification-status)。
