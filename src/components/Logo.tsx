type Props = {
  /** Tailwind class controlling logo color (uses currentColor on the SVG). */
  className?: string;
  /** Hide the wordmark and show only the mark. */
  markOnly?: boolean;
};

/**
 * Zamekly logo: rounded square mark with a stylized Z (referencing the
 * "zamek" — lock — etymology) and the "Zamekly" wordmark next to it.
 *
 * The SVG uses currentColor for the mark fill so the whole logo can be
 * tinted via Tailwind text-* utilities on the wrapping span.
 */
export default function Logo({ className = "text-brand-navy dark:text-white", markOnly = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" className="dark:fill-brand-navy" />
        <path
          d="M10.5 11h11l-11 10h11"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {!markOnly && (
        <span className="text-lg font-semibold tracking-tight">Zamekly</span>
      )}
    </span>
  );
}
