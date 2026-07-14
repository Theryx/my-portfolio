import { useParams } from 'react-router-dom';
import ProfileLink from '../components/ProfileLink';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Award, FileText, Users, Accessibility, Film, ClipboardList } from 'lucide-react';
import teamDiscussion from '../assets/img/Me discussion with my collegue.jfif';
import teamAward from '../assets/img/Team spirit award_2025.jfif';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectById, type Project } from '../lib/api';
import { projectImageMap, shomiMarkdownImageMap } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';
import { lightboxTrigger } from '../lib/a11y';
import { ReadingProgress } from '../components/ReadingProgress';

import paysikaDesignDocs from '../assets/img/paysika/paysika-design-docs.png';
import paysikaDesignRequirements from '../assets/img/paysika/paysika-design-requirements.png';
import paysikaProductAssets from '../assets/img/paysika/paysika-product-assets.png';
import paysikaMailerAssets from '../assets/img/paysika/paysika-mailer-assets.png';
import paysikaResearchArchive from '../assets/img/paysika/paysika-research-archive.png';
import paysikaRecognition from '../assets/img/paysika/paysika-recognition.png';
import paysikaProcessDocs1 from '../assets/img/paysika/paysika-process-docs1.png';
import paysikaProcessDocs2 from '../assets/img/paysika/paysika-process-docs2.png';
import paysikaMockup from '../assets/img/paysika_mockup.png';

// Brand Designer profile — PaySika brand ownership assets
import paysikaBrandGuide from '../assets/img/paysika/brand/brand-guide.png';
import paysikaDesignSystem from '../assets/img/paysika/brand/design-system.png';
import paysikaDesignFiles from '../assets/img/paysika/brand/design-files.png';
import paysikaPresentations from '../assets/img/paysika/brand/presentations.webp';
import paysikaMarketingSurfaces from '../assets/img/paysika/brand/marketing-surfaces.webp';

// Brand Designer profile — GUEEMSHOME brand engagement
import gueemsBoisSecret from '../assets/img/gueemshome/candle-bois-secret.jpg';
import gueemsAmbreVanille from '../assets/img/gueemshome/candle-ambre-vanille.jpg';
import gueemsAqua7 from '../assets/img/gueemshome/perfume-aqua7.jpg';
import gueemsSpray from '../assets/img/gueemshome/spray-lifestyle.jpg';
import gueemsPackaging from '../assets/img/gueemshome/packaging-gift.jpg';
import gueemsConcept from '../assets/img/gueemshome/identity-concept.jpg';
import gueemsPalette from '../assets/img/gueemshome/palette-exploration.jpg';
import gueemsInsertCards from '../assets/img/gueemshome/insert-cards.jpg';

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

// Brand Designer profile — the brand guide: the rulebook
const paysikaBrandGuideArtifact = {
  title: 'PaySika brand guide',
  description: 'The rules in one place: typography (Muli + AmpleSoft Pro), the colour system (a blue-to-green gradient over #00B0F4 and #00CC92 on deep navy), logo usage, iconography, and layout.',
  image: paysikaBrandGuide,
};

// Brand Designer profile — the design system across every digital surface
const paysikaDesignSystemArtifacts = [
  {
    title: 'PaySika design system',
    description: 'The rules turned into reusable Figma components, text styles, and colour styles, the single source every digital surface builds from.',
    image: paysikaDesignSystem,
  },
  {
    title: 'One system, many surfaces',
    description: 'The same system fed the mobile app, backoffice dashboards, the agent app, and the web experience: onboarding, KYC, cards, deposits, and more, all versioned and named so the current asset is the one people find.',
    image: paysikaDesignFiles,
  },
];

// Brand Designer profile — one identity from product to marketing
const paysikaBrandSurfaceArtifacts = [
  {
    title: 'On-brand presentation library',
    description: 'Pitch and business-case decks built from shared, AI-friendly templates, so stakeholder and AI-generated decks stayed on-brand without me policing every slide.',
    image: paysikaPresentations,
  },
  {
    title: 'One brand across surfaces',
    description: 'The same identity from the mobile app to Facebook and social campaigns to slide decks: one promise, one look, no matter the touchpoint.',
    image: paysikaMarketingSurfaces,
  },
];

