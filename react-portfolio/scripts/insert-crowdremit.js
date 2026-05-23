import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// Parse .env.local for DATABASE_URL
const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const databaseUrl = match[1];
console.log('Connecting to database...');
const sql = neon(databaseUrl);

try {
  // We will insert crowdremit for 'default' and 'fintech' profiles
  const crowdremitDefault = {
    id: 'crowdremit_default',
    profile_id: 'default',
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
    challenge_text: 'Designing a familiar yet differentiated fintech experience across all platforms. Creating a design system for consistency, and solving the complex UX of multi-currency, multi-account money transfers.',
    solution: 'The Solution',
    solution_text: 'Started with user research, journey maps, and personas. Moved to low-fidelity wireframes before high-fidelity mockups. Iterated constantly with the team and developers using Jira. Performed A/B tests and regular critiques. Rebranded the logo for better accessibility.',
    result: 'The Result',
    result_text: 'Delivered a complete design system, mobile app (iOS & Android), web app, and web dashboard. The process emphasized testing and iteration, leading to a user-centric final product.',
    is_hidden: false,
    sort_order: 2 // Show right after PaySika
  };

  const crowdremitFintech = {
    ...crowdremitDefault,
    id: 'crowdremit_fintech',
    profile_id: 'fintech',
    sort_order: 3 // Show right after PaySika and Matanga in fintech
  };

  console.log('Inserting crowdremit_default...');
  await sql`
    INSERT INTO projects (
      id, profile_id, tag, title, tagline, image, description, impact, site, role, period,
      location, responsibilities, challenge, challenge_text, solution, solution_text,
      result, result_text, is_hidden, sort_order
    ) VALUES (
      ${crowdremitDefault.id}, ${crowdremitDefault.profile_id}, ${crowdremitDefault.tag}, 
      ${crowdremitDefault.title}, ${crowdremitDefault.tagline}, ${crowdremitDefault.image},
      ${crowdremitDefault.description}, ${crowdremitDefault.impact}, ${crowdremitDefault.site}, 
      ${crowdremitDefault.role}, ${crowdremitDefault.period}, ${crowdremitDefault.location},
      ${crowdremitDefault.responsibilities}, ${crowdremitDefault.challenge}, 
      ${crowdremitDefault.challenge_text}, ${crowdremitDefault.solution},
      ${crowdremitDefault.solution_text}, ${crowdremitDefault.result}, 
      ${crowdremitDefault.result_text}, ${crowdremitDefault.is_hidden}, 
      ${crowdremitDefault.sort_order}
    )
    ON CONFLICT (id) DO UPDATE SET
      profile_id = EXCLUDED.profile_id, tag = EXCLUDED.tag, title = EXCLUDED.title,
      tagline = EXCLUDED.tagline, image = EXCLUDED.image, description = EXCLUDED.description,
      impact = EXCLUDED.impact, site = EXCLUDED.site, role = EXCLUDED.role,
      period = EXCLUDED.period, location = EXCLUDED.location,
      responsibilities = EXCLUDED.responsibilities, challenge = EXCLUDED.challenge,
      challenge_text = EXCLUDED.challenge_text, solution = EXCLUDED.solution,
      solution_text = EXCLUDED.solution_text, result = EXCLUDED.result,
      result_text = EXCLUDED.result_text, is_hidden = EXCLUDED.is_hidden,
      sort_order = EXCLUDED.sort_order
  `;

  console.log('Inserting crowdremit_fintech...');
  await sql`
    INSERT INTO projects (
      id, profile_id, tag, title, tagline, image, description, impact, site, role, period,
      location, responsibilities, challenge, challenge_text, solution, solution_text,
      result, result_text, is_hidden, sort_order
    ) VALUES (
      ${crowdremitFintech.id}, ${crowdremitFintech.profile_id}, ${crowdremitFintech.tag}, 
      ${crowdremitFintech.title}, ${crowdremitFintech.tagline}, ${crowdremitFintech.image},
      ${crowdremitFintech.description}, ${crowdremitFintech.impact}, ${crowdremitFintech.site}, 
      ${crowdremitFintech.role}, ${crowdremitFintech.period}, ${crowdremitFintech.location},
      ${crowdremitFintech.responsibilities}, ${crowdremitFintech.challenge}, 
      ${crowdremitFintech.challenge_text}, ${crowdremitFintech.solution},
      ${crowdremitFintech.solution_text}, ${crowdremitFintech.result}, 
      ${crowdremitFintech.result_text}, ${crowdremitFintech.is_hidden}, 
      ${crowdremitFintech.sort_order}
    )
    ON CONFLICT (id) DO UPDATE SET
      profile_id = EXCLUDED.profile_id, tag = EXCLUDED.tag, title = EXCLUDED.title,
      tagline = EXCLUDED.tagline, image = EXCLUDED.image, description = EXCLUDED.description,
      impact = EXCLUDED.impact, site = EXCLUDED.site, role = EXCLUDED.role,
      period = EXCLUDED.period, location = EXCLUDED.location,
      responsibilities = EXCLUDED.responsibilities, challenge = EXCLUDED.challenge,
      challenge_text = EXCLUDED.challenge_text, solution = EXCLUDED.solution,
      solution_text = EXCLUDED.solution_text, result = EXCLUDED.result,
      result_text = EXCLUDED.result_text, is_hidden = EXCLUDED.is_hidden,
      sort_order = EXCLUDED.sort_order
  `;

  console.log('CrowdRemit successfully inserted/updated in projects table!');
} catch (err) {
  console.error('Error inserting/updating database projects:', err);
}
