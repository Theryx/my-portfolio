---
type: Code Repository Map
title: api
description: Radar source-navigation map.
map: 1
scope: api
parent: ../MAP.md
uses: [react-portfolio/src/components, react-portfolio/src/pages/admin]
fidelity: syntax
api_hash: d2a78eebf07b37e0
tokens: ~349
stamped: 2026-09-23T00:05:16Z
---
# api

<!-- radar:slot purpose max=160 -->
Serverless API routes and shared helpers that authenticate the admin, validate payloads, and persist portfolio content in Neon Postgres.
<!-- /radar:slot -->

## API
_lib/auth.ts
- function requireAuth(req: IncomingMessage): void
- function verifyAuth(req: IncomingMessage): boolean
- function getJwtSecret(): string
_lib/db.ts
- function getDb(): NeonQueryFunction<false, false>
- function ensureSchema(): Promise<void>
_lib/validate.ts
- function isId(v: unknown): boolean
- function validateCompanyBody(b: Record<string, unknown>): string | null
- function validateWarehouseEntryBody(b: Record<string, unknown>): string | null
- function validateAssetBody(b: Record<string, unknown>,
- function isShortText(v: unknown,
- function isLongText(v: unknown): boolean
- function isStringArray(v: unknown): boolean
- function isProfileIdList(v: unknown,
- function isAboutContent(v: unknown): boolean
- function isContentBlocks(v: unknown): boolean
- also: handler, isCompanyLinks, isIdList, isJsonObject, side, validateBlogBody, validateProfileBody, validateProjectBody
- +10 more public symbols omitted by the map budget
