export default function Loader({ full = false }: { full?: boolean }) {
  return (
    <div className={`sig-loader${full ? ' sig-loader--full' : ''}`} role="status" aria-live="polite">
      <svg className="sig-loader__mark" viewBox="0 0 46 44" aria-hidden="true">
        <rect x="0" y="0" width="8" height="44" />
        <rect x="12.5" y="0" width="8" height="44" />
        <rect x="25" y="0" width="8" height="44" />
        <rect x="37.5" y="0" width="8" height="44" />
      </svg>
      <span className="sig-loader__word">Ndouken Theryx</span>
      <span className="sr-only">Loading</span>
    </div>
  );
}
