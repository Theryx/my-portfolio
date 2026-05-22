import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Award, FileText, Users } from 'lucide-react';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import teamAward from '../assets/img/Team spirit award_2025.jfif';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectById, type Project } from '../lib/api';
import { projectImageMap, shomiMarkdownImageMap } from '../data/projects';

import paysikaDesignDocs from '../assets/img/paysika/paysika-design-docs.png';
import paysikaDesignRequirements from '../assets/img/paysika/paysika-design-requirements.png';
import paysikaProductAssets from '../assets/img/paysika/paysika-product-assets.png';
import paysikaMailerAssets from '../assets/img/paysika/paysika-mailer-assets.png';
import paysikaResearchArchive from '../assets/img/paysika/paysika-research-archive.png';
import paysikaRecognition from '../assets/img/paysika/paysika-recognition.png';
import paysikaProcessDocs1 from '../assets/img/paysika/paysika-process-docs1.png';
import paysikaProcessDocs2 from '../assets/img/paysika/paysika-process-docs2.png';
import paysikaMockup from '../assets/img/paysika_mockup.png';

const paysikaProcessArtifacts = [
  {
    title: 'Design system and team process',
    description: 'I built the documentation for UI standards, established collaboration rituals, and created the repeatable design delivery pipeline.',
    image: paysikaDesignDocs,
  },
  {
    title: 'Product and marketing requirements',
    description: 'I drafted the requirements connecting dashboard needs, branding, email, KYC, fees, and mobile flows.',
    image: paysikaDesignRequirements,
  },
  {
    title: 'Mobile flow and product assets',
    description: 'I designed the screens, onboarding references, transaction history, secure card flows, animations, and app assets.',
    image: paysikaProductAssets,
  },
  {
    title: 'Card mailer production assets',
    description: 'I produced the packaging, print, envelope, manufacturing, and presentation materials for physical card delivery.',
    image: paysikaMailerAssets,
  },
  {
    title: 'Usability testing archive',
    description: 'I conducted usability tests, creating the consent forms, scripts, observer guides, reports, and recordings.',
    image: paysikaResearchArchive,
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  const handleImageClick = (src: string, caption: string) => {
    setSelectedImage({ src, caption });
  };

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

  const isPaySika = project.id === 'paysika';
  const imageSrc = isPaySika ? paysikaMockup : projectImageMap[project.image];

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

          <div 
            className="project-detail__hero" 
            onClick={() => handleImageClick(imageSrc, isPaySika ? 'PaySika mobile interface phone mockup' : project.title)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={imageSrc}
              alt={isPaySika ? 'PaySika mobile interface phone mockup' : project.title}
              loading="eager"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="project-detail__body">
            <section className="project-detail__section">
              <h2>Overview</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
            </section>

            <section className="project-detail__section">
              <h2>Role</h2>
              {(project.role || '').split('\n').map((r, i) => (
                <p key={i} style={{ margin: 0 }}><strong>{r.trim()}</strong></p>
              ))}
            </section>

            {isPaySika && (
              <>
                <section className="project-detail__section paysika-story">
                  <div className="paysika-story__intro">
                    <span className="paysika-story__eyebrow">Flagship case study</span>
                    <h2>From product screens to product operations</h2>
                    <p>
                      PaySika was not only a UI/UX project for me. It became a system of product flows, team rituals, research documents, brand assets, and stakeholder-ready materials that helped the team move faster.
                    </p>
                  </div>

                  <div className="paysika-story__stats">
                    <div className="paysika-story__stat">
                      <Users size={22} />
                      <strong>Team leadership</strong>
                      <span>Managed the design team and collaborated across product, engineering, business, and support.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <FileText size={22} />
                      <strong>Design operations</strong>
                      <span>Built documentation around design systems, KYC, onboarding, fees, mobile flows, and research.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <Award size={22} />
                      <strong>Recognition</strong>
                      <span>Recognized for collaboration, ownership, and team contribution during the PaySika journey.</span>
                    </div>
                  </div>
                </section>



                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">Behind the process</span>
                    <h2>The work behind the screens</h2>
                    <p>
                      Here is a look at the foundational systems I created behind the shipped interface, including documentation, research, branding, mobile flows, and physical card materials.
                    </p>
                  </div>

                  <div className="paysika-process__grid">
                    {paysikaProcessArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img 
                          src={artifact.image} 
                          alt={artifact.title} 
                          loading="lazy" 
                          onClick={() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`)}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <h3>{artifact.title}</h3>
                          <p>{artifact.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="project-detail__section paysika-recognition">
                  <div className="paysika-recognition__header">
                    <h2>The Guy people can rely on. Team player? For suuur !</h2>
                    <p>
                      Product design at PaySika also meant being dependable inside the team: clarifying flows, helping teammates move, and getting my hands dirty on some stuff that was not my domain of expertise...but hey! that's the startup spirit, turning messy product questions into usable decisions.
                    </p>
                  </div>
                  <div className="paysika-recognition__gallery">
                    <img
                      src={teamDiscussion}
                      alt="Brainstorming session with colleague on product flows"
                      loading="lazy"
                      onClick={() => handleImageClick(teamDiscussion, "Brainstorming and collaborative session with my colleague on product flows.")}
                      style={{ cursor: 'pointer' }}
                    />
                    <img
                      src={teamAward}
                      alt="Team Spirit Award 2025"
                      loading="lazy"
                      onClick={() => handleImageClick(teamAward, "Receiving the Team Spirit Award in 2025 for collaboration and leadership.")}
                      style={{ cursor: 'pointer' }}
                    />
                    <img
                      src={paysikaRecognition}
                      alt="Receiving recognition during the PaySika journey"
                      loading="lazy"
                      onClick={() => handleImageClick(paysikaRecognition, "Receiving recognition for outstanding teamwork and reliability during the PaySika journey")}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </section>
              </>
            )}



            {project.content && (
              <section className="project-detail__section project-detail__full-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({ children, ...props }) => {
                      const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
                      const isNextSection = text.includes('Designed End-to-End Mobile App');
                      return (
                        <>
                          {isNextSection && isPaySika && (
                            <div className="paysika-ops-images" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                              <img
                                src={paysikaProcessDocs2}
                                alt="Design team process files in SharePoint"
                                loading="lazy"
                                onClick={() => handleImageClick(paysikaProcessDocs2, 'Design team process files — Release & deployment, process.pptx, Design team process.docx and Copywriting process documented in SharePoint.')}
                                style={{ cursor: 'pointer' }}
                              />
                              <img
                                src={paysikaProcessDocs1}
                                alt="Design team process PPTX and DOCX in Teams"
                                loading="lazy"
                                onClick={() => handleImageClick(paysikaProcessDocs1, 'Design team process.pptx created by Theryx Lanvin NDOUKEN — shared in the team channel alongside the process.docx and active team conversation.')}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          )}
                          <h3 {...props}>{children}</h3>
                        </>
                      );
                    },
                    img: ({ src, alt, ...props }) => {
                      const decodedSrc = decodeURIComponent(src || '');
                      const resolvedSrc = shomiMarkdownImageMap[decodedSrc] || src;
                      return (
                        <div className="markdown-image-wrapper" style={{ margin: 'var(--spacing-lg) 0', textAlign: 'center' }}>
                          <img
                            src={resolvedSrc}
                            alt={alt}
                            loading="lazy"
                            onClick={() => handleImageClick(resolvedSrc || '', alt || '')}
                            style={{ 
                              cursor: 'pointer', 
                              borderRadius: '16px', 
                              boxShadow: 'var(--shadow-md)', 
                              maxWidth: '100%', 
                              height: 'auto',
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            className="markdown-zoom-image"
                            {...props}
                          />
                          {alt && (
                            <span 
                              className="markdown-image-caption" 
                              style={{ 
                                display: 'block', 
                                fontSize: '0.875rem', 
                                color: 'var(--color-text-muted)', 
                                marginTop: '8px', 
                                fontStyle: 'italic' 
                              }}
                            >
                              {alt}
                            </span>
                          )}
                        </div>
                      );
                    },
                  }}
                >
                  {project.content}
                </ReactMarkdown>
              </section>
            )}

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
