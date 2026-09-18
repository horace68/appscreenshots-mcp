# Tools and workflow

The hosted MCP server is the source of truth for input schemas and account permissions. Clients may prefix these names. This repository supplies workflow guidance, not an alternate API or database interface.

| Tool | Purpose |
| --- | --- |
| `get_capabilities` | Read entitlements, design bounds, devices and preview/export modes |
| `search_templates` | Search public template metadata |
| `get_template` | Read an entitled template |
| `list_projects` | List authorized projects |
| `get_project` | Read current project, revision and editable link |
| `get_project_preview` | Get the authorized editor link, revision, pages and browser review instructions (not a rendered image) |
| `create_project` | Create from a template or blank canvas |
| `update_project` | Apply structured edits with revision and idempotency protection |
| `list_assets` | List explicitly shared assets and assets in authorized projects |

A normal task reads capabilities/assets, selects an available template, creates or reads a project, edits it, inspects previews and exports. The installed [Skill](../skills/appscreenshots/SKILL.md) explains when to apply each step.

Editing supports naming, frame addition/removal/reordering, element upsert/removal, backgrounds, languages and canvas settings. Read actual tool schemas for supported fields. Prefer `patch_element` with an existing element ID and only changed fields. `upsert_element` requires full geometry and preserves omitted fields for the same type. Existing image URLs are retained server-side: do not send them back. Replace images through authorized `assetId` values. `set_background` targets one frame and preserves other frames when splitting shared backgrounds.

Every logical write uses a fresh idempotency key; reuse it for an identical retry. After a revision conflict, read the latest version and reconcile. Reusing a key with changed arguments is an error. Never use SQL, HTML or scripts as edit instructions.

Upload materials through the existing website editor, then authorize the project/assets. The nine-tool MCP does not expose binary uploads, cloud rendering, render jobs or temporary export download links.

The default review flow uses `get_project_preview` → the client's browser tools → editor screenshots → MCP corrections → fresh browser screenshots. Website login is separate from MCP authorization. Browser access is supplied by the client, not by this server or Skill. Preserve unsaved browser edits and re-read the revision before corrections. See the [browser review guide](../skills/appscreenshots/references/browser-preview.md).

Deliver the project link for the user to preview and export in the editor. If the client lacks browser/image tools, say that visual verification is pending. Preview and export use the website; no cloud-render tools are exposed. No payment, deletion, AI-image-generation or store-publishing tools are exposed by this version.
