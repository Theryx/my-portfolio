import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import teamAward from '../assets/img/Team spirit award_2025.jfif';
import userResearch from '../assets/img/Conducting a user research.jfif';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import { motion } from 'framer-motion';

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

  return (
    <PageTransition>
      <section className="about">
        <div className="container">
          <motion.div className="about__inner" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <div className="about__profile">
              <img src={myProfile} alt="Ndouken Theryx" className="about__profile-image" loading="lazy" />
            </div>
            <h2 className="section__title" style={{ textAlign: 'left' }}>About Me</h2>
            <p className="about__text">
              {profile?.bio || 'I am a Design Engineer specializing in fintech UI/UX, mobile applications, and minimalist aesthetics. After building and leading the design team at PaySika for over four years, I stepped down in January 2026 to focus on tech entrepreneurship, building real-world applications, and managing real estate operations.'}
            </p>
            <p className="about__text">
              {profile?.tagline || 'I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving.'}
            </p>
            
            <div className="about__photos">
              <img src={teamDiscussion} alt="Discussion with colleague" className="about__photo" loading="lazy" />
              <img src={teamAward} alt="Team Spirit Award 2025" className="about__photo" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <h2 className="section__title">Speaking & Community</h2>
            <div className="speaking__content">
              <img src={givingLecture} alt="Theryx giving a lecture" className="speaking__image" loading="lazy" />
              <div className="speaking__text">
                <p>
                  I am passionate about sharing knowledge and growing the tech community in Africa. I regularly give lectures to open source communities, mentor young designers, and speak at tech events about fintech innovation and product design.
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
              { date: 'Dec 2021 - Jan 2026', title: 'Lead Product Designer', company: 'PaySika', desc: 'Managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking. Awarded the Team Spirit Award.' },
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
              { title: 'Loving Tech', role: 'Founder', desc: 'Launching an e-commerce tech shop specializing in premium, original Logitech peripherals. Focusing on high-end, "museum-quality" product branding and minimalist layouts for the African market.' },
              { title: 'CITE Tsap', role: 'Creator & Developer', desc: 'Building a custom real estate management application using Angular to digitize tenant records and rent tracking.' },
              { title: 'Property Management', role: 'Concierge', desc: 'Acting as concierge for a private residential estate. Handling tenant operations, infrastructure maintenance, and Starlink data monetization.' },
              { title: 'Kody (shomi)', role: 'Product Lead & Co-founder', desc: 'Building shomi, an all-in-one platform for postgraduate students. Raised pre-seed funding to drive edTech innovation in Africa.' },
              { title: 'GEFONA Digital Foundation', role: 'Communication & Finance', desc: 'Leading communication and finance for a foundation supporting policy research on the digital economy and cybersecurity in Africa.' },
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

      <section className="community">
        <div className="container">
          <h2 className="section__title">Open Source & Community</h2>
          <div className="community__grid">
            <motion.div className="community__item" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3>osscameroon</h3>
              <span>Project Maintainer & Designer</span>
              <p>Jan 2021 - Present</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="skills">
        <div className="container">
          <h2 className="section__title">Skills & Toolkit</h2>
          <div className="skills__grid">
            {[
              { title: 'Design', desc: 'Figma, Adobe Creative Suite, Protopie, User Research, Usability Testing, Fintech UI/UX, Minimalist Aesthetics, Product Photography.', image: userResearch, alt: 'User Research' },
              { title: 'Technical', desc: 'Angular, AI Coding Tools (OpenCode AI, Antigravity), Mixpanel.' },
              { title: 'Business', desc: 'Field Marketing, Customer Onboarding, Team Leadership, Public Speaking.' },
            ].map((skill) => (
              <motion.div className="skill-card" key={skill.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                {'image' in skill && skill.image && (
                  <div className="skill-card__image">
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
            <h3 className="about__interests-title">Interests</h3>
            <ul className="about__interests-list">
              <li>Premium Tech Hardware</li>
              <li>Logitech MX & G-series</li>
              <li>Fintech Innovation</li>
              <li>Networking</li>
              <li>Eating Fish</li>
            </ul>
          </div>

          <div className="about__fun-fact">
            <p className="about__fun-fact-text">
              Fun Fact: I value direct opinions, simple language, and a good plate of fish.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}