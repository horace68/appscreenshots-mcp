# Client setup

Endpoint: `https://appscreenshots.net/api/mcp` · Transport: **Streamable HTTP** · Authentication: **OAuth browser sign-in**.

The hosted service must be enabled before authorization works. The repository helper only prints configuration and installs an optional Skill. Use your client's native remote connection rather than launching the helper as a stdio server.

## Claude Code

```sh
claude mcp add --transport http --scope user appscreenshots https://appscreenshots.net/api/mcp
```

Then use `/mcp` and authorize. For a project-scoped connection, merge [claude.mcp.json](../examples/claude.mcp.json) into `.mcp.json` instead of registering user scope. Do not configure both without intending a scope override. [Official MCP docs](https://code.claude.com/docs/en/mcp).

Optional Skill: `node bin/appscreenshots.mjs install-skill claude`. It uses `~/.claude/skills`; see [Claude skills](https://code.claude.com/docs/en/skills).

## Codex

```sh
codex mcp add appscreenshots --url https://appscreenshots.net/api/mcp
codex mcp login appscreenshots
```

Alternatively merge [codex.toml](../examples/codex.toml) into the client's `config.toml`, preserving other sections. [Official MCP docs](https://developers.openai.com/codex/mcp/).

Optional Skill: `node bin/appscreenshots.mjs install-skill codex`. The default is `~/.agents/skills`; a custom `CODEX_HOME` does not change this helper's skill destination. Use `--dir` for your desired directory. [Official skill locations](https://developers.openai.com/codex/skills/).

## Gemini CLI

```sh
gemini mcp add --transport http --scope user appscreenshots https://appscreenshots.net/api/mcp
```

Inside Gemini CLI, run `/mcp auth appscreenshots`. Alternatively merge [gemini.settings.json](../examples/gemini.settings.json) into `~/.gemini/settings.json`. It uses `httpUrl` for Streamable HTTP. [Official MCP docs](https://geminicli.com/docs/tools/mcp-server/).

## Kimi Code

For the current Kimi Code CLI, open `/mcp-config`, add an HTTP server with the endpoint, then use `/mcp-config login appscreenshots`. The [kimi.mcp.json example](../examples/kimi.mcp.json) can be merged into `~/.kimi-code/mcp.json`. Restart your session after adding configuration. [Current Kimi Code documentation](https://www.kimi.com/code/docs/en/kimi-code-cli/customization/mcp.html).

Older **kimi-cli** distributions have different commands and paths:

```sh
kimi mcp add --transport http --auth oauth appscreenshots https://appscreenshots.net/api/mcp
kimi mcp auth appscreenshots
```

Use these only if your installed `kimi mcp --help` exposes them. [Legacy CLI reference](https://moonshotai.github.io/kimi-cli/en/reference/kimi-mcp.html).

## ZCode

In MCP settings, add an HTTP service named `appscreenshots`, enter the endpoint, enable OAuth and complete the browser sign-in. Use the configuration interface shipped with your version. [Official MCP documentation](https://zcode.z.ai/en/docs/mcp-services).

## ChatGPT

Use your account or workspace's available custom MCP connection entry and select OAuth with the endpoint above. Availability depends on account and workspace controls. Do not invent a client ID or callback URL: use the values and registration flow supplied by the client. A public GitHub repository does not create a ChatGPT directory listing or grant distribution approval. [Official remote MCP guidance](https://developers.openai.com/apps-sdk/build/mcp-server/).

Local filesystem Skill installation does not automatically install a Skill into ChatGPT. You can use MCP without it.

## Other clients

Use native Streamable HTTP and OAuth if supported. A client supporting only local stdio or static bearer tokens cannot use these examples directly. Do not paste website cookies as a substitute. File uploads, inline image display and Skill discovery are separate client capabilities.

## Verification status

Documentation reviewed September 18, 2026. Entries below describe integration targets, **not completed end-to-end certification**.

| Client | Connection instructions | Real OAuth + create + preview + export |
| --- | --- | --- |
| Claude Code | Native HTTP + OAuth | Pending hosted-service activation |
| Codex | Native HTTP + OAuth; local command syntax checked | Pending hosted-service activation |
| Gemini CLI | HTTP + OAuth | Pending hosted-service activation |
| Kimi Code | Current TUI/config and legacy CLI documented separately | Pending hosted-service activation |
| ZCode | HTTP + OAuth settings | Pending hosted-service activation |
| ChatGPT | Account/workspace-dependent custom connection | Pending; directory distribution separate |

For each completed test record client version, date, operating system, OAuth mode, asset upload, inline preview display and export result. Never infer every client's compatibility from one protocol test.
