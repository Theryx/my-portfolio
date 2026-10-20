---
name: tailored-portfolio
description: Use when Ndouken shares a job description or a job link and wants a tailored portfolio for that application, asks whether a job is worth applying to, or wants to change a company portfolio site under /c/<slug>. Scores the fit against the warehouse, advises against applying below 60%, proposes existing and new projects, researches web design inspiration, and builds a one-off company mini-site with its own design.
---

# Tailored portfolio

Ndouken applies to roughly two jobs a month. Each application gets its own
portfolio mini-site at `/c/<slug>`, built from scratch with its own design and
its own selection of projects. Use the warehouse as the source of facts. The
job description decides what to show and how to tell it.

Each site is a one-off on purpose, so Ndouken can ask to move, cut or
restyle anything. Do not turn the sites into a shared template, and do not
copy another company's site and recolour it.

Work in the stages below, in order. Stop at every **Check-in** and wait for
Ndouken's answer before going on.

Keep working notes for each application in `applications/<slug>/`. That folder
is gitignored because it holds the fit analysis. Use these files:

- `job.md`: the job text, the link, and the date it was fetched.
- `fit.md`: the fit analysis.
- `projects.md`: the project plan.
- `design.md`: the design brief, with the inspiration links.

## Stage 1: Read the job

1. If Ndouken gives a link, fetch it with WebFetch, or open it in the
   built-in browser if the page needs JavaScript. Save the full text to
   `applications/<slug>/job.md`. If the page will not load, ask for the
   pasted text. Never guess what a job description says.
2. Pick a short lowercase slug, usually the company name (`spiro`,
   `mtn-cameroon`). Check `src/pages/companies/registry.ts` and the
   companies table so the slug does not collide with an existing site.
3. Pull out:
   - the company, the role title, the location and the work mode;
   - the seniority, and the languages required;
   - the must-have requirements and the core responsibilities;
   - the nice-to-haves;
   - any hard requirements, such as a degree, a number of years, a
     certification or a location.

## Stage 2: Load the warehouse

The warehouse is the single source of truth. Ndouken puts everything there:
projects, experience, skills, education, research, testimonials, bio, and
notes such as his job targets. Read all of it, not just the projects.

```bash
cd react-portfolio
npm install            # only if node_modules is missing
node scripts/export-warehouse.js ../applications/<slug>/warehouse.json
```

The export groups every entry by type (`bio`, `experience`, `skill`,
`education`, `project`, `research`, `testimonial`, `note`, `article`,
`contact`, `custom`). It also lists the companies that already exist, the
entries each one links, and the asset library.

Treat the warehouse as the only source. Do not use these as sources:

- `about_me.md`;
- old copy on the main site;
- earlier company sites;
- the hard-coded profile data in `src/data/`.

If one of those holds a fact the warehouse lacks, or disagrees with it, do not
use the fact. Tell Ndouken what is missing or conflicting, and offer to add
it to the warehouse. Add it only once he confirms it.

## Stage 3: Fit analysis

Score the job against the evidence, not against how good the job sounds.

1. List every requirement from Stage 1 and give each one a weight:
   - must-have: **3**
   - core responsibility: **2**
   - nice-to-have: **1**
2. Mark each requirement with the strongest evidence in the warehouse:
   - **Strong (1.0):** direct evidence. Name the project and what it shows.
   - **Partial (0.5):** adjacent or transferable evidence. Say why it
     transfers.
   - **None (0):** nothing in the record supports it.
3. **Fit = sum(weight × match) / sum(weight) × 100**, rounded.
4. Check the blockers separately. Each one is a reason to pause, whatever the
   score:
   - a required language, location or work mode Ndouken cannot meet;
   - a hard degree, certification or years requirement that is clearly
     missed;
   - a role family Ndouken is not targeting.

   His targets live in the warehouse note `note:job-targets`. Its metadata
   has `target_roles`, `excluded_roles` and an optional `notes` line. Always
   read the targets from there.

   If the note is missing, ask Ndouken to confirm his targets, then create the
   note. Use this content as the starting point, which he confirmed in October
   2026:
   - **target roles:** UX design, product design, product management and
     product owner, customer experience and service design;
   - **excluded roles:** digital marketing, graphic design, video and motion,
     community management, communications, teaching, unpaid internships;
   - **notes:** brand design is a strength to sell inside UX and product
     roles, not a role family to apply for.
