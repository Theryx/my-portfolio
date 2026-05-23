-- CLEAR EXISTING DATA (except profiles)
TRUNCATE projects CASCADE;
TRUNCATE blog_posts CASCADE;

-- ==========================================
-- PROJECTS POPULATION
-- ==========================================

-- PROJECTS FOR 'default' PROFILE
INSERT INTO projects (id, profile_id, tag, title, tagline, image, description, impact, site, role, period, location, responsibilities, challenge, challenge_text, solution, solution_text, result, result_text, sort_order)
VALUES 
(
  'paysika_default', 'default', 'Fintech Innovation', 'PaySika', 'Driving 40% user retention and 60% support ticket reduction.', 'paysika_mockup.png', 
  'As Lead Product Designer and Founding Team Member, I managed a two-person design team and scaled PaySika’s mobile and web applications to serve thousands of active users across Central Africa. I engineered cross-functional workflows, led visual rebranding, and leveraged Mixpanel data to optimize transactional funnels.',
  'Scaled fintech operations serving thousands of users across Africa.', 'https://www.paysika.co', 'Lead Product Designer', 'Dec 2021 - Aug 2026', 'Douala, Cameroon',
  ARRAY['Recruited, scaled, and managed the creative design team, establishing high-performance assets handoff pipelines', 'Redesigned core mobile application interfaces (Onboarding, KYC, and Visa activation flows), minimizing drop-offs', 'Conducted usability testing sessions and leveraged Mixpanel tracking to drive evidence-backed retention updates', 'Led the end-to-end industrial and print design of PaySika’s physical debit card experience and unboxing'],
  'The Challenge', 'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users. The existing product had friction points in the onboarding and transaction flows.',
  'The Solution', 'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust. We implemented a clean, minimalist interface with clear CTAs and simplified KYC processes. Mixpanel integration helped us track user behavior and continuously optimize the funnel.',
  'The Result', 'Improved user retention by 40% and reduced customer support tickets by 60%. The design system we built scaled across web and mobile platforms.', 1
),
(
  'jobsika_default', 'default', 'Job Platform', 'Jobsika', 'Connecting Cameroonian job seekers with local opportunities.', 'Screenshot of the UI of Jobsika.PNG', 
  'At OSS Cameroon (Open Source Society Cameroon), I serve as co-maintainer and design lead for jobsika.cm—a community-driven platform. I established the visual guidelines, designed low-friction workflows, and spearheaded open-source design contributions.',
  'Helping job seekers find opportunities across Cameroon.', 'https://jobsika.cm/', 'Co-maintainer & Design Lead (Open Source)', '2022 - 2024', 'Cameroon',
  ARRAY['Designed responsive web and mobile workflows, improving low-bandwidth accessibility for local job seekers', 'Served as active maintainer on GitHub, auditing design PR implementations and guiding community contributions', 'Collaborated with open-source software engineers to review and merge UI/UX code components, ensuring design parity'],
  'The Challenge', 'Jobsika needed to serve as an accessible, high-performance job board for Cameroonians, operating efficiently across varying digital literacy levels and device capabilities, while maintaining a transparent open-source contribution pipeline.',
  'The Solution', 'I designed a mobile-first UI with clear search categories and a straightforward application process. I documented complete contribution guidelines on GitHub, opening design issues and collaborating directly with frontend developers through pull requests to ensure our design standards were accurately translated into React.',
  'The Result', 'Successfully launched jobsika.cm as a fully open-source job portal. Built a thriving community of developer contributors on GitHub, delivering a consistent, accessible experience designed specifically for Cameroon’s local context.', 2
),
(
  'shomi_default', 'default', 'EdTech Platform', 'shomi (Kody)', 'All-in-one educational platform built for secondary school students.', 'shomi-cover.png', 
  'Designed the Shomi educational app for our startup company, Kody, after raising a $5,000 seed funding from the Tony Elumelu Foundation. Collaborated as the UI/UX Designer alongside my friend who served as the Tech Engineer.',
  'Secured $5,000 seed funding from the Tony Elumelu Foundation.', '', 'UI/UX Designer', 'Dec 2019 - Dec 2020', 'Cameroon',
  ARRAY['Designed the entire web and mobile platform layout and user flows', 'Conducted comprehensive user research, surveys, and usability tests', 'Collaborated directly with the Tech Engineer to transition designs into a functional product', 'Crafted the brand identity and visual design language'],
  'The Challenge', 'Our startup Kody needed to build Shomi—a highly engaging educational platform for secondary school students in Cameroon, taking into account limited smartphone access at home and complex local payment integration.',
  'The Solution', 'As the UI/UX designer on our lean two-person team at Kody, I designed Shomi as a mobile-first experience with a clean layout, offline-first study materials, and interactive booklet features, collaborating closely with the Tech Engineer.',
  'The Result', 'Successfully designed the Shomi MVP and validated the layout through usability tests. While we raised $5,000 from the Tony Elumelu Foundation and launched, we unfortunately shut down the app after one year due to a lack of student engagement, retention, and content strategy.', 3
),
(
  'citetsap_default', 'default', 'Real Estate', 'CITE Tsap', 'Custom real estate management app.', 'an app I coded myself.PNG', 
  'Built a custom real estate management application using Angular to digitize tenant records and rent tracking.',
  'Streamlined property management operations.', 'https://citetsap.vercel.app/', 'Creator & Developer', '2025 - Present', 'Cameroon',
  ARRAY['Built custom Angular application', 'Digitized tenant records and rent tracking', 'Designed and developed the entire application'],
  'The Challenge', 'Traditional property management in Cameroon relied on manual record-keeping.',
  'The Solution', 'Designed and coded a full Angular application with tenant databases, rent tracking, and payment reminders.',
  'The Result', 'Fully digitized property management with automated rent tracking and reporting.', 4
),
(
  'gefona_default', 'default', 'Non-Profit', 'GEFONA Digital Foundation', 'Digital economy and cybersecurity research.', 'gefona website.PNG', 
  'Communication and Finance lead for GEFONA Digital Foundation. Supporting policy research on the digital economy and cybersecurity in Africa.',
  'Policy research and advocacy for Africa''s digital future.', 'https://www.gefona.org', 'Communication & Finance', 'Nov 2020 - Present', 'Africa',
  ARRAY['Lead communication and finance', 'Design research reports', 'Support policy research initiatives'],
  'The Challenge', 'Limited visibility and understanding of cybersecurity threats facing Central and West African businesses.',
  'The Solution', 'Produced comprehensive research reports on the state of cybersecurity in Africa.',
  'The Result', 'Published influential reports influencing policy discussions on digital security in Africa.', 5
),
(
  'matanga_default', 'default', 'Agency', 'Matanga Agency', 'Premium digital experiences for local and international clients.', 'Matanga agancy website.PNG', 
  'As a part-time UI/UX design consultant for Matanga Agency, I designed high-converting web applications, mobile interfaces, and digital dashboards for international and Cameroonian clients. I specialized in wireframing, interactive prototyping, and visual brand identity.',
  'Delivered user-centric designs for multiple client products.', 'https://matangaagency.com/fr/', 'Senior UI/UX Consultant (Part-time)', 'Dec 2022 - Dec 2023', 'Cameroon',
  ARRAY['Consulted with international and local stakeholders to turn complex product requirements into intuitive Figma mockups', 'Designed scalable component-driven UI kits and typography guides to ensure consistent styling across client deliverables', 'Conducted interactive design handoffs with engineering teams, ensuring visual fidelity and responsive layouts'],
  'The Challenge', 'Matanga''s diverse client portfolio required highly tailored digital transformations—ranging from early-stage fintech MVPs to established e-commerce systems—demanding rapid, pixel-perfect design execution without existing brand guidelines.',
  'The Solution', 'I acted as a plug-and-play design leader, auditing client briefs, defining visual design languages from scratch, and shipping responsive web and mobile interfaces. I leveraged Component Libraries in Figma to enable rapid iterations and maintain a unified design system.',
  'The Result', 'Delivered 6+ successful client product launches across Central Africa and Europe. Established repeatable design handoff standards that reduced development friction by 30% and significantly elevated the agency''s creative reputation.', 6
);

