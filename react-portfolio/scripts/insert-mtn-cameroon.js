import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const JOB_DESCRIPTION = `Coordinator, Products Core B2B (MTN Cameroon).
Contribute to product and service development from conception to route to market.
Ensure product lifecycle management, and upgrade or revamp existing products.
Drive innovation by managing the product portfolio from MTN Group and added value services that bring value for B2B customers and MTNC.
Guarantee the organisation of activities and the communication of the actions undertaken.
Knowledge of the enterprise business market, mobile technologies and trends, mobile, digital and ICT technologies, product development and management, customer experience and UI principles, mobile charging systems and customer management platforms, business analyst principles, and local markets.
Fluent in French and English.`;

// Neutral portfolio copy. No tailoring language, no em dashes.
const company = {
  id: 'mtn-cameroon',
  slug: 'mtn-cameroon',
  name: 'MTN Cameroon',
  role: 'Coordinator, Products Core B2B',
  job_url: '',
  job_description: JOB_DESCRIPTION,
  layout: 'mtn-cameroon-portfolio-v1',
  tagline:
    'Product manager and product designer working on regulated products, delivery and the operations around them.',
  hero_title: 'Ndouken Theryx',
  hero_subtitle:
    'I work on digital products end to end: discovery, delivery and the operations around them. Most of that work has been at PaySika, an African neo-bank, where I owned the product backlog and the card service that runs from the app to the relay point. Before that I designed cross-border transfers and an education platform.',
  philosophy_title: 'A product only counts when it ships.',
  philosophy_text:
    'Most of the work is decisions: what is in scope, what waits, and who signs it off. I keep one prioritized backlog, write acceptance criteria a team can test against, and keep the people who are not in the room, compliance, operations, support, up to date on the same source of truth.',
  intro_expanded_text:
    'I manage products across fintech, education and open source. At PaySika I owned the product backlog for the mobile app and web app, then took on the physical card service from ordering to relay-point pickup, including the internal app used by delivery agents. Earlier I co-founded an ed-tech product and ran its full lifecycle, from a grant-funded MVP to a documented sunset. I work in English and French, and I like staying close to the field where the product is actually used.',
  badges: [
    'Product lifecycle',
    'Regulated delivery',
    'Bilingual English and French',
    'Backlog and roadmap',
  ],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs',
    company_name: 'MTN Cameroon',
    role_target: 'Coordinator, Products Core B2B',
    job_url: '',
    now: 'Open to product management roles',
    metric_label: 'years shipping financial and digital products',
  },
  about_content: {
    location: 'Douala, Cameroon',
    location_label: 'Douala, Cameroon',
    languages: 'English and French',
    languages_label: 'Bilingual, fully fluent',
    fun_fact: 'I value direct opinions, simple language, and a good plate of fish.',
    faqs: [
      {
        question: 'What does a typical week look like?',
        answer:
          'One prioritized backlog, one update that every team reads from, and the field work that keeps the product honest. I spend time with engineering, compliance, operations and support, and I watch the funnel data before I reorder anything.',
      },
      {
        question: 'How do you handle regulated products?',
        answer:
          'Regulated flows get written acceptance criteria, named owners and a sign-off step, so the release evidence exists before anyone asks for it. When a scope request arrives mid-sprint, I write down what it displaces and hold the line.',
      },
      {
        question: 'Which languages do you work in?',
        answer:
          'Both French and English. I have written product copy, support content and campaigns in both, and I check that a flow reads the same way in each.',
      },
    ],
  },
  theme_config: {
    concept: 'signal',
    accent: '#f2b705',
    accent_text: '#7a5800',
    paper: '#f7f5ef',
    ink: '#14150f',
  },
  seo: {
    title: 'Ndouken Theryx, product management and delivery',
    description:
      'Product manager and designer working on lifecycle, regulated delivery and the operations around them.',
  },
};

