import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';
import LedgerRows from './LedgerRows';
import { themeOf } from './media';

interface PracticeItem {
  title: string;
  text: string;
}

interface FlowStep {
  id: string;
  pill: string;
  surface: string;
  problem: string;
  decision: string;
  outcome: string;
  projectId?: string;
}

interface AiSection {
  title?: string;
  lede?: string;
  steps?: PracticeItem[];
  notes?: PracticeItem[];
}

const DEFAULT_FLOWS: FlowStep[] = [
  {
    id: 'kyc',
    pill: '01 Consumer app & KYC',
    surface: 'Android, iOS, Back office',
    problem: 'Identity photo uploads failed silently on common Android browsers, stalling onboarding.',
    decision: 'Replaced file upload with a guided in-app camera and a resumable multi-step KYC summary.',
    outcome: '+40% retention, -60% support tickets',
    projectId: 'paysika_fintech',
  },
  {
    id: 'riders',
    pill: '02 Field riders app',
    surface: 'Cheap Android phones, PWA',
    problem: '15 delivery riders worked across Douala and Yaounde on patchy mobile connections.',
    decision: 'Kept addresses and QR confirmation working without internet while syncing new orders online.',
    outcome: 'Relay handover cut from 30 to 10 min',
    projectId: 'paysika-riders-app',
  },
  {
    id: 'field',
    pill: '03 Field research',
    surface: 'Douala and Yaounde',
    problem: 'Mixpanel showed where users dropped off, but not what confused them in person.',
    decision: 'Spent the last Friday of every month with users and staffed Yaounde fairs to ship fixes.',
    outcome: 'Card sleeve v2 & QR pickup flow',
    projectId: 'paysika-field',
  },
  {
    id: 'ai',
    pill: '04 Claude & Android prototyping',
    surface: 'Expo Android APK & Figma Make',
    problem: 'Static Figma frames hid edge states on real Android devices.',
    decision: 'Used Claude, Figma Make, and Expo to prototype and build installable Android APK builds fast.',
    outcome: 'Real-device testing before engineering',
    projectId: 'ai-side-projects',
  },
];

const FALLBACK_TITLE = "I'm Ndouken, a product designer from Cameroon.";

export default function Home() {
  const { base, company, projects, loading } = useCompany();
  const theme = themeOf(company);
  const practice = (Array.isArray(theme.practice) ? theme.practice : []) as PracticeItem[];
  const flowsRaw = (Array.isArray(theme.flows) ? theme.flows : DEFAULT_FLOWS) as FlowStep[];
  const flows = flowsRaw.length > 0 ? flowsRaw : DEFAULT_FLOWS;
  const ai = (theme.ai && typeof theme.ai === 'object' ? theme.ai : null) as AiSection | null;
  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);

  const activeFlow = flows[activeFlowIndex] ?? flows[0];

  return (
    <>
      <section className="lg-hero">
        <p className="lg-mono-label">Product designer · Douala · English and French</p>
        <h1 className="lg-hero__title">{company?.hero_title || FALLBACK_TITLE}</h1>
        {company?.hero_subtitle && <p className="lg-hero__lede">{company.hero_subtitle}</p>}
        <div className="lg-hero__actions">
          <Link to={`${base}/work`} className="lg-btn">See the work</Link>
          <a href={`mailto:${email}`} className="lg-btn lg-btn--ghost">Email me</a>
        </div>
      </section>

      <section className="lg-flowstrip" aria-labelledby="lg-flow-head">
        <div className="lg-flowstrip__top">
          <h2 id="lg-flow-head" className="lg-mono-label">Mobile flow log</h2>
          <div className="lg-flowstrip__pills" role="tablist" aria-label="Mobile work highlights">
            {flows.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={i === activeFlowIndex}
                className={`lg-pill${i === activeFlowIndex ? ' is-active' : ''}`}
                onClick={() => setActiveFlowIndex(i)}
              >
                {f.pill}
              </button>
            ))}
          </div>
        </div>
        {activeFlow && (
          <div className="lg-flowstrip__panel" role="tabpanel">
            <dl className="lg-flowstrip__grid">
              <div>
                <dt>Surface</dt>
                <dd>{activeFlow.surface}</dd>
              </div>
              <div>
                <dt>Friction</dt>
                <dd>{activeFlow.problem}</dd>
              </div>
              <div>
                <dt>Design move</dt>
                <dd>{activeFlow.decision}</dd>
              </div>
              <div>
                <dt>Receipt</dt>
                <dd className="lg-flowstrip__outcome">{activeFlow.outcome}</dd>
              </div>
            </dl>
            {activeFlow.projectId && projects.some((p) => p.id === activeFlow.projectId) && (
              <Link to={`${base}/work/${activeFlow.projectId}`} className="lg-textlink">
                Read the case study
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="lg-section" aria-labelledby="lg-work-head">
        <div className="lg-section__head">
          <h2 id="lg-work-head" className="lg-h2">{(theme.work_title as string) || 'Selected work'}</h2>
          <Link to={`${base}/work`} className="lg-textlink">All work</Link>
        </div>
        {typeof theme.work_lede === 'string' && <p className="lg-section__lede">{theme.work_lede}</p>}
        {loading && projects.length === 0 ? <Loader /> : <LedgerRows projects={projects} base={base} company={company} />}
      </section>

      {practice.length > 0 && (
        <section className="lg-section" aria-labelledby="lg-practice-head">
          <div className="lg-section__head">
            <h2 id="lg-practice-head" className="lg-h2">{company?.philosophy_title || 'How I work on mobile'}</h2>
          </div>
          {company?.philosophy_text && <p className="lg-section__lede">{company.philosophy_text}</p>}
          <ol className="lg-practice">
            {practice.map((s, i) => (
              <li key={s.title} className="lg-practice__item">
                <span className="lg-practice__no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {ai && (ai.steps?.length ?? 0) > 0 && (
        <section className="lg-section" aria-labelledby="lg-ai-head">
          <div className="lg-section__head">
            <h2 id="lg-ai-head" className="lg-h2">{ai.title || 'Prototyping with Claude and Expo'}</h2>
          </div>
          {ai.lede && <p className="lg-section__lede">{ai.lede}</p>}
          <ol className="lg-ai">
            {ai.steps!.map((s, i) => (
              <li key={s.title} className="lg-ai__step">
                <span className="lg-ai__no">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {(ai.notes?.length ?? 0) > 0 && (
            <dl className="lg-ai__notes">
              {ai.notes!.map((n) => (
                <div key={n.title}>
                  <dt>{n.title}</dt>
                  <dd>{n.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      <section className="lg-contact">
        <p className="lg-mono-label">Contact</p>
        <h2 className="lg-contact__title">Say hello</h2>
        <p className="lg-contact__text">Email is the quickest way to reach me, in English or French.</p>
        <a className="lg-btn lg-btn--invert" href={`mailto:${email}`}>{email}</a>
      </section>
    </>
  );
}
