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
    tagline: 'Redefining mobile finance in Africa.',
    image: 'PaySika website.PNG',
    description: 'As Lead Product Designer, I managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking. Awarded the Team Spirit Award for outstanding teamwork.',
    impact: 'Scaled fintech operations serving thousands of users across Africa.',
    site: 'https://www.paysika.co',
    role: 'Lead Product Designer',
    period: 'Dec 2021 - Jan 2026',
    location: 'Douala, Cameroon',
    responsibilities: [
      'Led a two-person design team',
      'Optimized payment flows for better user experience',
      'Implemented Mixpanel for user retention tracking',
      'Established brand identity from the ground up'
    ],
    challenge: 'The Challenge',
    challengeText: 'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users. The existing product had friction points in the onboarding and transaction flows.',
    solution: 'The Solution',
    solutionText: 'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust. We implemented a clean, minimalist interface with clear CTAs and simplified KYC processes. Mixpanel integration helped us track user behavior and continuously optimize the funnel.',
    result: 'The Result',
    resultText: 'Improved user retention by 40% and reduced customer support tickets by 60%. The design system we built scaled across web and mobile platforms.'
  },
  {
    id: 'jobsika',
    tag: 'Job Platform',
    title: 'Jobsika',
    tagline: 'Job platform for Cameroon.',
    image: 'Screenshot of the UI of Jobsika.PNG',
    description: 'Designed the user interface and experience for Jobsika, a job platform connecting job seekers with opportunities in Cameroon.',
    impact: 'Helping job seekers find opportunities across Cameroon.',
    site: 'https://jobsika.cm/',
    role: 'UI/UX Designer',
    period: '2022 - 2024',
    location: 'Cameroon',
    responsibilities: [
      'Designed user interface and experience',
      'Created job seeker and employer workflows',
      'Ensured mobile responsiveness'
    ],
    challenge: 'The Challenge',
    challengeText: 'Jobsika needed to stand out in the job market while serving users across different digital literacy levels in Cameroon.',
    solution: 'The Solution',
    solutionText: 'Created an intuitive, mobile-first design with clear job categories and easy application processes.',
    result: 'The Result',
    resultText: 'Successfully launched and helping thousands of job seekers find opportunities.'
  },
  {
    id: 'shomi',
    tag: 'EdTech Platform',
    title: 'shomi (Kody)',
    tagline: 'All-in-one platform for postgraduate students.',
    image: 'Shomi app_all in one solution for graduate students.jfif',
    description: 'As Product Lead & Co-founder, I raised pre-seed funding and led the product vision for shomi - an all-in-one platform designed for postgraduate students.',
    impact: 'Secured pre-seed funding for edTech innovation in Africa.',
    site: '',
    role: 'Product Lead & Co-founder',
    period: 'Jan 2022 - Present',
    location: 'Cameroon',
    responsibilities: [
      'Led product vision and strategy',
      'Raised pre-seed funding',
      'Built MVP from concept to launch'
    ],
    challenge: 'The Challenge',
    challengeText: 'Postgraduate students in Africa lacked a unified platform to manage their academic journey, from admissions to career placement.',
    solution: 'The Solution',
    solutionText: 'Built shomi as an all-in-one platform covering admissions, course management, networking, and job placement.',
    result: 'The Result',
    resultText: 'Secured pre-seed funding and launched MVP for pilot testing.',
    content: `# Ed-Tech app: SHOMI (by PREXCEL)

Created: January 17, 2021 2:17 AM
Tags: FigJam, Figma, Notion
Role: UI Design, UX Research
Context: A rebrand and UI/UX design of a school app
Company: PREXCEL
Status: Building

![SHOMI app - All in one solution for graduate students](Untitled.png)

## History of the brand

PREXCEL started as a weekend school that helps secondary school students to succeed in their exams. PREXCEL was founded by a group of young dynamic Engineers. Over the years, PREXCEL evolved to not just teaching weekend-classes to organising orientation conferences, home classes, selling books and pamphlets and preparing students to competitive exams.

![Brand history photoshoot and brainstorming sessions](Untitled%201.png)

## The Problem

With the outbreak of the 2019 pandemic (COVID-19), activities started slowing down.

- No more weekend/preparatory classes due to lockdowns
- No more conferences due to social distances
- General staff engagement slowing down due to lack of physical meetings

![Brainstorming and collaborative session with my colleague on product flows](Untitled%202.png)

### Problem statement: How can PREXCEL redefine itself and "go digital" while maintaining their vision and values?

## About my role

I was in charge of working on the rebranding and coming up with a web and mobile platform for PREXCEL with the best experience as possible.

- "Mini" [brand strategy](https://www.notion.so/Brand-strategy-b9feb1a336f146729b09b3b767e44182?pvs=21)
- New [brand identity](https://www.notion.so/Brand-Identity-56ce8a1b5dbf489187b5f4dbacf9aa1f?pvs=21)
- User experience (Competitor analysis, user interviews, persona, empathy map etc)
- Interfaces and prototypes
- Usability testing

After working on the brand identity and making sure everything was aligned, it was time to start the UX design process. We decided to name the platform **SHOMI**.

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

![Survey - Smartphone Access at Home](Untitled%205.png)

The survey showed that a significant portion of students have restricted or no smartphone access at home, meaning the platform must be highly optimized for quick sessions or offline-first study materials.

#### 2. Pamphlet Reading Preferences
We asked students how they prefer to read pamphlets and study guides:

![Survey - Reading Preferences](Untitled%204.png)

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

Surprisingly we didn't find any app that provide our unique selling point as a service which we called **exam night**.

![Screenshot of Jobsika showing our building process](Untitled%208.png)

### Wireframes and mockups

With the user journey and insights in place, I moved into Figma to create high-fidelity user interface mockups and interactive prototypes.

![UI Mockups Compilation](Untitled%209.png)

### Usability testing

We decided to perform some usability tests on some pages with 5 users, and 3 of them were from the Shomi team but not designers.

1. One user was confused where to change the language of the app.
2. All users did not quite understand the payment page.

![Usability Testing Session](Untitled%2010.png) Through feedback and observation:
1. 3/5 users told us they were more likely to open the corrections than to open the papers.

![Usability Testing Results Analysis](Untitled%2011.png)

### The tools

Since I was working remotely with the graphic designer, developers, and product managers, we had to use tools that would help us sync work remotely while staying efficient. As a result, we used the following tools:

- **Notion**: Project management
- **Slack**: For communication
- **Figma**: Design and mockups
- **Figjam**: Brainstorming
- **Google Forms**: For surveys
- **Google Meet / Zoom**: For interviews and standup meetings

## Recognition & Funding

The founder of the app received a seed funding of **$5,000** from the **Tony Elumelu Foundation** to accelerate the development of the MVP.

![Tony Elumelu Foundation Funding Award](Screenshot_20211116-234446.jpg) `
  },
  {
    id: 'citetsap',
    tag: 'Real Estate',
    title: 'CITE Tsap',
    tagline: 'Custom real estate management app.',
    image: 'an app I coded myself.PNG',
    description: 'Built a custom real estate management application using Angular to digitize tenant records and rent tracking. My first coding project - bridging design and development.',
    impact: 'Streamlined property management operations.',
    site: 'https://citetsap.vercel.app/',
    role: 'Creator & Developer',
    period: '2025 - Present',
    location: 'Cameroon',
    responsibilities: [
      'Built custom Angular application',
      'Digitized tenant records and rent tracking',
      'Designed and developed the entire application'
    ],
    challenge: 'The Challenge',
    challengeText: 'Traditional property management in Cameroon relied on manual record-keeping, leading to inefficiencies and errors in rent collection and tenant management.',
    solution: 'The Solution',
    solutionText: 'Designed and coded a full Angular application with tenant databases, rent tracking, payment reminders, and reporting dashboards.',
    result: 'The Result',
    resultText: 'Fully digitized property management with automated rent tracking and reporting.'
  },
  {
    id: 'gefona',
    tag: 'Non-Profit',
    title: 'GEFONA Digital Foundation',
    tagline: 'Digital economy and cybersecurity research.',
    image: 'gefona website.PNG',
    description: 'Communication and Finance lead for GEFONA Digital Foundation. Supporting policy research on the digital economy and cybersecurity in Africa.',
    impact: 'Policy research and advocacy for Africa\'s digital future.',
    site: 'https://www.gefona.org',
    role: 'Communication & Finance',
    period: 'Nov 2020 - Present',
    location: 'Africa',
    responsibilities: [
      'Lead communication and finance',
      'Design research reports',
      'Support policy research initiatives'
    ],
    challenge: 'The Challenge',
    challengeText: 'Limited visibility and understanding of cybersecurity threats facing Central and West African businesses and governments.',
    solution: 'The Solution',
    solutionText: 'Produced comprehensive research reports on the state of cybersecurity in Africa and presented findings to stakeholders.',
    result: 'The Result',
    resultText: 'Published influential reports influencing policy discussions on digital security in Africa.'
  },
  {
    id: 'matanga',
    tag: 'Agency',
    title: 'Matanga Agency',
    tagline: 'Digital agency for local and international clients.',
    image: 'Matanga agancy website.PNG',
    description: 'Part-time UI Designer designing local and international digital products using Figma. Focused on fintech, e-commerce, and community platforms.',
    impact: 'Delivered user-centric designs for multiple client products.',
    site: 'https://matangaagency.com/fr/',
    role: 'UI Designer (Part-time)',
    period: 'Dec 2022 - Feb 2024',
    location: 'Cameroon',
    responsibilities: [
      'Designed digital products for clients',
      'Created UI designs using Figma',
      'Collaborated with development teams'
    ],
    challenge: 'The Challenge',
    challengeText: 'Various clients needed digital transformation but lacked internal design capabilities.',
    solution: 'The Solution',
    solutionText: 'Delivered high-quality UI designs across fintech, e-commerce, and community platforms.',
    result: 'The Result',
    resultText: 'Multiple successful client launches with improved user engagement.'
  }
];

