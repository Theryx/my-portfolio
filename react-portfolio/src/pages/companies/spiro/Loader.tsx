export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`lp-loader${full ? ' lp-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="lp-loader__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path
          className="lp-loader__arc lp-loader__arc--a"
          d="M32 8a24 24 0 0 1 20.8 12"
        />
        <path
          className="lp-loader__arc lp-loader__arc--b"
          d="M32 56a24 24 0 0 1-20.8-12"
        />
        <path className="lp-loader__arrow lp-loader__arrow--a" d="M56 20l-3.6 1.2 3.2 3.4z" />
        <path className="lp-loader__arrow lp-loader__arrow--b" d="M8 44l3.6-1.2-3.2-3.4z" />
      </svg>
      <span className="lp-loader__word">Ndouken Theryx</span>
      <span className="sr-only">Loading</span>
    </div>
  );
}
