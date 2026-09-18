# Troubleshooting

- **404 / service unavailable:** Run `node bin/appscreenshots.mjs doctor`. If discovery returns 404, the service has not been enabled or deployed correctly. Reinstalling the Skill will not resolve it. Do not substitute the website cookie for OAuth.
- **Helper configured as MCP command:** Remove that stdio entry and connect to `https://appscreenshots.net/api/mcp` using HTTP. The helper is an installer, not a protocol server.
- **Skill installed but tools missing:** MCP registration and browser authorization are separate. Complete the client setup, then restart the agent session.
- **Skill destination exists:** Installation deliberately refuses replacement. Compare your local changes, move the directory aside, and install again. There is no destructive `--force` flag.
- **OAuth rejected:** Restart the client's authorization flow and check the canonical endpoint. Until the website's loopback fix is deployed, a client that registers a `127.0.0.1` callback can fail because the website rewrites that host to `localhost` inside the authorization query. If the client supports choosing its callback address, register and use `localhost` consistently; do not change a registered callback midway through authorization or weaken URI validation. An organization may also restrict custom connections. Avoid sharing tokens or callback query strings in issues.
- **No projects/assets:** The connection can only see selected projects/assets. Review website Settings → Connected AI tools. Creation also needs the allow-new-projects permission and account entitlement.
- **Revision conflict:** Read the project again; reconcile with the website user's edits and use a new idempotency key for the changed request.
- **Rate/quota limit:** Respect the returned error and retry window. Project/template/export entitlements still apply; browser review does not consume a cloud-render quota.
- **Client cannot upload or inspect images:** Use the website editor and preview. Text-only confirmation does not constitute a visual check.
- **Export needed:** Open the project in the website editor and use Download. This MCP does not provide render-job download links.

For public issues include client/version, operating system, tool name, sanitized error code and reproduction steps. Never attach credentials, signed URLs, private screenshots or unpublished project contents.
