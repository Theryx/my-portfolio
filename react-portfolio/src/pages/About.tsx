import { PageTransition } from '../components/PageTransition';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import teamAward from '../assets/img/Team spirit award_2025.jfif';
import userResearch from '../assets/img/Conducting a user research.jfif';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';

export default function About() {
  return (
    <PageTransition>
      <section className="about">
        <div className="container">
          <div className="about__inner">
            <div className="about__profile">
              <img src={myProfile} alt="Ndouken Theryx" className="about__profile-image" />
            </div>
            <h2 className="section__title" style={{ textAlign: 'left' }}>About Me</h2>
            <p className="about__text">
              I am a Design Engineer specializing in fintech UI/UX, mobile applications, and minimalist aesthetics. After building and leading the design team at PaySika for over four years, I stepped down in January 2026 to focus on tech entrepreneurship, building real-world applications, and managing real estate operations.
            </p>
            <p className="about__text">
              I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving. My journey spans from leading a design team at Africa's leading fintech to building my own products end-to-end.
            </p>
            
            <div className="about__photos">
              <img src={teamDiscussion} alt="Discussion with colleague" className="about__photo" />
              <img src={teamAward} alt="Team Spirit Award 2025" className="about__photo" />
            </div>
          </div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <h2 className="section__title">Speaking & Community</h2>
          <div className="speaking__content">
            <img src={givingLecture} alt="Theryx giving a lecture" className="speaking__image" />
            <div className="speaking__text">
              <p>
                I am passionate about sharing knowledge and growing the tech community in Africa. I regularly give lectures to open source communities, mentor young designers, and speak at tech events about fintech innovation and product design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="experience">
        <div className="container">
          <h2 className="section__title">Professional Experience</h2>
          <div className="experience__grid">
            <div className="experience__item">
              <span className="experience__date">Dec 2021 - Jan 2026</span>
              <h3 className="experience__title">Lead Product Designer</h3>
              <span className="experience__company">PaySika</span>
              <p className="experience__desc">
                Managed a two-person design team, optimized payment flows, and utilized Mixpanel for user retention tracking. Awarded the Team Spirit Award.
              </p>
            </div>
            <div className="experience__item">
              <span className="experience__date">Nov 2020 - Nov 2021</span>
              <h3 className="experience__title">Freelance Designer</h3>
              <span className="experience__company">Freelance</span>
              <p className="experience__desc">
                Provided design services for various clients. Designed reports on Cameroon Cybersecurity and Central/West Africa cybersecurity state.
              </p>
            </div>
            <div className="experience__item">
              <span className="experience__date">Dec 2022 - Feb 2024</span>
              <h3 className="experience__title">UI Designer (Part-time)</h3>
              <span className="experience__company">Matanga Agency</span>
              <p className="experience__desc">
                Designed local and international digital products using Figma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ventures">
        <div className="container">
          <h2 className="section__title">Current Ventures</h2>
          <div className="ventures__grid">
            <div className="venture-card">
              <h3 className="venture-card__title">Loving Tech</h3>
              <span className="venture-card__role">Founder</span>
              <p className="venture-card__desc">
                Launching an e-commerce tech shop specializing in premium, original Logitech peripherals. Focusing on high-end, "museum-quality" product branding and minimalist layouts for the African market.
              </p>
            </div>
            <div className="venture-card">
              <h3 className="venture-card__title">CITE Tsap</h3>
              <span className="venture-card__role">Creator & Developer</span>
              <p className="venture-card__desc">
                Building a custom real estate management application using Angular to digitize tenant records and rent tracking.
              </p>
            </div>
            <div className="venture-card">
              <h3 className="venture-card__title">Property Management</h3>
              <span className="venture-card__role">Concierge</span>
              <p className="venture-card__desc">
                Acting as concierge for a private residential estate. Handling tenant operations, infrastructure maintenance, and Starlink data monetization.
              </p>
            </div>
            <div className="venture-card">
              <h3 className="venture-card__title">Kody (shomi)</h3>
              <span className="venture-card__role">Product Lead & Co-founder</span>
              <p className="venture-card__desc">
                Building shomi, an all-in-one platform for postgraduate students. Raised pre-seed funding to drive edTech innovation in Africa.
              </p>
            </div>
            <div className="venture-card">
              <h3 className="venture-card__title">GEFONA Digital Foundation</h3>
              <span className="venture-card__role">Communication & Finance</span>
              <p className="venture-card__desc">
                Leading communication and finance for a foundation supporting policy research on the digital economy and cybersecurity in Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="community">
        <div className="container">
          <h2 className="section__title">Open Source & Community</h2>
          <div className="community__grid">
            <div className="community__item">
              <h3>osscameroon</h3>
              <span>Project Maintainer & Designer</span>
              <p>Jan 2021 - Present</p>
            </div>
          </div>
        </div>
      </section>

      <section className="skills">
        <div className="container">
          <h2 className="section__title">Skills & Toolkit</h2>
          <div className="skills__grid">
            <div className="skill-card">
              <div className="skill-card__image">
                <img src={userResearch} alt="User Research" />
              </div>
              <h3 className="skill-card__title">Design</h3>
              <p className="skill-card__desc">Figma, Adobe Creative Suite, Protopie, User Research, Usability Testing, Fintech UI/UX, Minimalist Aesthetics, Product Photography.</p>
            </div>
            <div className="skill-card">
              <h3 className="skill-card__title">Technical</h3>
              <p className="skill-card__desc">Angular, AI Coding Tools (OpenCode AI, Antigravity), Mixpanel.</p>
            </div>
            <div className="skill-card">
              <h3 className="skill-card__title">Business</h3>
              <p className="skill-card__desc">Field Marketing, Customer Onboarding, Team Leadership, Public Speaking.</p>
            </div>
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
