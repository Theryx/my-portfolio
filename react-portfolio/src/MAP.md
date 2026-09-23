---
type: Code Repository Map
title: react-portfolio/src
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src
parent: ../MAP.md
children: [components/MAP.md, data/MAP.md, lib/MAP.md, pages/MAP.md]
uses: [react-portfolio/src/components, react-portfolio/src/pages, react-portfolio/src/lib, react-portfolio/src/data, react-portfolio/src/pages/companies]
fidelity: syntax
api_hash: 71f39ca61b240dae
kids_hash: 3e602fef03d7e338
tokens: ~349
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src

<!-- radar:slot purpose max=160 -->
Application shell providing profile and company context, routing hooks, and per-page metadata.
<!-- /radar:slot -->

## API
context/CompanyContext.tsx
- function useCompany()
- function CompanyProvider(
context/ProfileContext.tsx
- function useProfile()
- function ProfileProvider(
hooks/useCountUp.ts
- function useCountUp(target: number, durationMs = 1400)
- const tick = (now: number) =>
hooks/usePageMeta.ts
- function usePageMeta(
- interface PageMeta
hooks/usePageTitle.ts
- function usePageTitle()

## Jump
- useProfile ← used by react-portfolio/src/components/Layout.tsx, react-portfolio/src/pages/About.tsx
- useCompany ← used by react-portfolio/src/pages/companies/jito/About.tsx, react-portfolio/src/pages/companies/jito/Home.tsx
- ProfileProvider · calls getProfileById, getActiveProfile, getProjectsByProfile

## Children
- [components/](components/MAP.md)
- [data/](data/MAP.md)
- [lib/](lib/MAP.md)
- [pages/](pages/MAP.md)

## Tests
- assets/img/shomi_usability_testing.png
- test/App.test.tsx
- test/CompanyJito.test.tsx
- test/CompanyPage.test.tsx
- test/ProfileContext.test.tsx
