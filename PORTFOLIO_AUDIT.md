# Portfolio Audit — Ndouken Theryx
> Audited: 2026-05-23 | Last updated: 2026-05-23

---

## STATUS LEGEND
- ✅ Fixed
- ⚠️ Partially fixed — needs more work
- ❌ Not yet addressed

---

## 1. HERO / FIRST IMPRESSION

- ✅ **Status badge updated** — now reads "🟢 Open to Product Design & Design Engineering roles". Accurate and signals availability clearly.
- ✅ **Hero headline rewritten** — "Founding Designer. Fintech for Africa." is punchy and differentiated. Good call.
- ✅ **Hero subtitle improved** — "I design financial experiences people trust with their money" is specific and memorable.
- ✅ **Resume download fixed** — now links to a real PDF file with a proper download attribute.
- ✅ **Resume PDF renamed** — renamed from `Linked in Profile.pdf` to the professional filename `Ndouken_Theryx_CV.pdf`, and references updated in both static HTML and React codebases.

**Remaining issue:**
- None! All hero section items are now fully optimized.

---

## 2. COPY QUALITY

- ✅ **"#TheBestTeam" removed** from achievement tiles.
- ✅ **"Left behind a thriving team, bulletproof processes…" replaced** — new legacy line is more concrete: *"Scaled the digital product to serve thousands of active users, establishing robust design systems and high-converting onboarding funnels."*
- ✅ **Achievement tile descriptions are more specific** — moved from category labels to action-oriented outcomes.

**Remaining issue:**

- ⚠️ *"from the ground up"* is still present in the PaySika tagline: *"Building a premier mobile finance experience in Africa from the ground up."* The hero now leads well — make the tagline consistent. Something like: *"Four years building PaySika's complete product experience, from zero to thousands of users."*
- ⚠️ The phrase *"I don't just design interfaces—I understand how they are built"* in the philosophy section is unchanged. Still needs proof, not assertion. Consider replacing with a specific example of a time you coded a feature or contributed to a repo.

---

## 3. PROJECT PRESENTATION

### PaySika
- ✅ **40% / 60% stat badges added** — visible on the card with colour-coded styling. This is the right call.
- ✅ **Achievement tiles rewritten** — now action-oriented with outcomes (onboarding bottlenecks, asset handoff pipelines, etc.).
- ✅ **Legacy line updated** — more factual and credible.
- ✅ **React app tagline updated** — now leads with the metrics: *"Driving 40% user retention and 60% support ticket reduction."* Strong.
- ✅ **React app responsibilities rewritten** — specific and evidence-backed.

**Remaining issues:**

- ❌ **Design Artifacts explorer still goes nowhere.** The file names (`Tutuka_3DSecure /`, `Onboarding flow of GTP card.pdf`) are listed but still not clickable. This feature looks broken. Either add Figma links or remove the explorer entirely — it actively hurts the impression.
- ❌ **No before/after.** You resdesigned the entire product over four years. Even a single side-by-side comparison (old vs. new screen) would be the most compelling thing on the page. This is still missing.

---

### Jobsika
- ✅ **Role updated** to "Co-maintainer & Design Lead (Open Source)" — much more accurate and interesting.
- ✅ **Description rewritten** — the open-source angle (GitHub, PRs, community contributions) is a genuine differentiator and now shows properly.
- ✅ **Responsibilities are specific** — low-bandwidth accessibility, PR reviews, design parity with engineers.
- ✅ **Challenge/Solution/Result all rewritten** — now reads as a real case study entry, not a resume bullet.

**Remaining issue:**

- ⚠️ Still no visual depth — no screenshots of the interface, no link to the GitHub repo, no Figma link. The copy is now solid but unsupported by evidence. Add at least one image and a GitHub link.

---

### Matanga Agency
- ✅ **Generic copy replaced** — new description specifies client types (fintech MVPs, e-commerce), Figma component libraries, and cross-regional work.
- ✅ **Role elevated** to "Senior UI/UX Consultant" — more accurate framing.
- ✅ **Result now has a number** — "6+ successful client launches", "30% reduction in development friction."

**Remaining issue:**

- ⚠️ The "30% reduction in development friction" metric — is this real and verifiable? If you have data to back it up, great. If it's an estimate, consider softening it to *"significantly reduced"* or replacing with a metric you can actually defend in an interview. Invented numbers in portfolios are a red flag if a recruiter asks for the story behind them.
- ❌ Still no screenshots of client work. Even one anonymised client project screen would give the entry credibility.

---

