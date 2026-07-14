export interface Project {
  id: string;
  tag: string;
  title: string;
  tagline: string;
  image: string;
  description: string;
  impact: string;
  site: string;
  role: string;
  period: string;
  location: string;
  responsibilities: string[];
  challenge: string;
  challengeText: string;
  solution: string;
  solutionText: string;
  result: string;
  resultText: string;
  content?: string;
}

export const projects: Project[] = [
  {
    id: 'paysika',
    tag: 'Fintech Innovation',
    title: 'PaySika',
    tagline: 'Driving 40% user retention and 60% support ticket reduction.',
    image: 'paysika_mockup.png',
    description: 'As Lead Product Designer and Founding Team Member, I managed a two-person design team and scaled PaySika’s mobile and web applications to serve thousands of active users across Central Africa. I engineered cross-functional workflows, led visual rebranding, and leveraged Mixpanel data to optimize transactional funnels.',
    impact: 'Scaled fintech operations serving thousands of users across Africa.',
    site: 'https://www.paysika.co',
    role: 'Lead Product Designer',
    period: 'Dec 2021 - Present',
    location: 'Douala, Cameroon',
    responsibilities: [
      'Recruited, scaled, and managed the creative design team, establishing high-performance assets handoff pipelines',
      'Redesigned core mobile application interfaces (Onboarding, KYC, and Visa activation flows), minimizing drop-offs',
      'Conducted usability testing sessions and leveraged Mixpanel tracking to drive evidence-backed retention updates',
      'Led the end-to-end industrial and print design of PaySika’s physical debit card experience and unboxing'
    ],
    challenge: 'The Challenge',
    challengeText: 'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users. The existing product had friction points in the onboarding and transaction flows.',
    solution: 'The Solution',
    solutionText: 'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust. We implemented a clean, minimalist interface with clear CTAs and simplified KYC processes. Mixpanel integration helped us track user behavior and continuously optimize the funnel.',
    result: 'The Result',
    resultText: 'Improved user retention by 40% and reduced customer support tickets by 60%. The design system we built scaled across web and mobile platforms.',
    content: `## Key Responsibilities & Impact

### Recruited and Scaled the Creative Design Team
I transitioned our design team from a solo operation to a cohesive creative unit. By hiring a dedicated motion designer and a graphic designer, I established high-performance asset pipelines. Together, we defined our first formal brand guidelines and maintained a unified design system that aligned our creative output across the entire product ecosystem and marketing channels.

### Engineered Operational Processes
To synchronize product development and marketing cycles, I designed two core workflows:
*   **Design-to-Marketing**: Streamlined the assets pipeline so our marketing team could independently fetch brand-approved materials without slowing down product sprints.
*   **Design-to-Engineering**: Rebuilt our developer handoff in Figma. I documented edge cases, interaction states, and design system variables, reducing layout errors and developer back-and-forth during sprint implementation.

### Designed End-to-End Mobile App
I architected the core user journeys from the ground up, focusing on a frictionless and intuitive experience. This included the complete onboarding flow, a seamless KYC verification pipeline, and the digital card management experience, all strictly designed to operate efficiently even in fluctuating network environments.

### Led Physical Debit Card Experience & Packaging
I directed the physical debit card design and its accompanying custom unboxing packaging. I worked directly with the card manufacturer to select materials that made the card feel like a premium, banking-grade asset while maintaining our vibrant fintech brand identity.

### Spearheaded AI Integration
I introduced LLMs to design faster. By leveraging Claude, we drafted and localized our English and French UI microcopy, pressure-tested user flows against potential edge cases, and quickly generated realistic mock data for our interactive Figma prototypes. This significantly accelerated our copywriting and discovery phases.

### Mixpanel Data Analysis & Iteration
I paired design intuition with product analytics, using Mixpanel to monitor user funnels. When the data showed a high drop-off during the KYC photo upload, I conducted usability testing to identify the friction. Redesigning this interface into a guided, real-time camera helper improved successful verification rates.

---

### Cross-Functional Collaboration & Product Culture
In a fast-moving startup, design cannot exist in a vacuum. I worked daily across functional silos to keep our product momentum high:
*   **Engineering**: Partnered closely with developers during early wireframing to assess technical feasibility and prevent design rework.
*   **Marketing**: Collaborated on launch campaigns to make sure product screenshots and marketing visuals were fully aligned with our live UI.
*   **Product Management**: Translated high-level product briefs into concrete user flows, scoping features iteratively to balance user value with engineering effort.

By acting as a bridge between design, tech, and business, I helped establish a collaborative product culture where design was seen as a driver of business results, not just a final paint job.`
  },
  {
    id: 'jobsika',
    tag: 'Job Platform',
    title: 'Jobsika',
    tagline: 'Connecting Cameroonian job seekers with local opportunities.',
    image: 'Screenshot of the UI of Jobsika.PNG',
    description: 'At OSS Cameroon (Open Source Society Cameroon), I serve as co-maintainer and design lead for jobsika.cm, a community-driven platform. I established the visual guidelines, designed low-friction workflows, and spearheaded open-source design contributions.',
    impact: 'Helping job seekers find opportunities across Cameroon.',
    site: 'https://jobsika.cm/',
    role: 'Co-maintainer & Design Lead (Open Source)',
    period: '2022 - 2024',
    location: 'Cameroon',
    responsibilities: [
      'Designed responsive web and mobile workflows, improving low-bandwidth accessibility for local job seekers',
      'Served as active maintainer on GitHub, auditing design PR implementations and guiding community contributions',
      'Collaborated with open-source software engineers to review and merge UI/UX code components, ensuring design parity'
    ],
    challenge: 'The Challenge',
    challengeText: 'Jobsika needed to serve as an accessible, high-performance job board for Cameroonians, operating efficiently across varying digital literacy levels and device capabilities, while maintaining a transparent open-source contribution pipeline.',
    solution: 'The Solution',
    solutionText: 'I designed a mobile-first UI with clear search categories and a straightforward application process. I documented complete contribution guidelines on GitHub, opening design issues and collaborating directly with frontend developers through pull requests to ensure our design standards were accurately translated into React.',
    result: 'The Result',
    resultText: 'Successfully launched jobsika.cm as a fully open-source job portal. Built a thriving community of developer contributors on GitHub, delivering a consistent, accessible experience designed specifically for Cameroon’s local context.'
  },
  {
    id: 'shomi',
    tag: 'EdTech Platform',
    title: 'Shomi (Kody)',
    tagline: 'All-in-one educational platform built for secondary school students.',
    image: 'shomi-cover.png',
    description: 'Designed the Shomi educational app for our startup company, Kody, after raising a $5,000 seed funding from the Tony Elumelu Foundation. Collaborated as the UI/UX Designer alongside my friend who served as the Tech Engineer.',
    impact: 'Secured $5,000 seed funding from the Tony Elumelu Foundation.',
    site: '',
    role: 'UI/UX Designer',
    period: 'Dec 2019 - Dec 2020',
    location: 'Cameroon',
    responsibilities: [
      'Designed the entire web and mobile platform layout and user flows',
      'Conducted comprehensive user research, surveys, and usability tests',
      'Collaborated directly with the Tech Engineer to transition designs into a functional product',
      'Crafted the brand identity and visual design language'
    ],
    challenge: 'The Challenge',
    challengeText: 'Our startup Kody needed to build Shomi, a highly engaging educational platform for secondary school students in Cameroon, taking into account limited smartphone access at home and complex local payment integration.',
    solution: 'The Solution',
    solutionText: 'As the UI/UX designer on our lean two-person team at Kody, I designed Shomi as a mobile-first experience with a clean layout, offline-first study materials, and interactive booklet features, collaborating closely with the Tech Engineer.',
    result: 'The Result',
    resultText: 'Successfully designed the Shomi MVP and validated the layout through usability tests. While we raised $5,000 from the Tony Elumelu Foundation and launched, we unfortunately shut down the app after one year due to a lack of student engagement, retention, and content strategy.',
    content: `# Ed-Tech app: Shomi (Kody)

![SHOMI app - All in one solution for graduate students](Untitled.png)

## Project Context

Shomi is an all-in-one educational app designed to help secondary school students succeed in their exams by providing them with rich digital resources, guides, and interactive booklets. 

The project was conceived and built under **Kody**, the startup company we registered to participate in the Tony Elumelu Foundation challenge. After successfully securing a seed funding of **$5,000**, my friend (serving as the Tech Engineer) and I (serving as the UI/UX Designer) set out to build and launch the product. 

Unfortunately, after one year of operations, we made the difficult decision to shut down the app. This was primarily due to a lack of student engagement and retention, alongside challenges in developing a sustainable long-term content strategy.

## Strategic Partnership: PREXCEL

To design the Shomi project, we teamed up with a local educational institution called **PREXCEL**. This partnership was highly strategic as it gave us direct access to students, allowing us to validate our assumptions and test some of our UX hypotheses in a real-world environment.

![PREXCEL Classroom Study Session](shomi_prexcel_classroom.png)

### The History of PREXCEL
PREXCEL started as a weekend school designed to help secondary school students succeed in their exams, founded by a group of young, dynamic engineers. Over the years, PREXCEL evolved from teaching weekend classes to organizing academic orientation conferences, running home classes, creating and distributing custom textbooks/pamphlets, and preparing students for competitive exams.

![The PREXCEL Team and Educators Group](shomi_prexcel_team.png)

Partnering with them gave us a direct window into the students' learning habits, preferences, and constraints, which significantly shaped our design strategy.

## The Problem

With physical learning spaces facing constraints, students needed a way to prepare for high-stakes secondary school and competitive entrance exams digitally.

- Lack of accessible weekend/preparatory classes
- Lack of modern orientation materials
- Difficulty accessing high-quality pamphlets, booklets, and corrections remotely

### Problem statement: How can Kody make quality prep materials and interactive booklets accessible to students?

## About my role

As the UI/UX Designer, I was responsible for the branding, visual design, and user experience strategy. My friend took charge of the engineering. We collaborated closely throughout the lifecycle of the project to ensure technical feasibility and design consistency.

- Brand strategy & identity design
- User experience research (competitor analysis, user surveys, personas, and journey mapping)
- High-fidelity interface designs and interactive prototypes
- Usability testing

After aligning on the brand identity and design language, we named the mobile-first platform **SHOMI**.

## The challenge

The difficulty here was at three primary levels:

1. **Smartphone Access Restrictions**: The target audience is a young one usually around 14-20 years and are usually not allowed to use phones by their parents at home.
2. **Engagement & Motivation**: How do we design an educational experience that is engaging enough to compete with other social media distractions?
3. **Monetization & Local Payments**: How do we structure a payment and delivery model that works for students in Cameroon, where digital payment adoption varies and purchasing power is limited?

## User Research & Surveys

To validate our assumptions and understand our target users better, we conducted a comprehensive online survey using Google Forms. We received responses from high school and undergraduate students, focusing on smartphone access, studying preferences, and budget constraints.

### Key Survey Insights

#### 1. Smartphone Access at Home
A critical question was whether students are allowed to use smartphones at home, since many parents restrict phone usage to focus on schoolwork.

![Survey - Smartphone Access at Home](Untitled%204.png)

The survey showed that a significant portion of students have restricted or no smartphone access at home, meaning the platform must be highly optimized for quick sessions or offline-first study materials.

#### 2. Pamphlet Reading Preferences
We asked students how they prefer to read pamphlets and study guides:

![Survey - Reading Preferences](Untitled%205.png)

A majority of students still prefer physical pamphlets or interactive digital booklets over plain PDFs, prompting us to design a rich, interactive booklet viewer.

#### 3. Budget and Purchasing Power
We researched how much students or their parents are willing to spend on preparatory exam prep materials:

![Survey - Spending Power](Untitled%203.png)

This helped us design affordable pricing tiers and micro-payment models suited to the local market.

## Personas

Based on the survey insights and follow-up interviews, we defined two personas: a student persona and a mentor persona.

![Student Persona - Kenfack Donald](Untitled%206.png)

### User journey and flows

We mapped out the complete user journey to ensure students could seamlessly register, access pamphlets, and engage in exam nights.

![User Journey Map](Untitled%207.png)

### Competitive analysis

We had to check what other competitors do and find inspiration. So we took time to research on similar apps, their weaknesses, their strengths, their payment plans and methods etc.

![Competitive Analysis](shomi_competitive_analysis.png)

Surprisingly we didn't find any app that provide our unique selling point as a service which we called **exam night**.

### Wireframes and mockups

With the user journey and insights in place, I moved into Figma to create high-fidelity user interface mockups and interactive prototypes.

![Wireframes](shomi_wireframes.png)

[Interactive Figma Prototypes](https://www.figma.com/design/ZkczipWPw21osmJmzHCHBz/Shomi?node-id=354-1259&t=csZwqbc7SQ1m7NbW-4)

### Usability testing

We performed usability tests on key interfaces with 5 target users to validate user flows and readability:

1. One user was confused where to change the language of the app.
2. All users did not quite understand the payment page.

[Usability Testing & Feedback Interactive File](https://www.figma.com/design/ZkczipWPw21osmJmzHCHBz/Shomi?node-id=6807-2766&t=csZwqbc7SQ1m7NbW-4)

Through feedback and observation:
1. 3/5 users told us they were more likely to open the corrections than to open the papers.

![Usability Testing Changes](shomi_usability_testing.png)

### The tools

Since we were a lean, two-person team (myself as the designer and my friend as the Tech Engineer), we used highly collaborative tools to sync work and stay aligned:

- **Notion**: Project management
- **Slack**: For communication
- **Figma**: Design and mockups
- **Figjam**: Brainstorming
- **Google Forms**: For surveys
- **Google Meet / Zoom**: For syncs and walkthroughs

## Recognition & Funding

We successfully received a seed funding of **$5,000** from the **Tony Elumelu Foundation** to accelerate the development of our MVP under our registered company, **Kody**.

![Slack funding announcement](shomi_slack_announcement.jpg)

Although the app was eventually shut down after a year due to retention and content constraints, the process provided invaluable experience in full-cycle product design, user research, and cross-functional startup execution. `
  },
  {
    id: 'matanga',
    tag: 'Agency',
    title: 'Matanga Agency',
    tagline: 'Premium digital experiences for local and international clients.',
    image: 'Matanga agancy website.PNG',
    description: 'As a part-time UI/UX design consultant for Matanga Agency, I designed high-converting web applications, mobile interfaces, and digital dashboards for international and Cameroonian clients. I specialized in wireframing, interactive prototyping, and visual brand identity.',
    impact: 'Delivered user-centric designs for multiple client products.',
    site: 'https://matangaagency.com/fr/',
    role: 'Senior UI/UX Consultant (Part-time)',
    period: 'Dec 2022 - Dec 2023',
    location: 'Cameroon',
    responsibilities: [
      'Consulted with international and local stakeholders to turn complex product requirements into intuitive Figma mockups',
      'Designed scalable component-driven UI kits and typography guides to ensure consistent styling across client deliverables',
      'Conducted interactive design handoffs with engineering teams, ensuring visual fidelity and responsive layouts'
    ],
    challenge: 'The Challenge',
    challengeText: 'Matanga\'s diverse client portfolio required highly tailored digital transformations, ranging from early-stage fintech MVPs to established e-commerce systems, demanding rapid, pixel-perfect design execution without existing brand guidelines.',
    solution: 'The Solution',
    solutionText: 'I acted as a plug-and-play design leader, auditing client briefs, defining visual design languages from scratch, and shipping responsive web and mobile interfaces. I leveraged Component Libraries in Figma to enable rapid iterations and maintain a unified design system.',
    result: 'The Result',
    resultText: 'Delivered 6+ successful client product launches across Central Africa and Europe. Established repeatable design handoff standards that reduced development friction by 30% and significantly elevated the agency\'s creative reputation.'
  },
  {
    id: 'crowdremit',
    tag: 'Fintech Innovation',
    title: 'CrowdRemit',
    tagline: 'Digital peer-to-peer and business-to-business money transfer system.',
    image: 'crowdremit_mockup.png',
    description: 'Worked as UX Researcher on the entire digital experience for CrowdRemit, a fintech platform enabling cheap, fast, and easy cross-border money transfers. Designed the mobile app, web app, landing page, and design system.',
    impact: 'Designed a fintech experience targeting free cross-border transfers and multi-currency accounts.',
    site: '',
    role: 'UX Researcher & Product Designer',
    period: 'Jan 2021 - June 2021',
    location: 'Nigeria',
    responsibilities: [
      'Conducted user research and competitive analysis',
      'Designed mobile app, web app, and landing page',
      'Created and maintained the design system',
      'Led rebranding due to accessibility color contrast issues'
    ],
    challenge: 'The Challenge',
    challengeText: 'Designing a familiar yet differentiated fintech experience across all platforms. Creating a design system for consistency, and solving the complex UX of multi-currency, multi-account money transfers.',
    solution: 'The Solution',
    solutionText: 'Started with user research, journey maps, and personas. Moved to low-fidelity wireframes before high-fidelity mockups. Iterated constantly with the team and developers using Jira. Performed A/B tests and regular critiques. Rebranded the logo for better accessibility.',
    result: 'The Result',
    resultText: 'Delivered a complete design system, mobile app (iOS & Android), web app, and web dashboard. The process emphasized testing and iteration, leading to a user-centric final product.',
    content: `# Fintech App: CrowdRemit

![CrowdRemit Unified Design System](crowdremit_design_system.png)

## Product overview

Crowd Remit is a digital peer-to-peer and business to business money transfer system and service. Its mission is to make money transfer across the globe as cheap, fast and easy as possible. Its vision is to be the leader in domestically completed cross-border transfers, and to make this service the dominant player in international transfers.

My goal was to work with the team to create a mobile app, web app, landing page for users.

![CrowdRemit High-Fidelity Landing Page & Marketing Portal](crowdremit_landing_page.png)

## The Challenge

**So much going on:** The challenge here was to design an experience which looks familiar but yet highlights all the advantages of using the app. This was my second time of working on a fintech project, but it was my first time of working on such a big one across all platforms (iOS, Android, Web Dashboard, and Public Website).

**A design system:** I also had to come up with a comprehensive design system which would help developers work on consistent components and scale the design efficiently.

![CrowdRemit Comprehensive Design System Components & UI Kits](crowdremit_design_system.png)

**Multiple accounts:** The fact that the app permits you to have multiple accounts was a very challenging experience to design. A user could, for example, have two accounts both representing different countries which in turn have different currencies. Someone could choose to send money from country X with M currency to a country Y who will receive in N currency.

### *"How do we design the best experience in this kind of situation?"*

---

## We started from the basics

### We asked the users

One of the first things we did was to research the fintech space and similar apps already available. Even though the founder and stakeholders already had an idea of what they wanted, we insisted on researching before designing anything. We started gathering existing data on the fintech systems that exist and how users actually perform payments and how they send and receive money in real life.

![CrowdRemit Remote User Interview Session](crowdremit_user_interviews.png)

After gathering primary research data and also discussing with some people on how they actually perform transactions in real life, we came up with a **user journey map, user persona, and user stories.**

![CrowdRemit High-Fidelity User Stories [side-by-side]](crowdremit_user_stories.png)
![CrowdRemit Detailed Customer Journey Map [side-by-side]](crowdremit_journey_map.png)

The questions we were trying to answer were:
1. What are the primary user scenarios for which we want to craft the experience?
2. How does the user actually perform financial transactions without the app?
3. What pain points do they go through and how could the app reduce them?
4. How can we empathize better with the users?
5. How can we explore trending and existing technologies to provide a familiar but yet customized solution that stands out?

---

## Shall we design please!

### What does success look like?

Before starting the design, we had to define what success actually means for the whole experience. We sat down with the developers and stakeholders to determine the key functionality which would determine the success of the app:

1. **Sending and receiving money** instantly to friends, family, and businesses.
2. **Holding money** in stable wallets so it can generate yield/interest.
3. **Topping up airtime** and processing digital utility bills.
4. **Receiving money** and handling deposit transaction notifications and confirmations.

![CrowdRemit Receiving Money & Notification Flow](crowdremit_receiving_money.png)

---

## Design proper

We worked on low-fidelity wireframes first before going to high-fidelity designs because it helped us concentrate on the skeleton and the flow of the app without bothering about the colors, copy, and other low-level details that could distract us.

![CrowdRemit Mobile Wireframe Screens](crowdremit_wireframe_screens.png)

Right before starting the design of the mockup screens, I had to make a difficult decision.

### *"A color contrast made us rebrand the whole logo"*

![CrowdRemit Network Error Page Color Contrast Comparison](crowdremit_error_page_contrast.png)

Accessibility evaluation revealed that the old brand primary color reduced the readability of text on buttons. It failed WCAG contrast guidelines, making it difficult for visually impaired users. I took the bold decision to rebrand it, selecting a high-contrast orange theme that successfully passes WCAG AA contrast standards.

![CrowdRemit Brand Guidelines & Visual Identity](crowdremit_brand_guidelines.png)

I worked closely with the developers to create the interfaces. We used **Jira** to track the progress and sync the dev team with the design team (not an easy task, if you ask me!).

### Infinite iterations


After the wireframing stage, we worked on the high-fidelity mockups. We had meetings where we would critique and even argue on some design decisions. In a nutshell, we **designed, tested, and iterated**. We also moved back and forth between wireframes and hi-fi mockups.

We also performed regular A/B tests to validate design decisions, while developers started implementing the design concurrently.

### High-Fidelity Mockups

Below are some screens from the final design process:

![CrowdRemit High-Fidelity Deliverables Mockup Compilation](crowdremit_mockup.png)

At the end of my process, I successfully handed over the deliverables:
- **Mobile app design** (for iOS and Android)
- **A unified Design System**
- **Public landing website**
- **Admin/Web Dashboard**

---

## What I learned

- **Roadmaps flex:** Projects will not always run exactly as planned on the roadmap. Being agile is crucial.
- **Speak developer:** Working closely with the developers to understand their language improves implementation accuracy.
- **Test early:** Testing mockups with real scenarios made us understand the flow gaps clearly and iterate before writing code.`
  }
];

