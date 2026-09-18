# Tools and workflow

The hosted MCP server is the source of truth for input schemas and account permissions. Clients may prefix these names. This repository supplies workflow guidance, not an alternate API or database interface.

| Tool | Purpose |
| --- | --- |
| `get_capabilities` | Read entitlements, design bounds, devices and cloud frame limits |
| `search_templates` | Search public template metadata |
| `get_template` | Read an entitled template |
| `list_projects` | List authorized projects |
| `get_project` | Read current project, revision and editable link |
| `create_project` | Create from a template or blank canvas |
| `update_project` | Apply structured edits with revision and idempotency protection |
| `list_assets` | List explicitly shared assets and assets in authorized projects |
| `create_asset_upload` | Obtain a temporary PUT URL for a PNG/JPEG/WebP image |
| `complete_asset_upload` | Validate the upload and attach it to the project |
| `request_render` | Queue preview or final PNG/JPEG rendering |
| `get_render_job` | Poll job state, inspect a preview frame, obtain downloads |

A normal task reads capabilities/assets, selects an available template, creates or reads a project, edits it, inspects previews and exports. The installed [Skill](../skills/appscreenshots/SKILL.md) explains when to apply each step.

Editing supports naming, frame addition/removal/reordering, element upsert/removal, backgrounds, languages and canvas settings. Read actual tool schemas for supported fields. Element upsert replaces the whole element. Use IDs returned by the server and preserve unrelated fields.

Every logical write uses a fresh idempotency key; reuse it for an identical retry. After a revision conflict, read the latest version and reconcile. Reusing a key with changed arguments is an error. Never use SQL, HTML or scripts as edit instructions.

Uploads require a client able to PUT raw file bytes. Otherwise upload through the website. Preview jobs may wait approximately a minute before processing. Honor the returned polling interval; a queued job is not a finished export. `previewFrame` selects the image to inspect in a completed preview job.

Final multi-frame export requires the account's batch-export entitlement. ZIP packaging is automatic when applicable. Temporary links can be renewed while artifacts remain available. No payment, deletion, AI-image-generation or store-publishing tools are exposed by this version.