### CrowdRemit
- ✅ **Period fixed** — now "Jan 2021 - June 2021". No longer shows the same month as both start and end.

**Remaining issues:**

- ⚠️ The WCAG rebrand story is the most compelling thing in this case study — it shows initiative, accessibility awareness, and a difficult judgment call. It is still buried mid-way through the write-up. Move it to the top or surface it in the card description.
- ❌ The site field is still empty (`site: ''`). If the product is live, add the URL. If it isn't, consider adding a Figma prototype link instead.

---

### Shomi
- No changes needed — remains your strongest case study. Honest, detailed, well-evidenced.

---

## 4. SKILLS SECTION

- ❌ **Not yet updated.** The 4 skill cards (Product Design, Design Leadership, Front-End Dev, Growth & Operations) are unchanged — no tools listed, no proof statements. This section still carries no evidence. Recommended fix: add 2–3 specific tools per card and one short proof line (e.g. *"Ran usability tests with 200+ users at PaySika"*).

---

## 5. NAVIGATION & STRUCTURE

- ❌ **Still 5 nav items.** No change. Consider trimming to Projects + About + Contact.
- ❌ **FAQ section unchanged.** Still feels like padding. "Do you code?" and "Do you speak French?" should be replaced with a closing statement or one testimonial.
- ⚠️ **HTML now has 5 project cards** (added CrowdRemit and Shomi) — good parity with the React app. However, CrowdRemit and Shomi are using inline SVG placeholders instead of real screenshots. These should be replaced with actual images when available.

---

## 6. DUAL CODEBASE PROBLEM

- ⚠️ **Partially improved.** The HTML and React app are more in sync now — both have 5 projects, metrics are consistent. However:
  - The PaySika period in `projects.ts` still says `Dec 2021 - Aug 2026` which is a future date. This is likely a typo — should be `Jan 2026` based on the actual end date.
  - The canonical deployment URL is still unclear. Which one do you share with recruiters?

---

## 7. WHAT'S MISSING (unchanged)

- ❌ **No photo of you on the landing page.** Still missing from the HTML version hero. Adds trust and personality immediately.
- ❌ **No social proof.** Still no testimonials, recommendations, or quotes from collaborators. One quote from a PaySika stakeholder would materially strengthen the portfolio.
- ❌ **No clear intent in the contact section.** The contact section doesn't tell visitors what you're looking for (full-time, freelance, co-founder). The status badge now says "Open to roles" — the contact section should echo this.
- ❌ **Social links still `#` placeholders** in the HTML version. LinkedIn especially — this is a trust issue.

---

## UPDATED PRIORITY FIX LIST

| Status | Priority | Fix |
|---|---|---|
| ✅ | Immediate | Update status badge |
| ✅ | Immediate | Fix resume download link |
| ✅ | Immediate | Fix CrowdRemit period |
| ✅ | High | Add 40%/60% metrics to PaySika card |
| ✅ | High | Rewrite hero headline |
| ✅ | Immediate | Rename resume PDF (currently "Linked in Profile.pdf") |
| ⚠️ | High | Fix PaySika period in projects.ts (shows future date Aug 2026) |
| ❌ | Immediate | Fix LinkedIn/social links (still `#`) |
| ❌ | High | Fix Design Artifacts explorer — link to Figma or remove |
| ❌ | High | Add a before/after comparison for PaySika |
| ❌ | High | Add photo to hero section |
| ❌ | Medium | Add proof statements to Skills section |
| ❌ | Medium | Add Jobsika screenshot and GitHub link |
| ❌ | Medium | Add Matanga client work screenshot |
| ❌ | Medium | Move WCAG rebrand story to top of CrowdRemit |
| ❌ | Medium | Add one testimonial/quote to About |
| ❌ | Medium | Clarify job-seeking intent in Contact section |
| ❌ | Medium | Replace CrowdRemit/Shomi SVG placeholders with real screenshots |
| ❌ | Low | Remove "from the ground up" from PaySika tagline |
| ❌ | Low | Rewrite philosophy section ("I don't just design interfaces…") |
| ❌ | Low | Trim nav to 3 items, replace FAQ with closing statement |

---

## OVERALL ASSESSMENT

Strong first wave of fixes — the hero is now differentiated, the PaySika metrics are visible, and the project copy across the board is materially more specific and credible. The most impactful remaining items are the social links (immediate trust issue), the Design Artifacts explorer (looks broken), and the missing before/after for PaySika (the single most compelling design story you could tell). The resume filename is a small but noticeable detail worth fixing before you share the link with anyone.
