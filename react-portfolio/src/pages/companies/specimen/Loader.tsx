import './site.css';

// No blue on this site, so the chips stay warm, green and neutral.
const CHIPS = ['#F2C14E', '#C9A27A', '#3F7D6E', '#E2431D', '#151515'];

// A stack of colour chips that fans open and closes again. The full version
// stands alone (it shows before the shell loads), so it carries the .sp scope.
export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`sp-loader${full ? ' sp sp-loader--full' : ''}`} role="status" aria-live="polite">
      <div className="sp-loader__fan" aria-hidden="true">
        {CHIPS.map((c, i) => (
          <span key={c} className="sp-loader__chip" style={{ background: c, ['--i' as string]: i }} />
        ))}
      </div>
      {full && <span className="sp-loader__label">Ndouken Theryx</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
