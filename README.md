# AppScreenshots MCP

[简体中文](README.zh-CN.md) · [Client setup](docs/clients.md) · [Tools](docs/tools.md) · [Troubleshooting](docs/troubleshooting.md)

Let your AI agent create editable app screenshot projects, work with your authorized assets, inspect previews, and export PNG/JPEG images or ZIP bundles in [AppScreenshots](https://appscreenshots.net).

> **Preview — hosted service pending activation.** On September 18, 2026, the production OAuth discovery endpoint returned HTTP 404. You can install the skill and prepare client settings, but account authorization and screenshot creation require the hosted service to be enabled. Run `doctor` below to check discovery; no real-client end-to-end compatibility is claimed yet.

This public repository contains **connection examples, a small installation helper, and an optional agent Skill**. The MCP server runs within AppScreenshots. Website, authentication, database, billing and rendering backend code remain in their existing private deployment. The helper is not a local stdio server.

## Connect the MCP service

Remote Streamable HTTP endpoint:

```text
https://appscreenshots.net/api/mcp
```

Choose your client and follow its OAuth flow. Sign in with your AppScreenshots account, choose projects/assets, and optionally allow new projects. No database credentials or service API keys are required.

**Claude Code**

```sh
claude mcp add --transport http --scope user appscreenshots https://appscreenshots.net/api/mcp
```

Open `/mcp` in Claude Code and authorize AppScreenshots.

**Codex**

```sh
codex mcp add appscreenshots --url https://appscreenshots.net/api/mcp
codex mcp login appscreenshots
```

For Gemini CLI, Kimi Code, ZCode and ChatGPT, see [client setup](docs/clients.md). MCP is sufficient to call the tools; the Skill below provides a reusable design and preview workflow.

## Install the optional Skill

Requires Git and Node.js 20+. No npm dependencies or install hooks are used.

```sh
git clone https://github.com/horace68/appscreenshots-mcp.git
cd appscreenshots-mcp
node bin/appscreenshots.mjs install-skill codex
```

For Claude Code, replace the last line with:

```sh
node bin/appscreenshots.mjs install-skill claude
```

The installer copies `skills/appscreenshots` into `~/.agents/skills/appscreenshots` for Codex or `~/.claude/skills/appscreenshots` for Claude Code. It refuses to overwrite an existing directory. Restart the agent to discover the Skill, then use `$appscreenshots` in Codex or `/appscreenshots` in Claude Code. Connect and authorize MCP separately.

For project-local or other compatible skill hosts, choose the parent skill directory explicitly:

```sh
node bin/appscreenshots.mjs install-skill custom --dir /path/to/project/.agents/skills --dry-run
node bin/appscreenshots.mjs install-skill custom --dir /path/to/project/.agents/skills
```

Use the directory required by your client. The installer does not auto-configure other clients or modify existing MCP settings. To update a customized Skill, compare it with this repository and merge your edits; for a clean update, move the old directory aside and rerun installation. To uninstall, remove only the installed `appscreenshots` skill directory. Revoke server access separately in website settings.

## Connection helper

```sh
node bin/appscreenshots.mjs config codex
node bin/appscreenshots.mjs config claude
node bin/appscreenshots.mjs config gemini
node bin/appscreenshots.mjs config kimi
node bin/appscreenshots.mjs doctor
```

`config` prints a snippet to merge into existing settings. `doctor` checks public OAuth discovery, sends no credentials, and exits nonzero if discovery is unavailable. It does not authenticate or test rendering. The npm package name is not published to the npm registry; use this Git repository.

## Try a task

> Use my authorized screenshots to create an English App Store screenshot project. Pick an available template, keep the headlines short, inspect previews, and export the final images. Include a link so I can continue editing on the website.

If your client cannot transfer files, upload screenshots on the website first and authorize the project or individual assets. Chat attachments are not automatically available to MCP. [Tool reference](docs/tools.md) explains editing, retries, previews and downloads.

## Availability and data

Account entitlements still apply. Current initial cloud quotas are 30 rendered frames/day for Free and 300/day for paid users (UTC reset); previews also count. Cached results are reused. Downloads expire after 15 minutes; artifacts are retained for 24 hours. These limits may change; consult `get_capabilities` and the website for account-specific permissions.

Manage or revoke access in **Settings → Connected AI tools**. Already-issued signed download links can remain valid until expiry. This repository does not implement purchases, deletion, hosted AI generation or app-store publishing. [Security and scope](SECURITY.md).

## Development

```sh
npm test
npm run check
npm pack --dry-run
```

Tests exercise configuration generation, installation isolation, overwrite protection, CLI failures and discovery diagnostics. CI runs on Linux, macOS and Windows with Node.js 20 and 22. Live-client OAuth, uploads, preview display and exports still require service staging tests; see the [compatibility matrix](docs/clients.md#verification-status).

MIT license covers this repository's helper, examples and Skill; it does not grant access to the hosted service or rights to user assets, paid templates or the website backend.
