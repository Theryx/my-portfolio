-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (portfolio variations)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  tagline TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  philosophy_title TEXT,
  philosophy_text TEXT,
  badges TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  tag TEXT,
  title TEXT NOT NULL,
  tagline TEXT,
  image TEXT,
  description TEXT,
  impact TEXT,
  site TEXT,
  role TEXT,
  period TEXT,
  location TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  challenge TEXT,
  challenge_text TEXT,
  solution TEXT,
  solution_text TEXT,
  result TEXT,
  result_text TEXT,
  is_hidden BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS TABLE
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  date TEXT,
  author TEXT,
  read_time TEXT,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  is_hidden BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile
INSERT INTO profiles (id, name, is_active, bio, tagline, hero_title, hero_subtitle, philosophy_title, philosophy_text, badges)
VALUES (
  'default',
  'Default',
  true,
  'Design Engineer & Tech Entrepreneur',
  'I design and build user-centric digital products.',
  'Design Engineer & Tech Entrepreneur',
  'I design and build user-centric digital products. Combining expert UX/UI design with front-end development to create beautiful, functional experiences. Based in Douala, Cameroon.',
  'I design experiences that bridge technology and human needs.',
  'As a Design Engineer, I bridge the gap between design and development. With 4+ years leading design at PaySika and now building my own ventures, I combine UX/UI expertise with hands-on coding to create products that are both beautiful and functional.',
  ARRAY['Available for projects']
);

-- Insert fintech profile
INSERT INTO profiles (id, name, is_active, bio, tagline, hero_title, hero_subtitle, philosophy_title, philosophy_text, badges)
VALUES (
  'fintech',
  'Fintech Focus',
  true,
  'Fintech Product Designer',
  'Building the future of African finance.',
  'Fintech Product Designer',
  'Specializing in payment systems, financial apps, and mobile money solutions for the African market. Let''s build the next generation of African fintech together.',
  'Making complex financial services simple and accessible.',
  'With deep expertise in fintech UX, I specialize in simplifying complex financial flows. From mobile money to credit systems, I design interfaces that build trust and drive adoption.',
  ARRAY['Open to opportunities']
);

-- Insert design-engineer profile
INSERT INTO profiles (id, name, is_active, bio, tagline, hero_title, hero_subtitle, philosophy_title, philosophy_text, badges)
VALUES (
  'design-engineer',
  'Design Engineer',
  true,
  'Design Engineer | AI-Powered Builder',
  'Where design meets code, powered by AI.',
  'Design Engineer & AI Builder',
  'I use AI tools (Claude, Gemini, OpenCode) to rapidly design and build web applications. Bridging the gap between Figma prototypes and production code with AI assistance.',
  'Building faster with AI, designing smarter for users.',
  'I leverage AI to accelerate my development workflow while maintaining design excellence. From concept to deployment, AI helps me iterate faster and deliver better products.',
  ARRAY['Available for projects', 'AI-Powered']
);

-- Insert a sample project
INSERT INTO projects (id, profile_id, tag, title, tagline, description, impact, site, role, period, location, responsibilities, challenge, challenge_text, solution, solution_text, result, result_text, is_hidden, sort_order)
VALUES (
  'paysika',
  'default',
  'Fintech Innovation',
  'PaySika',
  'Redefining mobile finance in Africa.',
  'As Lead Product Designer, I managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking. Awarded the Team Spirit Award for outstanding teamwork.',
  'Scaled fintech operations serving thousands of users across Africa.',
  'https://www.paysika.co',
  'Lead Product Designer',
  'Dec 2021 - Jan 2026',
  'Douala, Cameroon',
  ARRAY['Led a two-person design team', 'Optimized payment flows for better user experience', 'Implemented Mixpanel for user retention tracking', 'Established brand identity from the ground up'],
  'The Challenge',
  'PaySika needed to differentiate itself in the crowded African fintech market while making complex financial services accessible to everyday users.',
  'The Solution',
  'I redesigned the entire user journey from onboarding to daily transactions, focusing on simplicity and trust.',
  'The Result',
  'Improved user retention by 40% and reduced customer support tickets by 60%.',
  false,
  1
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read blog_posts" ON blog_posts FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Allow admin write profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow admin write projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow admin write blog_posts" ON blog_posts FOR ALL USING (true);

-- Create indexes
CREATE INDEX idx_projects_profile ON projects(profile_id);
CREATE INDEX idx_projects_hidden ON projects(profile_id, is_hidden);
CREATE INDEX idx_blog_profile ON blog_posts(profile_id);
CREATE INDEX idx_blog_hidden ON blog_posts(profile_id, is_hidden);