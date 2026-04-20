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
  'paysika_default', 'default', 'Fintech Innovation', 'PaySika', 'Redefining mobile finance in Africa.', 'PaySika website.PNG', 
  'As Lead Product Designer, I managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking. Awarded the Team Spirit Award for outstanding teamwork.',
  'Scaled fintech operations serving thousands of users across Africa.', 'https://www.paysika.co', 'Lead Product Designer', 'Dec 2021 - Jan 2026', 'Douala, Cameroon',
  ARRAY['Led a two-person design team', 'Optimized payment flows for better user experience', 'Implemented Mixpanel for user retention tracking', 'Established brand identity from the ground up'],
  'The Challenge', 'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users.',
  'The Solution', 'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust.',
  'The Result', 'Improved user retention by 40% and reduced customer support tickets by 60%.', 1
),
(
  'jobsika_default', 'default', 'Job Platform', 'Jobsika', 'Job platform for Cameroon.', 'Screenshot of the UI of Jobsika.PNG', 
  'Designed the user interface and experience for Jobsika, a job platform connecting job seekers with opportunities in Cameroon.',
  'Helping job seekers find opportunities across Cameroon.', 'https://jobsika.cm/', 'UI/UX Designer', '2022 - 2024', 'Cameroon',
  ARRAY['Designed user interface and experience', 'Created job seeker and employer workflows', 'Ensured mobile responsiveness'],
  'The Challenge', 'Jobsika needed to stand out in the job market while serving users across different digital literacy levels in Cameroon.',
  'The Solution', 'Created an intuitive, mobile-first design with clear job categories and easy application processes.',
  'The Result', 'Successfully launched and helping thousands of job seekers find opportunities.', 2
),
(
  'shomi_default', 'default', 'EdTech Platform', 'shomi (Kody)', 'All-in-one platform for postgraduate students.', 'Shomi app_all in one solution for graduate students.jfif', 
  'As Product Lead & Co-founder, I raised pre-seed funding and led the product vision for shomi - an all-in-one platform designed for postgraduate students.',
  'Secured pre-seed funding for edTech innovation in Africa.', '', 'Product Lead & Co-founder', 'Jan 2022 - Present', 'Cameroon',
  ARRAY['Led product vision and strategy', 'Raised pre-seed funding', 'Built MVP from concept to launch'],
  'The Challenge', 'Postgraduate students in Africa lacked a unified platform to manage their academic journey.',
  'The Solution', 'Built shomi as an all-in-one platform covering admissions, course management, networking, and job placement.',
  'The Result', 'Secured pre-seed funding and launched MVP for pilot testing.', 3
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
  'matanga_default', 'default', 'Agency', 'Matanga Agency', 'Digital agency for local and international clients.', 'Matanga agancy website.PNG', 
  'Part-time UI Designer designing local and international digital products using Figma. Focused on fintech, e-commerce, and community platforms.',
  'Delivered user-centric designs for multiple client products.', 'https://matangaagency.com/fr/', 'UI Designer (Part-time)', 'Dec 2022 - Feb 2024', 'Cameroon',
  ARRAY['Designed digital products for clients', 'Created UI designs using Figma', 'Collaborated with development teams'],
  'The Challenge', 'Various clients needed digital transformation but lacked internal design capabilities.',
  'The Solution', 'Delivered high-quality UI designs across fintech, e-commerce, and community platforms.',
  'The Result', 'Multiple successful client launches with improved user engagement.', 6
);