const IMG = {
  deliveryMode:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789530915/kvmciqxtxgjmy3ofyhxs.png',
  homeDelivery:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789530984/yjkbnsgaehonfiz8japv.png',
  relayQr:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789532584/kevdnzwpid0nqotsx38c.jpg',
  activation:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789531364/mjoi7juw2pfuywmeafup.png',
  agentList:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789529537/glrqigcg6qhz79dqsqk6.png',
  qrValidation:
    'https://res.cloudinary.com/duzedercz/image/upload/v1789531743/pasd7qkl209hrk1gyej3.jpg',
};

// ── Per-company project stories. Each project gets its own block sequence, so
// no two read the same. Built only from the facts already in the warehouse. ──

const paysikaProductLine = [
  {
    type: 'intro',
    eyebrow: 'Product line',
    heading: 'A product line that runs past the app',
    text: 'PaySika grew from an MVP to a multi-product neo-bank serving people across Central Africa. I led design through that growth, then owned the half of the experience that happens away from a screen: the physical card, from the order to the moment it works.',
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'users',
        title: 'Small team, one product',
        text: 'Took design from a solo effort to a small team working with product, engineering, compliance, operations and support.',
      },
      {
        icon: 'route',
        title: 'Beyond the app',
        text: 'Owned onboarding, KYC, transactions and card management, then the service around the card: ordering, home delivery, relay-point pickup and activation.',
      },
      {
        icon: 'chart',
        title: 'Measured in outcomes',
        text: 'The redesigned journey lifted retention 40%, cut support tickets 60%, and took relay-point handover from 30 minutes to 10.',
      },
    ],
  },
  {
    type: 'two-col',
    heading: 'One product, two sets of rules',
    imageSide: 'left',
    image: 'paysika-design-requirements.png',
    caption: 'The requirements folder for the dashboard, branding, KYC and fees work.',
    markdown:
      'When PaySika opened in Gabon, KYC in Cameroon was not KYC in Gabon: different documents, different checks, different expectations from the partner bank. I led the design across the mobile app and the back office so we kept one product with market-specific onboarding, rather than two apps that drift apart.',
  },
  {
    type: 'steps',
    eyebrow: 'The card journey',
    heading: 'Order, deliver, hand over, activate',
    text: 'Five moments in one experience, and several of them happen away from a screen.',
    items: [
      {
        title: 'Ordering',
        text: 'The delivery method, the fees and the timing sit on the same screen as the decision.',
        image: IMG.deliveryMode,
      },
      {
        title: 'The agent app',
        text: 'The order list our delivery agents worked from in Douala and Yaounde, one row per delivery with the address and status, built to be obvious on a phone mid-shift.',
        image: IMG.agentList,
      },
      {
        title: 'Handling it in the field',
        text: 'A single order detail screen: the customer, the address, and one button to take the order.',
        image: IMG.homeDelivery,
      },
      {
        title: 'Relay-point handover',
        text: 'At an activation stand, a QR code replaced the manual paperwork, so the handover is recorded the moment it happens.',
        image: IMG.relayQr,
      },
      {
        title: 'Activation',
        text: 'Back in the app, the card is live, with the controls to block, replace or travel with it.',
        image: IMG.activation,
      },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'Behind the process',
    heading: 'The systems behind the shipped screens',
    items: [
      {
        image: 'design-system.png',
        title: 'One design system',
        description: 'Tokens, components and text styles in Figma, the source every PaySika surface builds from.',
      },
      {
        image: 'card-states.png',
        title: 'Card state library',
        description: 'Every physical and virtual card state, active, locked, expired or inactive, designed once and reused.',
      },
      {
        image: 'icon-library.png',
        title: 'Icon library',
        description: 'A shared icon set for card settings, mobile-money and bank partners, and card actions.',
      },
      {
        image: 'illustration-library.png',
        title: 'Illustration library',
        description: 'Reusable illustrations for onboarding, KYC, empty states and success moments.',
      },
    ],
  },
  {
    type: 'photos',
    heading: 'The people around the product',
    items: [
      {
        image: 'Me discussion with my collegue.jfif',
        caption: 'A working session with a colleague on product flows.',
      },
      {
        image: 'paysika-recognition.png',
        caption: 'Recognition for teamwork and reliability during the PaySika journey.',
      },
      {
        image: 'Team spirit award_2025.jfif',
        caption: 'The Team Spirit Award in 2025, for collaboration and leadership.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'A calm confirmation and a scary error state do different jobs, but they answer the same question for the user: is my money safe here? Answering yes on every screen is what the retention and support numbers follow.',
  },
];

const paysikaOwnership = [
  {
    type: 'intro',
    eyebrow: 'Product ownership',
    heading: 'Turning a request list into a backlog the team can ship from',
    text: 'At PaySika I was the single point of ownership for the what and the why: one prioritized backlog across the mobile app and the web app, translated from company strategy into an outcome-driven roadmap.',
  },
  {
    type: 'steps',
    heading: 'How a request becomes a release',
    items: [
      {
        title: 'One place for every request',
        text: 'Requests that used to live in threads, meetings and partner emails moved into a single prioritized backlog, each item with one owner and a clear Definition of Ready.',
      },
      {
        title: 'Written criteria before planning',
        text: 'Every story carried testable acceptance criteria before it entered a sprint, so done meant the same thing to every team.',
        image: 'paysika-design-requirements.png',
      },
      {
        title: 'Regulated sign-off built in',
        text: 'For KYC, cards and transactions, compliance and the partner bank reviewed the acceptance criteria, and the release evidence existed before anyone asked for it.',
      },
      {
        title: 'Read the funnel after the release',
        text: 'Adoption, conversion and drop-off in Mixpanel, feeding the next round of prioritisation instead of opinions.',
        image: 'paysika-research-archive.png',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'users',
        title: 'Cross-functional bridge',
        text: 'The link between engineering, compliance, operations, support and the partner banks, surfacing dependencies before they blocked delivery.',
      },
      {
        icon: 'clipboard',
        title: 'Backlog and delivery ops',
        text: 'One prioritized backlog with a Definition of Ready and acceptance criteria, plus the OKRs that turn strategy into shippable, measurable work.',
      },
      {
        icon: 'award',
        title: 'Ownership, recognised',
        text: 'Recognised for ownership, reliability and team spirit across the PaySika journey.',
      },
    ],
  },
  {
    type: 'two-col',
    heading: 'The same update for every audience',
    image: 'paysika-design-docs.png',
    caption: 'Part of the process and documentation set the team worked from.',
    markdown:
      'In a typical week I aligned engineering, compliance, operations and support. I wrote one update that product, the bank and leadership could all read from, so nobody heard a different version of the same release. Cross-squad dependencies got surfaced early, and mid-sprint requests waited their turn or displaced something on the record.',
  },
  {
    type: 'gallery',
    heading: 'The artefacts I kept',
    items: [
      {
        image: 'paysika-design-requirements.png',
        title: 'Requirements and process docs',
        description: 'Requirement documents connecting the dashboard, KYC, fees and mobile flows to testable outcomes.',
      },
      {
        image: 'paysika-research-archive.png',
        title: 'Research and analytics archive',
        description: 'The usability study files and the Mixpanel reports that underpinned prioritisation.',
      },
      {
        image: '',
        title: 'The backlog itself',
        description: 'A screenshot of the prioritized board, one item per row with owner, criteria and status.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'Predictable delivery came from the boring parts: one backlog, named owners, accepted scope, and a release path that compliance could audit. That is the part of product work I like most, because it is what lets a small team keep shipping.',
  },
];

const shomiLifecycle = [
  {
    type: 'intro',
    eyebrow: '0 to 1',
    heading: 'A product that was built, launched, and then stopped on purpose',
    text: 'I co-founded Kody and owned the product side of Shomi, interactive exam preparation for Cameroonian secondary-school students. With a two-person team and a $5,000 grant, I ran the full lifecycle: discovery, backlog, launch, and the decision to stop.',
  },
  {
    type: 'photos',
    heading: 'Discovery with the students it was for',
    items: [
      {
        image: 'Untitled 1.png',
        caption: 'A research session with a student, working through the flow on a phone.',
      },
      {
        image: 'shomi_prexcel_classroom.png',
        caption: 'Students at the partner exam-preparation school who tested the product.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'Prototypes and tests before production code',
    items: [
      {
        image: 'shomi_wireframes.png',
        title: 'Wireframe flow',
        description: 'The skeleton of the app, settled before any visual design started.',
      },
      {
        image: 'shomi_usability_testing.png',
        title: 'A finding worth acting on',
        description: 'Before and after the paper list, once testing showed the actions were hard to find.',
      },
      {
        image: 'Untitled 3.png',
        title: 'What students spent',
        description: 'One of the survey cuts that shaped the first backlog.',
      },
      {
        image: 'shomi_competitive_analysis.png',
        title: 'Competitive landscape',
        description: 'A board of adjacent products and patterns, used to place Shomi.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'file',
        title: 'A funded start',
        text: 'Won a $5,000 Tony Elumelu Foundation grant and directed the budget across the product lifecycle.',
      },
      {
        icon: 'target',
        title: 'Scope as the strategy',
        text: 'One platform, one audience, one validated need. Two adjacent ideas were turned down in the first month.',
      },
      {
        icon: 'shield',
        title: 'The sunset call',
        text: 'When retention data showed the content model would not sustain, I owned the sunset and wrote the post-mortem.',
      },
    ],
  },
  {
    type: 'quote',
    text: 'Can we keep this product fed sustainably at our team size? That question belonged in week one, not month six.',
    attribution: 'From the post-mortem',
    role: 'Shomi',
  },
  {
    type: 'richtext',
    markdown:
      'Shipping the MVP was the easy half. The harder lesson was that a product whose retention depends on a content stream you cannot afford is not a product yet, however well it is designed. I now ask the operational question while the scope is still being written.',
  },
];

const jobsikaDelivery = [
  {
    type: 'intro',
    eyebrow: 'Open source delivery',
    heading: 'A backlog volunteers could pick up without asking',
    text: 'Jobsika is a jobs platform built by the Cameroonian open-source community. I owned the delivery side of a product with no shared working hours: the backlog, the release milestones, and onboarding treated as a product in its own right.',
  },
  {
    type: 'gallery',
    heading: 'The work in the open',
    items: [
      {
        image: 'jobsika_repo.png',
        title: 'One repository, one line',
        description: 'The main branch, its commit history, and the releases the community worked toward.',
      },
      {
        image: 'jobsika_issues.png',
        title: 'Issues with labels and milestones',
        description: 'Work scoped so anyone could pick it up and know what done meant.',
      },
      {
        image: 'jobsika_pr.png',
        title: 'A pull request under review',
        description: 'A contributor change waiting on review, which is where most momentum is won or lost.',
      },
    ],
  },
  {
    type: 'steps',
    heading: 'Onboarding designed like a product',
    items: [
      {
        title: 'Good-first-issue scope',
        text: 'Beginner work carried explicit scope and acceptance criteria, so a first contribution was a small, finishable task.',
      },
      {
        title: 'A contribution guide',
        text: 'Written steps for setting up, branching and opening a pull request, so nobody had to ask in a chat first.',
      },
      {
        title: 'Design issues beside code',
        text: 'Design work was tracked the same way as engineering work, on the same board, with the same labels.',
      },
      {
        title: 'A reviewer paired on join',
        text: 'New contributors were matched with a reviewer early, which shortened the wait before a first merge.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'clipboard',
        title: 'The backlog is the roadmap',
        text: 'Issues prioritized in public, with release milestones anyone could see.',
      },
      {
        icon: 'sparkles',
        title: 'Onboarding as a product',
        text: 'The first-contribution experience got the same care as a user flow.',
      },
      {
        icon: 'message',
        title: 'Async by default',
        text: 'Communication written clearly enough that contributors in different time zones could move without a meeting.',
      },
    ],
  },
  {
    type: 'two-col',
    heading: 'Connecting job seekers with local roles',
    image: 'Screenshot of the UI of Jobsika.PNG',
    caption: 'The company ratings and salary view, one of the surfaces people use most.',
    markdown:
      'The platform had no shared schedule and no line management, so clarity was the only coordination tool that scaled. The public roadmap stayed honest: contributors and users always saw the same priorities, and a well-scoped issue was never waiting on a meeting to start.',
  },
  {
    type: 'richtext',
    markdown:
      'Open-source delivery is product management with the safety net removed. If the scope is ambiguous, the work simply stops. Writing clear issues and a clear onboarding path was the whole job, and it is the same habit I use on paid products.',
  },
];

const crowdremitPlatform = [
  {
    type: 'intro',
    eyebrow: 'Cross-border case study',
    heading: 'Four platforms, one idea of trust',
    text: 'CrowdRemit let people send money between countries with clear fees. I was the researcher and product designer across the iOS and Android apps, the web app, the admin dashboard and the marketing site, and I built the design system the engineers implemented from.',
  },
  {
    type: 'gallery',
    eyebrow: 'Research before pixels',
    heading: 'Starting from real behaviour',
    items: [
      {
        image: 'crowdremit_user_interviews.png',
        title: 'Remote user interviews',
        description: 'Moderated sessions with senders and recipients, focused on how transfers actually happen.',
      },
      {
        image: 'crowdremit_journey_map.png',
        title: 'Customer journey map',
        description: 'Every step from intent to the received-money confirmation, and the anxiety at each one.',
      },
      {
        image: 'crowdremit_user_stories.png',
        title: 'User stories',
        description: 'Research turned into concrete scenarios the whole team could build against.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'users',
        title: 'Research led',
        text: 'Interviews, journey maps and personas came before wireframes, so the structure followed real behaviour.',
      },
      {
        icon: 'shield',
        title: 'An accessibility decision',
        text: 'The original primary colour failed WCAG AA contrast on buttons. We rebranded to a palette that passes on every action.',
      },
      {
        icon: 'layers',
        title: 'One system, many surfaces',
        text: 'A single design system fed the apps, the dashboard and the marketing site.',
      },
    ],
  },
  {
    type: 'compare',
    eyebrow: 'An accessibility call',
    heading: 'A contrast test made us rebrand',
    left: {
      label: 'The contrast problem',
      image: 'crowdremit_error_page_contrast.png',
      caption: 'The original error and network screens, side by side with the accessible version.',
    },
    right: {
      label: 'The documented brand',
      image: 'crowdremit_brand_guidelines.png',
      caption: 'The new palette and type, written down so product and marketing stayed consistent.',
    },
  },
  {
    type: 'gallery',
    eyebrow: 'The deliverables',
    heading: 'The system and the surfaces',
    items: [
      {
        image: 'crowdremit_design_system.png',
        title: 'Design system',
        description: 'Tokens, components and UI kits, so the teams built consistent screens.',
      },
      {
        image: 'crowdremit_receiving_money.png',
        title: 'Receive-first send flow',
        description: 'The receive amount is the main input, with fees and rate on the same screen.',
      },
      {
        image: 'crowdremit_wireframe_screens.png',
        title: 'Low-fidelity first',
        description: 'Wireframes settled the skeleton before colour or copy could distract from it.',
      },
      {
        image: 'crowdremit_landing_page.png',
        title: 'Marketing site',
        description: 'The public landing page, carrying the same identity as the product.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The insight that shaped the flow was simple: people think in the amount that lands, not the exchange rate. Once the receive amount became the primary input, the rest of the screen had a job to do, and the fees stopped feeling hidden.',
  },
];

const gefonaDelivery = [
  {
    type: 'intro',
    eyebrow: 'Programme delivery',
    heading: 'One timeline for research, communications and money',
    text: 'At the GEFONA Digital Foundation I ran delivery as the link between research, communications and finance, in a lean non-profit where a dropped ball is expensive. I owned the timelines, the reporting and the finance records.',
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'route',
        title: 'One shared timeline',
        text: 'A research milestone, its announcement and its budget line moved together instead of surprising each other.',
      },
      {
        icon: 'message',
        title: 'A steady reporting rhythm',
        text: 'Stakeholders and funders got current numbers on a fixed cadence, without having to chase status.',
      },
      {
        icon: 'file',
        title: 'Finance you can audit',
        text: 'Budgeting and tracking kept clean enough to report against at any time.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'Deliverables from the programmes',
    items: [
      {
        image: 'campaign-proposal.png',
        title: 'Sponsorship proposal',
        description: 'A bilingual campaign proposal deck, from the problem statement to the advantages for partners.',
      },
      {
        image: 'onboarding-deck.png',
        title: 'Onboarding deck',
        description: 'The introduction deck used with new contributors and partners.',
      },
      {
        image: 'content-archive.png',
        title: 'Content archive',
        description: 'Social posts, campaign frames and articles, kept in one archive so communications stayed consistent.',
      },
    ],
  },
  {
    type: 'steps',
    heading: 'How I kept three functions aligned',
    items: [
      {
        title: 'Sequence the work in public',
        text: 'Deliverables across contributors were ordered on one timeline, with status reported to stakeholders and funders.',
      },
      {
        title: 'Write for the audience',
        text: 'External communications ran on the same rhythm as the research, so announcements matched the evidence.',
      },
      {
        title: 'Make the budget readable',
        text: 'Finance tracking stayed tied to funder lines, so every decision was made on real numbers.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'In a small non-profit, communications and finance are not overhead, they are part of the delivery. Keeping them on the same timeline as the research is what stopped the surprises.',
  },
];

// ── Articles: keep the original text, insert real, existing images at the
// points the text already describes. A cover alone reads unfinished. ──

const kycArticleContent = `# How we shipped PaySika's KYC redesign in 3 sprints

KYC at a regulated fintech touches three teams (product, eng, compliance), one external partner (the bank), and an angry funnel chart. Every team has a reason to delay. We shipped a major KYC redesign in three two-week sprints. Here's how, and what I'd warn you about.

![The PaySika mobile flows: onboarding, transactions and card management](paysika-product-assets.png)

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

![The usability testing archive: consent forms, scripts and reports](paysika-research-archive.png)

## Sprint 3: instrumentation + launch

Wired Mixpanel events for every step. Soft-launched to 10% of new signups, watched the funnel for 48 hours, opened the gate to 100%.

## What almost broke it

- **Mid-sprint scope creep.** Compliance asked to bundle address verification into the same redesign in week 4. I had to say no in writing, with the contract attached. They agreed (next quarter).
- **One person sick at the wrong time.** I should have had backup ownership documented. I do now.
- **A partner-bank dependency we discovered late.** Always ask the external partner what they need from you in the first week. We asked in week 5.

## The result

The redesign drove the 40% retention lift and 60% support-ticket reduction PaySika now publishes. The contract is now the template I use for every scoped delivery project.
`;

const kodyArticleContent = `# Co-founding Kody: from $5,000 funding to a live MVP in 6 months

In 2019, my friend and I won $5,000 from the Tony Elumelu Foundation for an ed-tech idea we called Shomi: interactive prep booklets for Cameroonian secondary-school students. Six months later we shipped a live MVP. A year later we sunset it. Both halves of that story taught me PM lessons I still use.

## What worked

### Tight scope from week one

One product, one platform, one audience. We had two other ideas we could have run with the same funding. We said no to both in the first month. Holding scope is the loneliest part of founding work and the part that separates shipping from almost-shipping.

### A user-research partnership

PREXCEL, a local exam-prep school, became our partner. They gave us direct access to the students we were designing for. Without that partnership we'd have built for an imagined audience.

![Students at the partner exam-preparation school](shomi_prexcel_classroom.png)

### Usability testing before high-fidelity design

We ran tests on Figma prototypes with five real students before any production work. They told us things we couldn't have inferred: the language toggle was unfindable; the payment page was confusing. Both fixable cheaply at that stage.

![Before and after the paper list, once testing showed the actions were hard to find](shomi_usability_testing.png)

## What didn't work

### Underestimated content strategy

Our retention model depended on a steady stream of fresh exam-prep content we couldn't sustainably produce at our team size and budget. We discovered this six months in. By then we'd built the platform around the assumption.

### Misread market signal

Early enthusiasm from students in the pilot wasn't predictive of broader adoption. The pilot students engaged because they liked us and the platform was new. Without ongoing content their engagement dropped.

### Underweighted the post-launch operational load

Customer support, content updates, payment reconciliation: none of that fit a two-person team alongside continued development.

![The wireframe flow, settled before visual design started](shomi_wireframes.png)

## The post-mortem

When we sunset the product, I wrote a long-form post-mortem. It is one of the most useful artefacts from the project. Every PM project I run now starts by reading my own past post-mortems: the same patterns recur.

## What I'd tell my younger PM self

The content moat question, *can we keep this product fed sustainably at our team size?*, needed to be answered in week one of design, not month six of operations. Scope discipline isn't just about feature creep. It's about whether the operational model survives contact with reality.
`;

const now = new Date().toISOString();

await sql`
  INSERT INTO companies (
    id, name, slug, is_active, role, job_description, job_url, status, layout,
    theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
    philosophy_text, intro_expanded_text, badges, social_links, about_content,
    created_at, updated_at
  ) VALUES (
    ${company.id}, ${company.name}, ${company.slug}, false, ${company.role},
    ${company.job_description}, ${company.job_url}, 'published', ${company.layout},
    ${JSON.stringify(company.theme_config)}, ${JSON.stringify(company.seo)},
    ${company.tagline}, ${company.hero_title}, ${company.hero_subtitle},
    ${company.philosophy_title}, ${company.philosophy_text}, ${company.intro_expanded_text},
    ${company.badges}, ${JSON.stringify(company.social_links)},
    ${JSON.stringify(company.about_content)}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = EXCLUDED.is_active,
    role = EXCLUDED.role, job_description = EXCLUDED.job_description,
    job_url = EXCLUDED.job_url, status = EXCLUDED.status, layout = EXCLUDED.layout,
    theme_config = EXCLUDED.theme_config, seo = EXCLUDED.seo,
    tagline = EXCLUDED.tagline, hero_title = EXCLUDED.hero_title,
    hero_subtitle = EXCLUDED.hero_subtitle, philosophy_title = EXCLUDED.philosophy_title,
    philosophy_text = EXCLUDED.philosophy_text, intro_expanded_text = EXCLUDED.intro_expanded_text,
    badges = EXCLUDED.badges, social_links = EXCLUDED.social_links,
    about_content = EXCLUDED.about_content, updated_at = ${now}
`;

const links = [
  {
    entry_id: 'project:paysika_project-manager',
    sort_order: 0,
    metadata: {
      content_blocks: paysikaOwnership,
      tagline: 'Owned the product backlog for a scaling neo-bank, bridging engineering, compliance, operations and partner banks.',
      description:
        'As a founding-team member at PaySika I was the single point of ownership for the what and the why: one prioritized product backlog across the mobile app and web app, translated from company strategy into an outcome-driven roadmap.',
      responsibilities: [
        'Own a single, transparent, prioritized product backlog across mobile and web, with a Definition of Ready and acceptance criteria on every story',
        'Translate company strategy into product OKRs and sequence initiatives by business value, customer impact, regulatory implications and technical feasibility',
        'Act as the bridge between engineering, compliance, operations, customer support and the partner banks, surfacing dependencies before they block delivery',
        'Protect the sprint from mid-sprint priority churn, recording what each new request displaces',
        'Drive prioritisation with product analytics on adoption, conversion and drop-off',
        'Ensure regulated flows carry auditable acceptance criteria, approval workflows and release evidence',
      ],
    },
  },
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 1,
    metadata: {
      content_blocks: paysikaProductLine,
      tagline:
        'Designing the product and the service around it: a card journey that runs from the app to a relay point, and a second market.',
      description:
        'As UX Design Lead and a founding-team member I led design at PaySika from MVP to a multi-product neo-bank. I managed a small design team, owned the core mobile and web journeys, then took on the half of the experience that happens outside the app: the physical card, from ordering and home delivery to relay-point pickup and activation.',
      responsibilities: [
        'Recruited, scaled and managed the design team, and set up the asset handoff pipelines',
        'Redesigned the core mobile journeys: onboarding, KYC and card activation',
        'Ran usability testing and used Mixpanel tracking to drive evidence-backed retention work',
        'Led the end-to-end design of the physical debit card and its unboxing',
        'Owned the card journey end to end: ordering, home delivery, relay-point pickup and activation',
        'Designed the internal app used by 15 delivery agents across Douala and Yaounde',
        'Cut relay-point handover from 30 to 10 minutes with QR-code validation in place of paperwork',
        'Led the multi-country design for the expansion into Gabon across the app and the back office',
      ],
    },
  },
  {
    entry_id: 'project:shomi_project-manager',
    sort_order: 2,
    metadata: {
      content_blocks: shomiLifecycle,
      tagline:
        'Owned an ed-tech product end to end as co-founder, from a grant-funded MVP to a documented sunset.',
      description:
        'Co-founder of Kody and product owner on Shomi: interactive exam preparation for Cameroonian secondary-school students. With a two-person team and a $5,000 grant I owned the full product lifecycle: discovery, backlog, roadmap, launch, and the decision to stop.',
      responsibilities: [
        'Owned discovery, scope, roadmap and backlog from pitch to launch, turning student surveys into prioritized requirements',
        'Secured and managed a $5,000 Tony Elumelu Foundation grant, directing the budget across the product lifecycle',
        'Ran usability tests with students on prototypes before build, then sequenced the MVP backlog around one validated need',
        'Managed the partnership with a local exam-preparation school for user access and validation',
        'Owned the full lifecycle, including the sunset call and the written post-mortem',
      ],
    },
  },
  {
    entry_id: 'project:jobsika_project-manager',
    sort_order: 3,
    metadata: {
      content_blocks: jobsikaDelivery,
      tagline:
        'Owned the backlog and release milestones for an open-source jobs platform built by the Cameroonian developer community.',
      description:
        'As co-maintainer of Jobsika at OSS Cameroon I owned the delivery side of an open-source product built entirely by volunteers: a transparent, prioritized backlog, release milestones, and contributor onboarding treated as a product in its own right.',
      responsibilities: [
        'Owned and prioritized the GitHub backlog: scoping issues, defining acceptance criteria and sequencing release milestones',
        'Coordinated volunteer developers and designers across time zones with async-by-default communication',
        'Designed contributor onboarding as a product, with good-first-issue scoping and contribution guides',
        'Kept a public, honest roadmap so contributors and users always saw the same priorities',
      ],
    },
  },
  {
    entry_id: 'project:crowdremit_fintech',
    sort_order: 4,
    metadata: {
      content_blocks: crowdremitPlatform,
    },
  },
  {
    entry_id: 'project:gefona_project-manager',
    sort_order: 5,
    metadata: {
      content_blocks: gefonaDelivery,
      period: '',
      image: 'gefona_logo.png',
      description:
        'At the GEFONA Digital Foundation, an independent non-profit publishing policy research on the digital economy and cybersecurity across Africa, I ran delivery as the connective tissue between research, communications and finance.',
      responsibilities: [
        'Owned project timelines and deliverables across contributors, sequencing work and reporting status to stakeholders and funders',
        'Ran external communications and the foundation public voice across audiences',
        'Managed budgeting and finance tracking with auditable records for funder reporting',
        'Kept research, communications and funding stakeholders aligned on scope and priorities',
      ],
    },
  },
  {
    entry_id: 'article:pm_kyc_three_sprints',
    sort_order: 0,
    content: kycArticleContent,
  },
  {
    entry_id: 'article:pm_kody_5k_to_mvp',
    sort_order: 1,
    content: kodyArticleContent,
  },
];

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
    VALUES (
      ${company.id}, ${l.entry_id}, ${l.sort_order},
      ${l.content ?? null},
      ${l.metadata ? JSON.stringify(l.metadata) : null}::jsonb,
      true
    )
    ON CONFLICT (company_id, entry_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      override_content = EXCLUDED.override_content,
      override_metadata = EXCLUDED.override_metadata,
      is_visible = EXCLUDED.is_visible
  `;
}

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${company.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${company.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