// Image mapping for static imports
import paysikaImage from '../assets/img/PaySika website.PNG';
import jobsikaImage from '../assets/img/Screenshot of the UI of Jobsika.PNG';
import shomiImage from '../assets/img/shomi-cover.png';
import matangaImage from '../assets/img/Matanga agancy website.PNG';

import paysikaMockup from '../assets/img/paysika_mockup.png';
import crowdremitMockup from '../assets/img/crowdremit_mockup.png';
import gueemshomeLogo from '../assets/img/gueemshome/logo.png';
import gueemshomeHero from '../assets/img/gueemshome/hero.jpg';
import gefonaLogo from '../assets/img/gefona/logo-final.png';
import crowdremitDesignSystem from '../assets/img/crowdremit_design_system.png';
import crowdremitLandingPage from '../assets/img/crowdremit_landing_page.png';
import crowdremitUserInterviews from '../assets/img/crowdremit_user_interviews.png';
import crowdremitUserStories from '../assets/img/crowdremit_user_stories.png';
import crowdremitJourneyMap from '../assets/img/crowdremit_journey_map.png';
import crowdremitReceivingMoney from '../assets/img/crowdremit_receiving_money.png';
import crowdremitWireframeScreens from '../assets/img/crowdremit_wireframe_screens.png';
import crowdremitErrorPageContrast from '../assets/img/crowdremit_error_page_contrast.png';
import crowdremitBrandGuidelines from '../assets/img/crowdremit_brand_guidelines.png';

