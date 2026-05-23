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
# How to Contribute to Open Source as a Designer: A case study of OSS Cameroon

## Overview
Hi, I’m Theryx. I’m a digital designer. In this blog, I will tell you practically how I contribute to Open Source as a non-tech person. This blog could also be titled “How to contribute to Open Source without coding knowledge” or “how to contribute to open source as a UI designer”. I will try to write the blog as simple as possible because this is intended for non-tech people.

### What is Open Source?
Before we begin, let's define Open Source in case you don’t know what it is. Well… the term **Open Source** refers to intellectual property people can modify and share because it is made to be publicly accessible. Most open source projects are usually run by one or more people called maintainers.

An Open source project, product, or initiative is one that cherishes strong values like collaboration, participation, rapid prototyping, transparency, meritocracy, and community-oriented development.

### What is OSS Cameroon?
Most of what I will write in this blog is largely based on my experience contributing to **OSS Cameroon** projects. OSS Cameroon is short for *Open Source Society Cameroon*. It is a community of Cameroonians that have a passion to develop open source solutions to solve local problems. The community is maintained by a group of awesome (yeah, I’m one of them!) persons but owned and driven by everyone.

OSS Cameroon also exists to promote the talent and know-how of Cameroonians by using technical and non-technical knowledge to bring solutions to problems found in our society.

### What is a maintainer?
At OSS Cameroon, I’m one of the maintainers of a project called **jobsika.cm**, but what is an open source maintainer? We can talk about what it means to maintain an open source project another day in another blog, but I just want to touch on it so that you don’t feel confused.

> “Maintainers are the conductors of an open source project orchestra,” — *Steven J. Vaughan-Nichols*. “If a bug hasn't been fixed by a developer, they'll fix it. If the code hasn't been reviewed, they'll review it. And, with large projects like Linux, there are often hundreds of code patches, which need to be maintained a week.”

---

## How contribution is done… practically

I have broken down the process into five simple steps:

### **Step 0:** Ask how you could help?
If you have no idea how to contribute and you want someone to help you get started, you could ask in the comment section of an issue, join the community's Discord server, Telegram, or even ask on social media and mention **@osscameroon**. There is always someone happy to help.

### **Step 1:** Find a project on the OSS Cameroon GitHub page
Find a project that matches your interests or area of expertise. Contributing to projects can be “hard” sometimes, so you want to make sure you select a project in which you are really interested. Don’t worry about the programming languages attached to each project!

