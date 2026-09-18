# Client setup

Endpoint: `https://appscreenshots.net/api/mcp` · Transport: **Streamable HTTP** · Authentication: **OAuth browser sign-in**.

The hosted service is live. The repository helper only prints configuration and installs an optional Skill. Use your client's native remote connection rather than launching the helper as a stdio server.

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

Merge [zcode.config.json](../examples/zcode.config.json) into `~/.zcode/cli/config.json` under `mcp.servers` (or add the HTTP service named `appscreenshots` in Settings → MCP), restart the session, and complete the OAuth browser sign-in when the client presents it. Use the configuration interface shipped with your version. [Official MCP documentation](https://zcode.z.ai/en/docs/mcp-services).

Known issue (desktop build verified 2026-09-18): the desktop client does not open the authorization URL by itself and cancels a pending authorization after roughly 180 seconds, so the sign-in page must be completed promptly once it appears; until the website's loopback registration default is deployed, the client's `127.0.0.1` callback may also be rejected at registration (see [troubleshooting](troubleshooting.md)). A verified interim path is an explicit `application_type: native` registration or a manually obtained token supplied as a static `Authorization: Bearer` header on the server entry.

Optional Skill: `node bin/appscreenshots.mjs install-skill zcode`. The default is `~/.agents/skills`, read by ZCode at startup.

## ChatGPT

Use your account or workspace's available custom MCP connection entry and select OAuth with the endpoint above. Availability depends on account and workspace controls. Do not invent a client ID or callback URL: use the values and registration flow supplied by the client. A public GitHub repository does not create a ChatGPT directory listing or grant distribution approval. [Official remote MCP guidance](https://developers.openai.com/apps-sdk/build/mcp-server/).

Local filesystem Skill installation does not automatically install a Skill into ChatGPT. You can use MCP without it.

## Other clients

Use native Streamable HTTP and OAuth if supported. A client supporting only local stdio or static bearer tokens cannot use these examples directly. Do not paste website cookies as a substitute. File uploads, inline image display and Skill discovery are separate client capabilities.

## Verification status

Documentation reviewed September 18, 2026. A native protocol test client completed OAuth with a `localhost` callback, project creation/editing, website preview and two-PNG export. A `127.0.0.1` callback is affected by the website URL normalization bug until the server fix is deployed. Entries below are integration targets, **not completed individual-client certification**.

| Client | Connection instructions | Real OAuth + create + preview + export |
| --- | --- | --- |
| Claude Code | Native HTTP + OAuth | Pending client verification |
| Codex | Native HTTP + OAuth; local command syntax checked | Pending client verification |
| Gemini CLI | HTTP + OAuth | Pending client verification |
| Kimi Code | Current TUI/config and legacy CLI documented separately | Pending client verification |
| ZCode | HTTP + OAuth settings; `config`/`install-skill` helper support | Partially verified 2026-09-18 (macOS desktop): manual native-client registration + PKCE OAuth, Bearer-authenticated initialize/tools/list and project create/edit succeeded; native in-client OAuth blocked by the client's 180-second cancel and the pending loopback fix |
| ChatGPT | Account/workspace-dependent custom connection | Pending; directory distribution separate |

For each completed test record client version, date, operating system, OAuth mode, asset upload, inline preview display and export result. Never infer every client's compatibility from one protocol test.
