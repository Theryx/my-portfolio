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
    resultText: 'Secured pre-seed funding and launched MVP for pilot testing.'
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

export const projectImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'Shomi app_all in one solution for graduate students.jfif': shomiImage,
  'an app I coded myself.PNG': citetsapImage,
  'gefona website.PNG': gefonaImage,
  'Matanga agancy website.PNG': matangaImage
};

// Unique tags for filtering
export const projectTags = ['All', 'Fintech Innovation', 'Job Platform', 'EdTech Platform', 'Real Estate', 'Non-Profit', 'Agency'];
