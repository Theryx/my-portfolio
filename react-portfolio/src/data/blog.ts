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

// Reusing project images for now, or you can add new ones to assets/img
import paysikaImage from '../assets/img/PaySika website.PNG';
import jobsikaImage from '../assets/img/Screenshot of the UI of Jobsika.PNG';

export const blogImageMap: Record<string, string> = {
  'future-of-fintech-africa': paysikaImage,
  'designing-for-accessibility': jobsikaImage,
};

export const blogTags = ['All', 'Fintech', 'Africa', 'Product Design', 'UX Design', 'Accessibility', 'Emerging Markets'];
