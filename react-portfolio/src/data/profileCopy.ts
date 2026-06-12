export interface ProfilePreset {
  id: string;
  name: string;
  is_active: boolean;
  bio: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  philosophy_title: string;
  philosophy_text: string;
  badges: string[];
  social_links: Record<string, string>;
}

export interface ProjectPreset {
  id: string;
  profile_id: string;
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
  challenge_text: string;
  solution: string;
  solution_text: string;
  result: string;
  result_text: string;
  is_hidden: boolean;
  sort_order: number;
  content: string;
}

export const profilePresets: Record<string, ProfilePreset> = {
  default: {
    id: 'default',
    name: 'Default',
    is_active: true,
    bio: 'Product Designer',
    tagline: 'I design and build user-centric digital products.',
    hero_title: 'Product Designer & Tech Entrepreneur',
    hero_subtitle: 'I design end-to-end digital products, combining UX/UI design with frontend development. Led design at PaySika for 4 years and co-founded tech ventures. Based in Cameroon.',
    philosophy_title: 'I design experiences that bridge technology and human needs.',
    philosophy_text: 'As a Product Designer, I combine user empathy, clear analytics, and business objectives. With 4+ years leading design at PaySika and co-founding my own ventures, I create products that look beautiful, function seamlessly, and drive business growth.',
    badges: ['Open to Product Design & Design Engineering roles', 'Tech Entrepreneur'],
    social_links: {
      now: 'Shipping my next venture with AI-assisted design & code',
      projects_intro: 'Selected Case Studies: fintech applications, community job boards, and startup MVPs.',
      blog_intro: 'Thoughts on product design, user experience, and building tech in Africa.',
      metric_label: 'years leading product design',
    },
  },
  fintech: {
    id: 'fintech',
    name: 'Fintech Focus',
    is_active: true,
    bio: 'Fintech Product Designer',
    tagline: 'Designing financial experiences people trust with their money.',
    hero_title: 'Fintech Product Designer',
    hero_subtitle: 'I design secure and trustworthy financial experiences. Led UX/UI design at PaySika, optimized KYC verification funnels, and scaled transaction interfaces for thousands of active users. Based in Cameroon.',
    philosophy_title: 'Trust is the core currency of financial design.',
    philosophy_text: 'Fintech design goes beyond aesthetics—it is about clarity, security, and trust. By reducing friction in onboarding, streamlining KYC photo uploads, and simplifying multi-currency wallets, I help users feel confident and secure with every transaction.',
    badges: ['Available for Fintech Product Design roles', 'Secure UX & Payments'],
    social_links: {
      now: 'Optimizing onboarding funnels and transaction flows for fintech products',
      projects_intro: 'Selected Fintech Work: mobile wallet interfaces, debit card experiences, and remittance systems.',
      blog_intro: 'Insights on fintech usability, security patterns, and financial inclusion in Africa.',
      metric_label: 'years leading fintech design',
    },
  },
  'design-engineer': {
    id: 'design-engineer',
    name: 'Design Engineer',
    is_active: true,
    bio: 'Design Engineer',
    tagline: 'Bridging the gap between design and production-ready code.',
    hero_title: 'Design Engineer',
    hero_subtitle: 'I bridge the gap between design and production code. I build Figma-to-production pipelines, write clean frontend components, and leverage advanced AI tooling (Claude, Gemini) to accelerate delivery. Based in Cameroon.',
    philosophy_title: 'The best handoff is no handoff.',
    philosophy_text: 'I believe that design and engineering should be a continuous loop, not separate phases. By designing in Figma with code structure in mind, and writing React and CSS that matches the designs pixel-for-pixel, I eliminate handoff friction and ship higher-quality products faster.',
    badges: ['Available for Design Engineer roles', 'React / CSS / Figma'],
    social_links: {
      now: 'Building UI components and prototyping using Claude & Gemini',
      projects_intro: 'Selected Work: bridging pixel-perfect design with clean front-end engineering.',
      blog_intro: 'Thoughts on front-end development, CSS layout, design systems, and AI tools.',
      metric_label: 'years bridging design & code',
    },
  },
  'digital-marketing': {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    is_active: true,
    bio: 'Digital Marketing Strategist',
    tagline: 'Helping brands grow with content, campaigns, and measurable acquisition.',
    hero_title: 'Digital Marketing Strategist',
    hero_subtitle: 'I plan and execute growth marketing campaigns. I align brand strategy, content creation, paid acquisition, and funnel analytics to drive conversion-focused digital experiences. Based in Cameroon.',
    philosophy_title: 'Marketing should be clear, measurable, and useful.',
    philosophy_text: 'I combine audience research, performance tracking, and product thinking to build campaigns that do more than get attention. They build brand equity, establish customer trust, and drive measurable conversions.',
    badges: ['Available for growth & marketing projects', 'Brand & Conversion'],
    social_links: {
      now: 'Developing content strategies and paid media campaigns for growth-stage startups',
      projects_intro: 'Selected Campaigns: content strategy, SEO, and paid acquisition case studies.',
      blog_intro: 'Insights on growth marketing, conversion rate optimization, and brand building.',
      metric_label: 'years in brand & growth',
    },
  },
  'project-manager': {
    id: 'project-manager',
    name: 'Project Manager',
    is_active: true,
    bio: 'Product & Project Manager',
    tagline: 'Coordinating cross-functional teams to deliver high-quality products on time.',
    hero_title: 'Product & Project Manager',
    hero_subtitle: 'I lead cross-functional teams to deliver digital products from definition to launch. Co-founded Kody, raised $5,000 for the Shomi EdTech app, and coordinated product cycles at PaySika. Based in Cameroon.',
    philosophy_title: 'Clarity is a deliverable.',
    philosophy_text: 'Great projects are built on alignment, clear scopes, and open communication. I translate high-level product briefs into structured execution roadmaps, keep engineering and design in sync, and balance scope with business value to ensure timely delivery.',
    badges: ['Available for Product & Project Management roles', 'Agile / Scrum / Leadership'],
    social_links: {
      now: 'Managing product roadmaps and scoping MVPs for early-stage startups',
      projects_intro: 'Product Management Case Studies: scoping, team leadership, and product delivery.',
      blog_intro: 'Thoughts on agile execution, team dynamics, scoping MVP milestones, and startup operations.',
      metric_label: 'years leading product teams',
    },
  },
};

