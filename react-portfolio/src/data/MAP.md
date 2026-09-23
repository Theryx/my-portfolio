---
type: Code Repository Map
title: react-portfolio/src/data
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/data
parent: ../MAP.md
uses: [react-portfolio/src/lib]
fidelity: syntax
api_hash: 7b349d2beda67c87
tokens: ~302
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/data

<!-- radar:slot purpose max=160 -->
Typed seed content and helpers for projects, blog posts, and per-profile copy that back the CMS fallback.
<!-- /radar:slot -->

## API
blog.ts
- function resolveBlogImage(image: string | undefined): string
- interface BlogPost
profileCopy.ts
- interface AboutFaq
- interface AboutContent
- type ProjectSeed = Omit<Project, 'profile_ids'> &
- type BlogPostSeed = Omit<BlogPost, 'profile_ids'> &
- interface ProfilePreset
- function presetProfile(id: string): Profile | null
projects.ts
- function resolveProjectImage(image: string | undefined): string
- interface Project

## Jump
- resolveProjectImage ← used by react-portfolio/src/components/ProjectSections.tsx, react-portfolio/src/pages/ProjectDetail.tsx
- resolveBlogImage ← used by react-portfolio/src/pages/Blog.tsx, react-portfolio/src/pages/BlogPostDetail.tsx
- BlogPost ← used by react-portfolio/src/context/CompanyContext.tsx, react-portfolio/src/context/ProfileContext.tsx