-- PROJECTS FOR 'fintech' PROFILE
INSERT INTO projects (id, profile_id, tag, title, tagline, image, description, impact, site, role, period, location, responsibilities, challenge, challenge_text, solution, solution_text, result, result_text, sort_order)
VALUES 
(
  'paysika_fintech', 'fintech', 'Fintech Innovation', 'PaySika', 'Driving 40% user retention and 60% support ticket reduction.', 'paysika_mockup.png', 
  'As Lead Product Designer and Founding Team Member, I managed a two-person design team and scaled PaySika’s mobile and web applications to serve thousands of active users across Central Africa. I engineered cross-functional workflows, led visual rebranding, and leveraged Mixpanel data to optimize transactional funnels.',
  'Scaled fintech operations serving thousands of users across Africa.', 'https://www.paysika.co', 'Lead Product Designer', 'Dec 2021 - Aug 2026', 'Douala, Cameroon',
  ARRAY['Recruited, scaled, and managed the creative design team, establishing high-performance assets handoff pipelines', 'Redesigned core mobile application interfaces (Onboarding, KYC, and Visa activation flows), minimizing drop-offs', 'Conducted usability testing sessions and leveraged Mixpanel tracking to drive evidence-backed retention updates', 'Led the end-to-end industrial and print design of PaySika’s physical debit card experience and unboxing'],
  'The Challenge', 'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users.',
  'The Solution', 'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust.',
  'The Result', 'Improved user retention by 40% and reduced customer support tickets by 60%.', 1
),
(
  'matanga_fintech', 'fintech', 'Agency', 'Matanga Agency', 'Premium digital experiences for local and international clients.', 'Matanga agancy website.PNG', 
  'As a part-time UI/UX design consultant for Matanga Agency, I designed high-converting web applications, mobile interfaces, and digital dashboards for international and Cameroonian clients. I specialized in wireframing, interactive prototyping, and visual brand identity.',
  'Delivered user-centric designs for multiple client products.', 'https://matangaagency.com/fr/', 'Senior UI/UX Consultant (Part-time)', 'Dec 2022 - Dec 2023', 'Cameroon',
  ARRAY['Consulted with international and local stakeholders to turn complex product requirements into intuitive Figma mockups', 'Designed scalable component-driven UI kits and typography guides to ensure consistent styling across client deliverables', 'Conducted interactive design handoffs with engineering teams, ensuring visual fidelity and responsive layouts'],
  'The Challenge', 'Matanga''s diverse client portfolio required highly tailored digital transformations—ranging from early-stage fintech MVPs to established e-commerce systems—demanding rapid, pixel-perfect design execution without existing brand guidelines.',
  'The Solution', 'I acted as a plug-and-play design leader, auditing client briefs, defining visual design languages from scratch, and shipping responsive web and mobile interfaces. I leveraged Component Libraries in Figma to enable rapid iterations and maintain a unified design system.',
  'The Result', 'Delivered 6+ successful client product launches across Central Africa and Europe. Established repeatable design handoff standards that reduced development friction by 30% and significantly elevated the agency''s creative reputation.', 2
);