// Image mapping for static imports
import paysikaImage from '../assets/img/PaySika website.PNG';
import jobsikaImage from '../assets/img/Screenshot of the UI of Jobsika.PNG';
import shomiImage from '../assets/img/Shomi app_all in one solution for graduate students.jfif';
import citetsapImage from '../assets/img/an app I coded myself.PNG';
import gefonaImage from '../assets/img/gefona website.PNG';
import matangaImage from '../assets/img/Matanga agancy website.PNG';

import paysikaMockup from '../assets/img/paysika_mockup.png';

// Imports for Shomi UX Case study images
import shomiHero from '../assets/img/Shomi app_all in one solution for graduate students.jfif';
import shomiResearch from '../assets/img/Conducting a user research.jfif';
import shomiColleague from '../assets/img/Me discussion with my collegue.jfif';
import shomiSurveySpending from '../assets/img/shomi/untitled_3.png';
import shomiSurveyReading from '../assets/img/shomi/untitled_4.png';
import shomiSurveySmartphones from '../assets/img/shomi/untitled_5.png';
import shomiPersonaDonald from '../assets/img/shomi/untitled_6.png';
import shomiUserJourney from '../assets/img/shomi/untitled_7.png';
import shomiCompetitorProcess from '../assets/img/Screenshot of Jobsika sowing our building process.jfif';
import shomiMockupCompilation from '../assets/img/an app I coded myself.PNG';
import shomiUsabilityUI from '../assets/img/Screenshot of the UI of Jobsika.PNG';
import shomiFundingAward from '../assets/img/Team spirit award_2025.jfif';

export const projectImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'paysika_mockup.png': paysikaMockup,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'Shomi app_all in one solution for graduate students.jfif': shomiImage,
  'an app I coded myself.PNG': citetsapImage,
  'gefona website.PNG': gefonaImage,
  'Matanga agancy website.PNG': matangaImage
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
  'Untitled 8.png': shomiCompetitorProcess,
  'Untitled 9.png': shomiMockupCompilation,
  'Untitled 10.png': shomiUsabilityUI,
  'Untitled 11.png': shomiColleague,
  'Screenshot_20211116-234446.jpg': shomiFundingAward
};

// Unique tags for filtering
export const projectTags = ['All', 'Fintech Innovation', 'Job Platform', 'EdTech Platform', 'Real Estate', 'Non-Profit', 'Agency'];
