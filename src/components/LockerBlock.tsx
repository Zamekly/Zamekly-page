type Status = "free" | "busy" | "maintenance";

const STATUS_COLOR: Record<Status, string> = {
  free: "#10b981", // emerald-500
  busy: "#ef4444", // red-500
  maintenance: "#f59e0b", // amber-500
};

/**
 * Schematic front view of a Zamekly block: a central kiosk (centralita)
 * with touchscreen, camera, card reader and speaker, flanked by 12 lockers
 * — each with its mini exterior screen and status indicator. Purely
 * decorative: aria-hidden, no text content read by screen readers.
 */
export default function LockerBlock({ className = "" }: { className?: string }) {
  // Locker positions (4 columns of 2, centralita in the middle column).
  // Each locker is 70w × 110h. Rows at y = 80, 202, 324.
  const lockers: Array<{ x: number; y: number; status: Status }> = [
    // Left side
    { x: 56, y: 80, status: "free" },
    { x: 134, y: 80, status: "busy" },
    { x: 56, y: 202, status: "busy" },
    { x: 134, y: 202, status: "free" },
    { x: 56, y: 324, status: "maintenance" },
    { x: 134, y: 324, status: "free" },
    // Right side
    { x: 356, y: 80, status: "free" },
    { x: 434, y: 80, status: "busy" },
    { x: 356, y: 202, status: "maintenance" },
    { x: 434, y: 202, status: "free" },
    { x: 356, y: 324, status: "free" },
    { x: 434, y: 324, status: "free" },
  ];

  return (
    <svg
      viewBox="0 0 560 520"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="screen-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1f3a" />
          <stop offset="1" stopColor="#1a3358" />
        </linearGradient>
        <linearGradient id="block-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1f3a" stopOpacity="0.04" />
          <stop offset="1" stopColor="#0b1f3a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="280" cy="492" rx="220" ry="10" fill="#0b1f3a" opacity="0.07" />

      {/* Solar panel + mount */}
      <rect x="180" y="32" width="200" height="12" rx="2" fill="#1a3358" />
      <rect x="184" y="34" width="192" height="8" rx="1" fill="#0b1f3a" opacity="0.55" />
      <line x1="230" y1="44" x2="230" y2="62" stroke="#1a3358" strokeWidth="2" strokeLinecap="round" />
      <line x1="330" y1="44" x2="330" y2="62" stroke="#1a3358" strokeWidth="2" strokeLinecap="round" />

      {/* Main block frame */}
      <rect
        x="40"
        y="64"
        width="480"
        height="412"
        rx="20"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <rect x="40" y="64" width="480" height="80" rx="20" fill="url(#block-shadow)" />

      {/* Lockers */}
      {lockers.map((l, i) => (
        <Locker key={i} x={l.x} y={l.y} status={l.status} />
      ))}

      {/* Centralita */}
      <Centralita />

      {/* Base / floor strip */}
      <rect x="40" y="464" width="480" height="12" rx="3" fill="#f1f5f9" />
      <line x1="56" y1="470" x2="504" y2="470" stroke="#cbd5e1" strokeWidth="1" />
    </svg>
  );
}

function Locker({ x, y, status }: { x: number; y: number; status: Status }) {
  const color = STATUS_COLOR[status];
  return (
    <g>
      {/* Door */}
      <rect
        x={x}
        y={y}
        width="70"
        height="110"
        rx="6"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />
      {/* Mini exterior screen */}
      <rect x={x + 8} y={y + 10} width="54" height="22" rx="3" fill="#0b1f3a" />
      <rect x={x + 12} y={y + 15} width="20" height="2.5" rx="1.25" fill="#ffffff" opacity="0.55" />
      <rect x={x + 12} y={y + 22} width="28" height="3" rx="1.5" fill={color} />
      {/* Door seam */}
      <line
        x1={x + 56}
        y1={y + 48}
        x2={x + 56}
        y2={y + 78}
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Status indicator dot */}
      <circle cx={x + 35} cy={y + 90} r="3.5" fill={color} />
      <circle cx={x + 35} cy={y + 90} r="3.5" fill={color} opacity="0.25" />
    </g>
  );
}

function Centralita() {
  // Centralita body x=212 y=80 w=136 h=354
  return (
    <g>
      {/* Body */}
      <rect
        x="212"
        y="80"
        width="136"
        height="354"
        rx="12"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />

      {/* Camera */}
      <circle cx="280" cy="100" r="6.5" fill="#0b1f3a" />
      <circle cx="280" cy="100" r="3" fill="#1a3358" />
      <circle cx="280" cy="100" r="1.2" fill="#ffffff" opacity="0.7" />

      {/* Touchscreen */}
      <rect
        x="224"
        y="116"
        width="112"
        height="190"
        rx="8"
        fill="url(#screen-gradient)"
      />

      {/* Screen UI: title bar */}
      <rect x="234" y="126" width="60" height="4" rx="2" fill="#ffffff" opacity="0.7" />
      <rect x="234" y="135" width="34" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />

      {/* Screen UI: mini grid of lockers (mirroring real status) */}
      <g>
        {/* Row 1 */}
        <rect x="234" y="150" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        <rect x="254" y="150" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="274" y="150" width="16" height="20" rx="2" fill="#ef4444" opacity="0.9" />
        <rect x="294" y="150" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="314" y="150" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        {/* Row 2 */}
        <rect x="234" y="174" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="254" y="174" width="16" height="20" rx="2" fill="#f59e0b" opacity="0.9" />
        <rect x="274" y="174" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        <rect x="294" y="174" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="314" y="174" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        {/* Row 3 */}
        <rect x="234" y="198" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        <rect x="254" y="198" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="274" y="198" width="16" height="20" rx="2" fill="#ffffff" opacity="0.18" />
        <rect x="294" y="198" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
        <rect x="314" y="198" width="16" height="20" rx="2" fill="#10b981" opacity="0.9" />
      </g>

      {/* Screen UI: time selector pill row */}
      <rect x="234" y="234" width="32" height="14" rx="7" fill="#ffffff" opacity="0.18" />
      <rect x="270" y="234" width="32" height="14" rx="7" fill="#ffffff" opacity="0.85" />
      <rect x="306" y="234" width="24" height="14" rx="7" fill="#ffffff" opacity="0.18" />

      {/* Screen UI: CTA button */}
      <rect x="244" y="270" width="84" height="22" rx="11" fill="#ffffff" />
      <rect x="262" y="278" width="48" height="6" rx="3" fill="#0b1f3a" />

      {/* Speaker holes */}
      <g fill="#94a3b8">
        <circle cx="250" cy="322" r="1.6" />
        <circle cx="258" cy="322" r="1.6" />
        <circle cx="266" cy="322" r="1.6" />
        <circle cx="274" cy="322" r="1.6" />
        <circle cx="286" cy="322" r="1.6" />
        <circle cx="294" cy="322" r="1.6" />
        <circle cx="302" cy="322" r="1.6" />
        <circle cx="310" cy="322" r="1.6" />
      </g>

      {/* Card reader slot */}
      <rect x="234" y="336" width="92" height="26" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="244" y="345" width="72" height="6" rx="2" fill="#94a3b8" />

      {/* Subtle Zamekly wordmark bar at the bottom */}
      <rect x="248" y="404" width="64" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="270" y="414" width="20" height="6" rx="3" fill="#0b1f3a" opacity="0.85" />
    </g>
  );
}