-- PROJECTS FOR 'fintech' PROFILE
INSERT INTO projects (id, profile_id, tag, title, tagline, image, description, impact, site, role, period, location, responsibilities, challenge, challenge_text, solution, solution_text, result, result_text, sort_order)
VALUES 
(
  'paysika_fintech', 'fintech', 'Fintech Innovation', 'PaySika', 'Redefining mobile finance in Africa.', 'PaySika website.PNG', 
  'As Lead Product Designer, I managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking.',
  'Scaled fintech operations serving thousands of users across Africa.', 'https://www.paysika.co', 'Lead Product Designer', 'Dec 2021 - Jan 2026', 'Douala, Cameroon',
  ARRAY['Led a two-person design team', 'Optimized payment flows', 'Implemented Mixpanel', 'Established brand identity'],
  'The Challenge', 'PaySika needed to differentiate itself in the crowded African fintech market.',
  'The Solution', 'I redesigned the entire user journey from onboarding to daily transactions.',
  'The Result', 'Improved user retention by 40%.', 1
),
(
  'matanga_fintech', 'fintech', 'Agency', 'Matanga Agency', 'Fintech Design Specialist.', 'Matanga agancy website.PNG', 
  'Specialized UI Designer for fintech products. Delivered user-centric designs for multiple financial platforms.',
  'Delivered user-centric designs for multiple client products.', 'https://matangaagency.com/fr/', 'UI Designer (Part-time)', 'Dec 2022 - Feb 2024', 'Cameroon',
  ARRAY['Designed fintech digital products', 'Created UI designs using Figma', 'Collaborated with development teams'],
  'The Challenge', 'Clients needed specialized fintech design expertise.',
  'The Solution', 'Delivered high-quality UI designs focused on financial clarity and security.',
  'The Result', 'Successful launches of multiple financial platforms.', 2
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
),
(
  'fintech_future_default', 'default', 'The Future of Fintech in Africa: Beyond Payments', 
  'Exploring how fintech is evolving from simple payment solutions to comprehensive financial ecosystems in Africa.',
  '<p>Fintech in Africa has long been synonymous with mobile money and payments...</p>',
  'April 10, 2026', 'Ndouken Theryx', '5 min read', ARRAY['Fintech', 'Africa', 'Product Design'], 'PaySika website.PNG', 3
),
(
  'accessibility_default', 'default', 'Designing for Accessibility in Emerging Markets', 
  'How to create inclusive digital products for users with varying levels of digital literacy and device capabilities.',
  '<p>Accessibility in emerging markets isn''t just about disability; it''s about accessibility to technology itself...</p>',
  'March 25, 2026', 'Ndouken Theryx', '4 min read', ARRAY['UX Design', 'Accessibility', 'Emerging Markets'], 'Screenshot of the UI of Jobsika.PNG', 4
);

-- BLOG POSTS FOR 'fintech' PROFILE
INSERT INTO blog_posts (id, profile_id, title, excerpt, content, date, author, read_time, tags, image, sort_order)
VALUES 
(
  'fintech_future_fintech', 'fintech', 'The Future of Fintech in Africa: Beyond Payments', 
  'Exploring how fintech is evolving from simple payment solutions to comprehensive financial ecosystems in Africa.',
  '<p>Fintech in Africa has long been synonymous with mobile money and payments...</p>',
  'April 10, 2026', 'Ndouken Theryx', '5 min read', ARRAY['Fintech', 'Africa', 'Product Design'], 'PaySika website.PNG', 1
),
(
  'accessibility_fintech', 'fintech', 'Designing for Accessibility in Emerging Markets', 
  'How to create inclusive digital products for users with varying levels of digital literacy and device capabilities.',
  '<p>Accessibility in emerging markets isn''t just about disability; it''s about accessibility to technology itself...</p>',
  'March 25, 2026', 'Ndouken Theryx', '4 min read', ARRAY['UX Design', 'Accessibility', 'Emerging Markets'], 'Screenshot of the UI of Jobsika.PNG', 2
);

-- BLOG POSTS FOR 'design-engineer' PROFILE
INSERT INTO blog_posts (id, profile_id, title, excerpt, content, date, author, read_time, tags, image, sort_order)
VALUES 
(
  'oss_de', 'design-engineer', 'How to Contribute to Open Source as a Designer', 
  'A practical guide on how to contribute to open source projects without writing a single line of code.',
  '<p>Hi, I’m Theryx. I’m a digital designer. In this blog, I will tell you practically how I contribute to Open source as a non-tech person...</p>',
  'September 24, 2022', 'Ndouken Theryx', '6 min read', ARRAY['Open Source', 'Design', 'Community'], 'theryx giving a lecture to a comunity of open source.png', 1
),
(
  'accessibility_de', 'design-engineer', 'Designing for Accessibility in Emerging Markets', 
  'How to create inclusive digital products for users with varying levels of digital literacy and device capabilities.',
  '<p>Accessibility in emerging markets isn''t just about disability; it''s about accessibility to technology itself...</p>',
  'March 25, 2026', 'Ndouken Theryx', '4 min read', ARRAY['UX Design', 'Accessibility', 'Emerging Markets'], 'Screenshot of the UI of Jobsika.PNG', 2
);