// Brand Designer profile — GUEEMSHOME identity, from concept to system
const gueemsProcessArtifacts = [
  {
    title: 'Early concept & tagline',
    description: 'One of the first directions: a boxed "G | H" serif mark under the line "Déco. Qualité. Design." Exploring the brand\'s voice before settling the final identity.',
    image: gueemsConcept,
  },
  {
    title: 'Colour & mark exploration',
    description: 'Testing the GH monogram across light and dark colourways with candidate palettes, the groundwork for the colour system that now flexes per scent.',
    image: gueemsPalette,
  },
];

// Brand Designer profile — GUEEMSHOME identity applied across the range
const gueemsIdentityArtifacts = [
  {
    title: 'Bois Secret',
    description: 'The GH hexagon monogram on a clean label, the anchor of the identity across every product.',
    image: gueemsBoisSecret,
  },
  {
    title: 'Ambre Vanille',
    description: 'A colour-coded label per scent, so the range reads as one family while each fragrance keeps its own character.',
    image: gueemsAmbreVanille,
  },
  {
    title: 'Aqua 7',
    description: 'The same system in a fresh, green colourway, applied to the room-perfume line.',
    image: gueemsAqua7,
  },
];

// Brand Designer profile — GUEEMSHOME from packaging to campaign
const gueemsMarketingArtifacts = [
  {
    title: 'Campaign & product imagery',
    description: 'Art-directed with a photographer: warm, restrained styling that carries the brand across the storefront and the Instagram feed.',
    image: gueemsSpray,
  },
  {
    title: 'Branded packaging',
    description: 'Kraft gift boxes with a signature ribbon, so the unboxing feels as considered and hand-made as the product.',
    image: gueemsPackaging,
  },
  {
    title: 'Bilingual insert cards',
    description: 'Reusable thank-you, merci, and review-request cards, French and English, so every order closes on-brand and in the customer\'s language.',
    image: gueemsInsertCards,
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  usePageMeta({
    title: project?.title,
    description: project?.tagline || project?.description,
    image: project?.image,
    type: 'article',
  });

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
          <ProfileLink to="/projects" className="btn btn--primary" style={{ marginTop: '20px' }}>
            Back to Projects
          </ProfileLink>
        </div>
      </PageTransition>
    );
  }

  const isPaySika = project.id === 'paysika' || project.id.startsWith('paysika_');
  const isPaySikaBrand = project.id === 'paysika_brand-designer';
  const isGueemsHome = project.id === 'gueemshome_brand-designer';
  const isCrowdRemit = project.id.startsWith('crowdremit');
  const imageSrc = isPaySika ? paysikaMockup : projectImageMap[project.image];
  const heroCaption = isPaySika 
    ? 'PaySika mobile interface phone mockup' 
    : isCrowdRemit 
      ? 'CrowdRemit high-fidelity multi-platform mockup' 
      : project.title;

  return (
    <PageTransition>
      <ReadingProgress />
      <article className="project-detail">
        <div className="container">
          <ProfileLink to="/projects" className="project-detail__back">
            <ArrowLeft size={20} />
            Back to Projects
          </ProfileLink>

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
            {...lightboxTrigger(() => handleImageClick(imageSrc, heroCaption), 'Enlarge project image')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={imageSrc}
              alt={heroCaption}
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

            {project.responsibilities && project.responsibilities.length > 0 && (
              <section className="project-detail__section">
                <h2>Key Responsibilities</h2>
                <ul className="project-detail__responsibilities">
                  {project.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {project.challenge_text && (
              <section className="project-detail__section">
                <h2>{project.challenge || 'The Challenge'}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.challenge_text}</ReactMarkdown>
              </section>
            )}

            {project.solution_text && (
              <section className="project-detail__section">
                <h2>{project.solution || 'The Solution'}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.solution_text}</ReactMarkdown>
              </section>
            )}

            {project.result_text && (
              <section className="project-detail__section">
                <div className="project-detail__result">
                  <h2>{project.result || 'The Result'}</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.result_text}</ReactMarkdown>
                </div>
              </section>
            )}

            {isCrowdRemit && (
              <section className="project-detail__section paysika-story">
                <div className="paysika-story__intro">
                  <span className="paysika-story__eyebrow">Fintech case study</span>
                  <h2>Ecosystem Deliverables &amp; Design Architecture</h2>
                  <p>
                    CrowdRemit was a full-scale digital experience. I designed a multi-currency ecosystem across four platforms: iOS App, Android App, Web Dashboard, and a public landing page, unified by a custom design system.
                  </p>
                </div>

                <div className="paysika-story__stats">
                  <div className="paysika-story__stat">
                    <Users size={22} />
                    <strong>User-Centric Design</strong>
                    <span>Insisted on user interviews, journey maps, and personas to guide the UX structure before drawing wireframes.</span>
                  </div>
                  <div className="paysika-story__stat">
                    <FileText size={22} />
                    <strong>Accessible Rebranding</strong>
                    <span>Led a bold accessibility rebranding, replacing a low-contrast primary color to satisfy WCAG AA requirements.</span>
                  </div>
                  <div className="paysika-story__stat">
                    <Award size={22} />
                    <strong>Cross-Platform Scope</strong>
                    <span>Created and handed over consistent assets for mobile, responsive web dashboard, and marketing landing pages.</span>
                  </div>
                </div>
              </section>
            )}

            {isPaySikaBrand && (
              <>
                <section className="project-detail__section paysika-story">
                  <div className="paysika-story__intro">
                    <span className="paysika-story__eyebrow">Brand ownership</span>
                    <h2>One brand, every touchpoint</h2>
                    <p>
                      As the lead designer, I led the PaySika design team and owned the visual identity across digital products and marketing: one brand guide, one design system, applied consistently from the app to the ad to the pitch deck.
                    </p>
                  </div>

                  <div className="paysika-story__stats">
                    <div className="paysika-story__stat">
                      <FileText size={22} />
                      <strong>Brand guide</strong>
                      <span>Typography, colour, logo, iconography, and layout rules in one living source of truth.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <Users size={22} />
                      <strong>Design system</strong>
                      <span>Reusable components and styles feeding product and marketing from the same parts.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <Award size={22} />
                      <strong>Consistency</strong>
                      <span>Reviewed journeys, campaigns, and decks so every surface shipped on-brand.</span>
                    </div>
                  </div>
                </section>

                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">The rulebook</span>
                    <h2>One source of truth</h2>
                    <p>
                      The brand guide was the single source of truth: typography, colour, logo, iconography, illustration, and layout in one living document every team could reach for. I reviewed journeys, campaigns, and screens for the small drifts that erode a brand, and significant work came to me before it shipped, so what a customer saw was on-brand by the time it went live.
                    </p>
                  </div>
                  <div className="paysika-process__grid" style={{ gridTemplateColumns: '1fr' }}>
                    <article className="paysika-process__item">
                      <img
                        src={paysikaBrandGuideArtifact.image}
                        alt={paysikaBrandGuideArtifact.title}
                        loading="lazy"
                        {...lightboxTrigger(() => handleImageClick(paysikaBrandGuideArtifact.image, `${paysikaBrandGuideArtifact.title} - ${paysikaBrandGuideArtifact.description}`), `Enlarge: ${paysikaBrandGuideArtifact.title}`)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div>
                        <h3>{paysikaBrandGuideArtifact.title}</h3>
                        <p>{paysikaBrandGuideArtifact.description}</p>
                      </div>
                    </article>
                  </div>
                </section>

                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">Digital brand experience</span>
                    <h2>One design system, every digital surface</h2>
                    <p>
                      Working alongside product and engineering, I kept one consistent visual language across every digital experience: components, icons, illustrations, typography, spacing, and colour defined once and reused across the mobile app, backoffice dashboards, the agent app, and the web experience. My job was the brand layer on top of usability, visual direction that made each experience not only usable but unmistakably PaySika, reviewed screen by screen so the brand survived the trip from Figma to production.
                    </p>
                  </div>
                  <div className="paysika-process__grid">
                    {paysikaDesignSystemArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img
                          src={artifact.image}
                          alt={artifact.title}
                          loading="lazy"
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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

                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">On-brand everywhere</span>
                    <h2>From product to marketing</h2>
                    <p>
                      The same identity across the app, Facebook and social campaigns, and stakeholder-ready pitch decks. When AI tools spread through the company and colleagues started generating their own off-brand decks, I did not police every slide: I built on-brand, AI-friendly templates so the fastest way to make a deck was also the on-brand way.
                    </p>
                  </div>
                  <div className="paysika-process__grid">
                    {paysikaBrandSurfaceArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img
                          src={artifact.image}
                          alt={artifact.title}
                          loading="lazy"
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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

                <section className="project-detail__section paysika-story">
                  <div className="paysika-story__intro">
                    <span className="paysika-story__eyebrow">Running the brand</span>
                    <h2>What owning the brand meant day to day</h2>
                    <p>
                      Beyond the guide and the system, owning the brand meant keeping it accessible, telling its story in motion, working across every team, and running a clear queue so the highest-impact work shipped first.
                    </p>
                  </div>

                  <div className="paysika-story__stats">
                    <div className="paysika-story__stat">
                      <Accessibility size={22} />
                      <strong>Accessible &amp; inclusive by default</strong>
                      <span>Colour contrast, readable typography, clear hierarchy, and inclusive imagery built into the system so the brand works for the widest range of users.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <Film size={22} />
                      <strong>Motion &amp; visual storytelling</strong>
                      <span>Light motion for launches, onboarding, and social, with larger pieces art-directed against the same system and timing.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <Users size={22} />
                      <strong>Cross-functional partner</strong>
                      <span>Worked across Marketing, Product, Engineering, Compliance, Risk, Sales, and Customer Experience to keep every touchpoint on-brand and regulator-aligned.</span>
                    </div>
                    <div className="paysika-story__stat">
                      <ClipboardList size={22} />
                      <strong>Intake &amp; prioritisation</strong>
                      <span>A simple request process ranked on business impact, customer visibility, compliance sensitivity, urgency, and effort.</span>
                    </div>
                  </div>
                </section>

                <section className="project-detail__section paysika-story">
                  <div className="paysika-story__intro">
                    <span className="paysika-story__eyebrow">Why it matters</span>
                    <h2>Every expression reinforces the positioning</h2>
                    <p>
                      Trust, simplicity, innovation, professionalism, reliability, and security are not taglines: they are things a visual system either communicates or quietly undermines. I designed toward them deliberately, so the brand said the same thing whether a customer was opening the app or seeing an ad for the first time.
                    </p>
                  </div>
                </section>
              </>
            )}

            {isGueemsHome && (
              <>
                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">Building the identity</span>
                    <h2>From concept to a system</h2>
                    <p>
                      I explored the mark, the palette, and the type before locking the brand: the wordmark settled on Hammersmith One, the mark on the GH hexagon monogram, and the palette on a warm, restrained set that could flex per product.
                    </p>
                  </div>
                  <div className="paysika-process__grid">
                    {gueemsProcessArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img
                          src={artifact.image}
                          alt={artifact.title}
                          loading="lazy"
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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

                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">The identity, applied</span>
                    <h2>One monogram, a colour per scent</h2>
                    <p>
                      The brand hangs on the GH hexagon monogram, then flexes through a colour-coded label per fragrance, so the range feels like one family while each scent keeps its own character.
                    </p>
                  </div>
                  <div className="paysika-process__grid">
                    {gueemsIdentityArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img
                          src={artifact.image}
                          alt={artifact.title}
                          loading="lazy"
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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

                <section className="project-detail__section paysika-process">
                  <div className="paysika-process__header">
                    <span className="paysika-story__eyebrow">From packaging to campaign</span>
                    <h2>One look, from the box to the feed</h2>
                    <p>
                      The identity extends into packaging and marketing. I art-directed the product and campaign photography with a photographer so everything, storefront to social, shares one warm, restrained look.
                    </p>
                  </div>
                  <div className="paysika-process__grid">
                    {gueemsMarketingArtifacts.map((artifact) => (
                      <article className="paysika-process__item" key={artifact.title}>
                        <img
                          src={artifact.image}
                          alt={artifact.title}
                          loading="lazy"
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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
              </>
            )}

            {isPaySika && !isPaySikaBrand && (
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
                          {...lightboxTrigger(() => handleImageClick(artifact.image, `${artifact.title} - ${artifact.description}`), `Enlarge: ${artifact.title}`)}
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
                      {...lightboxTrigger(() => handleImageClick(teamDiscussion, "Brainstorming and collaborative session with my colleague on product flows."), 'Enlarge team discussion photo')}
                      style={{ cursor: 'pointer' }}
                    />
                    <img
                      src={teamAward}
                      alt="Team Spirit Award 2025"
                      loading="lazy"
                      {...lightboxTrigger(() => handleImageClick(teamAward, "Receiving the Team Spirit Award in 2025 for collaboration and leadership."), 'Enlarge award photo')}
                      style={{ cursor: 'pointer' }}
                    />
                    <img
                      src={paysikaRecognition}
                      alt="Receiving recognition during the PaySika journey"
                      loading="lazy"
                      {...lightboxTrigger(() => handleImageClick(paysikaRecognition, "Receiving recognition for outstanding teamwork and reliability during the PaySika journey"), 'Enlarge recognition photo')}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </section>
              </>
            )}



            {project.content && !isPaySikaBrand && (
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
                                onClick={() => handleImageClick(paysikaProcessDocs2, 'Design team process files: Release & deployment, process.pptx, Design team process.docx and Copywriting process documented in SharePoint.')}
                                style={{ cursor: 'pointer' }}
                              />
                              <img
                                src={paysikaProcessDocs1}
                                alt="Design team process PPTX and DOCX in Teams"
                                loading="lazy"
                                onClick={() => handleImageClick(paysikaProcessDocs1, 'Design team process.pptx created by Theryx Lanvin NDOUKEN, shared in the team channel alongside the process.docx and active team conversation.')}
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
                      const isSideBySide = alt && alt.includes('[side-by-side]');
                      const cleanAlt = alt ? alt.replace('[side-by-side]', '').trim() : '';
                      return (
                        <div 
                          className="markdown-image-wrapper" 
                          style={{ 
                            margin: 'var(--spacing-lg) 0', 
                            textAlign: 'center',
                            display: isSideBySide ? 'inline-block' : 'block',
                            width: isSideBySide ? 'calc(50% - 16px)' : '100%',
                            minWidth: isSideBySide ? '280px' : 'none',
                            boxSizing: 'border-box',
                            padding: isSideBySide ? '0 8px' : '0',
                            verticalAlign: 'top'
                          }}
                        >
                          <img
                            src={resolvedSrc}
                            alt={cleanAlt}
                            loading="lazy"
                            {...lightboxTrigger(() => handleImageClick(resolvedSrc || '', cleanAlt || ''), `Enlarge: ${cleanAlt || 'image'}`)}
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
                          {cleanAlt && (
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
                              {cleanAlt}
                            </span>
                          )}
                        </div>
                      );
                    },
                    a: ({ href, children, ...props }) => {
                      const isFigma = href && (href.includes('figma.com/file/') || href.includes('figma.com/proto/') || href.includes('figma.com/design/'));
                      if (isFigma) {
                        const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(href)}`;
                        return (
                          <div className="figma-embed-container" style={{ margin: 'var(--spacing-xl) 0', width: '100%' }}>
                            <iframe
                              title="Figma Prototype"
                              width="100%"
                              height="500"
                              src={embedUrl}
                              allowFullScreen
                              style={{
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                backgroundColor: '#1e1e1e',
                                boxShadow: 'var(--shadow-lg)'
                              }}
                            />
                            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                              <a 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="project-detail__meta-item project-detail__meta-link" 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px',
                                  fontSize: '0.875rem',
                                  color: 'var(--color-primary)',
                                  textDecoration: 'none'
                                }}
                              >
                                <span>Open Prototype in Figma</span>
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                          {children}
                        </a>
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
              <ProfileLink to="/projects" className="project-detail__nav-btn">
                <ArrowLeft size={20} />
                All Projects
              </ProfileLink>
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