In addition to the OSS Cameroon’s organization page on GitHub, people can also find projects to contribute to by going to the [osscameroon.com](http://osscameroon.com) projects page.

![OSS Cameroon organization page on GitHub](oss_projects_github.png)

### **Step 2:** Read the documentation
Open a project and document yourself about it. You’ll usually find the project description in the repository’s \`README.md\` file.

![JobSika repository on GitHub](jobsika_repo.png)

### **Step 3:** Check possible issues you could help with
Go to the issue tab and see if there are any design-related issues you could help with. You can use advanced search in the GitHub search bar (e.g., \`is:issue is:open label:design\` or searching for "design").

![JobSika issues list on GitHub](jobsika_issues.png)

Once you find an existing issue that is open, open it and engage:
*   Read the description of the issue and try to clearly understand the problem.
*   Check the comment section and engage with existing members.
*   Propose your solution (it could be a screenshot or a link to your design mockup) in the comments.

### **Step 4:** Create an issue
Sometimes the issue you work on might not be in the existing open or closed issues. This means the issue has not been reported yet. In that case, you can create a new issue by clicking on the **“New issue”** button.

Clearly describe the problem and propose a design solution, then go ahead and submit it.

### **Step 5:** Review the implementation of your solution
If the issue you submit has to be implemented, then a developer will help you implement your design. The developer could be a maintainer on the project or a contributor like you. The developer will then create a pull request (PR) linking the issue you created. 

Other maintainers will review the implementation and merge it. If you are a maintainer on the project, you could merge the implementation if you are okay with it, but if you are not a maintainer, you can engage in the comments and discuss the implementation details to ensure it aligns with your design.

![JobSika Pull Request merge on GitHub](jobsika_pr.png)

---

## Congratulations!
Aaaaaand… that's it! You have just completed your contribution to an open source project. 🥳

Before concluding this section, I must say that contributing to an open source project is not exactly the same for every project. Every project defines its own contribution rules and processes. As a general rule, you should always read the documentation of each project to know how to submit your contribution.

Also, some projects may limit the extent to which you can contribute. Lastly, your contribution could take some time to be implemented, reviewed, or merged. Sometimes maintainers may consider your contribution as less important and not give it immediate attention. It is important to know that, but that should not kill your energy—go for it!

---

## Conclusion
I hope this blog will motivate you to contribute to open source even if you don’t have coding knowledge. There are various ways you could contribute to open source projects, and this is how we do it at OSS Cameroon.

Other ways you can contribute are:
*   Submit a bug fix.
*   Submit a user interface design improvement.
*   Update documentation.
*   Answer questions (either on GitHub or in the community).
*   Review code.
*   Talk about the project to your friends or share it on social media.

This could be applied to a lot of non-tech roles like graphic design, illustration, writing, marketing, product design, research, organizing, community management, and more.

---

## Definitions

*   **GitHub**: Simply put, GitHub is a website that helps developers store and manage their code, as well as track and control changes. To contribute to open source projects, you need to create a GitHub account.
*   **Readme file**: The Readme file (\`README.md\`) is often the first file that contributors read. It is a text file that contains important information for contributors about the project.
*   **Pull request (PR)**: A pull request is a technical term used in software development that means a contributor (usually a developer) has applied changes to the code and is ready to merge them into the main project repository.
*   **Reviewing a pull request**: Once a pull request is submitted by a developer, their code is checked, tested, and reviewed before merging.
*   **Merging code**: Merging code means integrating changes that come from a pull request into the main code of the project.
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

![Design Career seriously - Illustrator Cost](illustrator_cost_medium.png)

If I had to pay for Illustrator and use it for one year, it will cost me **USD 239.88 (approx. XAF 130,267)** and the app does not belong to me.

![Adobe Illustrator Annual Pricing Plan Screenshot](illustrator_pricing_plan.png)

On the other hand, Affinity Designer costs **USD 49.99 (approx. XAF 27,200)** for the Mac and Windows app. There is no subscription—you own the app for life, and all minor updates are free.

![Affinity Designer App Store Screenshot](affinity_pricing_plan.png)

Did I mention Affinity Designer has an iPad and Windows version, and a free trial version for 30 days? Illustrator did not have an iPad version until recently and their trial version is just 7 days.

![Affinity Designer Cross-Platform Pricing and Purchase Options](affinity_platforms.png)

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

![Affinity Designer High Zoom Workspace Performance](affinity_zoom_workspace.png)

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
  }
];

// Image mapping
import paysikaImage from '../assets/img/PaySika website.PNG';
import jobsikaImage from '../assets/img/Screenshot of the UI of Jobsika.PNG';
import ossImage from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import affinityImage from '../assets/img/illustrator_vs_affinity.png';
import ossProjectsGithub from '../assets/img/oss_projects_github.png';
import jobsikaRepo from '../assets/img/jobsika_repo.png';
import jobsikaIssues from '../assets/img/jobsika_issues.png';
import jobsikaPr from '../assets/img/jobsika_pr.png';
import illustratorCostMedium from '../assets/img/illustrator_cost_medium.png';
import illustratorPricingPlan from '../assets/img/illustrator_pricing_plan.png';
import affinityPricingPlan from '../assets/img/affinity_pricing_plan.png';
import affinityPlatforms from '../assets/img/affinity_platforms.png';
import affinityZoomWorkspace from '../assets/img/affinity_zoom_workspace.png';

export const blogImageMap: Record<string, string> = {
  'PaySika website.PNG': paysikaImage,
  'Screenshot of the UI of Jobsika.PNG': jobsikaImage,
  'theryx giving a lecture to a comunity of open source.png': ossImage,
  'illustrator_vs_affinity.png': affinityImage,
  'oss_projects_github.png': ossProjectsGithub,
  'jobsika_repo.png': jobsikaRepo,
  'jobsika_issues.png': jobsikaIssues,
  'jobsika_pr.png': jobsikaPr,
  'illustrator_cost_medium.png': illustratorCostMedium,
  'illustrator_pricing_plan.png': illustratorPricingPlan,
  'affinity_pricing_plan.png': affinityPricingPlan,
  'affinity_platforms.png': affinityPlatforms,
  'affinity_zoom_workspace.png': affinityZoomWorkspace,
};

export const blogTags = ['All', 'Fintech', 'Africa', 'Product Design', 'UX Design', 'Accessibility', 'Emerging Markets', 'Open Source', 'Design Tools'];