export const projectPresets: ProjectPreset[] = [
  {
    id: 'paysika_project-manager',
    profile_id: 'project-manager',
    tag: 'Fintech Innovation',
    title: 'PaySika',
    tagline: 'Coordinating cross-functional squads to scale operations to thousands of active users.',
    image: '',
    description: "As Product and Project Manager, I coordinated a cross-functional squad of design, marketing, and engineering to scale PaySika's mobile and web apps. I established agile sprints, managed the release roadmaps, and utilized Mixpanel data to prioritize backlog features and optimize operational workflows.",
    impact: 'Coordinated cross-functional teams to scale fintech operations.',
    site: '',
    role: 'Product & Project Manager',
    period: '',
    location: '',
    responsibilities: [
      'Coordinated a 10+ person cross-functional team across design, engineering, and marketing using Agile methodologies',
      'Structured and managed product backlogs, sprint planning, and weekly release cycles, reducing time-to-market by 25%',
      'Established clear developer handoff guidelines and communication protocols, minimizing implementation loops',
      'Analyzed user conversion and drop-off metrics in Mixpanel to prioritize feature requests and UX improvements',
    ],
    challenge: '',
    challenge_text: '',
    solution: '',
    solution_text: '',
    result: '',
    result_text: '',
    is_hidden: false,
    sort_order: 0,
    content: '',
  },
  {
    id: 'jobsika_project-manager',
    profile_id: 'project-manager',
    tag: 'Job Platform',
    title: 'Jobsika',
    tagline: "Scoping and managing open-source development sprints for Cameroon's job portal.",
    image: '',
    description: 'For OSS Cameroon, I served as project manager and co-maintainer for jobsika.cm. I scoped development roadmaps, prioritized issues, audited community pull requests on GitHub, and coordinated collaborative sprints between designers and developers to deliver an accessible job platform.',
    impact: 'Helping job seekers find opportunities across Cameroon.',
    site: '',
    role: 'Project Manager (Open Source)',
    period: '',
    location: '',
    responsibilities: [
      'Scoped and defined feature requirements, backlog issues, and release milestones on GitHub',
      'Coordinated volunteer developers and designers, ensuring clear task assignments and timely contributions',
      'Facilitated design review sessions and audited frontend implementations to verify alignment with functional specifications',
    ],
    challenge: '',
    challenge_text: '',
    solution: '',
    solution_text: '',
    result: '',
    result_text: '',
    is_hidden: false,
    sort_order: 1,
    content: '',
  },
  {
    id: 'shomi_project-manager',
    profile_id: 'project-manager',
    tag: 'EdTech Platform',
    title: 'Shomi (Kody)',
    tagline: 'Co-founding and leading product delivery of an EdTech app from $5k funding to market.',
    image: '',
    description: 'Co-founded Kody and served as Product Lead for Shomi. After raising a $5,000 seed grant from the Tony Elumelu Foundation, I defined the product roadmap, managed a strategic content partnership with PREXCEL, coordinated MVP development with the engineering lead, and directed user testing.',
    impact: 'Secured $5,000 seed funding from the Tony Elumelu Foundation.',
    site: '',
    role: 'Co-founder & Product Lead',
    period: '',
    location: '',
    responsibilities: [
      'Secured and managed a $5,000 seed grant from the Tony Elumelu Foundation, directing budget allocation for product launch',
      'Negotiated and managed a strategic partnership with PREXCEL to secure student user-testing cohorts and learning materials',
      'Translated user survey data from 100+ students into functional requirements and guided MVP scoping',
      'Coordinated design and engineering milestones, ensuring alignment between visual layouts and backend capabilities',
    ],
    challenge: '',
    challenge_text: '',
    solution: '',
    solution_text: '',
    result: '',
    result_text: '',
    is_hidden: false,
    sort_order: 2,
    content: '',
  },
];
