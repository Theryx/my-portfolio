import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { projectImageMap } from '../data/projects';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { gridVariants, tileVariants } from '../lib/motion';

export default function Projects() {
  const { projects, loading, error } = useProfile();
  const visible = projects.filter((p) => !p.is_hidden);

  return (
    <PageTransition>
      <section className="projects">
        <div className="container">
          <div className="page-hero">
            <span className="section-sticker section-sticker--accent">
              <Sparkles size={13} aria-hidden="true" />
              {visible.length > 0 ? `${String(visible.length).padStart(2, '0')} case studies` : 'Case studies'}
            </span>
            <h2 className="section__title page-hero__title">Selected Work</h2>
            <p className="page-hero__sub">
              Fintech apps, open-source platforms, and ed-tech experiments — each one shipped with a team I'm proud of.
            </p>
          </div>

          {loading ? (
            <p role="status" aria-live="polite">Loading projects...</p>
          ) : error ? (
            <p role="alert" style={{ color: 'var(--color-error, #e53e3e)', textAlign: 'center', padding: '60px 0' }}>
              Failed to load projects. Please try again later.
            </p>
          ) : (
            <>
              {projects.length === 0 && (
                <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                  No projects yet.
                </p>
              )}

              <motion.div
                className="projects__grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
              >
                {projects.map((project, index) => {
                  const isFeatured = index === 0;
                  return (
                    <motion.div key={project.id} variants={tileVariants} className={isFeatured ? 'project-card-wrap--featured' : ''}>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`project-card ${isFeatured ? 'project-card--featured' : ''}`}
                      >
                        <span className="project-card__index" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="project-card__gradient" />
                        <div className="project-card__content">
                          <span className="project-card__tag">{project.tag}</span>
                          <h3 className="project-card__title">{project.title}</h3>
                          <p className="project-card__tagline">{project.tagline}</p>

                          {isFeatured && (
                            <p className="project-card__desc">
                              {project.description}
                            </p>
                          )}

                          <div className="project-card__image">
                            <img
                              src={projectImageMap[project.image] || project.image}
                              alt={project.title}
                              loading={isFeatured ? 'eager' : 'lazy'}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>

                          {project.impact && (
                            <span className="project-card__impact">{project.impact}</span>
                          )}
                          <span className="project-card__cta">View Case Study <span className="project-card__cta-arrow">→</span></span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </div>
      </section>

      <section className="collaboration">
        <div className="container">
          <span className="section-sticker">Better together</span>
          <h2 className="section__title">Collaboration & Teamwork</h2>
          <div className="collaboration__content">
            <img src={teamDiscussion} alt="Team discussion" className="collaboration__image" loading="lazy" />
            <div className="collaboration__text">
              <p>
                I believe the best products are never the work of a single individual. Designing these projects has always been a collective team effort, and I am grateful to have collaborated closely with brilliant engineers, product managers, and stakeholders.
              </p>
              <p>
                The truth is, some of the best design solutions come from others having better ideas than I do—which is why I view feedback as a true blessing and never take it for granted. It is our willingness to listen, co-create, and critique together that makes the final products successful.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
