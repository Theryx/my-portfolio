const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

const env = fs.readFileSync('D:\\Personal\\Portfolio\\.env.local', 'utf8');
const line = env.split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='));
const url = line.slice('DATABASE_URL='.length).trim().replace(/^"|"$/g, '');
const sql = neon(url);
const BACKUP = 'C:\\Users\\ndouk\\.codex\\visualizations\\2026\\09\\13\\01a09c48-e2e5-7673-9101-33b5dad5383e\\db-backup-before-update.json';

const bio = `UX Design Lead with over five years designing across digital, physical and human touchpoints in Central Africa, including nearly four years leading UX at PaySika.`;
const tagline = `I design the product and the service around it, so trust holds from the first tap to the final handover.`;
const heroTitle = `UX Design Lead`;
const heroSubtitle = `Nearly four years leading UX at PaySika across onboarding, KYC, transactions, the physical card journey and our expansion into Gabon. I specialise in simplifying complex product and service flows for African users.`;
const philosophy = `Every financial product asks someone to bet their money on a screen. My job is to make that bet feel obvious: clear hierarchy, predictable actions, honest costs, no surprises. I find where trust breaks by pairing Mixpanel funnels with real usability tests, then rebuild that exact moment. Increasingly the most important moments are not screens at all: a courier's app, a relay point, a queue.`;
const badges = ['Open to CX, service design & product roles', 'Payments · KYC · Cards · Multi-country'];
const nowLine = `On a short professional break after nearly four years at PaySika — open to CX, service design and product design roles`;
const metricLabel = `years designing products & services`;
const blogIntro = `Field notes on designing money: trust, compliance, and the parts of a journey that are not screens.`;
const faqOneAnswer = `Onboarding, KYC capture, transaction history, multi-currency wallets, virtual and physical Visa cards (ordering, home delivery, relay-point pickup, activation), mobile-money top-up, back office and admin dashboards. Mobile, web, native iOS/Android, plus the internal app our 15 delivery agents used across Douala and Yaoundé.`;
const newFaq = { question: `How do you design a journey that leaves the app?`, answer: `The same way I design one inside it: I map what actually happens, including the parts nobody owns. For the card that meant the delivery agent's app, the relay-point handover and the back-office update. Customers waited 30 minutes because of paperwork happening behind the scenes; QR-code validation took that to 10.` };

const projectTagline = `Designing the product and the service around it: +40% retention, -60% support tickets, and a card journey that runs from the app to a relay point.`;
const projectDescription = `As UX Design Lead and a founding-team member, I led design at PaySika from MVP to a multi-product neobank serving thousands of active users across Central Africa. I managed a small design team, owned the core mobile and web journeys, then took on the half of the experience that happens outside the app: the physical card, from ordering and home delivery to relay-point pickup and activation. I designed the app our delivery agents used in the field, cut relay-point handover from 30 minutes to 10, and led the design work behind the expansion into Gabon.`;
const newResponsibilities = [
  'Owned the physical card journey end to end: ordering, home delivery and relay-point pickup, through activation',
  'Designed the internal app our delivery agents used to receive and fulfil card orders, rolled out to 15 agents across Douala and Yaoundé',
  'Cut relay-point handover from 30 to 10 minutes by replacing manual paperwork with QR-code validation',
  'Led the multi-country design for the expansion into Gabon across the mobile app and back office, reworking KYC and onboarding for local requirements',
];
const challengeAdd = ` The physical card added a second, partly offline journey — courier, relay point, paper handover — that nobody had mapped end to end.`;
const solutionAdd = ` For the card I designed past the app: the agent's steps, the relay-point handover and the back-office update, replacing the paper form with QR-code validation before carrying the same approach into Gabon.`;
const resultAdd = ` Relay-point handover dropped from 30 to 10 minutes, and the same system scaled to a second market.`;

