import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { getProjectById, type Project } from '../lib/supabase';
import { projectImageMap } from '../data/projects';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      const data = await getProjectById(id);
      setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </PageTransition>
    );
  }

  if (!project) {
    return (
      <PageTransition>
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <h1>Project not found</h1>
          <Link to="/projects" className="btn btn--primary" style={{ marginTop: '20px' }}>
            Back to Projects
          </Link>
        </div>
      </PageTransition>
    );
  }

  const imageSrc = projectImageMap[project.id];

  return (
    <PageTransition>
      <article className="project-detail">
        <div className="container">
          <Link to="/projects" className="project-detail__back">
            <ArrowLeft size={20} />
            Back to Projects
          </Link>

          <header className="project-detail__header">
            <span className="project-detail__tag">{project.tag}</span>
            <h1 className="project-detail__title">{project.title}</h1>
            <p className="project-detail__tagline">{project.tagline}</p>

            <div className="project-detail__meta">
              <div className="project-detail__meta-item">
                <Calendar size={16} />
                <span>{project.period}</span>
              </div>
              <div className="project-detail__meta-item">
                <MapPin size={16} />
                <span>{project.location}</span>
              </div>
              {project.site && (
                <a
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-detail__meta-item project-detail__meta-link"
                  aria-label={`Visit ${project.title} website (opens in new tab)`}
                >
                  <ExternalLink size={16} />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </header>

          <div className="project-detail__hero">
            <img src={imageSrc} alt={project.title} loading="eager" />
          </div>

          <div className="project-detail__body">
            <section className="project-detail__section">
              <h2>Overview</h2>
              <p>{project.description}</p>
            </section>

            <section className="project-detail__section">
              <h2>Role</h2>
              <p><strong>{project.role}</strong></p>
            </section>

            <section className="project-detail__section">
              <h2>Responsibilities</h2>
              <ul>
                {(project.responsibilities || []).map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="project-detail__section">
              <h2>{project.challenge || 'The Challenge'}</h2>
              <p>{project.challenge_text}</p>
            </section>

            <section className="project-detail__section">
              <h2>{project.solution || 'The Solution'}</h2>
              <p>{project.solution_text}</p>
            </section>

            <section className="project-detail__section project-detail__result">
              <h2>{project.result || 'The Result'}</h2>
              <p>{project.result_text}</p>
            </section>
          </div>

          <footer className="project-detail__footer">
            <div className="project-detail__navigation">
              <Link to="/projects" className="project-detail__nav-btn">
                <ArrowLeft size={20} />
                All Projects
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </PageTransition>
  );
}