-- PROJECTS FOR 'design-engineer' PROFILE
INSERT INTO projects (id, profile_id, tag, title, tagline, image, description, impact, site, role, period, location, responsibilities, challenge, challenge_text, solution, solution_text, result, result_text, sort_order)
VALUES 
(
  'citetsap_de', 'design-engineer', 'Real Estate', 'CITE Tsap', 'Custom real estate management app.', 'an app I coded myself.PNG', 
  'Built a custom real estate management application using Angular to digitize tenant records and rent tracking.',
  'Streamlined property management operations.', 'https://citetsap.vercel.app/', 'Creator & Developer', '2025 - Present', 'Cameroon',
  ARRAY['Built custom Angular application', 'Digitized tenant records and rent tracking', 'Designed and developed the entire application'],
  'The Challenge', 'Traditional property management in Cameroon relied on manual record-keeping.',
  'The Solution', 'Designed and coded a full Angular application with tenant databases, rent tracking, and payment reminders.',
  'The Result', 'Fully digitized property management with automated rent tracking and reporting.', 1
);


-- ==========================================
-- BLOG POSTS POPULATION
-- ==========================================

-- BLOG POSTS FOR 'default' PROFILE
INSERT INTO blog_posts (id, profile_id, title, excerpt, content, date, author, read_time, tags, image, sort_order)
VALUES 
(
  'oss_default', 'default', 'How to Contribute to Open Source as a Designer', 
  'A practical guide on how to contribute to open source projects without writing a single line of code.',
  '<p>Hi, I’m Theryx. I’m a digital designer. In this blog, I will tell you practically how I contribute to Open source as a non-tech person...</p>',
  'September 24, 2022', 'Ndouken Theryx', '6 min read', ARRAY['Open Source', 'Design', 'Community'], 'theryx giving a lecture to a comunity of open source.png', 1
),
(
  'affinity_default', 'default', 'Why I Switched from Illustrator to Affinity Designer', 
  'Exploring the reasons behind moving my design workflow from Adobe Illustrator to Affinity Designer.',
  '<p>Adobe Illustrator has been the industry standard for vector design for decades...</p>',
  'August 15, 2022', 'Ndouken Theryx', '5 min read', ARRAY['Design Tools', 'Affinity Designer', 'Workflow'], 'Editor and designer for Report on Cameroon Cybersecurity.jfif', 2
);

-- BLOG POSTS FOR 'design-engineer' PROFILE
INSERT INTO blog_posts (id, profile_id, title, excerpt, content, date, author, read_time, tags, image, sort_order)
VALUES 
(
  'oss_de', 'design-engineer', 'How to Contribute to Open Source as a Designer', 
  'A practical guide on how to contribute to open source projects without writing a single line of code.',
  '<p>Hi, I’m Theryx. I’m a digital designer. In this blog, I will tell you practically how I contribute to Open source as a non-tech person...</p>',
  'September 24, 2022', 'Ndouken Theryx', '6 min read', ARRAY['Open Source', 'Design', 'Community'], 'theryx giving a lecture to a comunity of open source.png', 1
);
