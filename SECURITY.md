# Security boundary

This repository contains a public static presentation and a synthetic teaching
example. It cannot execute trades, load models, accept credentials or connect to
a broker. Passing demo checks only changes the in-memory presentation.

The website has no lead API, authentication, cookies, analytics SDK or persistent
browser storage. Hosting providers still handle network requests and may keep
operational logs. External contact links are user-initiated.

## Report an issue

Use [lred@list.ru](mailto:lred@list.ru) for a confidential security report. Do not
include passwords, account information, customer data or exploitable details in
a public issue. No automated messages are sent by this project.

## Supply and publication controls

- Exact package versions and lockfile.
- CI with read-only repository permission and no deployment secrets.
- Unit tests for fail-closed demonstration behavior and immutable proposals.
- Output audit for external resources, source maps, data files and private paths.
- Browser tests for responsive layout, no unexpected requests, and 404 behavior.
- Only the static output is uploaded to hosting; repository files stay outside
  the document root.

Pattern matching does not prove absence of all confidential information.
Human review of content and the complete candidate history remains necessary.

## Non-goals

The demo is not a production risk engine, trading strategy, financial
recommendation or a specification sufficient to operate customer accounts.
Production security, tenant isolation, permissions, manual confirmation,
reconciliation and legal readiness require separate implementation and review.
