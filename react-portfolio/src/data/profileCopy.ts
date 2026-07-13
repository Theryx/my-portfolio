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
// Profile ids covered: fintech, design-engineer, digital-marketing,
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

export type ProjectSeed = Omit<Project, 'profile_id'>;
export type BlogPostSeed = Omit<BlogPost, 'profile_id'>;

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
  'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';

function commonLinks(extras: Record<string, string>): Record<string, string> {
  return {
    email: NDOUKEN_EMAIL,
    linkedin: NDOUKEN_LINKEDIN,
    resume: NDOUKEN_RESUME,
    ...extras,
  };
}

// ─── fintech ─────────────────────────────────────────────────────────────

const fintechPreset: ProfilePreset = {
  profile: {
    name: 'Fintech Focus',
    is_active: false,
    bio: 'Fintech Product Designer with four years leading design at PaySika across mobile, web, and physical card products serving thousands of users in Central Africa.',
    tagline: 'I design financial products that earn trust with the first tap.',
    hero_title: 'Fintech Product Designer',
    hero_subtitle:
      'Four years leading design at PaySika across onboarding, KYC, transactions, and physical cards. I specialise in simplifying complex financial flows for African mobile users.',
    philosophy_title: 'Trust is the core currency of financial design.',
    philosophy_text:
      'Every financial product asks the user to bet their money on a screen. My job is to make that bet feel obvious: clear hierarchy, predictable interactions, honest copy, no surprises. I pair Mixpanel data with usability testing to find where trust breaks and rebuild from there.',
    badges: ['Open to fintech design roles', 'Payments · KYC · Mobile money'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Researching mobile-money onboarding patterns across West & Central Africa',
    projects_intro:
      'Payments, KYC, cards, and cross-border transfers for African fintech, shipped at scale and measured in retention.',
    blog_intro: 'Notes on trust, compliance, and mobile money UX from the field in Cameroon.',
    metric_label: 'years leading fintech design',
  }),
  projects: [
    {
      id: 'paysika_fintech',
      tag: 'Payments · KYC · Cards',
      title: 'PaySika',
      tagline: '40% retention lift and 60% fewer support tickets across mobile, web, and physical cards.',
      image: 'paysika_mockup.png',
      description:
        'As Lead Product Designer and founding team member, I scaled PaySika from MVP to a multi-product fintech serving thousands of active users across Central Africa. I led a two-person design team, redesigned the KYC and onboarding flows, and shipped the physical Visa-partner card from artwork to unboxing.',
      impact: 'Scaled fintech operations serving thousands of users across Central Africa.',
      site: 'https://www.paysika.co',
      role: 'Lead Product Designer',
      period: 'Dec 2021 - Present',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Recruited and managed a two-person design team and set up the asset-handoff pipeline to engineering',
        'Redesigned onboarding, KYC photo capture, and Visa-activation flows; measured drop-off in Mixpanel and iterated',
        'Led the physical debit card industrial and print design, working directly with the card manufacturer',
        'Wrote and localised English / French UI microcopy using Claude as a copy partner',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to differentiate in a crowded African fintech market while making complex financial services accessible to everyday users on patchy mobile networks. KYC drop-off was the biggest leak in the funnel.',
      solution: 'The Solution',
      solution_text:
        'I redesigned the whole journey around three rules: every screen states what it costs you, every input shows why we need it, and every success state confirms in plain language. The KYC photo step became a guided real-time camera helper rather than a generic file upload.',
      result: 'The Result',
      result_text:
        '40% lift in user retention and 60% reduction in customer support tickets. The design system we built scaled across mobile, web, and the physical card mailer.',
      is_hidden: false,
      sort_order: 0,
      content: `## What I designed at PaySika

### Onboarding & KYC
Before the redesign, KYC photo upload was a generic file picker that failed quietly on most Android browsers in Cameroon. I replaced it with a guided real-time camera helper that frames the document for the user, gives live feedback on glare and focus, and only accepts the photo once it passes a client-side check. Mixpanel confirmed the redesign: successful first-attempt KYC went up sharply, and the related support tickets dropped by a measurable margin.

### Transaction history
I rewrote the transaction history to behave the way people actually scan financial statements: grouped by day, currency-formatted with thousand separators, every line including a one-tap support shortcut. Failed transactions are visually distinct and surface the reason ("network timeout", "insufficient balance") instead of a generic error code.

### Physical card
I led the industrial design of PaySika's physical Visa-partner card and its mailer packaging. We worked directly with the card manufacturer on substrate, finish, and emboss placement; the mailer was designed so the first thing the user sees after opening is the card itself, framed against a brand-colour insert.

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
      period: 'Dec 2022 - Dec 2023',
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
      'I speak about fintech design, mobile money UX, and what scales (and what doesn\'t) across the African market.',
    faqs: [
      {
        question: 'What fintech surfaces have you shipped?',
        answer:
          'Onboarding, KYC photo capture, transaction history, multi-currency wallets, virtual & physical Visa-partner cards, mobile money top-up, and admin dashboards. Mobile, web, and native iOS/Android.',
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
      'I close the loop between Figma and production code. React, TypeScript, design tokens, and Claude as a daily working partner. Four years at PaySika shipping the artwork and the implementation.',
    philosophy_title: 'The best handoff is no handoff.',
    philosophy_text:
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
      role: 'Lead Product Designer · Design Engineer',
      period: 'Dec 2021 - Present',
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
        'A single codebase that serves multiple persona-tailored portfolios (default, fintech, design-engineer, marketing, PM) from one URL, editable end-to-end through a CMS, without losing the playful identity of a bento-style design.',
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
      period: 'Dec 2021 - Present',
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
      period: 'Dec 2022 - Dec 2023',
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
    name: 'Project Manager',
    is_active: false,
    bio:
      'Product & Project Manager with four years scaling PaySika from MVP to a multi-product fintech, plus co-founding experience taking Kody from $5,000 funding to live MVP.',
    tagline: 'Clarity is a deliverable.',
    hero_title: 'Product & Project Manager',
    hero_subtitle:
      'I lead cross-functional teams through scoping, delivery, and the messy middle. Four years coordinating design, engineering, and marketing at PaySika; co-founder of Kody (Tony Elumelu Foundation-funded MVP); maintainer of an open-source community platform.',
    philosophy_title: 'Clarity is a deliverable.',
    philosophy_text:
      "Most projects don't fail on talent or budget. They fail because the team disagrees about what \"done\" looks like and nobody writes it down. My job is to write it down, explicitly, early, and with the right level of detail, and to keep the team aligned through the parts where reality contradicts the plan.",
    badges: ['Open to PM & delivery roles', 'Product · Cross-functional · Open source'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Coordinating a multi-quarter PaySika roadmap across design, eng, and marketing',
    projects_intro:
      'Cross-functional product and delivery work: at PaySika, at Kody (where I co-founded an ed-tech MVP), and in the open-source community.',
    blog_intro: 'Notes on shipping cross-functional work: scoping, async coordination, and what to cut when reality bites.',
    metric_label: 'years leading product delivery',
  }),
  projects: [
    {
      id: 'paysika_project-manager',
      tag: 'Fintech · Cross-functional delivery',
      title: 'PaySika product & design delivery',
      tagline:
        'Coordinated design, engineering, and marketing through a multi-product fintech roadmap: KYC, cards, transactions, dashboards.',
      image: 'paysika_mockup.png',
      description:
        "As Lead Product Designer and a founding-team member, I owned cross-functional delivery for design at PaySika: managing a two-person design team, coordinating with engineering and marketing on sprint and release cycles, and acting as the bridge that kept the roadmap honest when reality contradicted the plan.",
      impact: 'Shipped major redesigns (KYC, transactions, physical card) on cadence across a multi-product fintech.',
      site: 'https://www.paysika.co',
      role: 'Lead Product Designer · Team Lead',
      period: 'Dec 2021 - Present',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Recruited and managed a two-person design team: hiring, performance, growth',
        'Engineered the design-to-engineering handoff process (Figma, documentation, PR review rhythms)',
        'Engineered the design-to-marketing pipeline so marketing could fetch brand-approved assets without blocking design',
        'Drove KYC redesign delivery in three sprints with eng, design, and the partner bank',
        'Translated product briefs into scoped, deliverable user flows, and protected the team from scope creep',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to ship multiple major product surfaces (KYC, transactions, cards) on cadence, with a small team, while keeping design quality high and engineering velocity steady. Cross-functional coordination (design, engineering, marketing, partner bank) was the bottleneck, not headcount.',
      solution: 'The Solution',
      solution_text:
        'I built explicit hand-off rituals between teams, documented them once, and kept them. Design-to-engineering: scoped Figma files with edge cases written in, PR reviews catching visual drift. Design-to-marketing: brand-approved asset library that marketing pulled from. Sprint planning broke big bets into shippable slices with clear "done" criteria.',
      result: 'The Result',
      result_text:
        '40% lift in user retention and 60% reduction in support tickets driven by the KYC redesign. The handoff rituals survived team changes and are still in use.',
      is_hidden: false,
      sort_order: 0,
      content: `## What I coordinated at PaySika

### Hiring & team management
I recruited the team that turned PaySika design from a solo function into a small group. That meant writing role descriptions, screening, structured interviews, and, once people joined, running 1:1s, performance feedback, and growth conversations.

### Design-to-engineering process
Before the change, engineering rebuilt the same component three slightly different ways across surfaces. I rebuilt the handoff: scoped Figma files with edge cases written in, semantic design tokens shared between Figma and code, PR review where I (and the designer who owned the file) caught visual drift before merge. The "looks different from the mock" ticket category went away.

### Design-to-marketing process
Marketing used to wait on design for every campaign asset. I built a brand-approved asset pipeline (locked files, asset library, versioning) that marketing could fetch from without a design ticket. Both teams' velocity went up.

### Sprint discipline
I wrote scope before each sprint and held the line on it. Mid-sprint requests went to the next sprint by default. Mid-sprint *blocking* requests got triaged: cut something else, or extend the sprint, but not both silently.

### Stakeholder communication
At a fintech with a partner bank, regulator, and investors all asking for updates, I wrote one weekly update that all three could read. Same source, three audiences, no contradictions.`,
    },
    {
      id: 'shomi_project-manager',
      tag: 'EdTech · Co-founding',
      title: 'Kody / Shomi: co-founding an ed-tech MVP',
      tagline:
        'Took an ed-tech idea from Tony Elumelu Foundation funding ($5,000) to live MVP with a two-person team.',
      image: 'shomi-cover.png',
      description:
        'Co-founder of Kody (the company) and product lead on Shomi (the product). We raised $5,000 from the Tony Elumelu Foundation, built and launched the MVP with a two-person team (me on product/design, my co-founder on engineering), and ran the product live for a year before sunsetting it.',
      impact: 'Raised $5,000, shipped a live MVP, and closed the loop with a documented post-mortem on retention.',
      site: '',
      role: 'Co-founder · Product Lead',
      period: 'Dec 2019 - Dec 2020',
      location: 'Cameroon',
      responsibilities: [
        'Wrote the funding pitch that won the Tony Elumelu Foundation award',
        'Owned product scope, roadmap, and user research',
        'Coordinated with our partner school (PREXCEL) for user access and validation',
        'Ran the post-mortem when retention told us the model wasn\'t working',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'A two-person team, $5,000, an unfamiliar product category (educational content for Cameroonian secondary-school students), and a year to prove the model.',
      solution: 'The Solution',
      solution_text:
        'Scoped tightly: one platform (mobile-first), one audience (students preparing for exams), one validated unmet need (interactive prep booklets). Partnered with PREXCEL for direct user access. Ran usability tests with real students before any high-fidelity design.',
      result: 'The Result',
      result_text:
        "Shipped the MVP, validated the layout, and ran the product live for twelve months. Sunset the product when retention told us the content-strategy moat we'd built wasn't deep enough to sustain growth. The post-mortem document is one of the most useful artefacts I've ever written.",
      is_hidden: false,
      sort_order: 1,
      content: `## What co-founding taught me about PM work

Co-founding compressed every PM lesson into one project: you cannot delegate scope discipline. You cannot delegate user-research follow-through. And the post-mortem matters more than the launch.

## The scope I held

We had $5,000 and a year. The scope was: one product, one platform, one audience. We turned down two parallel ideas in the first month; both were good ideas but neither was *this* idea. Holding scope is the lonely part of PM work and the part that separates shipped from almost-shipped.

## The post-mortem

When we sunset the product, I wrote a long-form post-mortem covering what we got right (user research, partnership with PREXCEL, fast MVP), what we got wrong (content-strategy moat too shallow, retention model dependent on weekly fresh content we couldn't sustainably produce), and what I would do differently. That document is the most useful artefact from the project.`,
    },
    {
      id: 'jobsika_project-manager',
      tag: 'Open source · Community delivery',
      title: 'JobSika: open-source community management',
      tagline:
        'Co-maintainer of a fully open-source jobs platform built by the Cameroonian developer community.',
      image: 'Screenshot of the UI of Jobsika.PNG',
      description:
        'As co-maintainer of JobSika at OSS Cameroon, I worked the project-management side of an open-source product: triaging issues, coordinating contributors across time zones, designing low-friction onboarding for first-time contributors, and keeping the roadmap visible and honest.',
      impact: 'A live open-source jobs platform with an active contributor community and a public roadmap.',
      site: 'https://jobsika.cm/',
      role: 'Co-maintainer & Design Lead (Open Source)',
      period: '2022 - 2024',
      location: 'Cameroon',
      responsibilities: [
        'Triaged GitHub issues: labelling, prioritisation, assignment',
        'Coordinated contributors across time zones with async-by-default communication',
        'Designed contributor onboarding (good-first-issue labelling, contribution guides, design issues alongside code issues)',
        'Kept the public roadmap honest and visible',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'Open-source communities live or die on contributor onboarding. A typical first-PR experience involves five hidden steps and a lot of waiting; we wanted contributors landing a merged PR in under a week.',
      solution: 'The Solution',
      solution_text:
        'Treated contributor onboarding as a product. Documented good-first-issues with explicit scope, paired new contributors with reviewers on join, and ran async-by-default communication so contributors across time zones could move without blocking.',
      result: 'The Result',
      result_text:
        "A live open-source jobs platform, a track record of new designers and developers landing their first open-source contribution through OSS Cameroon, and a documented contributor playbook still in use.",
      is_hidden: false,
      sort_order: 2,
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
      'I write and speak about cross-functional delivery, scope discipline, and what shipping at a small African fintech taught me about PM work.',
    faqs: [
      {
        question: 'Are you a PM, a designer, or both?',
        answer:
          'My title at PaySika is Lead Product Designer but the role is closer to "design PM": I own scope, hiring, delivery rhythm, and cross-functional handoffs alongside the design work itself. If you\'re hiring for a PM role where design fluency is a strength, I am that person.',
      },
      {
        question: 'How do you handle scope creep?',
        answer:
          "With a written contract before kickoff that names what we will and won't ship, signed by every team. Mid-sprint requests go to next sprint by default; blocking mid-sprint requests get triaged: we cut something or extend, but never both silently.",
      },
      {
        question: 'What\'s your async-vs-sync philosophy?',
        answer:
          'Async by default, sync by exception. A 30-minute meeting that could have been a Notion doc is a 30-minute tax on everyone present. I write clearly so meetings are reserved for decisions that genuinely need real-time conversation.',
      },
      {
        question: 'What did you learn from shipping a product that didn\'t make it?',
        answer:
          'Most of what I know about PM work. Kody/Shomi taught me that the operational-sustainability question (can we keep this product fed?) belongs in week one of design, not month six of operations. Every PM project I start now begins by re-reading my own post-mortems.',
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
      'Brand Designer who owns visual identity end to end for African fintech: brand systems, reusable asset libraries, and accessible design language across mobile, web, and print.',
    tagline: 'A brand is a promise kept on every screen.',
    hero_title: 'Brand Designer',
    hero_subtitle:
      'Four years shaping and safeguarding the PaySika brand across mobile, web, developer surfaces, and physical cards. I build brand systems, reusable asset kits, and an accessible visual language that reads as trust, simplicity, and reliability in French and English.',
    philosophy_title: 'Consistency is what turns a logo into a brand.',
    philosophy_text:
      'A brand is not the logo, it is the thousandth touchpoint looking like the first. My job is to define the visual system (type, colour, iconography, imagery, motion) once, document it clearly, and make the right choice the easy choice for every team that touches a customer. Every expression should quietly say the same thing: this is trustworthy, simple, and built to last.',
    badges: ['Open to Brand Designer roles', 'Brand systems · Accessibility · FR/EN'],
    social_links: {},
  },
  social_links: commonLinks({
    now: 'Building a brand hub and reusable asset kits for a Central African fintech',
    projects_intro:
      'Visual identity, brand systems, and accessible design language shipped across fintech mobile, web, developer, and print surfaces.',
    blog_intro: 'Notes on brand governance, accessible colour, and keeping a fintech brand consistent as it scales.',
    metric_label: 'years building fintech brand systems',
  }),
  projects: [
    {
      id: 'paysika_brand-designer',
      tag: 'Visual identity · Brand system',
      title: 'PaySika brand identity',
      tagline:
        'Owned the PaySika visual identity across mobile, web, developer surfaces, and physical cards.',
      image: 'paysika_mockup.png',
      description:
        'As Lead Product Designer and founding-team member, I shaped and safeguarded the PaySika brand as it grew from MVP to a multi-product fintech serving thousands of users in Central Africa. I defined the visual system (typography, colour, iconography, imagery), built the reusable asset library that Marketing and Product pulled from, and extended the brand into the physical Visa-partner card and its packaging.',
      impact: 'A single, documented visual identity applied consistently across every PaySika touchpoint.',
      site: 'https://www.paysika.co',
      role: 'Lead Product Designer · Brand Owner',
      period: 'Dec 2021 - Present',
      location: 'Douala, Cameroon',
      responsibilities: [
        'Defined and maintained the brand system: typography, colour, logo usage, iconography, imagery, layout, and motion',
        'Built and governed a reusable asset library with clear naming conventions, versioning, and file structure so Marketing and Product could ship on-brand without a design bottleneck',
        'Extended the identity into the physical debit card and mailer, working directly with the manufacturer',
        'Produced launch and campaign visuals including light motion (UI micro-interactions and short promo and onboarding animations)',
        'Partnered with the compliance side and our partner bank so customer-facing communications stayed accurate and regulator-aligned',
        'Ran a simple intake process to receive, prioritise, and track design requests across teams',
        'Localised brand voice and UI copy across French and English with Claude as a copy partner',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'PaySika needed to look and feel like one trustworthy institution across a growing set of surfaces (app, web, developer portal, ad creative, physical card) while a small team shipped fast. Without a shared system, every new surface drifted a little further from the last.',
      solution: 'The Solution',
      solution_text:
        'I built one brand system and made it the easy default. Semantic tokens for colour and type, a documented logo and iconography set, and a self-serve asset library meant any team could produce on-brand work without waiting on design. Every brand expression was checked against the same promise: trust, simplicity, reliability.',
      result: 'The Result',
      result_text:
        'A consistent identity from the first ad a user sees to the card that arrives in the mail, and an asset pipeline that let Marketing and Product move without breaking the brand.',
      is_hidden: false,
      sort_order: 0,
      content: `## Owning the PaySika brand

### One system, every surface
The unlock was treating the brand as a system, not a set of files. I defined semantic colour and type tokens, a logo-usage spec, an iconography set, and imagery guidelines, then documented them where every team could find them. The rule I held: the on-brand choice has to be the easy choice, or consistency will always lose to deadlines.

### A self-serve, governed asset library
Before, Marketing waited on design for every campaign asset. I built a brand-approved library (logos, lockups, type lockups, photo treatments, templates) that Marketing and Product could pull from directly. Just as important as the assets was the governance around them: clear naming conventions, versioning, and a predictable file structure, so people found the current file instead of resurrecting last quarter's. Velocity in both teams went up and the brand stopped drifting between departments.

### Brand into the physical world
I extended the identity into the physical Visa-partner card and its mailer, working directly with the manufacturer on substrate, finish, and emboss placement. The mailer was designed so the first thing a user sees on opening is the card itself, framed against a brand-colour insert. The same brand promise, now in the hand.

### Motion, kept light and on-brand
Not every brand needs a motion studio, but it does need motion that behaves. I handled the lighter end myself: UI micro-interactions, short promo and onboarding animations for launches, and social clips, all built from the same tokens and timing so movement felt like part of the brand rather than a bolt-on. When work went beyond my depth, I art-directed it against the same system.

### Working with compliance
At a regulated fintech, customer-facing communication is a shared responsibility. I worked with the compliance side and our partner bank so that required disclosures and regulator-sensitive copy stayed accurate without reading like fine-print afterthoughts, treating compliance language as design, not decoration.

### One brand voice, two languages
I localised brand voice and UI copy across French and English, using Claude to draft French variants that our francophone team edited. A bilingual audience should never feel like it is reading a translation of someone else's brand.`,
    },
    {
      id: 'crowdremit_brand-designer',
      tag: 'Accessible brand · WCAG',
      title: 'CrowdRemit accessible brand',
      tagline: 'Rebranded the primary colour after WCAG testing exposed a contrast failure on CTAs.',
      image: 'crowdremit_mockup.png',
      description:
        'As UX Researcher and Product Designer, I built the CrowdRemit visual identity and design system across iOS, Android, web, and dashboard, then led a brand-level decision to rebrand the primary colour after WCAG contrast testing showed it failed on buttons. Accessibility drove a core brand choice, not the other way around.',
      impact: 'A brand identity that passes WCAG AA contrast on every CTA across four surfaces.',
      site: '',
      role: 'UX Researcher & Product Designer',
      period: 'Jan 2021 - Jun 2021',
      location: 'Nigeria (remote)',
      responsibilities: [
        'Built the visual identity and design system: colour, type, iconography, and components',
        'Tested brand colour against WCAG AA contrast on real CTAs, including with visually-impaired participants',
        'Led the primary-colour rebrand and re-applied it across mobile, web, and the marketing site',
        'Documented the system as tokens so engineering could implement the brand consistently',
      ],
      challenge: 'The Challenge',
      challenge_text:
        'The original CrowdRemit primary colour failed WCAG AA contrast on CTA buttons against the lightest neutral. The brand looked good in a moodboard and excluded real users in production.',
      solution: 'The Solution',
      solution_text:
        'I tested four candidate replacements with a small group of users, including two visually-impaired participants, and picked a high-contrast orange that passes AA on every CTA. Then I re-applied it as a semantic token across all four surfaces and the marketing site so the fix was systemic, not per-screen.',
      result: 'The Result',
      result_text:
        'A brand that passes WCAG AA contrast on every CTA across iOS, Android, web, and dashboard, proving accessibility and a distinctive identity are not a trade-off.',
      is_hidden: false,
      sort_order: 1,
      content: `## Accessibility as a brand decision

CrowdRemit's original primary colour failed WCAG AA contrast on CTA buttons against the lightest neutral. It is easy to treat that as an engineering ticket. I treated it as a brand decision, because the primary colour is the brand, and a brand that excludes users with low vision is not doing its job.

## Testing the replacement

I tested four candidate colours against AA contrast on the actual CTAs, not in isolation, with a small group of users that included two visually-impaired participants. The selected high-contrast orange passes AA on every button in the product and held up across the marketing site.

## Fixing it systemically

The fix lived in one place: a semantic colour token. Changing the token re-applied the new primary across iOS, Android, web, and the dashboard at once. That is the whole argument for tokenised brand systems: a brand-level change should be one edit, not a forty-screen migration.`,
    },
    {
      id: 'matanga_brand-designer',
      tag: 'Agency · Client branding',
      title: 'Matanga client brand systems',
      tagline: 'Built brand systems from scratch for international and Cameroonian agency clients.',
      image: 'Matanga agancy website.PNG',
      description:
        'As Senior UI/UX Consultant (part-time) at Matanga Agency, I defined visual identities and reusable component libraries for clients ranging from early-stage MVPs to established e-commerce, most of whom arrived with no brand system at all.',
      impact: 'Delivered brand systems and asset libraries for 6+ clients across Central Africa and Europe.',
      site: 'https://matangaagency.com/fr/',
      role: 'Senior UI/UX Consultant (Part-time)',
      period: 'Dec 2022 - Dec 2023',
      location: 'Cameroon',
      responsibilities: [
        'Defined visual language from scratch (type, colour, iconography) where clients had none',
        'Built reusable component libraries and typography guides per client',
        'Documented brand usage so client teams could stay consistent after handoff',
      ],
      challenge: 'The Challenge',
      challenge_text:
        "Matanga's clients ranged from fintech MVPs to mature e-commerce, and most had no existing brand system. Each wanted pixel-perfect, consistent execution across their surfaces.",
      solution: 'The Solution',
      solution_text:
        'I worked as a plug-and-play brand lead: defined the visual language, built a reusable component library and type guide, and documented usage so the client could stay on-brand after I left. The library, not just the deliverable, was the point.',
      result: 'The Result',
      result_text:
        'Delivered brand systems for 6+ client launches and left each with documentation and an asset library their own teams could maintain.',
      is_hidden: false,
      sort_order: 2,
      content: '',
    },
  ],
  blogPosts: [
    {
      id: 'brand_hub_fintech',
      title: 'Building a brand hub that a fast-moving fintech will actually use',
      excerpt:
        'A brand guideline nobody opens is decoration. Here is how I built a brand hub at PaySika that Marketing and Product reached for by default.',
      date: 'June 2, 2026',
      author: 'Ndouken Theryx',
      read_time: '6 min read',
      tags: ['Brand', 'Design systems'],
      image: 'paysika_mockup.png',
      is_hidden: false,
      sort_order: 0,
      content: `# Building a brand hub that a fast-moving fintech will actually use

Most brand guidelines die the same way: a beautiful 60-page PDF, shared once, opened never. At PaySika I stopped treating the brand as a document and started treating it as a hub, a living, self-serve source of truth that teams reached for because it was faster than not reaching for it.

## The rule: the on-brand choice has to be the easy choice

Consistency loses to deadlines every time you make people choose between them. So the whole design of a brand hub is about removing that choice. If the fastest way to make a campaign asset is to pull an approved template from the hub, the campaign asset will be on-brand. If the fastest way is to eyeball last quarter's file, it won't.

## What went in the hub

- **Tokens, not swatches.** Colour and type as semantic tokens (color/accent/primary, not "the orange"), so a brand change is one edit.
- **Logo and iconography specs** with clear do and don't examples, because "don't" prevents more drift than "do".
- **A reusable asset library**: logos, lockups, photo treatments, presentation templates, social and email templates, per team.
- **Naming, versioning, and file structure** so the current asset is always the one people find, and stale files retire cleanly.
- **Usage documentation** written for the person in a hurry, not the person with an afternoon.

## Governance without becoming a bottleneck

Owning the brand does not mean reviewing every asset. It means building the system so most work is on-brand without review, and reserving review for the high-visibility, high-stakes launches. I reviewed significant initiatives before they shipped; everything else the hub handled on its own.

## The signal it was working

The signal was not compliments on the guidelines. It was Marketing shipping a campaign without opening a design ticket, and it still looking like PaySika. That is when a brand hub has done its job.`,
    },
    {
      id: 'brand_accessible_color',
      title: 'When your brand colour fails WCAG: an accessibility rebrand story',
      excerpt:
        'The CrowdRemit primary colour looked great and failed contrast on every button. Here is how I turned an accessibility failure into a better brand.',
      date: 'April 25, 2026',
      author: 'Ndouken Theryx',
      read_time: '5 min read',
      tags: ['Brand', 'Accessibility'],
      image: 'crowdremit_mockup.png',
      is_hidden: false,
      sort_order: 1,
      content: `# When your brand colour fails WCAG: an accessibility rebrand story

Every brand designer eventually meets this moment: the primary colour that looked perfect on the moodboard fails WCAG AA contrast the instant it lands on a real button. At CrowdRemit, that was our colour. Here is what I did, and why I think it made the brand stronger.

## Accessibility is a brand decision, not a bug ticket

It is tempting to hand a contrast failure to engineering as "make the text darker". But the primary colour *is* the brand. A brand colour that excludes users with low vision is a brand that does not keep its promise. So I owned the fix as a brand decision.

## Testing the candidates on real CTAs

I generated four replacement candidates and tested each against AA contrast on the actual call-to-action buttons, not in a swatch grid. I ran it past a small group of users including two visually-impaired participants. The winner, a high-contrast orange, passes AA on every CTA in the product.

## Fix it in one place

Because the colour lived as a semantic token, changing it re-applied the new primary across iOS, Android, web, and the marketing site at once. A brand-level change should be one edit, not a per-screen migration. If your brand colour is pasted as a hex value in forty files, that is the real problem to fix first.

## What I took from it

Accessible and distinctive are not opposites. The constraint made the palette better, not blander. Now I contrast-test brand colour on real components before it is ever "the colour", not after.`,
    },
  ],
  about: {
    speakingIntro:
      'I write and speak about brand systems, accessible visual design, and keeping a fintech brand consistent as it scales across surfaces and languages.',
    faqs: [
      {
        question: 'What does owning a brand end to end look like for you?',
        answer:
          'Defining the visual system (type, colour, iconography, imagery, motion), documenting it as a self-serve hub, building reusable asset kits per team, reviewing high-visibility work before it ships, and extending the identity into every surface: mobile, web, developer portals, and print. At PaySika that included the physical Visa-partner card.',
      },
      {
        question: 'How do you keep a brand consistent without becoming a bottleneck?',
        answer:
          'Build the system so the on-brand choice is the fastest choice, then let most work happen without review. Semantic tokens, an approved asset library, and clear usage docs handle the everyday; I reserve hands-on review for the high-stakes launches.',
      },
      {
        question: 'How do you handle accessibility in brand work?',
        answer:
          'I treat WCAG as a brand input, not a compliance afterthought. At CrowdRemit I led a primary-colour rebrand after contrast testing on real CTAs failed AA, and validated the replacement with visually-impaired users. Accessible and distinctive are not a trade-off.',
      },
      {
        question: 'How do you handle incoming design requests?',
        answer:
          'With a simple, visible intake: every request is logged, then prioritised on business impact, customer visibility, compliance sensitivity, urgency, and effort, so the highest-value work gets attention first and nothing gets lost in DMs. Requesters can see where their ask sits, which cuts the "any update?" pings dramatically.',
      },
      {
        question: 'Which tools do you work in?',
        answer:
          'Figma for brand systems and component libraries; Adobe Creative Suite (Illustrator, Photoshop, InDesign) for identity work, with After Effects for lighter motion; and AI-assisted tools like Claude for bilingual copy and production boilerplate. I also read and write basic HTML/CSS, which keeps my handoffs honest about what is buildable. I work fluently in both French and English.',
      },
    ],
  },
};

// ─── exports ─────────────────────────────────────────────────────────────

export const profilePresets: Record<string, ProfilePreset> = {
  fintech: fintechPreset,
  'design-engineer': designEngineerPreset,
  'digital-marketing': digitalMarketingPreset,
  'project-manager': projectManagerPreset,
  'brand-designer': brandDesignerPreset,
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
