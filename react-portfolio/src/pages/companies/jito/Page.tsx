import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../../../components/PageTransition';
import { usePageMeta } from '../../../hooks/usePageMeta';
import {
  getCompanyBySlug,
  getProjectsByProfile,
  getBlogPostsByProfile,
  type Company,
  type Project,
  type BlogPost,
} from '../../../lib/api';
import {
  ArrowUpRight,
  Mail,
  Download,
  Copy,
  Check,
  Layers,
  Gauge,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './Page.css';

const DEFAULT_RESUME_URL =
  'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';
const DEFAULT_EMAIL = 'ndouken@gmail.com';
const DEFAULT_LINKEDIN = 'https://www.linkedin.com/in/ndoukentheryx';

const REASONS = [
  {
    k: '01',
    label: 'PRODUCT SENSE',
    title: 'Decisions I can defend',
    text: 'I do not decorate screens. At PaySika I rebuilt onboarding, KYC and transactions against Mixpanel funnels, then shipped the version the data argued for: a 40% retention lift and 60% fewer support tickets.',
  },
  {
    k: '02',
    label: 'CLARITY UNDER PRESSURE',
    title: 'Legible in half a second',
    text: 'Dense financial screens get scanned, not studied. I redesigned PaySika\u2019s transaction history so a missing payment is findable in under five seconds: grouping, honest states, plain-language failures.',
  },
  {
    k: '03',
    label: 'SYSTEMS & TOKENS',
    title: 'One source of truth',
    text: 'I build semantic token systems that live in Figma and in code under the same names. At PaySika that killed the \u201clooks different from the mock\u201d drift across mobile, web and back office.',
  },
  {
    k: '04',
    label: 'SHIP, DON\u2019T HAND OFF',
    title: 'Design that reaches production',
    text: 'I work in the repo with engineers: reviewing PRs, resolving edge cases in the component, keeping fidelity intact. The portfolio you are reading is a token system I designed and shipped myself.',
  },
];

const FAQ_FALLBACK = [
  {
    question: 'You have not designed a trading terminal. Why JTX?',
    answer:
      'Straight answer: I have not. What I have done for four years is design dense, high-stakes financial screens where the cost of a misread is real money: onboarding, KYC, transaction history, card and back-office operations. The core craft transfers. What is new is the market itself, and I would rather say that plainly than pretend otherwise.',
  },
  {
    question: 'What does \u201cclear at a glance\u201d mean to you?',
    answer:
      'A trader under pressure scans before they read. So hierarchy, number formatting and state have to answer before the question is finished. At PaySika I rewrote the transaction list so a missing payment is findable in under five seconds without scrolling. Same discipline, applied to positions and execution.',
  },
  {
    question: 'How do you work with engineering on a design system?',
    answer:
      'Semantic tokens first, same names on both sides. Figma variables and code tokens share a vocabulary, so when someone says the accent is too saturated an engineer can search the codebase and find every usage. I also work directly in the repo, reviewing PRs and resolving edge cases rather than throwing specs over a wall.',
  },
  {
    question: 'You are remote and outside EST. Does that work?',
    answer:
      'I have worked remote-first across Africa and Europe for years, and I keep a written trail so decisions do not depend on being in the room. I am willing to hold regular EST meetings and overlap deliberately for the moments that matter.',
  },
];

export default function Page({ slug: propSlug }: { slug?: string }) {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const slug = propSlug || routeSlug || 'jito';

  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'busy' | 'clear'>('clear');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  usePageMeta({
    title: company ? `${company.name} \u2014 ${company.role ?? 'Product Designer'}` : 'Product Designer',
    description: company?.tagline ?? undefined,
  });

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const c = await getCompanyBySlug(slug);
        if (!live) return;
        setCompany(c);
        if (c?.id) {
          const [p, b] = await Promise.all([
            getProjectsByProfile(c.id),
            getBlogPostsByProfile(c.id),
          ]);
          if (!live) return;
          setProjects(p);
          setPosts(b);
        }
      } catch {
        /* keep the page renderable */
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [slug]);

  const contactEmail = company?.social_links?.email || DEFAULT_EMAIL;
  const linkedinUrl = company?.social_links?.linkedin || DEFAULT_LINKEDIN;
  const resumeUrl = company?.social_links?.resume || DEFAULT_RESUME_URL;
  const jobUrl = company?.job_url || 'https://jobs.lever.co/jito/97151aba-e3eb-483d-b56c-34711b873760';
  const faqs = company?.about_content?.faqs?.length ? company.about_content.faqs : FAQ_FALLBACK;
  const badges = company?.badges?.length
    ? company.badges
    : [
        'Product Design \u00b7 Fintech',
        'Token-based design systems',
        'Figma \u2194 Engineering',
        'Dense UI \u00b7 Clarity under pressure',
      ];

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="jito">
          <div className="jito-wrap jito-loading">Loading brief…</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="jito">
        {/* Market strip */}
        <div className="jito-strip" aria-hidden="true">
          <div className="jito-strip__inner">
            <span className="jito-strip__sym">JTX / SOL</span>
            <span className="jito-strip__cell jito-strip__cell--up">EXEC <b>+0.04ms</b></span>
            <span className="jito-strip__cell">SLOT <b>14,338,917</b></span>
            <span className="jito-strip__cell jito-strip__cell--up">TPS <b>62,410</b></span>
            <span className="jito-strip__cell jito-strip__cell--muted">SELF-CUSTODIAL</span>
            <span className="jito-strip__cell jito-strip__cell--muted">NATIVE MOBILE / IN BUILD</span>
            <span className="jito-strip__scan" />
          </div>
        </div>

        <div className="jito-wrap">
          {/* Top bar */}
          <div className="jito-topbar">
            <span className="jito-chip">
              <span className="jito-chip__dot" />
              {company?.name ?? 'Jito Foundation'} / {company?.role ?? 'Product Designer'}
            </span>
            <span className="jito-chip jito-chip--ghost">Targeted candidate brief</span>
            {jobUrl && (
              <a className="jito-toplink" href={jobUrl} target="_blank" rel="noopener noreferrer">
                View the JTX role <ArrowUpRight size={13} />
              </a>
            )}
          </div>

          {/* Hero */}
          <section className="jito-hero">
            <div className="jito-hero__copy">
              <motion.h1
                className="jito-hero__title"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                Clear at a glance.
                <br />
                <span className="jito-hero__title-accent">Fast under pressure.</span>
              </motion.h1>
              <motion.p
                className="jito-hero__sub"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
              >
                {company?.hero_subtitle ??
                  'Product designer for dense, high-stakes financial surfaces. I make the screen a trader reads in half a second legible and trustworthy, and I own the token systems engineers ship it with.'}
              </motion.p>
              <div className="jito-hero__tags">
                {badges.map((b, i) => (
                  <span key={i} className="jito-tag">{b}</span>
                ))}
              </div>
              <div className="jito-hero__actions">
                <a href={`mailto:${contactEmail}`} className="jito-btn jito-btn--primary">
                  <Mail size={15} /> Start a conversation
                </a>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="jito-btn jito-btn--ghost">
                  <Download size={15} /> Download CV
                </a>
                <button type="button" onClick={copyEmail} className="jito-btn jito-btn--ghost">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy email'}
                </button>
              </div>
            </div>

            {/* Terminal panel */}
            <motion.div
              className="jito-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="jito-panel__head">
                <span className="jito-panel__dot" />
                <span className="jito-panel__title">JTX / positions</span>
                <span className="jito-panel__badge"><Zap size={11} /> live</span>
              </div>
              <div className="jito-panel__balance">
                <span className="jito-panel__label">EQUITY</span>
                <span className="jito-panel__value">$24,850.40</span>
                <span className="jito-panel__delta">+5.4% / 24h</span>
              </div>
              <div className="jito-rows">
                <div className="jito-row jito-row--head">
                  <span>MARKET</span><span>SIZE</span><span>PNL</span>
                </div>
                <div className="jito-row">
                  <span className="jito-row__sym">SOL-PERP</span>
                  <span className="jito-num">12.50</span>
                  <span className="jito-num jito-num--up">+318.20</span>
                </div>
                <div className="jito-row">
                  <span className="jito-row__sym">BTC-PERP</span>
                  <span className="jito-num">0.080</span>
                  <span className="jito-num jito-num--up">+104.66</span>
                </div>
                <div className="jito-row">
                  <span className="jito-row__sym">JTO-PERP</span>
                  <span className="jito-num">240.0</span>
                  <span className="jito-num jito-num--down">-92.15</span>
                </div>
              </div>
              <div className="jito-panel__foot">
                <span className="jito-panel__label">FILL LATENCY</span>
                <span className="jito-panel__lat">0.04 ms</span>
              </div>
            </motion.div>
          </section>

          {/* Reasons */}
          <section className="jito-section">
            <div className="jito-section__head">
              <span className="jito-eyebrow">01 / Why I am built for JTX</span>
              <h2 className="jito-h2">The screen is where speed becomes trust</h2>
              <p className="jito-lead">
                Jito sells the fastest market infrastructure; JTX has to make that speed feel
                obvious and safe. Here is the craft I bring to that layer.
              </p>
            </div>
            <div className="jito-reasons">
              {REASONS.map((r) => (
                <article key={r.k} className="jito-reason">
                  <div className="jito-reason__meta">
                    <span className="jito-reason__k">{r.k}</span>
                    <span className="jito-reason__label">{r.label}</span>
                  </div>
                  <h3 className="jito-reason__title">{r.title}</h3>
                  <p className="jito-reason__text">{r.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Specimen */}
          <section className="jito-section">
            <div className="jito-section__head">
              <span className="jito-eyebrow">02 / Interactive specimen</span>
              <h2 className="jito-h2">The hierarchy problem, in one toggle</h2>
              <p className="jito-lead">
                Busy screens fail for structural reasons, not taste. Flip this order ticket from
                <em> busy</em> to <em>clear</em>: same data, different reading order.
              </p>
            </div>

            <div className="jito-specimen">
              <div className="jito-specimen__bar">
                <div className="jito-toggle" role="group" aria-label="Panel state">
                  <button
                    type="button"
                    className={`jito-toggle__btn ${mode === 'busy' ? 'is-on' : ''}`}
                    onClick={() => setMode('busy')}
                    aria-pressed={mode === 'busy'}
                  >
                    Busy
                  </button>
                  <button
                    type="button"
                    className={`jito-toggle__btn ${mode === 'clear' ? 'is-on' : ''}`}
                    onClick={() => setMode('clear')}
                    aria-pressed={mode === 'clear'}
                  >
                    Clear
                  </button>
                </div>
                <span className="jito-specimen__note">
                  <Gauge size={13} /> same data / same states
                </span>
              </div>

              <div className={`jito-ticket jito-ticket--${mode}`}>
                <div className="jito-ticket__head">
                  <span className="jito-ticket__pair">SOL-PERP</span>
                  <span className="jito-ticket__px">$142.18</span>
                </div>

                <div className="jito-ticket__body">
                  <div className="jito-field">
                    <label>Side</label>
                    <div className="jito-seg">
                      <span className="is-on">Long</span>
                      <span>Short</span>
                    </div>
                  </div>
                  <div className="jito-field">
                    <label>Size</label>
                    <div className="jito-input"><span className="jito-num">12.50</span><span className="jito-unit">SOL</span></div>
                  </div>
                  <div className="jito-field">
                    <label>Order type</label>
                    <div className="jito-input"><span>Limit</span><ChevronDown size={13} /></div>
                  </div>
                  <div className="jito-field">
                    <label>Leverage</label>
                    <div className="jito-input"><span className="jito-num">5x</span></div>
                  </div>
                  <div className="jito-field">
                    <label>Est. liquidation</label>
                    <div className="jito-input jito-input--warn"><span className="jito-num">$118.40</span></div>
                  </div>
                </div>

                <div className="jito-ticket__summary">
                  <div><span>Order value</span><b className="jito-num">$1,777.25</b></div>
                  <div><span>Est. fee</span><b className="jito-num">$0.44</b></div>
                </div>

                <div className="jito-ticket__actions">
                  <button type="button" className="jito-ticket__submit">Place long order</button>
                  <button type="button" className="jito-ticket__cancel">Cancel</button>
                </div>
              </div>
            </div>
          </section>

          {/* Work */}
          <section className="jito-section">
            <div className="jito-section__head">
              <span className="jito-eyebrow">03 / Selected work</span>
              <h2 className="jito-h2">Dense financial surfaces, shipped</h2>
              <p className="jito-lead">
                The proof is in regulated fintech: onboarding, KYC, transactions, operations, and the
                systems behind them.
              </p>
            </div>
            <div className="jito-work">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  className="jito-work__row"
                  to={`/projects/${p.id}?profile=${company?.id ?? 'jito'}`}
                >
                  <div className="jito-work__main">
                    <span className="jito-work__tag">{p.tag}</span>
                    <h3 className="jito-work__title">{p.title}</h3>
                    <p className="jito-work__desc">{p.description}</p>
                    <span className="jito-work__meta">{p.role} / {p.period}</span>
                  </div>
                  <div className="jito-work__side">
                    {p.impact && <span className="jito-work__impact">{p.impact}</span>}
                    <span className="jito-work__go"><ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              ))}
              {projects.length === 0 && (
                <p className="jito-lead">Case studies are loading from the warehouse.</p>
              )}
            </div>
          </section>

          {/* Philosophy */}
          <section className="jito-philosophy">
            <span className="jito-eyebrow">04 / Point of view</span>
            <h2 className="jito-philosophy__quote">
              {posts[0]?.title ? `\u201c${posts[0].title}\u201d` : '\u201cIn a trading app, clarity is the product.\u201d'}
            </h2>
            <p className="jito-philosophy__body">
              {company?.philosophy_text ??
                posts[0]?.excerpt ??
                'A trader under pressure does not read your interface, they scan it. Hierarchy, number formatting and state are not polish; they decide whether the right order goes through. The job is to make the screen answer before the question is finished.'}
            </p>
            <div className="jito-philosophy__chips">
              <span className="jito-chip jito-chip--ghost"><Layers size={13} /> tokens</span>
              <span className="jito-chip jito-chip--ghost"><ShieldCheck size={13} /> regulated fintech</span>
              <span className="jito-chip jito-chip--ghost"><Zap size={13} /> 60fps motion</span>
            </div>
          </section>

          {/* FAQ */}
          <section className="jito-section">
            <div className="jito-section__head">
              <span className="jito-eyebrow">05 / Straight answers</span>
              <h2 className="jito-h2">The questions a small team actually asks</h2>
            </div>
            <div className="jito-faq">
              {faqs.map((f, i) => (
                <div key={i} className="jito-faq__item">
                  <button
                    type="button"
                    className="jito-faq__q"
                    onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}
                    aria-expanded={openFaq === i}
                  >
                    <span>{f.question}</span>
                    {openFaq === i ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  </button>
                  {openFaq === i && (
                    <motion.div
                      className="jito-faq__a"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {f.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="jito-cta">
            <h2 className="jito-cta__title">Let us make JTX feel fast and safe at once.</h2>
            <p className="jito-cta__sub">
              I would rather show you how I think than tell you. Give me a JTX screen and I will come
              back with the hierarchy problem and a direction.
            </p>
            <div className="jito-cta__actions">
              <a href={`mailto:${contactEmail}`} className="jito-btn jito-btn--primary">
                <Mail size={15} /> {contactEmail}
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="jito-btn jito-btn--ghost">
                <ArrowUpRight size={15} /> LinkedIn
              </a>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="jito-btn jito-btn--ghost">
                <Download size={15} /> Resume
              </a>
            </div>
            <Link to="/" className="jito-back">Back to the main portfolio</Link>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