5. Give the verdict:
   - **Below 60%: advise him not to apply.** Say so plainly. Name the two or
     three gaps that decide it, and say what would have to be true for it to
     be worth applying. Do not build anything unless he says to go ahead
     anyway.
   - **60–74%: worth applying, with gaps.** Name the gaps and how the site
     can handle them honestly.
   - **75% and above: a strong fit.**
6. Write the requirements table, the score, the blockers and the verdict to
   `fit.md`, and give Ndouken a short version.

Never round a score up to reach 60, and never count a requirement as met
because a project "could" show it.

**Check-in:** share the score, the verdict and the main gaps. Wait for him to
say go before Stage 4.

## Stage 4: Propose projects

Propose both existing and new projects. Ndouken makes the final choice.

**Existing projects.** Rank the warehouse projects by how many weighted
requirements they prove. Suggest 3 or 4. For each one, give:

- the requirements it proves;
- the angle to tell it from for this role. The same project reads
  differently for a CX lead and a product manager: look at how PaySika is
  told on the Spiro site compared with the MTN site;
- which story blocks to keep, cut or rewrite, and which images to use;
- whether it needs a per-company override (`company_entries.override_metadata`)
  or can use the warehouse story as it is.

Also say which projects you left out, and why.

**New projects.** Look for work the job asks for that has no case study yet,
but where there are signs it exists. Examples:

- a responsibility in a project's metadata that was never written up;
- an `experience`, `research`, `note` or `bio` entry that describes work with
  no case study yet;
- a requirement marked Partial that a dedicated write-up could turn into
  Strong.

For each new project, propose a title and a one-line pitch, list the facts
you already have, and **ask Ndouken for the facts you do not have**: dates,
scope, outcomes, numbers and images. Never fill gaps with invented details or
metrics.

Once he has answered, add the project to the warehouse with an
`insert-<id>.js` script modelled on `scripts/insert-lovingtech.js`. Upsert into
`warehouse_entries`, then add any assets. That way the next application can
reuse it.

Write the plan to `projects.md`.

**Check-in:** wait for Ndouken to pick the projects and supply any missing
facts.

## Stage 5: Design direction

### Look for inspiration on the web

Do this every time. Search the web for current design references before
designing anything, and tell Ndouken you are doing it.

- Search for portfolios and sites that suit the role and the industry. A
  service-design lead, a fintech product designer and a B2B product manager
  should feel different from each other.
- Good places to start: Awwwards, Godly, SiteInspire, Minimal Gallery,
  Land-book, One Page Love, Httpster, Lapa Ninja, and the personal sites of
  designers in the same field. Use WebSearch, WebFetch or the built-in
  browser.
- Choose 2 or 3 references. For each one, note the URL and the specific
  idea you are taking from it: the layout rhythm, the type pairing, the
  navigation, the way case studies open, or the loader.
- Combine ideas from the references. Never reproduce one site.

### Keep the company's branding out

The site must not look like the company's own page.

- Look up the company's brand: logo colours, typeface and visual style.
- Do not use its primary or secondary colours. Keep the accent well away
  from its brand hue, or use a neutral palette.
- Do not use its logo, its typeface, its photography or its taglines.
- Nothing should suggest the site was made by the company or for its
  careers page. It is Ndouken's site, sent to them.
- Record the company's colours in `design.md`, next to the palette you chose,
  so the difference can be checked.

### Write the design brief

Write `design.md` with:

- a concept name, like the earlier sites' concepts ("loop" for Spiro);
- the layout idea for Home, Work, a case study and About;
- the type pairing, from Google Fonts or system fonts;
- the palette, written as the `theme_config` tokens the site will use;
- the loader and motion idea;
- the references, with what each one contributes;
- which pages the site needs. Writing pages are optional, and Spiro has none.

**Check-in:** share the concept, the references and a few lines on how it will
feel. Wait for approval or changes.

## Stage 6: Build the site