// Imports for Shomi UX Case study images
import shomiHero from '../assets/img/Shomi app_all in one solution for graduate students.jfif';
import shomiResearch from '../assets/img/Conducting a user research.jfif';
import shomiCompetitive from '../assets/img/shomi_competitive_analysis.png';
import shomiColleague from '../assets/img/Me discussion with my collegue.jfif';
import shomiSurveySpending from '../assets/img/shomi/untitled_3.png';
import shomiSurveyReading from '../assets/img/shomi/untitled_4.png';
import shomiSurveySmartphones from '../assets/img/shomi/untitled_5.png';
import shomiPersonaDonald from '../assets/img/shomi/untitled_7.png';
import shomiUserJourney from '../assets/img/shomi/untitled_6.png';
import shomiCompetitorProcess from '../assets/img/Screenshot of Jobsika sowing our building process.jfif';
import shomiMockupCompilation from '../assets/img/an app I coded myself.PNG';
import shomiFundingAward from '../assets/img/Team spirit award_2025.jfif';
import shomiWireframes from '../assets/img/shomi_wireframes.png';
import shomiUsabilityTesting from '../assets/img/shomi_usability_testing.png';
import shomiSlackAnnouncement from '../assets/img/shomi_slack_announcement.jpg';
import shomiPrexcelClassroom from '../assets/img/prexcel_students_classroom.png';
import shomiPrexcelTeam from '../assets/img/prexcel_team_group.png';