(async () => {
  const p = (await sql`SELECT * FROM profiles WHERE id = 'product-design'`)[0];
  const j = (await sql`SELECT * FROM projects WHERE id = 'paysika_fintech'`)[0];
  if (!p || !j) throw new Error('profile or project row not found');
  fs.writeFileSync(BACKUP, JSON.stringify({ profile: p, project: j }, null, 2));
  console.log('BACKUP: ' + BACKUP);

  const social = Object.assign({}, p.social_links, { now: nowLine, metric_label: metricLabel, blog_intro: blogIntro });
  const about = Object.assign({}, p.about_content);
  const faqs = Array.isArray(about.faqs) ? about.faqs.slice() : [];
  if (faqs[0]) faqs[0] = Object.assign({}, faqs[0], { answer: faqOneAnswer });
  faqs.push(newFaq);
  about.faqs = faqs;

  const now = new Date().toISOString();
  await sql`UPDATE profiles SET bio=${bio}, tagline=${tagline}, hero_title=${heroTitle}, hero_subtitle=${heroSubtitle}, philosophy_text=${philosophy}, intro_expanded_text=${philosophy}, badges=${badges}, social_links=${JSON.stringify(social)}, about_content=${JSON.stringify(about)}, updated_at=${now} WHERE id = 'product-design'`;
  console.log('PROFILE updated');

  const blocks = Array.isArray(j.content_blocks) ? j.content_blocks : [];
  const b1 = blocks[0], b2 = blocks[1], b3 = blocks[2];
  const rest = blocks.slice(3);
  const newBlocks = [
    Object.assign({}, b1, { text: `For nearly four years I led UX design at PaySika, from the MVP to a multi-product neobank serving thousands of people across Central Africa. I owned the experience end to end — mobile, web, back office and the physical card — and measured my work the way the business did: in retention, in support tickets, and in the minutes a customer spends at a relay point.` }),
    Object.assign({}, b2, { cards: [
      { icon: 'users', title: 'Design team lead', text: `Took design from a solo effort to a small team, working shoulder to shoulder with product, engineering, compliance, operations and support.` },
      { icon: 'target', title: 'End-to-end, beyond the app', text: `Owned onboarding, KYC, transactions and card management, then the service around the card: ordering, home delivery, relay-point pickup and activation.` },
      { icon: 'chart', title: 'Measured in outcomes', text: `A redesigned journey that lifted retention 40%, cut support tickets 60%, and took relay-point handover from 30 minutes to 10.` },
    ] }),
    Object.assign({}, b3, { text: `KYC was the biggest leak. The photo step failed quietly on most Android browsers in Cameroon, and drop-off clustered exactly where the product asked for trust without giving any back. The fix was less about visuals than honesty on every screen: what it costs, why we need it, what just happened. The card told a different story: once a customer ordered one, the journey left the app entirely — a courier, a relay point, a paper form — and nobody had mapped that half of the experience.` }),
    { type: 'intro', eyebrow: `The other half of the journey`, heading: `The card was a service, not an object`, text: `Ordering a card was the easy part. What came next happened outside the product: an agent drove it across the city, a relay point held it, a customer queued for it, and someone in the office typed the delivery status in later. Designing that meant designing three things as one journey — the agent's step, the customer's wait, and the back-office handover — not decorating the screen where it all started.` },
    { type: 'stat-cards', cards: [
      { icon: 'line', title: `30 minutes → 10`, text: `The average time a customer spent between arriving at a relay point and leaving it, once paper forms and manual signatures became QR-code validation.` },
      { icon: 'users', title: `15 delivery agents`, text: `Across Douala and Yaoundé, receiving orders and confirming handovers in an internal app I designed.` },
      { icon: 'branch', title: `Two markets`, text: `Cameroon and Gabon, one product: the same card and app experience, with KYC rebuilt per market.` },
    ] },
    { type: 'gallery', eyebrow: `The card journey`, heading: `Order, deliver, hand over, activate`, text: `Four touchpoints in one experience, and three of them happen away from a screen.`, items: [
      { image: '', title: `Ordering`, description: `Where the customer decides, with delivery method, fees and timing stated on the same screen.` },
      { image: '', title: `Home delivery`, description: `The agent's route, with the customer's details and the handover confirmed in the app.` },
      { image: '', title: `Relay-point pickup`, description: `QR-code validation replaced the paperwork, so the handover is recorded the moment it happens.` },
      { image: '', title: `Activation`, description: `Back in the app, the card goes live, and the customer's first transaction tells us whether the journey worked.` },
      { image: '', title: `The card itself`, description: `Production files and the mailer, designed so the first thing the customer sees is the card they waited for.` },
    ] },
    { type: 'photos', heading: `The app our agents used`, text: `The delivery agents were not part of the product team, so the app had to be obvious on a phone in the middle of a shift: the order, the customer, the address, one button to confirm.`, items: [
      { image: '', caption: `The order list the agents worked from.` },
      { image: '', caption: `QR validation at the relay point, in place of the paper form.` },
      { image: '', caption: `A relay point: where the 30 minutes were being spent.` },
    ] },
    { type: 'intro', eyebrow: `A second market`, heading: `One product, two sets of rules`, text: `When PaySika opened in Gabon, KYC in Cameroon was not KYC in Gabon: different documents, different checks, different expectations from the partner bank. I led the design across the mobile app and the back office so we kept one product with market-specific onboarding, rather than two apps that drift apart — and so the card journey behaved the same way in both.` },
  ].concat(rest);

  const responsibilities = (Array.isArray(j.responsibilities) ? j.responsibilities : []).concat(newResponsibilities);
  await sql`UPDATE projects SET role=${'UX Design Lead'}, period=${'Nov 2022 - Aug 2026'}, tagline=${projectTagline}, description=${projectDescription}, responsibilities=${responsibilities}, challenge_text=${(j.challenge_text || '') + challengeAdd}, solution_text=${(j.solution_text || '') + solutionAdd}, result_text=${(j.result_text || '') + resultAdd}, content_blocks=${JSON.stringify(newBlocks)}, updated_at=${now} WHERE id = 'paysika_fintech'`;
  console.log('PROJECT updated');

  const p2 = (await sql`SELECT * FROM profiles WHERE id = 'product-design'`)[0];
  const j2 = (await sql`SELECT * FROM projects WHERE id = 'paysika_fintech'`)[0];
  console.log('VERIFY profile: ' + p2.hero_title + ' | ' + p2.badges.join(' / ') + ' | faqs=' + p2.about_content.faqs.length);
  console.log('VERIFY project: ' + j2.role + ' | ' + j2.period + ' | responsibilities=' + j2.responsibilities.length + ' | blocks=' + j2.content_blocks.length + ' [' + j2.content_blocks.map((b) => b.type).join(', ') + ']');
})().catch((e) => { console.error('FAILED: ' + e.message); process.exit(1); });