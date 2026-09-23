---
type: Code Repository Map
title: react-portfolio/src/components
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/components
parent: ../MAP.md
uses: [react-portfolio/src/data, react-portfolio/src/lib, react-portfolio/src, react-portfolio/src/pages/admin]
fidelity: syntax
api_hash: 557e5c0776b7e82a
tokens: ~342
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/components

<!-- radar:slot purpose max=160 -->
Reusable UI components for layout, page transitions, modals, reading progress, markdown editing, and project sections.
<!-- /radar:slot -->

## API
ClickRipple.tsx
- const ClickRipple: React.FC = () =>
ErrorBoundary.tsx
- render()
MarkdownEditor.tsx
- function MarkdownEditor(
MediaEmbed.tsx
- function MediaEmbed(
PageTransition.tsx
- const PageTransition = (
ProfileLink.tsx
- function ProfileLink(
ReadingProgress.tsx
- const update = () =>
- function ReadingProgress()
ui/LoadingScreen.tsx
- function LoadingScreen()
- also: BenevolentModal, ErrorBoundary, JourneyModal, Layout, ProjectSections, closeMenu, componentDidCatch, getDerivedStateFromError, handleClick, onScroll, toggleTheme, useProfileParam, withProfile

## Jump
- PageTransition ← used by react-portfolio/src/pages/BlogPostDetail.tsx, react-portfolio/src/pages/Home.tsx
- ProfileLink ← used by react-portfolio/src/pages/BlogPostDetail.tsx, react-portfolio/src/pages/ProjectDetail.tsx
- LoadingScreen ← used by react-portfolio/src/App.tsx, react-portfolio/src/pages/companies/CompanyRouter.tsx
