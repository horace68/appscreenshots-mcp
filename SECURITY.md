# Security and access scope

The helper prints public configuration, copies the bundled Skill, and optionally fetches public OAuth resource metadata. It never reads client token stores, environment files, website sessions or database credentials. There are no runtime dependencies or installation hooks.

Account authorization happens directly between the client and the hosted service. Select only intended projects/assets, and allow project creation when needed. Read access to an authorized project includes its attached assets. Revoke access in AppScreenshots Settings → Connected AI tools. Removing a local Skill or connection configuration alone is not server-side revocation. Existing signed download URLs remain valid until expiry.

Do not submit secrets, signed upload/download links, customer images or private project contents in public issues. For a vulnerability, use the repository's private vulnerability-reporting entry if available, or contact the operator through the AppScreenshots website before sharing sensitive details. Ordinary reproducible installer bugs can be reported publicly with sanitized information.

The MIT license covers repository content only. It does not license the hosted backend or private user content, waive service limits, or grant access to paid templates.
