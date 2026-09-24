// Per-profile content presets.
//
// These are AI-generated draft proposals for each persona, intended to be
// reviewed and refined by the portfolio owner before publication. They are:
//
//   1. Rendered as the offline/static fallback for each profile
//      (see fallbackProfiles in lib/api.ts).
//   2. Available to be pushed to the database via the "Apply suggested
//      content" button in Studio (CMS) — projects/posts with matching ids
//      are NOT overwritten, so any field already edited in the CMS is safe.
//
// Profile ids covered: product-design, design-engineer, digital-marketing,
// project-manager, brand-designer. The `default` profile is intentionally
// absent — the owner has already curated it.

import type { Profile, Project, BlogPost } from '../lib/api';

export interface AboutFaq {
  question: string;
  answer: string;
}

export interface AboutContent {
  speakingIntro?: string;
  faqs: AboutFaq[];
}

export type ProjectSeed = Omit<Project, 'profile_ids'> & { profile_ids?: string[] };
export type BlogPostSeed = Omit<BlogPost, 'profile_ids'> & { profile_ids?: string[] };

export interface ProfilePreset {
  profile: Omit<Profile, 'id' | 'about_content'>;
  social_links: Record<string, string>;
  projects: ProjectSeed[];
  blogPosts: BlogPostSeed[];
  about: AboutContent;
}

// ─── Shared building blocks ──────────────────────────────────────────────

const NDOUKEN_EMAIL = 'ndouken@gmail.com';
const NDOUKEN_LINKEDIN = 'https://www.linkedin.com/in/ndoukentheryx';
const NDOUKEN_RESUME =
  'https://drive.google.com/open?id=1YaPoFPM99oGFvA4fChx-QOSarJ2GGHI_&usp=drive_fs';

function commonLinks(extras: Record<string, string>): Record<string, string> {
  return {
    email: NDOUKEN_EMAIL,
    linkedin: NDOUKEN_LINKEDIN,
    resume: NDOUKEN_RESUME,
    ...extras,
  };
}

// ─── product-design ──────────────────────────────────────────────────────

