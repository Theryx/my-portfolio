import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { projectImageMap } from '../data/projects';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import { motion } from 'framer-motion';

export default function Projects() {
  const { projects, loading, error } = useProfile();
  const [activeTag, setActiveTag] = useState('All');

  const uniqueTags = ['All', ...new Set(projects.map(p => p.tag).filter(Boolean))];

  const filteredProjects = activeTag === 'All'
    ? projects
    : projects.filter(p => p.tag === activeTag);

  return (
    <PageTransition>
      <section className="projects">
        <div className="container">
          <h2 className="section__title">Selected Work</h2>

          {loading ? (
            <p role="status" aria-live="polite">Loading projects...</p>
          ) : error ? (
            <p role="alert" style={{ color: 'var(--color-error, #e53e3e)', textAlign: 'center', padding: '60px 0' }}>
              Failed to load projects. Please try again later.
            </p>
          ) : (
            <>
              <div className="projects__filters" role="group" aria-label="Filter projects by category">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    className={`projects__filter-btn ${activeTag === tag ? 'projects__filter-btn--active' : ''}`}
                    onClick={() => setActiveTag(tag)}
                    type="button"
                    aria-pressed={activeTag === tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                  {activeTag === 'All' ? 'No projects yet.' : `No projects in "${activeTag}".`}
                </p>
              )}

              <motion.div className="projects__grid" layout>
                {filteredProjects.map((project) => (
                  <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                    <div className="project-card__gradient" />
                    <div className="project-card__content">
                      <span className="project-card__tag">{project.tag}</span>
                      <h3 className="project-card__title">{project.title}</h3>
                      <p className="project-card__tagline">{project.tagline}</p>
                      <div className="project-card__image">
                        <img
                          src={projectImageMap[project.image]}
                          alt={project.title}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <span className="project-card__cta">View Case Study <span className="project-card__cta-arrow">→</span></span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      <section className="collaboration">
        <div className="container">
          <h2 className="section__title">Collaboration & Teamwork</h2>
          <div className="collaboration__content">
            <img src={teamDiscussion} alt="Team discussion" className="collaboration__image" loading="lazy" />
            <div className="collaboration__text">
              <p>
                I believe the best products come from diverse teams working together. At PaySika, I managed "#TheBestTeam" - a two-person design team that delivered exceptional results. I've collaborated with cross-functional teams including engineers, product managers, and stakeholders to deliver impactful fintech solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}