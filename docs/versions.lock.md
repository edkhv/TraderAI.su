# Verified build toolchain

Verified against official package metadata on 20 October 2026.

- Node.js: 22.22.3 (`.nvmrc`; Astro requires at least 22.22.0).
- npm: 10.9.8.
- Astro: 7.4.1.
- TypeScript: 6.0.3 (compatible with Astro Check peer range).
- Astro Check: 0.9.11.
- Playwright: 1.64.1.
- Node type definitions and all transitive dependencies: exact versions in
  `package-lock.json`.

Official references:

- [Astro installation](https://docs.astro.build/en/install-and-setup/)
- [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/)
- [Caddy file server](https://caddyserver.com/docs/caddyfile/directives/file_server)
- [Caddy error handling](https://caddyserver.com/docs/caddyfile/directives/handle_errors)

Dependency updates should be separate, tested changes.
