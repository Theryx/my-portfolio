const fs = require('fs');
const path = require('path');
const API = 'https://react-portfolio-pi-topaz.vercel.app';
const OUT = path.join(__dirname, 'studio-paste');

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
const newFaqQ = `How do you design a journey that leaves the app?`;
const newFaqA = `The same way I design one inside it: I map what actually happens, including the parts nobody owns. For the card that meant the delivery agent's app, the relay-point handover and the back-office update. Customers waited 30 minutes because of paperwork happening behind the scenes; QR-code validation took that to 10.`;

(async () => {
  const project = (await (await fetch(API + '/api/projects?profile_id=product-design')).json()).find((p) => p.id === 'paysika_fintech');
  const profile = await (await fetch(API + '/api/profiles/product-design')).json();
  if (!project || !profile) throw new Error('could not fetch live rows');

  const blocks = project.content_blocks;
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

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, '1-paysika-content-blocks.json'), JSON.stringify(newBlocks, null, 2), 'utf8');

  const worksheet = [
    '# Studio worksheet — Product Design profile rebuild',
    '',
    'Paste the JSON file in this folder into Studio > Projects > PaySika > content sections > JSON view, then Save.',
    'Then update the fields below (Profiles > Product Design, and Projects > PaySika).',
    '',
    '## Profile: Product Design',
    '',
    'Hero title: ' + heroTitle,
    '',
    'Bio: ' + bio,
    '',
    'Hero subtitle: ' + heroSubtitle,
    '',
    'Badges (two separate badge fields): ' + badges.join('  |  '),
    '',
    'Now: ' + nowLine,
    '',
    'Metric label: ' + metricLabel,
    '',
    'Blog intro: ' + blogIntro,
    '',
    'Philosophy text (and intro expanded text, keep them identical): ' + philosophy,
    '',
    'FAQ 1 answer: ' + faqOneAnswer,
    '',
    'New FAQ - question: ' + newFaqQ,
    '',
    'New FAQ - answer: ' + newFaqA,
    '',
    '## Project: PaySika',
    '',
    'Role: UX Design Lead',
    '',
    'Period: Nov 2022 - Aug 2026',
    '',
    'Tagline: Designing the product and the service around it: +40% retention, -60% support tickets, and a card journey that runs from the app to a relay point.',
    '',
    'Description: As UX Design Lead and a founding-team member, I led design at PaySika from MVP to a multi-product neobank serving thousands of active users across Central Africa. I managed a small design team, owned the core mobile and web journeys, then took on the half of the experience that happens outside the app: the physical card, from ordering and home delivery to relay-point pickup and activation. I designed the app our delivery agents used in the field, cut relay-point handover from 30 minutes to 10, and led the design work behind the expansion into Gabon.',
    '',
    'Responsibilities - add these four:',
    '- Owned the physical card journey end to end: ordering, home delivery and relay-point pickup, through activation',
    '- Designed the internal app our delivery agents used to receive and fulfil card orders, rolled out to 15 agents across Douala and Yaoundé',
    '- Cut relay-point handover from 30 to 10 minutes by replacing manual paperwork with QR-code validation',
    '- Led the multi-country design for the expansion into Gabon across the mobile app and back office, reworking KYC and onboarding for local requirements',
    '',
    'Challenge text - add at the end: The physical card added a second, partly offline journey — courier, relay point, paper handover — that nobody had mapped end to end.',
    '',
    'Solution text - add at the end: For the card I designed past the app: the agent\'s steps, the relay-point handover and the back-office update, replacing the paper form with QR-code validation before carrying the same approach into Gabon.',
    '',
    'Result text - add at the end: Relay-point handover dropped from 30 to 10 minutes, and the same system scaled to a second market.',
    '',
    '## Then: images',
    '',
    'The new gallery and photo blocks are text-only for now. In Studio each image slot has an Upload button that sends the file to Cloudinary, so upload:',
    '- Card journey gallery: ordering screen, home delivery, relay-point pickup, activation, card + mailer',
    '- Agent app photos: order list, QR validation, relay point',
    'Pick these from the photos already in react-portfolio/src/assets/img/paysika/.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, '2-studio-worksheet.txt'), worksheet, 'utf8');

  console.log('Wrote:');
  console.log('  ' + path.join(OUT, '1-paysika-content-blocks.json') + '  (' + newBlocks.length + ' blocks)');
  console.log('  ' + path.join(OUT, '2-studio-worksheet.txt'));
  console.log('Block order: ' + newBlocks.map((b) => b.type).join(', '));
})().catch((e) => { console.error('FAILED: ' + e.message); process.exit(1); });