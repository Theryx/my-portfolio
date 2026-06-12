import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import userResearch from '../assets/img/Conducting a user research.jfif';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import jobsikaProcess from '../assets/img/Screenshot of Jobsika sowing our building process.jfif';
import codedApp from '../assets/img/an app I coded myself.PNG';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Languages, Fish, Quote } from 'lucide-react';
import { BenevolentModal } from '../components/BenevolentModal';
import { lightboxTrigger } from '../lib/a11y';
import { gridVariants, tileVariants } from '../lib/motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function About() {
  const { profile } = useProfile();
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<{ title: string; role: string; desc: string } | null>(null);

  // Custom cursor state for interactive cards
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is your design process?',
      answer: "Honestly I'm not sure I have a design process. Ok I would say it depends. Sometimes rough, sometimes straight to the point. The truth is that books say one thing but reality says otherwise.",
    },
    {
      question: 'Are you open to speaking engagements?',
      answer: 'Absolutely. I love public speaking, networking, and sharing insights on fintech, design, and tech ecosystems in Africa.',
    },
  ];

  const handleImageClick = (src: string, caption: string) => {
    setSelectedImage({ src, caption });
  };

  return (
    <PageTransition>
      {isHovering && (
        <div
          className="custom-cursor-label"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        >
          {cursorLabel}
        </div>
      )}

      {/* ── Bento intro mosaic ── */}
      <section className="about">
        <div className="container">
          <span className="section-sticker section-sticker--accent">Nice to meet you</span>
          <h2 className="section__title" style={{ textAlign: 'left' }}>About me</h2>
          <motion.div
            className="about-bento"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div className="bento-card about-bento__main" variants={tileVariants}>
              <img src={myProfile} alt="Ndouken Theryx" className="about-bento__photo" loading="lazy" />
              <div>
                <p className="about__text">
                  {profile?.bio || 'I am a Product Designer specializing in fintech UI/UX, mobile applications, and minimalist aesthetics. I have been building and leading the design team at PaySika since December 2021, while also focusing on tech entrepreneurship and building real-world applications.'}
                </p>
                <p className="about__text about-bento__tagline">
                  {profile?.tagline || 'I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving.'}
                </p>
              </div>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants}>
              <span className="bento-card__mini-icon bento-card__pin">
                <MapPin size={20} aria-hidden="true" />
                <span className="bento-card__pin-pulse" aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">Douala</span>
              <span className="bento-card__mini-label">Cameroon 🇨🇲</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants}>
              <span className="bento-card__mini-icon">
                <Languages size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">EN & FR</span>
              <span className="bento-card__mini-label">Bilingual, fully fluent</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini bento-card--fish" variants={tileVariants}>
              <span className="bento-card__mini-icon bento-card__fish">
                <Fish size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-label">Fun fact</span>
              <p className="bento-card__now-text">I value direct opinions, simple language, and a good plate of fish.</p>
            </motion.div>

            {profile?.philosophy_text && (
              <motion.div className="bento-card about-bento__philosophy" variants={tileVariants}>
                <Quote size={18} aria-hidden="true" className="about-bento__quote-icon" />
                <h3 className="about-bento__philosophy-title">{profile.philosophy_title}</h3>
                <p className="about-bento__philosophy-text">{profile.philosophy_text}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <span className="section-sticker">On stage</span>
            <h2 className="section__title">Research & Speaking</h2>
            <div className="speaking__content">
              <img
                src={givingLecture}
                alt="Theryx presenting research at OSS Cameroon"
                className="speaking__image"
                loading="lazy"
                {...lightboxTrigger(() => handleImageClick(givingLecture, "Presenting research on the Cameroon Design Ecosystem at the 2022 OSS Cameroon meetup."), 'Enlarge speaking photo')}
                style={{ cursor: 'pointer' }}
              />
              <div className="speaking__text">
                <p>
                  In 2022, I was invited by the <strong>OSS Cameroon</strong> community to present the findings of my research on the <strong>State of the Design Ecosystem in Cameroon</strong>.
                </p>
                <p>
                  The objective of the talk was to provide data-driven insights into our local industry while passionately encouraging more designers to bridge the gap between design and development by contributing to <strong>Open Source</strong> projects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="experience">
        <div className="container">
          <span className="section-sticker">The journey so far</span>
          <h2 className="section__title">Professional Experience</h2>
          <motion.div
            className="experience__grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { date: 'Dec 2021 - Present', title: 'Product Designer', company: 'PaySika', desc: 'Managed a two-person design team, optimized payment flows, and utilized Mixpanel to track user patterns and behavior in the app. Awarded the Team Spirit Award twice.' },
              { date: 'Nov 2020 - Nov 2021', title: 'Freelance Designer', company: 'Freelance', desc: 'Provided design services for various clients. Designed reports on Cameroon Cybersecurity and Central/West Africa cybersecurity state.' },
              { date: 'Dec 2022 - Dec 2023', title: 'Senior UI/UX Consultant (Part-time)', company: 'Matanga Agency', desc: 'Designed high-converting web and mobile dashboards for Central African and European clients, establishing scalable components in Figma.' },
            ].map((item, index) => (
              <motion.div className="experience__item" key={item.company} variants={tileVariants}>
                <span className="experience__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="experience__date">{item.date}</span>
                <h3 className="experience__title">{item.title}</h3>
                <span className="experience__company">{item.company}</span>
                <p className="experience__desc">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="ventures">
        <div className="container">
          <span className="section-sticker">Giving back</span>
          <h2 className="section__title">Benevolent Work</h2>
          <div className="ventures__grid">
            {[
              { title: 'GEFONA Digital Foundation', role: 'Communication & Finance', desc: 'Leading communication and finance for a foundation supporting policy research on the digital economy and cybersecurity in Africa.' },
              { title: 'osscameroon', role: 'Project Maintainer & Contributor', desc: 'Part of the founding team for JobSika. Involved in maintaining the platform and contributing to various open-source initiatives within the community.' },
              { title: 'geo-Advantage Labs', role: 'Superviseur front-end', desc: "This Project was aimed at bringing up a dashboard for the Corona virus crisis in Cameroon. I was in charge of bringing up the web and mobile interface and coordinate the frontEnd development of the web and mobile app making sure it's responsive.", logo: "https://media.licdn.com/dms/image/v2/C560BAQGntSHRznW--g/company-logo_100_100/company-logo_100_100/0/1630650441671/geo_advantage_logo?e=1781136000&v=beta&t=3Uujd5zdtae1PJngw6-qZ-2Cvt6MkZIscUI78zNVzLk" },
              { title: 'Dikalo, Inc', role: 'Visual Designer', desc: "Interface designs, graphic designs, illustrations, pitch deck, motion design", logo: "https://media.licdn.com/dms/image/v2/C4E0BAQE-iZFdhM8qpA/company-logo_100_100/company-logo_100_100/0/1657001284574?e=1781136000&v=beta&t=RBgyVIHCLRXRuX_O4rmu86TGR1NPCIrn7GTlmxetPZM" },
              { title: "O'LOKO", role: 'Designer', desc: "Oloko is the biggest attraction park for children in the country. I help with visual designs and make sure design is consistent", logo: "https://media.licdn.com/dms/image/v2/C4E0BAQGMLOviqcX8YQ/company-logo_100_100/company-logo_100_100/0/1669587615254?e=1781136000&v=beta&t=3S8yBiDpa9QjywVhsufkjE5OV4J-o8aVoDbjegzW5fA" },
              { title: 'USFE international', role: 'Social Media Manager', desc: "I handle the organisation social media" },
            ].map((v) => (
              <motion.div
                className="venture-card"
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                onClick={() => setSelectedVenture(v)}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setCursorLabel('click to expand');
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setCursorLabel('');
                }}
                style={{ cursor: 'none' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedVenture(v);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {v.logo && <img src={v.logo} alt={v.title} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain' }} />}
                  <h3 className="venture-card__title" style={{ margin: 0 }}>{v.title}</h3>
                </div>
                <span className="venture-card__role" style={{ color: 'var(--color-text-muted)' }}>{v.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="skills">
        <div className="container">
          <span className="section-sticker">What I bring</span>
          <h2 className="section__title">Skills & Toolkit</h2>
          <div className="skills__grid">
            {[
              { title: 'Design & UX', desc: 'Figma, User Research, Usability Testing.', image: userResearch, alt: 'User Research' },
              { title: 'Design Ops & AI', desc: 'Wireframing, User Flow Mapping, Claude/GPT Integration for UX Copy and Edge-case testing.', image: jobsikaProcess, alt: 'Design Ops Workflow' },
              { title: 'Technical & Data', desc: 'Angular, React, HTML/CSS, Mixpanel (Retention/Funnel Analysis).', image: codedApp, alt: 'Technical Coding App' },
            ].map((skill) => (
              <motion.div className="skill-card" key={skill.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                {'image' in skill && skill.image && (
                  <div className="skill-card__image" {...lightboxTrigger(() => handleImageClick(skill.image as string, skill.alt || skill.title), `Enlarge: ${skill.title}`)} style={{ cursor: 'pointer' }}>
                    <img src={skill.image} alt={skill.alt || ''} loading="lazy" />
                  </div>
                )}
                <h3 className="skill-card__title">{skill.title}</h3>
                <p className="skill-card__desc">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="interests">
        <div className="container">
          <div className="about__interests">
            <h3 className="about__interests-title">Tools I use to work</h3>
            <ul className="about__interests-list tool-pills">
              {['Logitech MX Master 3s', 'Logitech G413 TKL', 'Desktop', 'Webcam', 'Starlink', 'HP 27-inch monitor screen'].map((tool) => (
                <li key={tool} className="tool-pill">{tool}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <span className="section-sticker">You asked</span>
          <h2 className="section__title">Frequently Asked Questions</h2>
          <div className="faq__list">
            {faqs.map((faq, index) => (
              <div className="faq__item" key={index}>
                <button
                  className="faq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">▼</span>
                </button>
                {openFaq === index && (
                  <div className="faq__answer" id={`faq-answer-${index}`} role="region">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="image-lightbox__content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="image-lightbox__close" onClick={() => setSelectedImage(null)}>&times;</button>
              <img src={selectedImage.src} alt={selectedImage.caption} />
              <div className="image-lightbox__caption">
                <p>{selectedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BenevolentModal isOpen={!!selectedVenture} onClose={() => setSelectedVenture(null)} venture={selectedVenture} />
    </PageTransition>
  );
}