Read one existing site, such as `src/pages/companies/spiro/`, to learn the
data contract. Do not reuse its design. Then create
`react-portfolio/src/pages/companies/<slug>/` with:

- **`Site.tsx`:** the shell, with nav and footer. Import `./site.css`.
- **`Loader.tsx`:** its own loading animation. It accepts `full?: boolean`.
- **`Home.tsx`, `Work.tsx`, `WorkItem.tsx`, `About.tsx`:** the pages.
- **`Writing.tsx` and `WritingItem.tsx`:** required by the router even when
  the site has no writing section. In that case, redirect them to Home and
  leave Writing out of the nav. Spiro still has a Writing page that shows
  "Nothing published yet", which is the thing to avoid.
- **`Blocks.tsx`:** renders case-study blocks. It must handle every block type
  the chosen stories use. The current set is `intro`, `stat-cards`, `metrics`,
  `steps`, `compare`, `two-col`, `gallery`, `photos`, `quote`, `embed` and
  `richtext`. Check the stories in the export for anything new.
- **`media.ts`:** image resolving through `resolveProjectImage` and
  `resolveBlogImage`.
- **`site.css`:** all styles, scoped under the site's root class so nothing
  leaks into the main site or other company sites.

Data comes from `useCompany()` in `src/context/CompanyContext.tsx`, which
returns `{ base, company, projects, posts, loading }`. Build links from
`base`, never from a hard-coded `/c/<slug>`.

Then wire it up:

1. **Register the site.** Add the slug to `companySites` in
   `src/pages/companies/registry.ts`. Use lazy imports, like the other
   entries.
2. **Write the data script.** Create `scripts/insert-<slug>.js`, modelled on
   `scripts/insert-spiro.js`:
   - the company row, with the job description stored in it;
   - `theme_config` and `seo`;
   - `application`, so the site shows up on Studio's Applications board:
     `{ "kind": "application", "stage": "building", "fit_score": <score from Stage 3> }`.
     Write it with a separate `UPDATE companies SET application = ...` after the
     insert. Move the stage to `ready` once Ndouken approves the site;
   - the hero, About and FAQ copy;
   - one `company_entries` row per chosen project, with its overrides.

   Keep the `cleanDeep` dash cleaner. Insert with `is_active = false`; that
   flag is for the main site's profile and must stay false here.
3. **Add a test.** Create `src/test/Company<Name>.test.tsx`, modelled on
   `CompanySpiro.test.tsx`. It should mock `../lib/api` and check that Home,
   Work, a case study and About render.
4. **Check the build.** From `react-portfolio`, run `npm run test:run`,
   `npm run lint` and `npm run build`. Fix anything that fails before showing
   the site.

### Previewing

The company row lives in the shared production database. As soon as the
insert script runs, `/c/<slug>` serves the generic fallback page on the live
site until the code is deployed. The slug is unlisted, but say so before
running the script.

To preview with the real API, run `vercel dev` from the repo root. Or commit to
a branch and use the Vercel preview URL. Check the site on desktop and at
phone width.

## Stage 7: Review, adjust, publish

- Show Ndouken the preview, and send a screenshot of each page.
- He will ask for changes: move a section, cut a project, change the hero,
  change the type. Make them in this site's files only. Never edit another
  company's site to make one change.
- Publishing means running the insert script, if it has not run yet, and
  merging so the site deploys. Do both only when he says it is ready. Never
  push or merge without his go-ahead.
- Afterwards, give him the live link to send with the application.

## Copy rules

These match the rules in the existing insert scripts.

- Write in the first person, in plain human sentences.
- Do not mention the company, or the fact that the site is tailored. No
  "why I'm a fit for X" or "as your next…". The site should read as
  Ndouken's portfolio that happens to show the right work.
- Do not use em dashes or en dashes anywhere. The `cleanDeep` helper replaces
  them, but write without them in the first place.
- Use only facts from the warehouse. When Ndouken gives you a new fact in the
  conversation, add it to the warehouse before using it on the site, so the
  next application has it too.
- Never invent metrics, clients, titles or dates. If a number would help but
  does not exist, leave it out or ask for it.
- Match the job's language. Write in French when the job is in French; he
  works in both.
- Keep the role title honest. Position him for the role without claiming a
  title he did not hold.
