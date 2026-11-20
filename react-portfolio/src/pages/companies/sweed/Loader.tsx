export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`ss-loader${full ? ' ss-loader--full' : ''}`} role="status" aria-live="polite">
      <div className="ss-loader__box">
        <span className="ss-loader__code">SPEC // 01</span>
        <div className="ss-loader__bar" aria-hidden="true">
          <span className="ss-loader__fill" />
        </div>
        <span className="ss-loader__word">Ndouken Theryx</span>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
