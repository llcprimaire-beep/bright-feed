// Inline SVG of the Bright Feed sun mark — same geometry as src/app/icon.svg.
// idPrefix keeps gradient ids unique when the mark appears more than once on
// a page (header + footer).
export default function Logo({ size = 28, idPrefix = "bf" }: { size?: number; idPrefix?: string }) {
  const core = `${idPrefix}-core`;
  const ray = `${idPrefix}-ray`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={core} cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#ffe2ae" />
          <stop offset="1" stopColor="#f09a67" />
        </radialGradient>
        <linearGradient id={ray} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f7b280" />
          <stop offset="1" stopColor="#ef9663" />
        </linearGradient>
      </defs>
      <g fill={`url(#${ray})`}>
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x="29.3"
            y="5.5"
            width="5.4"
            height="9.7"
            rx="2.7"
            transform={`rotate(${deg} 32 33)`}
          />
        ))}
        {[45, 135, 225, 315].map((deg) => (
          <rect
            key={deg}
            x="29.3"
            y="8.2"
            width="5.4"
            height="7"
            rx="2.7"
            transform={`rotate(${deg} 32 33)`}
          />
        ))}
      </g>
      <circle cx="32" cy="33" r="13.5" fill={`url(#${core})`} />
      <path
        fill="#b7a4e3"
        d="M50.1 2.7 Q50.74 6.06 54.1 6.7 Q50.74 7.34 50.1 10.7 Q49.46 7.34 46.1 6.7 Q49.46 6.06 50.1 2.7 Z"
      />
      <circle cx="6.4" cy="51.3" r="2.2" fill="#9fd0ae" />
    </svg>
  );
}
