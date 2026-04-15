import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { projects, projectImageMap, projectTags } from '../data/projects';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import { motion } from 'framer-motion';

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All');

  const filteredProjects = activeTag === 'All'
    ? projects
    : projects.filter(p => p.tag === activeTag);

  return (
    <PageTransition>
      <section className="projects">
        <div className="container">
          <h2 className="section__title">Selected Work</h2>

          {/* Filter pills */}
          <div className="projects__filters">
            {projectTags.map(tag => (
              <button
                key={tag}
                className={`projects__filter-btn ${activeTag === tag ? 'projects__filter-btn--active' : ''}`}
                onClick={() => setActiveTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>

          <motion.div className="projects__grid" layout>
            {filteredProjects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                <div className="project-card__gradient" />
                <div className="project-card__content">
                  <span className="project-card__tag">{project.tag}</span>
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__tagline">{project.tagline}</p>
                  <div className="project-card__image">
                    <img src={projectImageMap[project.id]} alt={project.title} loading="lazy" />
                  </div>
                  <span className="project-card__cta">View Case Study <span className="project-card__cta-arrow">→</span></span>
                </div>
              </Link>
            ))}
          </motion.div>
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
