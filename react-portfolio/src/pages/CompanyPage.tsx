import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import {
  getCompanyBySlug,
  getProjectsByProfile,
  getBlogPostsByProfile,
  type Company,
  type Project,
  type BlogPost,
  fallbackProfiles,
} from '../lib/api';
import { projectImageMap } from '../data/projects';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Code,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './CompanyPage.css';

interface CompanyPageProps {
  slug?: string;
}

const DEFAULT_RESUME_URL =
  'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';

export default function CompanyPage({ slug: propSlug }: CompanyPageProps) {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const effectiveSlug = propSlug || routeSlug || 'trust-wallet';

  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [specimenTab, setSpecimenTab] = useState<'tokens' | 'reactNative' | 'figma'>('tokens');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const resolved = await getCompanyBySlug(effectiveSlug);
        if (!isMounted) return;

        const comp = resolved || (fallbackProfiles[effectiveSlug] as Company) || fallbackProfiles['trust-wallet'];
        setCompany(comp as Company);

        if (comp?.id) {
          const [fetchedProjects, fetchedPosts] = await Promise.all([
            getProjectsByProfile(comp.id),
            getBlogPostsByProfile(comp.id),
          ]);
          if (isMounted) {
            setProjects(fetchedProjects);
            setBlogPosts(fetchedPosts);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch company page data, using fallback:', err);
        const fb = (fallbackProfiles[effectiveSlug] || fallbackProfiles['trust-wallet']) as Company;
        if (isMounted) {
          setCompany(fb);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [effectiveSlug]);

  const contactEmail = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedinUrl = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resumeUrl = company?.social_links?.resume || DEFAULT_RESUME_URL;
  const jobUrl =
    company?.job_url ||
    (company?.theme_config?.ashby_url as string) ||
    'https://jobs.ashbyhq.com/trust-wallet/72c2f324-d2d7-4037-b3a8-d9afb25dbe18';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(prev => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="company-page">
          <div className="company-container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <div className="company-pill company-pill--neutral">Loading company brief...</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const badges = company?.badges?.length
    ? company.badges
    : [
        'Design Engineering',
        'Figma ↔ React Native',
        'Design Systems & Tokens',
        'Fintech & Self-Custody UX',
      ];

  const faqs = company?.about_content?.faqs || [
    {
      question: 'Why Trust Wallet?',
      answer:
        'Trust Wallet is the standard for self-custody with over 200M users. At that scale, design engineering is not cosmetic — it directly determines whether users feel confident sending funds or navigating on-chain protocols. I want to build the UI primitives and interaction systems that empower that confidence.',
    },
    {
      question: 'How do you handle Figma to React Native handoff?',
      answer:
        'By removing the traditional handoff barrier. I align Figma variables directly with code tokens, build reusable primitives, and write the React Native components myself or run peer PR reviews with engineers.',
    },
    {
      question: 'What experience do you have with mobile fintech?',
      answer:
        'Nearly four years at PaySika as UX Design Lead and founding designer, building mobile wallets, KYC verification cameras, and card journeys that scaled to thousands of active users with a 40% retention lift.',
    },
    {
      question: 'How do you balance 60fps micro-interactions and performance?',
      answer:
        'I prototype motion directly in code using gesture handlers and hardware-accelerated transforms (Reanimated / CSS springs). Animations must never block interaction or cause jank on lower-end devices.',
    },
  ];

  return (
    <PageTransition>
      <div className="company-page">
        <div className="company-container">
          {/* Top Eyebrow / Bar */}
          <div className="company-eyebrow-bar">
            <div className="company-badge-group">
              <span className="company-pill">
                <span className="company-pill-dot" />
                {company?.name || 'Trust Wallet'} · {company?.role || 'Design Engineer'}
              </span>
              <span className="company-pill company-pill--neutral">Bespoke Candidate Brief</span>
            </div>

            {jobUrl && (
              <a
                href={jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="company-external-link"
              >
                <span>View Ashby Job Posting</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          {/* Hero Section */}
          <section className="company-hero">
            <motion.h1
              className="company-hero__title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              From Figma to React Native.
              <br />
              Zero handoff friction.
            </motion.h1>

            <motion.p
              className="company-hero__subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              {company?.hero_subtitle ||
                'Closing the gap between design intent and shipped product. 4+ years leading fintech mobile UX, building tokenized design systems, and writing high-craft React Native UI for millions of on-chain transactions.'}
            </motion.p>

            <motion.div
              className="company-hero__tags"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              {badges.map((badge, idx) => (
                <span key={idx} className="company-tag">
                  {badge}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="company-hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              <a href={`mailto:${contactEmail}`} className="pill-btn pill-btn--primary">
                <Mail size={16} />
                <span>Start Conversation</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn pill-btn--outline"
              >
                <Download size={16} />
                <span>Download CV</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="pill-btn pill-btn--outline"
                title="Copy email to clipboard"
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? 'Copied to clipboard' : 'Copy Email'}</span>
              </button>
            </motion.div>
          </section>

          {/* 4 Pillars of Alignment */}
          <section className="company-section">
            <div className="company-section__header">
              <div className="company-section__eyebrow">Strategic Alignment</div>
              <h2 className="company-section__title">
                Why I'm built for the Trust Wallet Design Engineer role
              </h2>
              <p className="company-section__desc">
                Your job offer asks for someone who can move fluidly between Figma and code to ship
                pixel-accurate, performant UI directly into the React Native app. Here is how my
                track record directly solves that mandate.
              </p>
            </div>

            <div className="company-grid-2x2">
              <div className="company-card">
                <div className="company-card__num">01 / FIGMA TO REACT NATIVE</div>
                <h3 className="company-card__title">Direct Implementation, No Drift</h3>
                <p className="company-card__text">
                  I don't just hand off static specs. I build production-quality components and
                  micro-interactions directly in code. When edge cases arise (network delay, wallet
                  balance truncation, multi-chain address formatting), I resolve them directly in
                  the code without waiting for a new Figma revision.
                </p>
                <div className="company-card__meta">
                  <span className="company-card__badge">React Native</span>
                  <span className="company-card__badge">TypeScript</span>
                  <span className="company-card__badge">Component Library</span>
                </div>
              </div>

              <div className="company-card">
                <div className="company-card__num">02 / TOKEN-DRIVEN DESIGN SYSTEMS</div>
                <h3 className="company-card__title">Unified Single Source of Truth</h3>
                <p className="company-card__text">
                  At PaySika, I architected a cross-surface design system using semantic tokens
                  (surface, typography, elevated states, brand accents) that matched 1:1 between
                  Figma variables and code tokens. This eliminated visual regressions across mobile,
                  web, and internal apps.
                </p>
                <div className="company-card__meta">
                  <span className="company-card__badge">Semantic Tokens</span>
                  <span className="company-card__badge">Figma Variables</span>
                  <span className="company-card__badge">Theming Systems</span>
                </div>
              </div>

              <div className="company-card">
                <div className="company-card__num">03 / FINTECH & SELF-CUSTODY SCALE</div>
                <h3 className="company-card__title">4+ Years Designing Financial Trust</h3>
                <p className="company-card__text">
                  In crypto and fintech, trust is won or lost in milliseconds. Leading UX at PaySika,
                  I redesigned onboarding, KYC camera verification, and transactional flows,
                  achieving a 40% retention lift and a 60% reduction in support tickets. I know how
                  to make critical financial actions feel calm, clear, and reassuring.
                </p>
                <div className="company-card__meta">
                  <span className="company-card__badge">200M+ Scale Mindset</span>
                  <span className="company-card__badge">Transaction Security</span>
                  <span className="company-card__badge">Mixpanel Analytics</span>
                </div>
              </div>

              <div className="company-card">
                <div className="company-card__num">04 / CRAFT & 60FPS PERFORMANCE</div>
                <h3 className="company-card__title">Obsessive Micro-Interactions</h3>
                <p className="company-card__text">
                  Polished typography, deliberate motion curves, and tactile gesture feedback. I
                  believe luxury is in the details: instant touch responses, seamless sheet
                  transitions, and animations that feel natural without dropping frames on
                  lower-tier mobile hardware.
                </p>
                <div className="company-card__meta">
                  <span className="company-card__badge">Reanimated</span>
                  <span className="company-card__badge">Gestures</span>
                  <span className="company-card__badge">Zero Jank</span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Token & Specimen Demonstrator */}
          <section className="company-section">
            <div className="company-section__header">
              <div className="company-section__eyebrow">Interactive Specimen</div>
              <h2 className="company-section__title">The Design-Engineering Pipeline in Action</h2>
              <p className="company-section__desc">
                How semantic tokens unify Figma design intent with React Native code in production.
              </p>
            </div>

            <div className="company-specimen">
              <div className="company-specimen__header">
                <div className="company-specimen__tabs">
                  <button
                    type="button"
                    className={`specimen-tab ${specimenTab === 'tokens' ? 'specimen-tab--active' : ''}`}
                    onClick={() => setSpecimenTab('tokens')}
                  >
                    <Layers size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Tokens (JSON)
                  </button>
                  <button
                    type="button"
                    className={`specimen-tab ${specimenTab === 'reactNative' ? 'specimen-tab--active' : ''}`}
                    onClick={() => setSpecimenTab('reactNative')}
                  >
                    <Code size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    React Native Component
                  </button>
                  <button
                    type="button"
                    className={`specimen-tab ${specimenTab === 'figma' ? 'specimen-tab--active' : ''}`}
                    onClick={() => setSpecimenTab('figma')}
                  >
                    <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Figma Variable Mapping
                  </button>
                </div>
                <span className="company-pill company-pill--neutral" style={{ fontSize: '11px' }}>
                  Live Architecture Preview
                </span>
              </div>

              <div className="company-specimen__body">
                <div className="company-specimen__preview">
                  <div className="specimen-widget">
                    <div className="specimen-widget__top">
                      <div className="specimen-widget__logo">
                        <ShieldCheck
                          size={18}
                          color="#473BCE"
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                        />
                        Trust Wallet
                      </div>
                      <span className="company-pill company-pill--neutral" style={{ fontSize: '11px' }}>
                        Multi-Coin
                      </span>
                    </div>
                    <div className="specimen-widget__balance">$24,850.40</div>
                    <div className="specimen-widget__meta">+5.4% past 24h · 100+ chains</div>
                    <div className="specimen-widget__btns">
                      <button type="button" className="specimen-btn specimen-btn--send">
                        Send
                      </button>
                      <button type="button" className="specimen-btn specimen-btn--receive">
                        Receive
                      </button>
                    </div>
                  </div>
                </div>

                <pre className="company-specimen__code">
                  {specimenTab === 'tokens' && (
                    <code>{`// designTokens.ts — Shared Design System Tokens
export const tokens = {
  color: {
    surface: {
      default: 'rgba(255, 255, 255, 0.05)',
      elevated: '#1a192e',
      border: 'rgba(71, 59, 206, 0.25)',
    },
    brand: {
      primary: '#473BCE', // Trust Shield Blue/Purple
      primaryHover: '#3b31b0',
      success: '#10b981',
    },
  },
  radius: {
    card: 16,
    pill: 9999,
  },
  motion: {
    spring: { damping: 20, stiffness: 280 },
  },
};`}</code>
                  )}

                  {specimenTab === 'reactNative' && (
                    <code>{`// WalletCard.tsx — Production React Native Component
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { tokens } from './designTokens';

export function WalletCard({ balance, change }: { balance: string; change: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Multi-Coin Portfolio</Text>
      <Text style={styles.balance}>{balance}</Text>
      <Text style={styles.meta}>{change}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}`}</code>
                  )}

                  {specimenTab === 'figma' && (
                    <code>{`// Figma Variables ↔ Code Token Parity
// Variable Collection: "Trust-UI"

Figma Variable               | Code Token                    | Value
-----------------------------+-------------------------------+---------
color/surface/elevated       | tokens.color.surface.elevated | #1a192e
color/brand/trust-blue       | tokens.color.brand.primary    | #473BCE
radius/button/full           | tokens.radius.pill            | 9999px
spacing/touch/large          | tokens.spacing.touchLarge     | 14px 32px

// Result: Zero translation drift during PR reviews.`}</code>
                  )}
                </pre>
              </div>
            </div>
          </section>

          {/* Curated Work from the Warehouse */}
          <section className="company-section">
            <div className="company-section__header">
              <div className="company-section__eyebrow">Proof from the Warehouse</div>
              <h2 className="company-section__title">Relevant Case Studies & Shipped Systems</h2>
              <p className="company-section__desc">
                Real-world products where I owned the bridge between design and code, built token
                architectures, and delivered measurable business outcomes.
              </p>
            </div>

            <div className="company-project-list">
              {projects.slice(0, 3).map(project => {
                const imgUrl = project.image ? (projectImageMap[project.image] || project.image) : '';
                return (
                  <div key={project.id} className="company-project-row">
                    <div className="company-project-row__left">
                      <span className="company-project-tag">{project.tag}</span>
                      <h3 className="company-project-title">{project.title}</h3>
                      <div className="company-project-role">
                        {project.role} · {project.period}
                      </div>

                      {imgUrl && (
                        <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', maxHeight: '140px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <img
                            src={imgUrl}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      )}

                      {project.impact && (
                        <div className="company-project-impact-badge">{project.impact}</div>
                      )}
                    </div>

                    <div className="company-project-row__right">
                      <p className="company-project-desc">{project.description}</p>

                      {project.responsibilities && project.responsibilities.length > 0 && (
                        <ul className="company-project-bullets">
                          {project.responsibilities.slice(0, 3).map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      )}

                      <div>
                        <Link to={`/projects/${project.id}`} className="company-project-link">
                          <span>Read full case study</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="company-philosophy">
            <div className="company-philosophy__eyebrow">Engineering Philosophy</div>
            <h2 className="company-philosophy__quote">
              {blogPosts[0]?.title ? `"${blogPosts[0].title}"` : '"The best handoff is no handoff."'}
            </h2>
            <p className="company-philosophy__body">
              {blogPosts[0]?.excerpt ||
                "Design-to-engineering handoff is traditionally a translation step, and every translation loses fidelity. The mock says one thing, the implementation does another, and 'looks different from Figma' tickets pile up. The real solution isn't longer handoff documents — it's having engineers with design taste building the components themselves and maintaining a shared vocabulary of tokens."}
            </p>
            <div>
              <Link
                to={blogPosts[0] ? `/blog/${blogPosts[0].id}` : '/blog/de_handoff'}
                className="company-project-link"
              >
                <span>Read the essay on design-engineering handoffs</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          {/* Q&A / FAQs for Trust Wallet */}
          <section className="company-section">
            <div className="company-section__header">
              <div className="company-section__eyebrow">Candidate Q&A</div>
              <h2 className="company-section__title">Addressing the Core Questions</h2>
              <p className="company-section__desc">
                Direct, transparent answers regarding my workflow, remote collaboration, and vision
                for Trust Wallet.
              </p>
            </div>

            <div className="company-faq-list">
              {faqs.map((faq, fIdx) => (
                <div key={fIdx} className="company-faq-item">
                  <div className="company-faq-item__q" onClick={() => toggleFaq(fIdx)}>
                    <span>{faq.question}</span>
                    {expandedFaq === fIdx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  {expandedFaq === fIdx && (
                    <motion.div
                      className="company-faq-item__a"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer Call to Action */}
          <section className="company-footer-cta">
            <h2 className="company-footer-cta__title">Let's build together at Trust Wallet</h2>
            <p className="company-footer-cta__subtitle">
              I am ready to help Trust Wallet close the design-to-engineering loop and ship
              unmatched UI craft to 200M+ users worldwide.
            </p>

            <div className="company-footer-cta__actions">
              <a href={`mailto:${contactEmail}`} className="pill-btn pill-btn--primary">
                <Mail size={16} />
                <span>Send me an email ({contactEmail})</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn pill-btn--outline"
              >
                <ExternalLink size={16} />
                <span>Connect on LinkedIn</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn pill-btn--outline"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>
            </div>

            <div>
              <Link to="/" className="company-back-link">
                <span>← Return to General Portfolio</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
