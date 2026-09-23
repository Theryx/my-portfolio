---
type: Code Repository Map
title: react-portfolio/src/pages/admin
description: Radar source-navigation map.
map: 1
scope: react-portfolio/src/pages/admin
parent: ../MAP.md
uses: [react-portfolio/src/lib, react-portfolio/src/components, react-portfolio/src/data, react-portfolio/src/pages]
fidelity: syntax
api_hash: cf799173ae44dee8
tokens: ~334
stamped: 2026-09-23T00:05:16Z
---
# react-portfolio/src/pages/admin

<!-- radar:slot purpose max=160 -->
Admin Studio panels and form fields that edit and save profile, project, company, and asset content.
<!-- /radar:slot -->

## API
fields.tsx
- const update = (i: number, key: 'question' | 'answer', val: string) =>
forms.tsx
- const set = (k: string, v: unknown) => setForm((f) => (
- const set = (k: string, v: unknown) => setForm((f) => (
- const set = (k: string, v: string) => setForm((f) => (
- also: ArrayEditor, AssetPanel, BlockBuilder, BlogForm, CheckboxGroup, CheckboxOption, CloudinaryUploadButton, CompanyForm, CompanyPanel, FaqEditor, ImageField, JsonBlocksEditor, KVEditor, PasswordInput, ProjectForm, SecurityForm, SpeakingImagesEditor, WarehousePanel, add, addBlock, clearSlot, commit, confirmDelete, handleClick, handleSubmit, handleText, moveBlock, moveItem, onUpload, patchBlock
- +26 more public symbols omitted by the map budget

## Jump
- set ← used by react-portfolio/src/lib/api.ts, react-portfolio/scripts/migrate-warehouse.mjs
- update ← used by api/assets/index.ts, react-portfolio/scripts/migrate-warehouse.mjs