const productDesignPreset: ProfilePreset = {
  profile: {
    name: 'Product Design',
    is_active: false,
    bio: 'UX Design Lead with over five years designing across digital, physical and human touchpoints in Central Africa, including nearly four years leading UX at PaySika.',
    tagline: 'I design digital products that earn trust with the first tap.',
    hero_title: 'UX Design Lead',
    hero_subtitle:
      'Nearly four years leading UX at PaySika across onboarding, KYC, transactions, the physical card journey and our expansion into Gabon. I specialise in simplifying complex product and service flows for African users.',
    philosophy_title: 'Trust is the core currency of product design.',
    philosophy_text:
      'Every financial product asks the user to bet their money on a screen. My job is to make that bet feel obvious: clear hierarchy, predictable interactions, honest copy, no surprises. I pair Mixpanel data with usability testing to find where trust breaks and rebuild from there.',
    intro_expanded_text:
      'Every financial product asks the user to bet their money on a screen. My job is to make that bet feel obvious: clear hierarchy, predictable interactions, honest copy, no surprises. I pair Mixpanel data with usability testing to find where trust breaks and rebuild from there.',
    badges: ['Open to CX, service design & product roles', 'Payments · KYC · Cards · Multi-country'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'On a short professional break after nearly four years at PaySika — open to CX, service design and product design roles',
    projects_intro:
      'Payments, KYC, cards, and cross-border transfers for African fintech, shipped at scale and measured in retention.',
    blog_intro: 'Notes on trust, compliance, and mobile money UX from the field in Cameroon.',
    metric_label: 'years designing products & services',
  }),
  projects: [
    {
      id: 'paysika_fintech',
      tag: 'Payments · KYC · Cards',
      title: 'PaySika',
      tagline: '40% retention lift and 60% fewer support tickets, plus a card journey spanning delivery, relay-point pickup and activation.',
      image: 'paysika_mockup.png',
      description:
        'As UX Design Lead and founding team member, I scaled PaySika from MVP to a multi-product fintech serving thousands of active users across Central Africa. I led a two-person design team, owned the end-to-end card journey — ordering, home delivery and relay-point pickup, through activation — designed the internal app our delivery agents used in the field, and led the design work behind our expansion into Gabon.',
      impact: 'Scaled fintech operations serving thousands of users across Central Africa, including the physical card journey and a second market.',
      site: 'https://www.paysika.co',
      role: 'UX Design Lead',
      period: 'Nov 2022 - Aug 2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Recruited and managed a two-person design team and set up the asset-handoff pipeline to engineering',
        'Redesigned onboarding, KYC photo capture, and Visa-activation flows; measured drop-off in Mixpanel and iterated',
        'Owned the physical card journey end to end: ordering, home delivery and relay-point pickup, through activation',
        'Designed the internal app our delivery agents used to receive and fulfil card orders, rolled out to 15 agents across Douala and Yaoundé',
        'Cut relay-point handover from 30 to 10 minutes by replacing manual paperwork with QR-code validation',
        'Led the multi-country design for the expansion into Gabon across the mobile app and back office, reworking KYC and onboarding for local requirements',
        'Led the physical debit card industrial and print design, working directly with the card manufacturer',
        'Wrote and localised English / French UI microcopy using Claude as a copy partner',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to differentiate in a crowded African fintech market while making complex financial services accessible to everyday users on patchy mobile networks. KYC drop-off was the biggest leak in the funnel, and the physical card added a second, partly offline journey — delivery agents, relay points and paperwork — that nobody had mapped end to end.',
      solution: 'The Solution',
      solution_text:
        'I redesigned the whole journey around three rules: every screen states what it costs you, every input shows why we need it, and every success state confirms in plain language. The KYC photo step became a guided real-time camera helper rather than a generic file upload. For the card, I looked past the app at everything behind it — the delivery agent, the relay-point handover, the back-office updates — and replaced the paper handover with QR-code validation before carrying the same approach into Gabon.',
      result: 'The Result',
      result_text:
        '40% lift in user retention and 60% reduction in customer support tickets. Relay-point handover dropped from 30 to 10 minutes, and the design system scaled across mobile, web, back office, the card mailer and a second market.',
      is_hidden: false,
      sort_order: 0,
      content: `## What I designed at PaySika

### Onboarding & KYC
Before the redesign, KYC photo upload was a generic file picker that failed quietly on most Android browsers in Cameroon. I replaced it with a guided real-time camera helper that frames the document for the user, gives live feedback on glare and focus, and only accepts the photo once it passes a client-side check. Mixpanel confirmed the redesign: successful first-attempt KYC went up sharply, and the related support tickets dropped by a measurable margin.

### Transaction history
I rewrote the transaction history to behave the way people actually scan financial statements: grouped by day, currency-formatted with thousand separators, every line including a one-tap support shortcut. Failed transactions are visually distinct and surface the reason ("network timeout", "insufficient balance") instead of a generic error code.

### Physical card
I led the industrial design of PaySika's physical Visa-partner card and its mailer packaging. We worked directly with the card manufacturer on substrate, finish, and emboss placement; the mailer was designed so the first thing the user sees after opening is the card itself, framed against a brand-colour insert.

### The delivery agent app
Fifteen delivery agents across Douala and Yaoundé fulfilled card orders from an internal app I designed. They received the order, saw the customer and delivery details, and confirmed the handover in the app — replacing a paper dispatch sheet and a phone call back to the office.

### The relay-point handover
Relay points were the slowest moment in the journey. Customers waited an average of 30 minutes between arriving at the relay point and leaving it, because every handover meant paper forms, a manual signature and a status update that only reached the back office later. I replaced the paperwork with QR-code validation: the customer's code is scanned, the handover is recorded in that same moment, and the average dropped to 10 minutes.

### Expanding to Gabon
When PaySika opened in Gabon, KYC in Cameroon was not KYC in Gabon — different documents, different checks, different partner expectations. I led the design across the mobile app and the back office so that we shipped one product with market-specific onboarding rather than two apps that drift apart.

### Localisation with AI
I used Claude as a translation and copy partner for English / French UI microcopy. The workflow: I drafted strings in English, Claude proposed French versions with two tone variants, our francophone team picked one and edited. This cut the localisation review cycle from a week to a day.`,
    },
    {
      id: 'crowdremit_fintech',
      tag: 'Cross-border · Design system',
      title: 'CrowdRemit',
      tagline: 'Cross-border peer-to-peer transfers across iOS, Android, web, and dashboard.',
      image: 'crowdremit_mockup.png',
      description:
        'As UX Researcher and Product Designer, I designed the end-to-end CrowdRemit experience (mobile app, web app, marketing site, and admin dashboard) and built the design system used by the engineering team. I led a brand-level decision to rebrand the primary colour after WCAG contrast testing exposed a readability problem on buttons.',
      impact:
        'Shipped a complete cross-border transfer experience and a WCAG-AA-passing design system from scratch.',
      site: '',
      role: 'UX Researcher & Product Designer',
      period: 'Jan 2021 - Jun 2021',
      location: 'Nigeria (remote)',
      responsibilities: [
        'User research, journey maps, and personas covering remitter and recipient flows',
        'Wireframes, hi-fi mockups, and clickable prototypes for mobile, web, and dashboard',
        'Design system: tokens, components, and engineering handoff via Jira',
        'Led the primary-colour rebrand after WCAG contrast testing on CTAs',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Designing a familiar yet differentiated fintech experience across four surfaces (iOS, Android, web, dashboard) with multi-currency wallets, including a difficult-to-explain "send from X to Y" mental model.',
      solution: 'The Solution',
      solution_text:
        'Started from user research and journey maps, moved through low-fidelity wireframes before any visual design, and iterated continuously with developers via Jira. Rebuilt the design system in Figma with tokens for color, type, and spacing so the engineering team could implement consistently across surfaces.',
      result: 'The Result',
      result_text:
        'Delivered a complete design system, native mobile apps (iOS & Android), web app, marketing site, and admin dashboard. The brand passed WCAG AA contrast on buttons after the colour rebrand.',
      is_hidden: false,
      sort_order: 1,
      content: `## Cross-border UX research

CrowdRemit's whole value proposition lives in one moment: a user sending money from Lagos to Douala needs to believe the money will arrive, in the right currency, without surprise fees. We ran moderated remote sessions with senders and recipients across three corridors. The biggest learning: people don't think in exchange rates, they think in *received amount*. We restructured the send flow around that: the receive amount is the primary input, the send amount is computed.

## The colour-contrast rebrand

The original CrowdRemit primary failed WCAG AA contrast on CTA buttons against the lightest neutral. I tested four candidate replacements with a small group of users including two visually-impaired participants. The selected high-contrast orange passes AA on every CTA in the product and held up across the marketing site too.

## Design-system handoff

I built the system in Figma with semantic tokens (color/primary, color/surface/elevated, etc.) so the engineering team could implement them as CSS variables. Component documentation lived in the same Figma file with usage do/don't notes. Engineering caught fewer "looks different from the design" tickets after we switched to this model.`,
    },
    {
      id: 'matanga_fintech',
      tag: 'Agency · Fintech clients',
      title: 'Matanga Agency',
      tagline: 'Fintech MVPs and dashboards for international and Cameroonian clients.',
      image: 'Matanga agancy website.PNG',
      description:
        'As Senior UI/UX Consultant (part-time), I delivered fintech-leaning client work for Matanga Agency: wireframes, interactive prototypes, scalable component libraries, and engineering handoff for clients ranging from early-stage MVPs to established e-commerce systems.',
      impact: 'Delivered 6+ client product launches across Central Africa and Europe.',
      site: 'https://matangaagency.com/fr/',
      role: 'Senior UI/UX Consultant (Part-time)',
      period: 'Dec 2023 - Feb 2024',
      location: 'Cameroon',
      responsibilities: [
        'Audited client briefs and translated complex product requirements into Figma mockups',
        'Built scalable component libraries and typography guides per client',
        'Ran design handoff sessions with engineering teams to keep visual fidelity intact',
      ],
      challenge: 'The Challenge',
      challenge_text:
        "Matanga's portfolio ranged from fintech MVPs to mature e-commerce. Each client wanted pixel-perfect execution and most had no existing brand system.",
      solution: 'The Solution',
      solution_text:
        'I acted as a plug-and-play design lead: audited briefs, defined the visual language from scratch where needed, and shipped responsive interfaces. Component libraries in Figma let us iterate fast while keeping the design system unified.',
      result: 'The Result',
      result_text:
        "Delivered 6+ client launches and established repeatable design handoff standards that the agency continues to use. Several fintech clients shipped MVPs ready for fundraising.",
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'fintech_trust_first',
      title: 'Why African fintech UX has to start with trust',
      excerpt:
        'A breakdown of why every fintech screen in Africa carries trust debt by default, and three concrete patterns that pay it down.',
      date: 'April 12, 2026',
      author: 'Ndouken Theryx',
      read_time: '6 min read',
      tags: ['Fintech', 'UX'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 0,
      content: `# Why African fintech UX has to start with trust

The first time a user opens an African fintech app, they're not evaluating your visual design. They're asking three questions, in this order:

1. **Is this real?** (Not a scam.)
2. **Will my money actually move?**
3. **What does it cost me?**

If the first two screens don't answer those questions, the rest of your beautiful flow doesn't matter. They've already closed the app.

I learned this at PaySika the slow way, by watching real onboarding sessions and reading Mixpanel funnels that didn't behave like Western fintech benchmarks suggested they should. Drop-off was concentrated at the moments where the product asked for trust without first giving any.

## Three patterns that pay down trust debt

### 1. State the cost on the same screen as the action
Hiding fees behind a "Continue" button reads as a trap. Show the fee (even a zero fee) beside the amount input. If the fee is zero, *say* zero. Silence is interpreted as a hidden charge.

### 2. Tell users why you need the data
"Upload a photo of your ID" is a demand. "We need this so your bank partner can verify your account, it's required by Cameroon's regulator" is a partnership. Same data, completely different completion rate.

### 3. Confirmation screens are not optional
On a transaction app, the success state is the product. A green checkmark and a transaction ID, with a one-tap "send this to support" affordance, does more for retention than any animation could.

## The KYC story

The single biggest funnel improvement I shipped at PaySika was a guided KYC camera. The old flow: a file-picker, an opaque "uploading…" screen, and an error message that just said "try again." The new flow: an in-app camera with a live overlay framing the ID, real-time glare and focus feedback, and a confirmation that the photo passed an on-device check before submission.

Same regulatory requirement. Same data captured. Vastly different completion rate, and a sharp drop in the related support tickets, because the few users who *did* fail saw exactly why and how to fix it.

## What I'd tell a fintech designer starting today

Read your Mixpanel funnel with the question "where did we ask for trust without earning it?", not "where do users drop off?" The two questions point at the same screens, but the second one leads to UI tweaks and the first one leads to product changes.`,
    },
    {
      id: 'fintech_transaction_history',
      title: "Designing PaySika's transaction history for clarity under stress",
      excerpt:
        "When something looks wrong in your bank app, you're already stressed. Here's how I redesigned PaySika's transaction history so users can scan it the way they scan a paper statement.",
      date: 'March 4, 2026',
      author: 'Ndouken Theryx',
      read_time: '5 min read',
      tags: ['Fintech', 'Information design'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 1,
      content: `# Designing PaySika's transaction history for clarity under stress

A transaction history isn't a list view. It's the place users go when something feels wrong. That changes the design problem.

## The brief I gave myself

When designing the redesigned PaySika transaction list, I wrote a one-line brief on top of the Figma file: *"Make it possible to find a missing payment in under five seconds, without scrolling."*

That meant three things:

1. **Group by day.** Banks have done this for a century for a reason: humans index transactions in time.
2. **Format money the way people read it.** Currency symbol first, thousand separators, sign on the same baseline.
3. **Failed transactions look different.** Not just a red badge: different background, different icon, different copy.

## What changed

- Successful transactions: neutral icon, bold amount, faded timestamp.
- Failed transactions: amber border, *reason in plain language* ("network timeout", "insufficient balance"), and a "tell support" link inline.
- Pending: pulsing dot, estimated settle time when we have one.

The reason matters. "Transaction failed" with no explanation is the single biggest support-ticket generator in any payments app. "Insufficient balance" answers the question without anyone needing to write in.

## What I'd do differently

If I were building this again I'd add export-to-CSV from the start. Users asked for it within two weeks of launch and we shipped it as a follow-up, but it should have been there day one for anyone in a country where paper bank statements are still the proof-of-funds standard.`,
    },
  ],
  about: {
    speakingIntro:
      'I speak about product design, mobile money UX, and what scales (and what doesn\'t) across the African market.',
    faqs: [
      {
        question: 'What product surfaces have you shipped?',
        answer:
          'Onboarding, KYC photo capture, transaction history, multi-currency wallets, virtual & physical Visa-partner cards (ordering, delivery, relay-point pickup, activation), mobile money top-up, back office and admin dashboards. Mobile, web, native iOS/Android, plus the internal app our delivery agents use in the field.',
      },
      {
        question: 'How do you measure design impact?',
        answer:
          'I instrument every meaningful flow in Mixpanel before launch (drop-off per step, time to success, error rates) and tie the redesign to a specific metric. At PaySika the KYC redesign was measured in successful-first-attempt rate and the support-ticket volume linked to it.',
      },
      {
        question: 'What about compliance and regulators?',
        answer:
          "I treat compliance copy as design: required language gets the same care as any other UI string. At PaySika I worked closely with our partner bank to make sure regulator-required disclosures were both legally correct and human-readable.",
      },
    ],
  },
};

// ─── design-engineer ─────────────────────────────────────────────────────

const designEngineerPreset: ProfilePreset = {
  profile: {
    name: 'Design Engineer',
    is_active: false,
    bio: 'Design Engineer who ships production interfaces, from Figma to React, with AI as a working partner.',
    tagline: 'I design and build interfaces, end to end.',
    hero_title: 'Design Engineer',
    hero_subtitle:
      'I close the loop between Figma and production code. React, TypeScript, design tokens, and Claude as a daily working partner. Nearly four years at PaySika shipping the artwork and the implementation.',
    philosophy_title: 'The best handoff is no handoff.',
    philosophy_text:
      'When the person making the design decision also writes the component, there is no fidelity loss, no "looks different from the mock" ticket, no handoff document that goes stale the moment it ships. AI doesn\'t replace taste: it removes the boring middle so taste can show up everywhere.',
    intro_expanded_text:
      'When the person making the design decision also writes the component, there is no fidelity loss, no "looks different from the mock" ticket, no handoff document that goes stale the moment it ships. AI doesn\'t replace taste: it removes the boring middle so taste can show up everywhere.',
    badges: ['Available for design-engineering work', 'Figma · React · TypeScript · AI tooling'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Wiring a CMS-driven design system into a Vite + Vercel portfolio',
    projects_intro:
      'Design systems, component libraries, and production interfaces shipped Figma-to-code with AI as a working partner.',
    blog_intro: 'Notes on shipping interfaces with AI in the loop, without losing design taste.',
    metric_label: 'years bridging design & code',
  }),
  projects: [
    {
      id: 'paysika_design-engineer',
      tag: 'Design system · Implementation',
      title: 'PaySika design system',
      tagline:
        "Token-based design system feeding PaySika's mobile, web, and dashboard surfaces.",
      image: 'paysika_mockup.png',
      description:
        "I built and maintained PaySika's design system as semantic tokens in Figma and matching CSS variables in code. Same names on both sides, same source of truth, less drift between mock and implementation.",
      impact: 'Cut visual-fidelity bug tickets after standardising tokens between Figma and CSS.',
      site: 'https://www.paysika.co',
      role: 'UX Design Lead · Design Engineer',
      period: 'Nov 2022 - Aug 2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Defined semantic design tokens (color, type, spacing, radius) in Figma',
        'Mirrored them as CSS variables / Tailwind tokens for the engineering team',
        'Documented usage with do/don\'t notes inside the Figma file (no separate site)',
        'Ran handoff sessions with engineering and audited the implementation in PRs',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika\'s engineering team was implementing the same component three slightly different ways across mobile, web, and dashboard because the design source had no enforced tokens.',
      solution: 'The Solution',
      solution_text:
        'I rebuilt the Figma library around semantic tokens (color/surface/elevated, not "grey-100") and worked with engineering to mirror them in code. Component documentation lived in the same Figma file with usage notes; PR reviews caught drift before merge.',
      result: 'The Result',
      result_text:
        'Faster shipping, fewer visual-fidelity tickets, and a shared vocabulary between design and engineering that survived team changes.',
      is_hidden: false,
      sort_order: 0,
      content: `## Tokens, not values

The unlock was switching from descriptive tokens ("grey-100", "blue-500") to semantic ones ("color/surface/elevated", "color/accent/primary"). Once the names express *what something is* rather than *what it looks like*, theme changes, dark mode, and brand evolution become single-file changes instead of search-and-replace migrations.

## Same names on both sides

Figma exports tokens. Code reads tokens. They share names. That sentence sounds trivial but it's the entire trick: when a designer says "the primary accent looks too saturated", an engineer can search the codebase for \`--color-accent-primary\` and find every usage in five seconds.

## AI in the implementation loop

For the React side, I use Claude as a pair-programmer for the boring parts of component implementation: prop tables, accessibility attributes, story files. Taste stays mine; typing time goes down.`,
    },
    {
      id: 'portfolio_design-engineer',
      tag: 'Portfolio · CMS',
      title: 'This portfolio',
      tagline: 'Vite + React + TypeScript + Neon + a custom Studio CMS, built end-to-end with Claude.',
      image: 'shomi-cover.png',
      description:
        'The site you\'re reading. Built as a working demo of the design-engineer workflow: Figma intent, React implementation, Neon-backed CMS for content editing, and Claude as a working partner through the whole loop.',
      impact: 'Demonstrates the full Figma-to-deployed-React workflow on real production constraints.',
      site: 'https://react-portfolio-pi-topaz.vercel.app',
      role: 'Designer & Engineer',
      period: '2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Designed and shipped a bento-grid information architecture across home, projects, blog, and about',
        'Implemented React route-level code-splitting, framer-motion physics, and prefers-reduced-motion support',
        'Built the Studio CMS (sidebar, profiles, projects, blog, content-sync) on Vercel serverless + Neon Postgres',
        'Used Claude for adversarial code review, accessibility audits, and copy refinement',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'A single codebase that serves multiple persona-tailored portfolios (default, product-design, design-engineer, marketing, PM) from one URL, editable end-to-end through a CMS, without losing the playful identity of a bento-style design.',
      solution: 'The Solution',
      solution_text:
        'Profiles live in Neon; the React app reads them via ProfileContext and falls back to bundled static content when the API is unreachable. The Studio CMS lets me edit every visible field. AI handles boilerplate; design and architecture decisions are mine.',
      result: 'The Result',
      result_text:
        'A single deployed site, switchable per persona via ?profile=, with strict TypeScript, ESLint, and 12 passing Vitest tests gating every deploy.',
      is_hidden: false,
      sort_order: 1,
      content: '',
    },
    {
      id: 'crowdremit_design-engineer',
      tag: 'Design system handoff',
      title: 'CrowdRemit design-system handoff',
      tagline: 'Tokens, components, and a WCAG-AA-passing handoff across iOS, Android, web, and dashboard.',
      image: 'crowdremit_mockup.png',
      description:
        'Designed and documented CrowdRemit\'s design system in Figma, mirrored it as CSS variables for the engineering team, and ran weekly review sessions during implementation. Led the primary-colour rebrand after WCAG contrast testing.',
      impact: 'Shipped a token-based design system that survived four surfaces and a brand rebrand.',
      site: '',
      role: 'UX Researcher & Product Designer',
      period: 'Jan 2021 - Jun 2021',
      location: 'Nigeria (remote)',
      responsibilities: [
        'Designed and tokenised the design system in Figma',
        'Documented engineering handoff (component usage, do/don\'t notes)',
        'Led the primary-colour rebrand after WCAG contrast testing',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Four implementation surfaces (iOS, Android, web, dashboard), one design system, one engineering team. Drift was the default outcome.',
      solution: 'The Solution',
      solution_text:
        'Semantic tokens in Figma, matching CSS variables in code, and a shared review rhythm during implementation.',
      result: 'The Result',
      result_text:
        'Shipped a complete cross-platform product where the same component on iOS and web read as the same component, because they were built from the same tokens.',
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'de_ai_pair',
      title: 'How I use Claude to ship features 3× faster (without losing my design taste)',
      excerpt:
        'AI doesn\'t replace taste: it removes the boring middle. Here\'s the exact loop I run for design-engineering work with Claude as a partner.',
      date: 'May 22, 2026',
      author: 'Ndouken Theryx',
      read_time: '7 min read',
      tags: ['AI', 'Design engineering'],
      image: 'shomi-cover.png',
      is_hidden: false,
      sort_order: 0,
      content: `# How I use Claude to ship features 3× faster (without losing my design taste)

Most "AI for designers" advice falls into two camps: *AI will replace you* (it won't, at least not yet) or *AI is a magic wand* (it isn't). The truth is more boring and more useful: AI removes the slow middle of a workflow, so the parts where taste actually matters, the decisions, get more of your attention, not less.

Here is the exact loop I run for shipping a feature, end to end, with Claude in the loop.

## Step 1: Brief, with constraints

I write the feature brief myself, in plain prose, including the constraints I already know: who it's for, what success looks like, what we will not do. Claude is not great at inventing constraints, but it's excellent at applying constraints you state clearly.

## Step 2: Layout exploration in Figma

I sketch three or four layout candidates in Figma. Still my hand. AI sees nothing yet. The reason: when I let AI generate layouts first, my brain anchors on its output and stops searching. The Figma sketches are the search.

## Step 3: Copy & microcopy draft with Claude

Once a layout is chosen, I paste the wireframe screenshot into Claude with the brief and ask for three copy variants per UI string: tone variants, not synonym swaps. *Direct, warm, cautious* is a useful prompt frame. I pick or edit.

## Step 4: Component scaffolding

I describe the component I'll build in prose (props, states, accessibility) and ask Claude to scaffold it in React + TypeScript. I read every line. About 60% lands as-is; the rest I rewrite. The 40% I rewrite is the part where my taste shows up.

## Step 5: Adversarial review

Before I push, I paste the diff back into Claude with: *"You are reviewing this PR. Be skeptical. Find three things that will break in production."* This catches more issues than my own re-reading: fresh eyes, even synthetic ones.

## What this gets you

A loop where Claude removes typing time, prop-table boilerplate, and the first-pass copy draft. What it doesn't do: decide what the product *is*. That decision still has to come from a person who has met the user.

## What I'd avoid

- **Don't let AI choose the layout.** It will pick the most popular pattern. That's exactly the wrong choice for any product that needs to differentiate.
- **Don't skip the adversarial review.** Generated code looks great. Looking great and being correct are different things.
- **Don't ship without re-reading every line.** A typo from a human is funny. A typo from AI in production code is your career.`,
    },
    {
      id: 'de_figma_react',
      title: 'Figma-to-React, today: my AI-assisted handoff workflow',
      excerpt:
        'The boring truth about Figma-to-React in 2026: it\'s not one tool, it\'s a chain. Here\'s the one I use to ship components without a single "looks different from the mock" ticket.',
      date: 'February 18, 2026',
      author: 'Ndouken Theryx',
      read_time: '6 min read',
      tags: ['Figma', 'React', 'Workflow'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 1,
      content: `# Figma-to-React, today: my AI-assisted handoff workflow

There is no single Figma-to-React tool that ships production code. There is, however, a chain of small steps that, strung together, gets you to a clean implementation faster than any "AI converts your design to code" claim.

## The chain

### 1. Tokens first
Both Figma and code read from the same semantic tokens (color/surface/elevated, type/body/m, space/4). Same names, both sides. If your Figma file uses raw hex values, no tooling will save you.

### 2. Component contract in prose
Before I open my editor I write the component as a paragraph: *"A button. Three variants: primary, secondary, ghost. Three sizes. Disabled state. Loading state with a spinner that respects prefers-reduced-motion."* That paragraph is the brief for Claude.

### 3. Scaffolding with Claude
I paste the contract plus a snippet of an existing component from the same codebase ("match this style") and ask for the scaffold. The existing-component example is the crucial part: Claude matches conventions when it sees them.

### 4. Read every line
The scaffold is a draft. I read every line. The places I rewrite are the places where I had a specific design choice that wouldn't show up from prose alone: focus ring colour, hover transition curve, the exact pixel offset that makes the button feel "right."

### 5. Visual regression
I render the component in Storybook (or a sandbox route) and put it next to the Figma frame, side by side. Any pixel that's off comes from a token mismatch or a missing case. Five-minute fix.

## What doesn't work

- **One-shot prompts.** "Generate this component from the Figma file" produces something that *looks* right at low zoom and falls apart at every state transition.
- **No tokens.** If your Figma uses hex values, no tool in 2026 will read your intent. Fix the source first.
- **Skipping the visual regression.** The mock and the implementation are different artifacts. They will drift. Catch it before merge, not in production.`,
    },
  ],
  about: {
    speakingIntro:
      'I write and speak about the design-engineering workflow: Figma to React, AI in the loop, and what hands-on shipping teaches about both crafts.',
    faqs: [
      {
        question: 'Are you a designer or an engineer?',
        answer:
          "Both, on purpose. I design in Figma and I ship in React. The role I'm looking for treats that as a single craft (design engineer, hybrid IC, founding designer), not as two job descriptions stapled together.",
      },
      {
        question: 'How do you keep design taste with AI in the loop?',
        answer:
          'Three rules: never let AI choose the layout (anchor effect kills the search), always state constraints before asking for output, and always read every generated line. The taste lives in the choices, not the typing.',
      },
      {
        question: 'What\'s your favourite Claude prompt pattern?',
        answer:
          "Adversarial review: \"You are reviewing this PR. Be skeptical. Find three things that will break in production.\" It catches more real issues than any self-review I've done.",
      },
    ],
  },
};

// ─── digital-marketing ───────────────────────────────────────────────────

const digitalMarketingPreset: ProfilePreset = {
  profile: {
    name: 'Digital Marketing',
    is_active: false,
    bio:
      'Digital Marketing Strategist helping African fintech and tech brands turn audience research into measurable acquisition.',
    tagline: 'Strategy, channels, and analytics that move the metric you actually care about.',
    hero_title: 'Digital Marketing Strategist',
    hero_subtitle:
      'I plan and execute digital campaigns that connect brand strategy, content, paid channels, and analytics into a single funnel. Most of my work has been with African fintech and tech-community brands.',
    philosophy_title: 'Marketing should be clear, measurable, and useful.',
    philosophy_text:
      'I combine audience research, creative storytelling, performance tracking, and product thinking to build campaigns that do more than get attention. They help people understand, trust, and act, and I can show you the number.',
    intro_expanded_text:
      'I combine audience research, creative storytelling, performance tracking, and product thinking to build campaigns that do more than get attention. They help people understand, trust, and act, and I can show you the number.',
    badges: ['Available for marketing projects', 'Strategy · Paid · Content · Analytics'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Building a paid-acquisition playbook for African fintech audiences',
    projects_intro:
      'Growth playbooks, content engines, and community marketing for African fintech and open-source brands.',
    blog_intro: 'Notes on running marketing for African audiences: what budgets, channels, and metrics actually do.',
    metric_label: 'years in brand & growth',
  }),
  projects: [
    {
      id: 'paysika_digital-marketing',
      tag: 'Fintech growth · Brand',
      title: 'PaySika growth playbook',
      tagline:
        'Funnel design, brand work, and paid acquisition for a Visa-partner mobile bank in Central Africa.',
      image: 'paysika_mockup.png',
      description:
        "While leading design at PaySika, I owned the brand and marketing-asset pipeline: visual identity refresh, design-to-marketing handoff, paid campaign creative for Meta and Google, and the Mixpanel funnel work that told us which acquisition channels actually retained.",
      impact: 'Connected brand, paid acquisition, and product funnel into a single measurable system.',
      site: 'https://www.paysika.co',
      role: 'Brand & Growth (in-house)',
      period: 'Nov 2022 - Aug 2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Visual brand refresh and a unified asset pipeline between design and marketing',
        'Paid-acquisition creative for Meta and Google, in French and English variants',
        'Mixpanel funnel work to tie acquisition source to in-app activation',
        'Influencer & community marketing for the Cameroonian fintech audience',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika was running paid acquisition without confidence that the right channels were attracting users who would actually activate. Creative was siloed in design; performance was siloed in marketing.',
      solution: 'The Solution',
      solution_text:
        'I built a brand-approved asset pipeline that marketing could fetch from without slowing design. We instrumented Mixpanel to tag every signup with its acquisition source and looked at activation, not signups, as the metric. Creative variants got localised English + French.',
      result: 'The Result',
      result_text:
        'A funnel-based acquisition model that promoted the channels with the best activation rate (not the cheapest CPI) and a brand voice consistent from ad to onboarding.',
      is_hidden: false,
      sort_order: 0,
      content: `## What I owned at PaySika

### Brand-to-marketing pipeline
Pre-redesign, marketing waited on design for every campaign asset. I built a brand-approved asset library (logos, lockups, type lockups, photo treatments) that marketing could pull from without a design ticket. Sprint velocity in both teams went up.

### Acquisition-to-activation attribution
We tagged every signup with its acquisition source (utm_source captured at landing, persisted through the auth flow). Mixpanel reports then showed activation rate per channel, not just signup rate. We discovered some of our cheapest channels were also the lowest-quality and reallocated.

### Localisation done right
Every paid ad shipped in both English and French. We tested tone variants ("trust" vs "speed" vs "savings") and let CPA data pick, not personal preference.

### Creative for a Cameroonian audience
Stock photography of suited-up traders is wrong for this market. We used local creators, local backgrounds, and local money, and the engagement gap vs international creative was significant.`,
    },
    {
      id: 'matanga_digital-marketing',
      tag: 'Agency · Client growth',
      title: 'Matanga client growth retainer',
      tagline: 'Ongoing growth work for international and Cameroonian agency clients.',
      image: 'Matanga agancy website.PNG',
      description:
        'As a part-time consultant at Matanga, I delivered ongoing growth retainers for fintech and e-commerce clients: visual brand refreshes, campaign creative, paid-channel strategy, and content plans tuned to small budgets.',
      impact: 'Delivered measurable growth work for 6+ agency clients across multiple verticals.',
      site: 'https://matangaagency.com/fr/',
      role: 'Senior Consultant (Part-time)',
      period: 'Dec 2023 - Feb 2024',
      location: 'Cameroon',
      responsibilities: [
        'Brand audits and refreshes for early-stage clients',
        'Campaign creative for Meta, Google, and email',
        'Channel-mix recommendations based on client budget and audience',
        'Content plans for clients without in-house marketing capacity',
      ],
      challenge: 'The Challenge',
      challenge_text:
        "Most of Matanga's clients didn't have in-house marketing teams. They needed strategy *and* execution, on small budgets, with measurable outcomes.",
      solution: 'The Solution',
      solution_text:
        "I worked plug-and-play: audit, recommend the smallest viable channel mix, ship creative, instrument tracking, and review monthly. Many clients moved from 'we run some ads sometimes' to a documented growth plan in the first quarter.",
      result: 'The Result',
      result_text:
        "Delivered measurable growth work for 6+ clients. Several came back for second engagements and the playbooks I documented are still in use at the agency.",
      is_hidden: false,
      sort_order: 1,
      content: '',
    },
    {
      id: 'oss-cameroon_digital-marketing',
      tag: 'Community marketing',
      title: 'OSS Cameroon community growth',
      tagline:
        'Marketing and community work for an open-source society and the JobSika platform.',
      image: 'Screenshot of the UI of Jobsika.PNG',
      description:
        'As co-maintainer of OSS Cameroon and JobSika, I owned the community marketing work: visual identity, social presence, event design, and the storytelling that brought new contributors and job seekers into the platform.',
      impact: 'Grew a contributor and user community for a fully open-source jobs platform in Cameroon.',
      site: 'https://jobsika.cm/',
      role: 'Co-maintainer & Community Marketing',
      period: '2022 - 2024',
      location: 'Cameroon',
      responsibilities: [
        'Visual identity and social presence for OSS Cameroon and JobSika',
        'Event design and storytelling for community meetups',
        'Onboarding flow for new contributors (low-friction first PR)',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Open-source communities live or die by their onboarding experience. Cameroon\'s designer-developer community was small and scattered.',
      solution: 'The Solution',
      solution_text:
        "Treated community building as a marketing problem: clear value proposition for contributors, low-friction first PR ('design issues' alongside code issues), and consistent visual storytelling across our channels.",
      result: 'The Result',
      result_text:
        'A live open-source jobs platform with an active contributor community and a clear track record of new designers and developers making their first open-source contribution through OSS Cameroon.',
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'mkt_african_audiences',
      title: 'What 6 months of paid acquisition taught me about Cameroonian audiences',
      excerpt:
        'Western paid-acquisition playbooks don\'t translate. Here\'s what worked, what didn\'t, and what nobody warns you about when running ads in Cameroon.',
      date: 'May 30, 2026',
      author: 'Ndouken Theryx',
      read_time: '7 min read',
      tags: ['Marketing', 'Africa', 'Paid acquisition'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 0,
      content: `# What 6 months of paid acquisition taught me about Cameroonian audiences

The default fintech marketing playbook (Meta lookalike audiences, Google search intent, "scale what works") was written for markets PaySika doesn't operate in. Six months of running paid acquisition for a Central African fintech taught me three lessons that aren't in the standard advice.

## 1. Cheap clicks are not a metric

Cost-per-install in Cameroon can be remarkably low compared to Western benchmarks, but a quarter of the lowest-cost installs never opened the app a second time. We rebuilt the dashboard around cost-per-*activated*-user (signup + first verified transaction), not CPI. Spend looked higher per unit; quality went up sharply.

## 2. French and English are not the same audience

We initially ran bilingual creative in single campaigns. Once we split the creative entirely (separate campaigns, separate creators, separate copy), both halves performed better. The two audiences read fintech messaging through different frames; treating them as one was leaving money on the table.

## 3. Local creators outperform polished international content

Stock-style fintech imagery (suited men, glass skyscrapers) underperformed by a large margin against creative shot with local creators, local money, and local backgrounds. The latter feels honest, the former feels imported. Trust again.

## What I'd do next

Test WhatsApp Business as an acquisition surface end-to-end. The platform is where the audience already is, but most fintech brands still treat it as a support channel only.`,
    },
    {
      id: 'mkt_content_engine',
      title: 'Building a content engine for African fintech (when budgets are tight)',
      excerpt:
        'You don\'t need a content team of ten. You need a system. Here\'s the one I built at PaySika and the rules behind it.',
      date: 'April 8, 2026',
      author: 'Ndouken Theryx',
      read_time: '6 min read',
      tags: ['Marketing', 'Content'],
      image: 'crowdremit_mockup.png',
      is_hidden: false,
      sort_order: 1,
      content: `# Building a content engine for African fintech (when budgets are tight)

Content marketing advice in 2026 assumes you have a team. Most African fintech marketing teams I know are two or three people with a small budget. Here is the engine I built at PaySika under those constraints.

## The three-stream rule

Every week ship one of each:

- **One product story.** A real user, a real flow, a real outcome. Photo or short video preferred.
- **One explainer.** A 60-second answer to a question your support team is tired of answering. Often becomes paid creative later.
- **One trust signal.** A regulator partnership, a security update, a milestone. Builds the audience’s sense that you are a real institution.

Three pieces a week. Manageable for a team of two.

## Repurposing is the budget

Every long-form story becomes:

- A long-form post (LinkedIn or blog)
- A 3-card carousel for Instagram / Facebook
- A 30-60 second video for TikTok / Reels
- A WhatsApp Status creative for the existing user base

One brief, one shoot, four channels. The cost-per-impression collapses if you do this rigorously.

## Measure what?

For each content piece, two numbers: *reach in the target audience* (not total reach) and *time-on-content* (not likes). Likes are a vanity metric in this market.

## What not to do

Don’t hire a "social media person" before you have a system. Without a system, the role becomes "person who posts daily": high cost, low signal.`,
    },
  ],
  about: {
    speakingIntro:
      'I write and speak about marketing for African audiences: what scales, what doesn\'t, and how to spend small budgets like they\'re large ones.',
    faqs: [
      {
        question: 'What budgets do you typically work with?',
        answer:
          "Mostly small to mid: $2k-$20k/month in paid spend. I'm comfortable scaling up, but my real differentiator is doing measurable work on tight budgets: the African fintech market doesn't pretend its budgets are Western.",
      },
      {
        question: 'What channels do you start with?',
        answer:
          'Always Meta for African mobile audiences, often Google for high-intent search, sometimes TikTok for younger demos. I avoid recommending a channel before I see who the audience actually is: channel-first advice is a red flag.',
      },
      {
        question: 'How do you handle attribution?',
        answer:
          'UTM discipline at the source, Mixpanel to track activation-rate per channel, and a weekly review where we kill the lowest-quality channel ruthlessly. Activation, not signups, is the metric I report on.',
      },
    ],
  },
};

// ─── project-manager ─────────────────────────────────────────────────────

const projectManagerPreset: ProfilePreset = {
  profile: {
    name: 'Product Manager & B2B Solutions Lead',
    is_active: false,
    bio:
      'Product Manager with a technical and systems background, leading end-to-end Product Lifecycle Management (PLM) across telecom rails, B2B fintech integrations, ed-tech, and digital policy. Nearly four years at PaySika orchestrating cross-functional delivery between engineering, MTN MoMo and mobile money APIs, compliance, and enterprise partners; co-founder of Kody, leading business case development and GTM for a $5,000 Tony Elumelu Foundation-funded venture. I turn business goals into prioritized backlogs, robust product roadmaps, and measurable market impact.',
    tagline: 'Bridging business strategy, telecom rails, and flawless product delivery.',
    hero_title: 'Product Manager & B2B Solutions Lead',
    hero_subtitle:
      'I lead products from conception to Go-To-Market: investment business cases, prioritized backlogs, and cross-functional delivery across mobile networks, fintech APIs, and B2B platforms. Nearly four years at PaySika coordinating engineering, compliance, operations, and mobile money/banking partners through regulated delivery in Central Africa.',
    philosophy_title: 'Product leadership is the bridge between market demand, technical systems, and measurable ROI.',
    philosophy_text:
      'A successful product requires three things: a deep understanding of customer and enterprise needs, alignment across engineering and business stakeholders, and disciplined execution. From integrating mobile money rails and USSD/SMS fallback workflows to building investment business cases, my role is to eliminate ambiguity, ensure compliance, and deliver products that scale sustainably.',
    intro_expanded_text:
      'A successful product requires three things: a deep understanding of customer and enterprise needs, alignment across engineering and business stakeholders, and disciplined execution. From integrating mobile money rails and USSD/SMS fallback workflows to building investment business cases, my role is to eliminate ambiguity, ensure compliance, and deliver products that scale sustainably.',
    badges: ['B2B Product Management · Telecom & Fintech Rails', 'Product Lifecycle (PLM & GTM) · Investment Business Cases'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Managing B2B & mobile money product delivery, API integrations, and PLM roadmaps across Central Africa',
    projects_intro:
      'End-to-end product lifecycle management: B2B payment solutions, mobile money & telecom API integrations, investment business cases, and ICT policy.',
    blog_intro: 'Notes on product lifecycle management (PLM), telecom/fintech API integrations, and driving cross-functional delivery.',
    metric_label: 'years driving product lifecycle & delivery',
  }),
  projects: [
    {
      id: 'paysika_project-manager',
      tag: 'Fintech & Telecom Rails · B2B Product Delivery',
      title: 'PaySika: B2B & Core Product Lifecycle Delivery',
      tagline:
        'Led product lifecycle management, bridging engineering, MTN MoMo API rails, compliance, and partner banks across Central Africa.',
      image: 'paysika_mockup.png',
      description:
        'As a founding-team member, I owned cross-functional product delivery at PaySika: holding a single prioritized backlog across mobile and web, coordinating engineering, marketing, compliance, and mobile network operator partners (MTN MoMo, Orange Money) on sprint and release cycles, and driving the product roadmap from conception to market expansion.',
      impact: 'Shipped high-conversion KYC and payment flows, lifting retention by 40% and reducing support tickets by 60% on a structured three-sprint cadence.',
      site: 'https://www.paysika.co',
      role: 'Product Manager & Delivery Lead',
      period: 'Nov 2022 - Aug 2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Owned the end-to-end product lifecycle (PLM) and prioritized backlog, defining epics, user stories, and acceptance criteria for mobile and web surfaces',
        'Coordinated integrations with mobile network operator rails (MTN MoMo, Orange Money, USSD/SMS fallback) and banking partner APIs, ensuring high-uptime transaction processing',
        'Bridged engineering, operations, marketing, and compliance on regulated KYC and payments, cutting release cycle time by 25%',
        'Analyzed user adoption, transactional conversion, and drop-off in Mixpanel to optimize product ROI, ARPU, and retention',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to ship multiple major product surfaces (KYC, transactions, cards, B2B cash-in/cash-out) on cadence with high availability across fluctuating mobile network conditions, while keeping engineering velocity steady and satisfying strict banking/telecom compliance requirements.',
      solution: 'The Solution',
      solution_text:
        'I built explicit hand-off rituals and technical specifications between teams. Handled API contract alignment with telecom and banking partners, documented failure states and USSD/SMS fallback behaviors, and ran disciplined sprint planning that broke complex fintech requirements into shippable, measurable increments.',
      result: 'The Result',
      result_text:
        'Achieved a 40% lift in user retention and a 60% reduction in support tickets. The product lifecycle and handoff framework scaled smoothly as active transaction volume grew across Central Africa.',
      is_hidden: false,
      sort_order: 0,
      content: `## What I coordinated at PaySika

### Product Lifecycle & Cross-Functional Squad Leadership
I managed the end-to-end product lifecycle from requirement gathering to post-launch optimization. By establishing clear sprint rituals, backlog grooming, and definition-of-done criteria, I aligned engineering, design, and marketing into an agile delivery machine.

### Telecom Rails & Mobile Money Integration
In Central Africa, payment reliability hinges on mobile network operator (MNO) rails. I coordinated technical integration requirements for MTN MoMo and Orange Money cash-in/cash-out flows, defining edge cases for network timeouts, webhook delays, and SMS confirmation fallbacks.

### Business Case & Value Proposition Alignment
Every feature was tied to measurable business outcomes. By tracking user behavior and transactional funnels in Mixpanel, I prioritized roadmap items that directly contributed to user activation, customer lifetime value (LTV), and transaction volume.

### Regulatory Compliance & Partner Governance
Working in regulated fintech required continuous alignment with partner banks, compliance officers, and telecom regulatory standards. I ensured all KYC workflows and audit trails met strict legal and security benchmarks without compromising user conversion.`,
    },
    {
      id: 'shomi_project-manager',
      tag: 'EdTech · Investment Business Case & GTM',
      title: 'Kody / Shomi: Investment Business Case & Lifecycle Management',
      tagline:
        'Secured $5,000 TEF seed investment, developed the business case, and led product from conception to Go-To-Market.',
      image: 'shomi-cover.png',
      description:
        'Co-founder of Kody and Product Owner on Shomi. Developed the investment business case to secure $5,000 in seed funding from the Tony Elumelu Foundation, built and launched the mobile-first MVP with our engineering team, and managed the full product lifecycle from market research to Go-To-Market.',
      impact: 'Secured $5,000 funding, built investment models, and delivered an MVP tested with 100+ students and educators.',
      site: '',
      role: 'Co-founder & Product Manager',
      period: 'Dec 2019 - Dec 2020',
      location: 'Cameroon',
      responsibilities: [
        'Developed the investment business case, financial projections, and GTM strategy, securing $5,000 in seed funding from the Tony Elumelu Foundation',
        'Led market research across 100+ students and educators to define product requirements, unit economics, and value proposition',
        'Managed the full product development lifecycle with engineering, launching the mobile-first MVP on schedule',
        'Conducted post-launch lifecycle analysis and authored a comprehensive post-mortem on unit economics and retention',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Building an ed-tech product for secondary school students in Cameroon with limited resources, requiring clear market validation, tight scope management, and viable unit economics under challenging local internet infrastructure.',
      solution: 'The Solution',
      solution_text:
        'Developed an offline-first mobile product architecture and forged a strategic distribution partnership with PREXCEL. Built a tight MVP scope focusing on high-demand exam preparation booklets and validated UX hypotheses through iterative testing with real students.',
      result: 'The Result',
      result_text:
        'Successfully delivered the MVP and operated the platform for 12 months. Documented a thorough post-mortem analyzing content production costs, unit economics, and student engagement patterns—a framework that now informs my business case modeling for all digital products.',
      is_hidden: false,
      sort_order: 1,
      content: `## What co-founding taught me about Product Management

Co-founding compressed essential PM lessons into one venture: investment business case rigor, customer discovery, and honest lifecycle management.

### Developing the Investment Business Case
To secure the $5,000 Tony Elumelu Foundation grant, I built comprehensive financial models, addressable market sizing (TAM/SAM/SOM), and operational roadmaps, pitching the strategic ROI of digital exam preparation in Cameroon.

### User Discovery & Strategic Partnerships
I established a strategic partnership with PREXCEL, giving us direct access to our target demographic. We conducted surveys and prototype testing to validate features before committing engineering resources.

### Product Lifecycle Post-Mortem
When retention data indicated that our content acquisition costs exceeded our short-term monetization model, I led the structured sunsetting of the product. The resulting post-mortem remains a core reference for how I evaluate product feasibility, unit economics, and operational sustainability today.`,
    },
    {
      id: 'jobsika_project-manager',
      tag: 'Digital Platform · Open Source Backlog & Delivery',
      title: 'JobSika: Platform Delivery & Community Management',
      tagline:
        'Owned the product backlog, release milestones, and feature delivery for an open-source employment portal in Cameroon.',
      image: 'Screenshot of the UI of Jobsika.PNG',
      description:
        'As co-maintainer of JobSika at OSS Cameroon, I owned product delivery and backlog prioritization: triaging feature requests, managing milestone roadmaps, coordinating cross-functional contributors, and optimizing the platform for low-bandwidth mobile environments.',
      impact: 'Delivered a live, resilient employment platform serving Cameroonian job seekers with a transparent, prioritized backlog.',
      site: 'https://jobsika.cm/',
      role: 'Product & Delivery Manager (Open Source)',
      period: '2022 - 2024',
      location: 'Cameroon',
      responsibilities: [
        'Owned and prioritized the product backlog on GitHub: writing PRDs, defining acceptance criteria, and managing release sprints',
        'Coordinated cross-functional teams of software engineers and designers across time zones using agile workflows',
        'Designed lightweight mobile interfaces optimized for local 2G/3G network conditions and low-spec smartphones',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Delivering a reliable job platform that performs seamlessly across variable network connections while managing a distributed team of volunteer contributors.',
      solution: 'The Solution',
      solution_text:
        'Structured modular contribution roadmaps, established clear PR review guidelines, and prioritized performance optimizations to minimize data consumption for job seekers.',
      result: 'The Result',
      result_text:
        'Successfully deployed and scaled jobsika.cm as an active community resource with high uptime and rapid feature turnaround.',
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
    {
      id: 'gefona_project-manager',
      tag: 'ICT Policy & Enterprise Cybersecurity · Delivery',
      title: 'GEFONA Digital Foundation: ICT Policy & Digital Economy',
      tagline:
        'Led project delivery, finance, and stakeholder coordination for digital economy, telecom trends, and cybersecurity policy research.',
      image: '',
      description:
        'At the GEFONA Digital Foundation, which supports policy research on the digital economy, telecommunications ecosystem, and cybersecurity in Africa, I directed project delivery, stakeholder communications, and financial governance: keeping research initiatives on schedule, aligned with regulatory standards, and clearly reported.',
      impact: 'Delivered policy research on digital economy frameworks, telecom market evolution, and enterprise cyber resilience in Africa.',
      site: 'https://www.gefona.org/',
      role: 'Project, Communications & Finance Lead',
      period: 'Mar 2020 - Present',
      location: 'Cameroon',
      responsibilities: [
        'Directed research and delivery roadmaps examining African digital economy trends, ICT policy, telecommunications regulation, and data governance',
        'Coordinated communications with industry stakeholders, regulatory bodies, and academic partners',
        'Managed project budgeting, financial reporting, and resource allocation with auditable compliance',
        'Synthesized complex technological and telecom developments into actionable strategic insights for decision-makers',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Balancing rigorous policy research across digital transformation, telecom trends, and cybersecurity with structured delivery timelines and multi-stakeholder governance.',
      solution: 'The Solution',
      solution_text:
        'Created centralized tracking frameworks for research deliverables, established steady stakeholder communication channels, and maintained rigorous financial governance.',
      result: 'The Result',
      result_text:
        'Published influential research outputs that informed digital governance discussions and enterprise cybersecurity best practices across the CEMAC region.',
      is_hidden: false,
      sort_order: 3,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'pm_kyc_three_sprints',
      title: "How we shipped PaySika's KYC redesign in 3 sprints",
      excerpt:
        'KYC redesign at a regulated fintech is everyone\'s favourite project to delay. Here\'s how a small team shipped one in three sprints, and what almost broke it.',
      date: 'May 14, 2026',
      author: 'Ndouken Theryx',
      read_time: '8 min read',
      tags: ['Product management', 'Fintech', 'Delivery'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 0,
      content: `# How we shipped PaySika's KYC redesign in 3 sprints

KYC at a regulated fintech touches three teams (product, eng, compliance), one external partner (the bank), and an angry funnel chart. Every team has a reason to delay. We shipped a major KYC redesign in three two-week sprints. Here's how, and what I'd warn you about.

## Sprint 0 (one week): contract

Before any design or code, we wrote a contract. Not a spec: a contract. One page. Three sections:

- **What we will ship.** A guided real-time camera helper for the ID photo step, plus the surrounding screens.
- **What we will not ship.** Address verification redesign, document re-issue flow, support handoff redesign. All real problems, all next quarter.
- **What "done" looks like.** Two metrics: first-attempt success rate, and KYC-related support tickets per week.

Every team signed it. Partner bank too. The contract was the single most important artefact in the project.

## Sprint 1: skeleton

End-to-end shippable skeleton: every screen wired, no fidelity, no copy polish. Goal: prove the technical path works on real Android devices in patchy network conditions. We caught two issues here that would have been catastrophic later (the camera permission flow doesn't behave the same on stock Android vs. one of the major OEMs).

## Sprint 2: fidelity

Real design, real copy, real loading states. Started with the camera helper since it was the riskiest piece. Localised microcopy to English + French. Partner bank reviewed regulator-required disclosures.

## Sprint 3: instrumentation + launch

Wired Mixpanel events for every step. Soft-launched to 10% of new signups, watched the funnel for 48 hours, opened the gate to 100%.

## What almost broke it

- **Mid-sprint scope creep.** Compliance asked to bundle address verification into the same redesign in week 4. I had to say no in writing, with the contract attached. They agreed (next quarter).
- **One person sick at the wrong time.** I should have had backup ownership documented. I do now.
- **A partner-bank dependency we discovered late.** Always ask the external partner what they need from you in the first week. We asked in week 5.

## The result

The redesign drove the 40% retention lift and 60% support-ticket reduction PaySika now publishes. The contract is now the template I use for every scoped delivery project.`,
    },
    {
      id: 'pm_kody_5k_to_mvp',
      title: 'Co-founding Kody: from $5,000 funding to a live MVP in 6 months',
      excerpt:
        'A two-person team, $5,000 from the Tony Elumelu Foundation, and an ed-tech idea. Here\'s what shipping our MVP taught me that I still use as a PM today.',
      date: 'March 21, 2026',
      author: 'Ndouken Theryx',
      read_time: '7 min read',
      tags: ['Product management', 'Founding', 'EdTech'],
      image: 'shomi-cover.png',
      is_hidden: false,
      sort_order: 1,
      content: `# Co-founding Kody: from $5,000 funding to a live MVP in 6 months

In 2019, my friend and I won $5,000 from the Tony Elumelu Foundation for an ed-tech idea we called Shomi: interactive prep booklets for Cameroonian secondary-school students. Six months later we shipped a live MVP. A year later we sunset it. Both halves of that story taught me PM lessons I still use.

## What worked

### Tight scope from week one
One product, one platform, one audience. We had two other ideas we could have run with the same funding. We said no to both in the first month. Holding scope is the loneliest part of founding work and the part that separates shipping from almost-shipping.

### A user-research partnership
PREXCEL, a local exam-prep school, became our partner. They gave us direct access to the students we were designing for. Without that partnership we'd have built for an imagined audience.

### Usability testing before high-fidelity design
We ran tests on Figma prototypes with five real students before any production work. They told us things we couldn't have inferred: the language toggle was unfindable; the payment page was confusing. Both fixable cheaply at that stage.

## What didn't work

### Underestimated content strategy
Our retention model depended on a steady stream of fresh exam-prep content we couldn't sustainably produce at our team size and budget. We discovered this six months in. By then we'd built the platform around the assumption.

### Misread market signal
Early enthusiasm from students in the pilot wasn't predictive of broader adoption. The pilot students engaged because they liked us and the platform was new. Without ongoing content their engagement dropped.

### Underweighted the post-launch operational load
Customer support, content updates, payment reconciliation: none of that fit a two-person team alongside continued development.

## The post-mortem

When we sunset the product, I wrote a long-form post-mortem. It is one of the most useful artefacts from the project. Every PM project I run now starts by reading my own past post-mortems: the same patterns recur.

## What I'd tell my younger PM self

The content moat question, *can we keep this product fed sustainably at our team size?*, needed to be answered in week one of design, not month six of operations. Scope discipline isn't just about feature creep. It's about whether the operational model survives contact with reality.`,
    },
  ],
  about: {
    speakingIntro:
      "I presented research on Cameroon's tech ecosystem at an **OSS Cameroon** event in 2022, and I write about Product Lifecycle Management (PLM), telecom/fintech API integrations, and aligning business value with agile engineering delivery.",
    faqs: [
      {
        question: 'How do you approach Product Lifecycle Management (PLM) and Go-To-Market (GTM) for B2B/Enterprise products?',
        answer:
          'I manage products across their complete lifecycle: opportunity assessment, investment business case formulation, requirement definition (PRDs/epics), technical integration with core rails (telecom/billing APIs), user acceptance testing, and structured GTM rollout. Post-launch, I continuously evaluate adoption metrics, churn, and operational feedback to drive iterative upgrades and maintain high product ROI.',
      },
      {
        question: 'How do you build investment business cases for new product developments?',
        answer:
          'I calculate total cost of ownership (CapEx and OpEx), projected revenue impact (ARPU, transactional volume, conversion uplift), and customer acquisition/servicing costs against market opportunity sizing (TAM/SAM/SOM). I validate assumptions early through customer interviews and prototype testing to ensure capital is only deployed behind high-confidence, high-return initiatives.',
      },
      {
        question: 'How do you handle integrations with telecom networks, mobile charging, and local market constraints in Central Africa?',
        answer:
          'I design and coordinate product flows with real African network realities in mind: handling API latency, building robust webhook retry mechanisms for Mobile Money (MTN MoMo/Orange Money), implementing USSD/SMS transactional fallback, and ensuring user experiences remain frictionless even on 2G/3G connections and lower-end Android devices.',
      },
      {
        question: 'How do you prioritize what goes on the roadmap?',
        answer:
          'I weigh four critical vectors: enterprise/business value, customer experience impact, regulatory/compliance requirements, and technical feasibility. Then I leverage analytics (Mixpanel funnels, transaction logs) to break ties with real behavioral data rather than intuition, maintaining one single prioritized backlog aligned with executive strategy.',
      },
      {
        question: 'How do you balance growth with regulatory compliance and telecom/banking standards?',
        answer:
          'In regulated fintech and telecom environments, compliance and data security are core design constraints, not afterthoughts. At PaySika and GEFONA, I worked directly with compliance officers, partner banks, and regulatory guidelines (ART, MINPOSTEL, COBAC) so that our onboarding, KYC, and transactional flows complied with all legal frameworks while maintaining high conversion rates.',
      },
    ],
  },
};

// ─── brand-designer ──────────────────────────────────────────────────────

const brandDesignerPreset: ProfilePreset = {
  profile: {
    name: 'Brand Designer',
    is_active: false,
    bio:
      'Brand Designer who owns visual identity end to end across fintech, small business, and non-profit: brand systems, reusable asset libraries, and accessible design language across mobile, web, and print.',
    tagline: 'A brand is a promise kept on every screen.',
    hero_title: 'Brand Designer',
    hero_subtitle:
      'Nearly four years shaping and looking after the PaySika brand across mobile, web, and physical cards, plus founding brand work for GUEEMSHOME and GEFONA Digital Foundation. I build brand systems and reusable asset kits, and I make sure the visual language holds up equally well in French and English.',
    philosophy_title: 'Consistency is what turns a logo into a brand.',
    philosophy_text:
      "A brand is not the logo, it's whether the thousandth thing someone sees still looks like the first. I build the visual system once, write it down somewhere people actually check, and make the on-brand version the fastest one to grab, so nobody has to choose between shipping on time and shipping on-brand.",
    intro_expanded_text:
      "The best compliment I get isn't \"nice logo,\" it's someone recognising a screen they've never seen before as unmistakably ours. That only happens when the system holds up without me in the room. The case studies below show that work: the guides, the systems, the process, not just the finished screens.",
    badges: ['Open to Brand Designer roles', 'Brand systems · Accessibility · FR/EN'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Building out a shared brand library and reusable asset kits for a Central African fintech, plus ongoing brand work for GUEEMSHOME and GEFONA Digital Foundation',
    projects_intro:
      'Visual identity, brand systems, and accessible design language shipped across fintech, small business, and non-profit, on mobile, web, and print.',
    blog_intro: 'Notes on keeping a brand from drifting, accessible colour, and what actually scales.',
    metric_label: 'years building brand systems',
  }),
  projects: [
    {
      id: 'paysika_brand-designer',
      tag: 'Visual identity · Brand system',
      title: 'PaySika brand identity',
      tagline:
        'Owned the PaySika visual identity across digital products and marketing.',
      image: 'paysika_mockup.png',
      description:
        'As Lead Designer and a founding-team member, I led the PaySika design team and owned the visual identity end to end as the company grew from MVP to a multi-product fintech serving thousands of users in Central Africa. I built and maintained the brand guide and design system, ran the reusable asset library that Marketing and Product pulled from, and carried the identity from the app all the way to the physical Visa-partner card and its packaging.',
      impact: 'A single, documented visual identity applied consistently across every PaySika touchpoint.',
      site: 'https://www.paysika.co',
      role: 'Lead Designer · Brand Owner',
      period: 'Nov 2022 - Aug 2026',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Led the PaySika design team and owned the visual identity everywhere a customer or teammate ran into the brand',
        'Defined and maintained the brand guide and design system: typography, colour, logo usage, iconography, imagery, layout, and motion',
        'Built and kept a shared asset library organised, with clear file names and version history, so Marketing and Product could grab the current file and ship on-brand without waiting on design',
        'Extended the identity into the physical debit card and mailer, working directly with the manufacturer',
        'Produced launch and campaign visuals including light motion (short promo and onboarding animations)',
        'Supervised branded events and produced branded merchandise and internal assets: notebooks, mugs, stickers, roll-up banners, out-of-home billboards, and screen wallpapers',
        'Partnered with compliance and our partner bank so customer-facing communications stayed accurate and regulator-aligned',
        'Ran a simple intake process to receive, prioritise, and track design requests across teams',
        'Localised brand voice and copy across French and English with Claude as a copy partner',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to look and feel like one trustworthy institution across a fast-growing set of surfaces (app, web, ad creative, sales decks, and the physical card) while a small team shipped quickly. Without a shared system, every new surface drifted a little further from the last.',
      solution: 'The Solution',
      solution_text:
        'I built one brand system and made it the easy default. Semantic tokens for colour and type, a documented logo and iconography set, and a self-serve asset library meant any team could produce on-brand work without waiting on design. Every piece of work got the same gut check: would this feel like it came from anyone, or does it feel like PaySika.',
      result: 'The Result',
      result_text:
        'A consistent identity from the first ad a user sees to the card that arrives in the mail, and an asset pipeline that let Marketing and Product move without breaking the brand.',
      is_hidden: false,
      sort_order: 0,
      content: '',
    },
    {
      id: 'gueemshome_brand-designer',
      tag: 'Brand identity · Web · Marketing',
      title: 'GUEEMSHOME',
      tagline:
        'End-to-end brand for a French artisanal home-fragrance house: identity, brand guide, website, and marketing assets.',
      image: 'gueemshome_hero.jpg',
      description:
        "GUEEMSHOME is a Paris-based artisanal home-fragrance house, plant-based, rechargeable candles, room perfumes, and gift sets, founded by Anasthasie Gueem's. As the brand designer, I built the brand from the ground up: the visual identity and brand guide, the design of the e-commerce website, and the marketing assets, so a founder's vision arrived online as one coherent, premium brand.",
      impact: 'A complete, coherent brand from logo to storefront to social, launched and live.',
      site: 'https://gueemshome.com/',
      role: 'Brand Designer (Remote)',
      period: '2022',
      location: 'Remote — client in Paris, France',
      responsibilities: [
        'Designed the GUEEMSHOME visual identity: the GH monogram logo, typography, colour palette, and imagery direction',
        'Created the brand guide so the identity stayed consistent as the brand grew',
        'Designed the e-commerce website, from layout to product pages, which a developer then built in WordPress',
        'Produced marketing assets and collateral: social content, product and campaign visuals, bilingual insert cards, and custom branded QR codes',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'A founder had a clear vision, artisanal, conscious, warm home fragrance, but no brand to carry it. GUEEMSHOME needed a complete identity, a website to sell from, and marketing assets, all feeling premium and hand-made rather than mass-market, on a small-business budget.',
      solution: 'The Solution',
      solution_text:
        'I built the brand from the name outward: a monogram identity and a brand guide fixing typography, colour, and imagery; an e-commerce website designed around the product for a developer to build; and a kit of marketing assets so social, product, and campaign visuals all shared one warm, restrained look.',
      result: 'The Result',
      result_text:
        "GUEEMSHOME launched as a coherent brand, live at gueemshome.com and active on Instagram with a growing community, consistent from the logo to the storefront to the feed.",
      is_hidden: false,
      sort_order: 1,
      content: '',
    },
    {
      id: 'gefona_brand-designer',
      tag: 'NGO · Identity · Web',
      title: 'GEFONA Digital Foundation',
      tagline: 'Founding brand designer for a Cameroon-based digital-policy foundation: identity, brand guide, and website.',
      image: 'gefona_logo.png',
      description:
        'GEFONA Digital Foundation is an independent non-profit based in Yaoundé, Cameroon, publishing policy-relevant research on digital technology, the digital economy, and cybersecurity across Africa. As one of the founding designers, I built the visual identity and brand guide, redesigned and rebuilt the website, and have designed its campaign and social media presence ever since.',
      impact: 'A credible, consistently branded research foundation with a live website and an ongoing campaign presence.',
      site: 'https://www.gefona.org/',
      role: 'Founding Brand Designer',
      period: 'Mar 2020 - Present',
      location: 'Remote — Yaoundé, Cameroon',
      responsibilities: [
        'Designed the GEFONA visual identity: the geometric Africa mark, colour palette, and typography, and documented it in a brand guide',
        'Redesigned and rebuilt the foundation\'s WordPress website across desktop, tablet, and mobile, keeping the information architecture while modernising the visual system',
        'Designed business cards, an onboarding deck, and a team-recognition certificate template for internal awards',
        'Designed bilingual (French/English) campaign and sponsorship-proposal decks for the foundation\'s outreach programmes',
        'Produce ongoing social media content and campaign graphics as one of the foundation\'s founding designers',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'GEFONA needed to look like the credible, policy-focused research foundation it aimed to be: no existing visual identity, a generic starter website, and no consistent way to present itself to partners, sponsors, or the public.',
      solution: 'The Solution',
      solution_text:
        "As a founding designer, I built the identity from scratch: a geometric Africa-shaped mark, a documented brand guide, and a rebuilt website that kept the site's structure but modernised its visual system across devices. I extended the same system into business cards, onboarding materials, and bilingual campaign and sponsorship decks.",
      result: 'The Result',
      result_text:
        'A foundation that presents itself consistently everywhere it shows up: a rebuilt website, a documented identity, and campaign materials that partners and sponsors can trust, still in active use since 2022.',
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'brand_hub_fintech',
      title: 'Keeping brand assets somewhere people actually use them',
      excerpt:
        'A folder of logos nobody opens might as well not exist. Here is how I built a shared library at PaySika that people reached for on their own.',
      date: 'June 2, 2026',
      author: 'Ndouken Theryx',
      read_time: '6 min read',
      tags: ['Brand', 'Design systems'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 0,
      content: `# Keeping brand assets somewhere people actually use them

Most style guides die the same way: a beautiful PDF, shared once, opened never. At PaySika I stopped thinking of the brand as a document and built a shared library instead, a living place people actually reached for because pulling from it was faster than not.

## Make the on-brand option the fast option

Consistency loses to a deadline every single time you make someone choose between them. So the whole point of the library was removing that choice. If grabbing an approved template is the fastest way to make a campaign asset, the campaign asset ends up on-brand. If digging up last quarter's file is faster, it won't.

## What lived in it

- **Tokens, not swatches.** Colour and type saved as named values (accent/primary, not "the orange"), so a brand-wide change is one edit, not a search-and-replace.
- **Logo and icon rules** with side-by-side right and wrong examples, since showing the wrong way stops more drift than describing the right one.
- **A library people could actually search**: logos, lockups, photo treatments, deck templates, social and email templates, sorted by team.
- **Clear names and version history**, so the file someone opens is the current one, and old drafts don't quietly outlive their usefulness.
- **Instructions written for someone in a rush**, not someone with a spare afternoon.

## Staying out of the way

Owning the brand didn't mean signing off on every asset. It meant building things so most work landed on-brand without me looking at it, and saving my attention for the handful of launches where getting it wrong would actually cost something.

## How I knew it was working

Not compliments on the guidelines. It was marketing shipping a campaign without filing a design request, and it still looking like PaySika. That's the only signal that actually matters.`,
    },
    {
      id: 'brand_accessible_color',
      title: 'Why accessible colour is a brand decision, not a compliance checkbox',
      excerpt:
        'WCAG contrast rules read like a compliance checklist. Treat them as a brand decision instead, and the colour system gets better, not blander.',
      date: 'April 25, 2026',
      author: 'Ndouken Theryx',
      read_time: '5 min read',
      tags: ['Brand', 'Accessibility'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 1,
      content: `# Why accessible colour is a brand decision, not a compliance checkbox

Every brand designer eventually meets this moment: a primary colour that looks perfect in a moodboard and fails WCAG AA contrast the instant it lands on a real button. The easy move is to hand that off to engineering as "make the text darker." The harder, better move is to own it as a brand decision, because the primary colour *is* the brand, and a colour that excludes users with low vision is a brand that does not keep its promise.

## Test on real components, not swatches

Contrast has to be checked on the actual component, not a colour-picker preview. A hex value can pass a swatch test and still fail the moment it sits behind white text on a real button, at real size, on a real screen. In the PaySika design system, I check contrast at the component level before a colour or type choice ships, not after a complaint comes in.

## Fix it in one place

The reason to build a brand system on semantic tokens instead of pasted hex values: a fix only has to happen once. Change the token, and every surface that reads from it updates together. If your brand colour is pasted as a raw hex value in forty files, that is the real problem to fix before the next contrast issue even shows up.

## What I'd tell a brand designer starting today

Accessible and distinctive are not opposites. Constraint makes a palette better, not blander, the same way a tight brief makes a design better. Contrast-test your brand colour on real components before it is ever "the colour," not after.`,
    },
  ],
  about: {
    speakingIntro:
      'I write and speak about brand systems, accessible visual design, and keeping a brand consistent as it scales across surfaces, sectors, and languages.',
    faqs: [
      {
        question: 'What does owning a brand end to end look like for you?',
        answer:
          "Defining the visual system once (type, colour, icons, imagery, motion), writing it down somewhere people actually check, building reusable kits per team, stepping in myself before the big, visible launches, and carrying the identity into every surface: mobile, web, and print. At PaySika that included the physical Visa-partner card.",
      },
      {
        question: 'How do you keep a brand consistent without becoming a bottleneck?',
        answer:
          'Build the system so the on-brand choice is the fastest choice, then let most work happen without review. Semantic tokens, an approved asset library, and clear usage docs handle the everyday; I reserve hands-on review for the high-stakes launches.',
      },
      {
        question: 'How do you handle accessibility in brand work?',
        answer:
          'I treat WCAG as a brand input, not a compliance afterthought. In the PaySika design system, every colour and type choice is checked for contrast and legibility before it ships, and imagery is chosen to represent the audience the brand actually serves. Accessible and distinctive are not a trade-off.',
      },
      {
        question: 'How do you handle incoming design requests?',
        answer:
          'Every request goes into one visible list instead of someone\'s DMs. I weigh a handful of things when I decide what\'s next: how many people will actually notice it, whether it touches anything regulated, how urgent it really is versus how urgent it feels, and how long it will take. Anyone can see where their ask sits, which cuts down the "any update?" messages a lot.',
      },
      {
        question: 'Which tools do you work in?',
        answer:
          "Figma's where the brand system and components live day to day. For identity and print work I'm in Illustrator, Photoshop, and InDesign, and I'll drop into After Effects when something needs to move. I lean on Claude for French and English copy and the more tedious production tasks, and I know enough HTML/CSS to know what I'm asking an engineer for.",
      },
    ],
  },
};

// ─── trust-wallet ────────────────────────────────────────────────────────

const trustWalletPreset: ProfilePreset = {
  profile: {
    name: 'Trust Wallet',
    is_active: true,
    bio: 'Design Engineer bridging Figma and production React Native. 4+ years in fintech mobile apps, tokenized design systems, and zero-loss handoffs.',
    tagline: 'Translating high-craft design into performant React Native interfaces for 200M+ users.',
    hero_title: 'Design Engineer for Trust Wallet',
    hero_subtitle:
      'Closing the gap between Figma and production code. 4+ years leading fintech mobile UX, engineering token-based design systems, and eliminating handoff friction for crypto & payments.',
    philosophy_title: 'The best handoff is no handoff.',
    philosophy_text:
      'When the person making the design decision also writes the component, there is no fidelity loss, no "looks different from the mock" ticket, and no handoff doc going stale. I build systems where Figma variables and code tokens are the same single source of truth.',
    intro_expanded_text:
      'Trust Wallet gives 200M+ people self-custodial ownership over their assets. At that scale, interaction fidelity, state clarity, and 60fps micro-animations are paramount. I bridge design systems and React Native components so product teams ship faster with zero drift.',
    badges: [
      'Design Engineering',
      'Figma ↔ React Native',
      'Design Systems & Tokens',
      'Fintech & Self-Custody UX',
    ],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Targeted profile for Trust Wallet — Design Engineer role',
    company_name: 'Trust Wallet',
    role_target: 'Design Engineer',
    job_url: 'https://jobs.ashbyhq.com/trust-wallet/72c2f324-d2d7-4037-b3a8-d9afb25dbe18',
    projects_intro:
      'Token-based design systems, mobile wallet flows, and production React components engineered for scale and high fidelity.',
    blog_intro: 'Notes on the Figma-to-code pipeline, token architecture, and eliminating handoff friction.',
    metric_label: 'years bridging design & code',
  }),
  projects: designEngineerPreset.projects,
  blogPosts: designEngineerPreset.blogPosts,
  about: {
    speakingIntro:
      'I write and speak about design systems, Figma-to-code workflows, and how design engineers bridge high craft and performant code in fintech and Web3.',
    faqs: [
      {
        question: 'Why Trust Wallet?',
        answer:
          'Trust Wallet is the standard for self-custody with over 200M users. At that scale, design engineering is not cosmetic — it directly determines whether users feel confident sending funds or navigating on-chain protocols. I want to build the UI primitives and interaction systems that empower that confidence.',
      },
      {
        question: 'How do you handle Figma to React Native handoff?',
        answer:
          'By removing the traditional handoff barrier. I align Figma variables directly with code tokens, build reusable primitives, and write the React Native components myself or run peer PR reviews with engineers.',
      },
      {
        question: 'What experience do you have with mobile fintech?',
        answer:
          'Nearly four years at PaySika as UX Design Lead and founding designer, building mobile wallets, KYC verification cameras, and card journeys that scaled to thousands of active users with a 40% retention lift.',
      },
      {
        question: 'How do you balance 60fps micro-interactions and performance?',
        answer:
          'I prototype motion directly in code using gesture handlers and hardware-accelerated transforms (Reanimated / CSS springs). Animations must never block interaction or cause jank on lower-end devices.',
      },
    ],
  },
};

// ─── exports ─────────────────────────────────────────────────────────────

export const profilePresets: Record<string, ProfilePreset> = {
  'product-design': productDesignPreset,
  'design-engineer': designEngineerPreset,
  'digital-marketing': digitalMarketingPreset,
  'project-manager': projectManagerPreset,
  'brand-designer': brandDesignerPreset,
  'trust-wallet': trustWalletPreset,
};

export const presetProfileIds = Object.keys(profilePresets);

/**
 * Builds a complete Profile object from a preset id, suitable for use as the
 * offline fallback before the API responds.
 */
export function presetProfile(id: string): Profile | null {
  const preset = profilePresets[id];
  if (!preset) return null;
  return {
    id,
    ...preset.profile,
    social_links: preset.social_links,
    about_content: {
      speaking_intro: preset.about.speakingIntro,
      faqs: preset.about.faqs,
    },
  };
}