// Imports for CrowdRemit SVGs
import crowdremitUserResearch from '../assets/img/crowdremit/user_research.svg';
import crowdremitSuccess from '../assets/img/crowdremit/success.svg';
import crowdremitWireframes from '../assets/img/crowdremit/wireframes.svg';
import crowdremitRebranding from '../assets/img/crowdremit/rebranding.svg';

// Imports for PaySika UX Case study images
import paysikaDesignDocs from '../assets/img/paysika/paysika-design-docs.png';
import paysikaProcessDocs1 from '../assets/img/paysika/paysika-process-docs1.png';
import paysikaProductAssets from '../assets/img/paysika/paysika-product-assets.png';
import paysikaMailerAssets from '../assets/img/paysika/paysika-mailer-assets.png';
import paysikaResearchArchive from '../assets/img/paysika/paysika-research-archive.png';

export const projectImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'paysika_mockup.png': paysikaMockup,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'shomi-cover.png': shomiImage,
  'Matanga agancy website.PNG': matangaImage,
  'crowdremit_mockup.png': crowdremitMockup,
  'gueemshome_logo.png': gueemshomeLogo,
  'gueemshome_hero.jpg': gueemshomeHero,
  'gefona_logo.png': gefonaLogo
};

export const shomiMarkdownImageMap: Record<string, string> = {
  'Untitled.png': shomiHero,
  'Untitled 1.png': shomiResearch,
  'Untitled 2.png': shomiColleague,
  'Untitled 3.png': shomiSurveySpending,
  'Untitled 4.png': shomiSurveyReading,
  'Untitled 5.png': shomiSurveySmartphones,
  'Untitled 6.png': shomiPersonaDonald,
  'Untitled 7.png': shomiUserJourney,
  'shomi_competitive_analysis.png': shomiCompetitive,
  'Untitled 8.png': shomiCompetitorProcess,
  'Untitled 9.png': shomiMockupCompilation,
  'Untitled 11.png': shomiColleague,
  'Screenshot_20211116-234446.jpg': shomiFundingAward,
  'shomi_wireframes.png': shomiWireframes,
  'shomi_usability_testing.png': shomiUsabilityTesting,
  'shomi_slack_announcement.jpg': shomiSlackAnnouncement,
  'shomi_prexcel_classroom.png': shomiPrexcelClassroom,
  'shomi_prexcel_team.png': shomiPrexcelTeam,
  
  // CrowdRemit SVG map
  'crowdremit_user_research.svg': crowdremitUserResearch,
  'crowdremit_success.svg': crowdremitSuccess,
  'crowdremit_wireframes.svg': crowdremitWireframes,
  'crowdremit_rebranding.svg': crowdremitRebranding,
  'crowdremit_mockup.png': crowdremitMockup,
  'crowdremit_design_system.png': crowdremitDesignSystem,
  'crowdremit_landing_page.png': crowdremitLandingPage,
  'crowdremit_user_interviews.png': crowdremitUserInterviews,
  'crowdremit_user_stories.png': crowdremitUserStories,
  'crowdremit_journey_map.png': crowdremitJourneyMap,
  'crowdremit_receiving_money.png': crowdremitReceivingMoney,
  'crowdremit_wireframe_screens.png': crowdremitWireframeScreens,
  'crowdremit_error_page_contrast.png': crowdremitErrorPageContrast,
  'crowdremit_brand_guidelines.png': crowdremitBrandGuidelines,

  // PaySika image map
  '/assets/paysika_team.jpg': paysikaDesignDocs,
  'assets/paysika_team.jpg': paysikaDesignDocs,
  '/assets/process_diagram.png': paysikaProcessDocs1,
  'assets/process_diagram.png': paysikaProcessDocs1,
  '/assets/app_screens.png': paysikaProductAssets,
  'assets/app_screens.png': paysikaProductAssets,
  '/assets/physical_card.png': paysikaMailerAssets,
  'assets/physical_card.png': paysikaMailerAssets,
  '/assets/mixpanel_data.png': paysikaResearchArchive,
  'assets/mixpanel_data.png': paysikaResearchArchive
};

// Unique tags for filtering
export const projectTags = ['All', 'Fintech Innovation', 'Job Platform', 'EdTech Platform', 'Agency'];
