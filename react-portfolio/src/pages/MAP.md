---
type: Code Repository Map
title: react-portfolio/src/pages
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/pages
parent: ../MAP.md
children: [admin/MAP.md, companies/MAP.md]
uses: [react-portfolio/src/lib, react-portfolio/src/components, react-portfolio/src/pages/admin, react-portfolio/src, react-portfolio/src/data]
fidelity: syntax
api_hash: 4d5d34d6b88d698a
kids_hash: 1501f342f1f7d769
tokens: ~458
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/pages

<!-- radar:slot purpose max=160 -->
Route-level pages that render the home, projects, about, blog, admin, and detail experiences.
<!-- /radar:slot -->

## API
About.tsx
- const handleImageClick = (src: string, caption: string) =>
- function About()
- const toggleFaq = (index: number) =>
Admin.tsx
- const toggleHidden = async (kind: 'project' | 'post', item: Project | BlogPost) =>
- function Admin()
Blog.tsx
- function Blog()
BlogPostDetail.tsx
- const handleImageClick = (src: string, caption: string) =>
- function BlogPostDetail()
CompanyPage.tsx
- function CompanyPage(
- const toggleFaq = (index: number) =>
Home.tsx
- function Home()
NotFound.tsx
- function NotFound()
ProjectDetail.tsx
- const handleImageClick = (src: string, caption: string) =>
- function ProjectDetail()
Projects.tsx
- function Projects()
- also: confirmDelete, duplicateProject, fetchPost, fetchProject, handleCopyEmail, handleKeyDown, handleLinkedInClick, handleMouseMove, hoverable, loadData, move, openModal, requestDelete, saveBlogPost, saveProject, splitParagraphs
- +1 more public symbols omitted by the map budget

## Jump
- toggleHidden ← used by react-portfolio/src/pages/admin/WarehousePanel.tsx · calls updateProject, updateBlogPost
- CompanyPage ← used by react-portfolio/src/test/CompanyPage.test.tsx, react-portfolio/src/pages/companies/CompanyRouter.tsx · calls getCompanyBySlug, getProjectsByProfile, getBlogPostsByProfile

## Children
- [admin/](admin/MAP.md)
- [companies/](companies/MAP.md)
