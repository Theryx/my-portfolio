---
type: Code Repository Map
title: react-portfolio/src/lib
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/lib
parent: ../MAP.md
uses: [react-portfolio/src/pages/admin, react-portfolio/src/data]
fidelity: syntax
api_hash: 8e011a0f1ccc949d
tokens: ~332
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/lib

<!-- radar:slot purpose max=160 -->
Shared utilities for API calls, accessibility behaviour, and animation variants used across the site.
<!-- /radar:slot -->

## API
a11y.tsx
- function lightboxTrigger(open: () => void, label: string)
- also: AboutContent, Asset, BlogPost, Company, CompanyLink, MultiProfileMigrationResult, Profile, ProfileFaq, Project, ProjectBlock, ProjectCompareSide, ProjectGalleryItem, ProjectMetricItem, ProjectPhotoItem, ProjectStatCard, ProjectStepItem, SyncResult, WarehouseEntry, blogPostToEntry, changePassword, deleteAsset, deleteBlogPost, deleteCompany, deleteProfile, deleteProject, deleteWarehouseEntry
- +35 more public symbols omitted by the map budget

## Jump
- lightboxTrigger ← used by react-portfolio/src/components/ProjectSections.tsx, react-portfolio/src/pages/BlogPostDetail.tsx
- registerAsset ← used by react-portfolio/scripts/migrate-warehouse.mjs, react-portfolio/src/pages/admin/AssetPanel.tsx
- getBlogPostsByProfile ← used by react-portfolio/src/context/CompanyContext.tsx, react-portfolio/src/context/ProfileContext.tsx
