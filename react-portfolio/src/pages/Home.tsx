import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import myProfile from '../assets/img/My profile black and white.png';

export default function Home() {
  return (
    <PageTransition>
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <div className="hero__badge">
                Available for projects
              </div>
              <h1 className="hero__title">
                Design Engineer & <span>Tech Entrepreneur</span>
              </h1>
              <p className="hero__subtitle">
                I design and build user-centric digital products. Combining expert UX/UI design with front-end development to create beautiful, functional experiences. Based in Douala, Cameroon.
              </p>
              <div className="hero__cta">
                <Link to="/projects" className="btn btn--primary">View Selected Work</Link>
                <Link to="/about" className="btn btn--secondary">Read My Story</Link>
              </div>
            </div>
            <div className="hero__image">
              <img src={myProfile} alt="Ndouken Theryx" />
            </div>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <div className="container">
          <div className="philosophy__inner">
            <h2 className="philosophy__title">
              I design experiences that bridge technology and human needs.
            </h2>
            <p className="philosophy__text">
              As a Design Engineer, I bridge the gap between design and development. With 4+ years leading design at PaySika and now building my own ventures, I combine UX/UI expertise with hands-on coding to create products that are both beautiful and functional. I believe in clean design, simple language, and practical problem-solving.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
