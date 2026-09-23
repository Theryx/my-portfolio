---
type: Code Repository Map
title: react-portfolio/src/pages/companies
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/pages/companies
parent: ../MAP.md
uses: [react-portfolio/src, react-portfolio/src/data, react-portfolio/src/components, react-portfolio/src/pages, react-portfolio/src/lib]
fidelity: syntax
api_hash: 86b9794d28c89366
tokens: ~294
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/pages/companies

<!-- radar:slot purpose max=160 -->
Company-branded microsites and their registry, mounting per-client case studies such as Jito.
<!-- /radar:slot -->

## API
CompanyRouter.tsx
- function CompanyRouter()
jito/About.tsx
- function About()
jito/Blocks.tsx
- function JitoMarkdown(
- function ImagePlaceholder(
- function Blocks(
jito/Home.tsx
- function Home()
jito/Site.tsx
- function Site(
- const isActive = (to: string) => pathname.startsWith(`$
jito/Work.tsx
- function Work()
jito/WorkItem.tsx
- function WorkItem()
jito/Writing.tsx
- function Writing()
jito/WritingItem.tsx
- function WritingItem()
registry.ts
- interface CompanySiteModule

## Jump
- CompanyRouter ← used by react-portfolio/src/App.tsx, react-portfolio/src/test/CompanyJito.test.tsx · calls CompanyPage, CompanyProvider, LoadingScreen
- Home ← used by react-portfolio/src/test/App.test.tsx, react-portfolio/src/App.tsx · calls useCompany, resolveProjectImage
