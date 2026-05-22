import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import userResearch from '../assets/img/Conducting a user research.jfif';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import jobsikaProcess from '../assets/img/Screenshot of Jobsika sowing our building process.jfif';
import codedApp from '../assets/img/an app I coded myself.PNG';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is your design process?',
      answer: 'Direct and data-driven. I focus on the core problem, wireframe solutions, test, and deliver high-fidelity designs ready for engineering.',
    },
    {
      question: 'What technologies do you use?',
      answer: "I design in Figma and Adobe Creative Suite, and I'm currently learning front-end development with Angular and React. I also use Mixpanel for analytics.",
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
      <section className="about">
        <div className="container">
          <motion.div className="about__inner" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <div className="about__profile">
              <img src={myProfile} alt="Ndouken Theryx" className="about__profile-image" loading="lazy" />
            </div>
            <h2 className="section__title" style={{ textAlign: 'left' }}>About me</h2>
            <p className="about__text">
              {profile?.bio || 'I am a Product Designer specializing in fintech UI/UX, mobile applications, and minimalist aesthetics. I have been building and leading the design team at PaySika since December 2021, while also focusing on tech entrepreneurship and building real-world applications.'}
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', margin: 'var(--spacing-md) 0' }}>
              <div>
                <strong style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '14px', marginBottom: '4px' }}>Location</strong>
                <span>Douala, Cameroon</span>
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '14px', marginBottom: '4px' }}>Languages</strong>
                <span>English & French</span>
              </div>
            </div>

            <div className="about__fun-fact-top">
              <p className="about__fun-fact-text">
                Fun Fact: I value direct opinions, simple language, and a good plate of fish.
              </p>
            </div>

            <p className="about__text">
              {profile?.tagline || 'I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving.'}
            </p>
            

          </motion.div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <h2 className="section__title">Research & Speaking</h2>
            <div className="speaking__content">
              <img 
                src={givingLecture} 
                alt="Theryx presenting research at OSS Cameroon" 
                className="speaking__image" 
                loading="lazy" 
                onClick={() => handleImageClick(givingLecture, "Presenting research on the Cameroon Design Ecosystem at the 2022 OSS Cameroon meetup.")}
                style={{ cursor: 'pointer' }}
              />
              <div className="speaking__text">
                <p>
                  In 2022, I was invited by the **OSS Cameroon** community to present the findings of my research on the **State of the Design Ecosystem in Cameroon**. 
                </p>
                <p>
                  The objective of the talk was to provide data-driven insights into our local industry while passionately encouraging more designers to bridge the gap between design and development by contributing to **Open Source** projects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="experience">
        <div className="container">
          <h2 className="section__title">Professional Experience</h2>
          <div className="experience__grid">
            {[
              { date: 'Dec 2021 - Present', title: 'Product Designer', company: 'PaySika', desc: 'Managed a two-person design team, optimized payment flows, and utilized Mixpanel to track user patterns and behavior in the app. Awarded the Team Spirit Award twice.' },
              { date: 'Nov 2020 - Nov 2021', title: 'Freelance Designer', company: 'Freelance', desc: 'Provided design services for various clients. Designed reports on Cameroon Cybersecurity and Central/West Africa cybersecurity state.' },
              { date: 'Dec 2022 - Feb 2024', title: 'UI Designer (Part-time)', company: 'Matanga Agency', desc: 'Designed local and international digital products using Figma.' },
            ].map((item) => (
              <motion.div className="experience__item" key={item.company} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <span className="experience__date">{item.date}</span>
                <h3 className="experience__title">{item.title}</h3>
                <span className="experience__company">{item.company}</span>
                <p className="experience__desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="ventures">
        <div className="container">
          <h2 className="section__title">Current Ventures</h2>
          <div className="ventures__grid">
            {[
              { title: 'GEFONA Digital Foundation', role: 'Communication & Finance', desc: 'Leading communication and finance for a foundation supporting policy research on the digital economy and cybersecurity in Africa.' },
              { title: 'osscameroon', role: 'Project Maintainer & Contributor', desc: 'Part of the founding team for JobSika. Involved in maintaining the platform and contributing to various open-source initiatives within the community.' },
            ].map((v) => (
              <motion.div className="venture-card" key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h3 className="venture-card__title">{v.title}</h3>
                <span className="venture-card__role">{v.role}</span>
                <p className="venture-card__desc">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="skills">
        <div className="container">
          <h2 className="section__title">Skills & Toolkit</h2>
          <div className="skills__grid">
            {[
              { title: 'Design & UX', desc: 'Figma, User Research, Usability Testing.', image: userResearch, alt: 'User Research' },
              { title: 'Design Ops & AI', desc: 'Wireframing, User Flow Mapping, Claude/GPT Integration for UX Copy and Edge-case testing.', image: jobsikaProcess, alt: 'Design Ops Workflow' },
              { title: 'Technical & Data', desc: 'Angular, React, HTML/CSS, Mixpanel (Retention/Funnel Analysis).', image: codedApp, alt: 'Technical Coding App' },
              { title: 'Business', desc: 'Cross-functional Collaboration (Agile/Scrum), Tech Entrepreneurship, Team Leadership.' },
            ].map((skill) => (
              <motion.div className="skill-card" key={skill.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                {'image' in skill && skill.image && (
                  <div className="skill-card__image" onClick={() => handleImageClick(skill.image as string, skill.alt || skill.title)} style={{ cursor: 'pointer' }}>
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
            <ul className="about__interests-list">
              <li>Logitech MX Master 3s</li>
              <li>Logitech G413 TKL</li>
              <li>Desktop</li>
              <li>Webcam</li>
              <li>Starlink</li>
              <li>HP 27-inch monitor screen</li>
            </ul>
          </div>


        </div>
      </section>

      <section className="faq">
        <div className="container">
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
    </PageTransition>
  );
}