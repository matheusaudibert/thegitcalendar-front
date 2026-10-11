/**
 * Flags for the language toggle, drawn inline so they need no image requests
 * and stay crisp at any size. Simplified: the shapes and colours are right,
 * the fine detail (the US stars, Brazil's motto band) is left out at 14px.
 */
export function BrazilFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" aria-hidden className={className}>
      <rect width="20" height="14" fill="#009c3b" />
      <path d="M10 1.6 18.2 7 10 12.4 1.8 7z" fill="#ffdf00" />
      <circle cx="10" cy="7" r="3.1" fill="#002776" />
    </svg>
  );
}

const STRIPE = 14 / 13;

export function UsFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" aria-hidden className={className}>
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
        <rect
          key={stripe}
          y={stripe * STRIPE}
          width="20"
          height={STRIPE}
          fill="#b22234"
        />
      ))}
      <rect width="9" height={STRIPE * 7} fill="#3c3b6e" />
    </svg>
  );
}
