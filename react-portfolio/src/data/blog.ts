export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'how-to-contribute-to-open-source-as-a-designer',
    title: 'How to Contribute to Open Source as a Designer',
    excerpt: 'A practical guide on how to contribute to open source projects without writing a single line of code.',
    content: `
      <p>Hi, I’m Theryx. I’m a digital designer. In this blog, I will tell you practically how I contribute to Open source as a non-tech person. This blog could also be titled “How to contribute to Open Source without coding knowledge” or “how to contribute to open source as a UI designer”. I will try to write the blog as simple as possible because this is intended for non-tech people.</p>

      <h3>What is Open Source?</h3>
      <p>The term Open Source refers to intellectual property people can modify and share because it is made to be publicly accessible. Most open source projects are usually run by one or more people called maintainers.</p>
      <p>An Open source project, product, or initiative is one that cherishes strong values like collaboration, participation, rapid prototyping, transparency, meritocracy, and community-oriented development.</p>

      <h3>How Contribution is Done… Practically</h3>
      <p>I have broken down the process into five simple steps:</p>
      <ul>
        <li><strong>Step 0: Ask how you could help?</strong> Join the community's Discord, Telegram, or ask on social media.</li>
        <li><strong>Step 1: Find a project on GitHub</strong> Find a project that matches your interests or area of expertise.</li>
        <li><strong>Step 2: Read the documentation</strong> Document yourself about the project, usually found in the README file.</li>
        <li><strong>Step 3: Check possible issues</strong> Go to the issue tab and see if there are any design-related issues.</li>
        <li><strong>Step 4: Create an issue</strong> If the problem hasn't been reported yet, raise a new issue yourself.</li>
        <li><strong>Step 5: Review the implementation</strong> Work with developers to ensure your design is implemented correctly.</li>
      </ul>

      <h3>Conclusion</h3>
      <p>I hope this blog will motivate you to contribute to open source even if you don’t have coding knowledge. There are various ways you could contribute—from UI improvements to updating documentation and sharing the project with your friends.</p>
    `,
    date: 'September 24, 2022',
    author: 'Ndouken Theryx',
    readTime: '6 min read',
    tags: ['Open Source', 'Design', 'Community'],
    image: 'theryx giving a lecture to a comunity of open source.png'
  },
  {
    id: 'why-i-switched-from-illustrator-to-affinity-designer',
    title: 'Why I Switched from Illustrator to Affinity Designer',
    excerpt: 'Exploring the reasons behind moving my design workflow from Adobe Illustrator to Affinity Designer.',
    content: `
      <p>Adobe Illustrator has been the industry standard for vector design for decades. However, the rise of powerful alternatives like Affinity Designer has changed the landscape for many professionals.</p>
      
      <h3>The Performance Factor</h3>
      <p>One of the most immediate benefits of Affinity Designer is its speed. The software is built for modern hardware, offering smooth zooming and panning even with complex documents.</p>
      
      <h3>One-Time Purchase vs Subscription</h3>
      <p>The pricing model of Affinity is a major draw. Moving away from the Creative Cloud subscription model allows for better long-term budgeting without losing professional-grade features.</p>
      
      <h3>The Persona Workflow</h3>
      <p>The ability to switch between vector and pixel workspaces (Personas) seamlessly within the same app is a game-changer for digital illustrators.</p>
    `,
    date: 'August 15, 2022',
    author: 'Ndouken Theryx',
    readTime: '5 min read',
    tags: ['Design Tools', 'Affinity Designer', 'Workflow'],
    image: 'Editor and designer for Report on Cameroon Cybersecurity.jfif'
  },
  {
    id: 'future-of-fintech-africa',
    title: 'The Future of Fintech in Africa: Beyond Payments',
    excerpt: 'Exploring how fintech is evolving from simple payment solutions to comprehensive financial ecosystems in Africa.',
    content: `
      <p>Fintech in Africa has long been synonymous with mobile money and payments. However, we are entering a new era where financial technology is touching every aspect of daily life, from savings and insurance to credit and investment.</p>
      
      <h3>The Rise of Super-Apps</h3>
      <p>We're seeing a trend towards "super-apps" that integrate multiple financial services into a single interface. This is driven by the need for convenience and the high cost of data, making it preferable for users to have one app that does it all.</p>
      
      <h3>Credit and Financial Inclusion</h3>
      <p>One of the biggest hurdles in Africa is the lack of traditional credit scores. Fintech companies are now using alternative data—like mobile phone usage and payment history—to assess creditworthiness, opening doors for millions who were previously unbanked.</p>
      
      <h3>Conclusion</h3>
      <p>The next decade of African fintech will be defined by how well these platforms can provide value beyond just moving money. It's about building trust and creating ecosystems that empower users to grow their wealth.</p>
    `,
    date: 'April 10, 2026',
    author: 'Ndouken Theryx',
    readTime: '5 min read',
    tags: ['Fintech', 'Africa', 'Product Design'],
    image: 'PaySika website.PNG'
  },
  {
    id: 'designing-for-accessibility',
    title: 'Designing for Accessibility in Emerging Markets',
    excerpt: 'How to create inclusive digital products for users with varying levels of digital literacy and device capabilities.',
    content: `
      <p>Accessibility in emerging markets isn't just about disability; it's about accessibility to technology itself. Users often have low-end devices, limited data, and varying levels of digital literacy.</p>
      
      <h3>Optimizing for Low-End Devices</h3>
      <p>Designers must consider the technical constraints of the hardware. This means optimizing image sizes, reducing complex animations, and ensuring that the app remains functional even on older versions of Android.</p>
      
      <h3>Visual Hierarchy and Clarity</h3>
      <p>Clear visual cues are essential. For users who may not be familiar with standard UI patterns, we need to use explicit icons, clear labels, and intuitive navigation flows.</p>
      
      <h3>Localization and Culture</h3>
      <p>Localization goes beyond translation. It's about understanding cultural nuances and how they affect user interaction with digital products.</p>
    `,
    date: 'March 25, 2026',
    author: 'Ndouken Theryx',
    readTime: '4 min read',
    tags: ['UX Design', 'Accessibility', 'Emerging Markets'],
    image: 'Screenshot of the UI of Jobsika.PNG'
  }
];

// Image mapping
import paysikaImage from '../assets/img/PaySika website.PNG';
import jobsikaImage from '../assets/img/Screenshot of the UI of Jobsika.PNG';
import ossImage from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import affinityImage from '../assets/img/Editor and designer for Report on Cameroon Cybersecurity.jfif';

export const blogImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'theryx giving a lecture to a comunity of open source.png': ossImage,
  'Editor and designer for Report on Cameroon Cybersecurity.jfif': affinityImage,
};

export const blogTags = ['All', 'Fintech', 'Africa', 'Product Design', 'UX Design', 'Accessibility', 'Emerging Markets', 'Open Source', 'Design Tools'];
