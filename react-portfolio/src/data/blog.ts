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
Hi! 😊 If you are reading this article, chances are you already know about Adobe Illustrator. But have you heard about **Affinity Designer**?

I completely switched from Adobe Illustrator to Affinity Designer and in this article, I will give you 3 reasons why I love Affinity Designer.

### Context

The first Adobe software I started using was Adobe Premiere Pro. It’s later on that I discovered Adobe Photoshop.

3 years ago when I started taking design as a career I could not imagine my life without Photoshop. I was designing nearly everything (flyers, business card, brochures, book covers, icons, photo retouching etc) with Photoshop. Later on, I decided to learn Adobe Illustrator for vector design, especially logo design and illustration.

It took me quite some time to learn the basics of Illustrator cause it was quite different from Photoshop. What I loved and still love about Illustrator is that it gives you the ability to scale up your design without losing the quality.

Some months ago I decided to stop using Adobe Creative Cloud products:
*   I switched from **Adobe XD** to **Figma**
*   From **Adobe Premiere Pro** to **DaVinci Resolve**
*   From **Illustrator** to **Affinity Designer**
*   From **Photoshop** to **Affinity Photo**
*   From **InDesign** to **Affinity Publisher**

### Why did I switch to Affinity Designer?

Here are the 3 reasons I love Affinity Designer and why I switched.

#### 1. Pricing (I would’ve spent a lot of money)

> “I discovered it will cost me a lot of money”

Since I wanted to take my design career seriously, I decided I will pay for each software I was using. I discovered it will cost me a lot of money if I had to pay for Illustrator.

If I had to pay for Illustrator and use it for one year, it will cost me **USD 239.88 (approx. XAF 130,267)** and the app does not belong to me.

On the other hand, Affinity Designer costs **USD 49.99 (approx. XAF 27,200)** for the Mac and Windows app. There is no subscription—you own the app for life, and all minor updates are free.

Did I mention Affinity Designer has an iPad and Windows version, and a free trial version for 30 days? Illustrator did not have an iPad version until recently and their trial version is just 7 days.

**Let’s do some math here:**

*   **Illustrator (after 1 year):** $239 (XAF 130,267)
*   **Affinity Designer (after 1 year):** $50 (XAF 27,200)
*   **You save:** **$189 (XAF 102,298)**

*   **Illustrator (after 2 years):** $478 (XAF 258,534)
*   **Affinity Designer (after 2 years):** $50 (and you own it)
*   **You save:** **$428 (XAF 231,234)**

And even if you buy both the iPad and Windows versions, you still save a lot of money.

#### 2. User Experience

> “Pricing made me choose, simplicity made me stay”

The first thing I noticed was how simple and intuitive the interface is. I must admit Illustrator frustrated me with its complex and cluttered environment. It took me just one day to get fully started and comfortable on Affinity Designer. 

Affinity Designer has way fewer nested and complicated options which are often unnecessary for everyday work, making it perfect for freelancers and digital creators. Going back to Illustrator now would be very difficult.

#### 3. Performance

The desktop application of Affinity Designer is extremely lightweight (around 750 MB). It is built from the ground up for modern hardware, making the entire experience incredibly smooth. In fact, you can zoom up to **1,000,000%** with absolutely zero lag!

### Conclusion & Recommendation

It is important to note that if you intend to work inside traditional creative agencies, I highly recommend you still learn Illustrator. A lot of companies out there can't imagine life without Adobe products. 

But on the other hand, if you are a freelancer wanting to save money while using a powerful, fast, and intuitive app, then definitely give a try to **Affinity Designer**.

*Hit me up on Twitter if you have any questions on Affinity Designer!*
    `,
    date: 'August 15, 2022',
    author: 'Ndouken Theryx',
    readTime: '5 min read',
    tags: ['Design Tools', 'Affinity Designer', 'Workflow'],
    image: 'illustrator_vs_affinity.png'
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
import affinityImage from '../assets/img/illustrator_vs_affinity.png';

export const blogImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'theryx giving a lecture to a comunity of open source.png': ossImage,
  'illustrator_vs_affinity.png': affinityImage,
};

export const blogTags = ['All', 'Fintech', 'Africa', 'Product Design', 'UX Design', 'Accessibility', 'Emerging Markets', 'Open Source', 'Design Tools'];
