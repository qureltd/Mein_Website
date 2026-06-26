// Decorative background texture for the Choose Your Move section.
// SVG fragments drawn from the Mein graffiti artwork motifs (crown, star,
// checker flag, smiley, music note, arrows, doodle burst). All elements are
// purely decorative: aria-hidden, pointer-events-none, z-0.

function CrownSvg({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.72)} viewBox="0 0 60 43" fill="none">
      <path
        d="M4 41 L4 22 L17 36 L30 6 L43 36 L56 22 L56 41 L4 41 Z"
        stroke="#F4B400"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Small dots on peaks */}
      <circle cx="30" cy="6" r="2.5" fill="#F4B400" />
      <circle cx="4" cy="22" r="2" fill="#F4B400" />
      <circle cx="56" cy="22" r="2" fill="#F4B400" />
    </svg>
  )
}

function StarBurstSvg({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <path
        d="M30 4 L34 22 L52 16 L42 28 L54 44 L34 38 L30 56 L26 38 L6 44 L18 28 L8 16 L26 22 Z"
        stroke="#2F6BFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="30" r="4" fill="#2F6BFF" />
    </svg>
  )
}

function SmileySvg({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="24" stroke="#F4B400" strokeWidth="2.5" />
      <circle cx="22" cy="25" r="3" fill="#F4B400" />
      <circle cx="38" cy="25" r="3" fill="#F4B400" />
      <path
        d="M18 38 Q30 50 42 38"
        stroke="#F4B400"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function CheckerFlagSvg({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={6 + col * 16}
            y={6 + row * 16}
            width={14}
            height={14}
            fill={(row + col) % 2 === 0 ? '#111111' : 'none'}
            stroke="#111111"
            strokeWidth="1.5"
            rx={1}
          />
        ))
      )}
    </svg>
  )
}

function MusicNoteSvg({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      {/* Stem */}
      <line x1="26" y1="10" x2="26" y2="40" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Note head */}
      <ellipse
        cx="20"
        cy="40"
        rx="8"
        ry="5.5"
        stroke="#2F6BFF"
        strokeWidth="2.5"
        transform="rotate(-20 20 40)"
      />
      {/* Flag */}
      <path
        d="M26 10 L42 6 L42 18 L26 22"
        stroke="#2F6BFF"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function CurvedArrowSvg({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path
        d="M8 50 C8 24 38 8 50 18"
        stroke="#2F6BFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M43 11 L50 18 L43 25"
        stroke="#2F6BFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChunkyArrowSvg({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.65)} viewBox="0 0 54 35" fill="none">
      <rect x="4" y="13" width="30" height="9" rx="2" stroke="#F4B400" strokeWidth="2" />
      <path
        d="M30 8 L50 17.5 L30 27"
        stroke="#F4B400"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DoodleBurstSvg({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* X mark */}
      <line x1="11" y1="11" x2="21" y2="21" stroke="#F4B400" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="11" x2="11" y2="21" stroke="#F4B400" strokeWidth="2.5" strokeLinecap="round" />
      {/* Scattered dots */}
      <circle cx="30" cy="10" r="2.5" fill="#2F6BFF" />
      <circle cx="33" cy="23" r="2" fill="#F4B400" />
      <circle cx="9" cy="31" r="2" fill="#2F6BFF" />
      <circle cx="26" cy="35" r="2.5" fill="#F4B400" />
      {/* Small 4-point star */}
      <path
        d="M33 31 L35 27 L37 31 L33 29 L37 27 L35 31 L33 27 L37 29 Z"
        fill="#2F6BFF"
      />
    </svg>
  )
}

export default function MeinEnergyTexture() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/*
        ── DESKTOP FRAGMENTS (md+) ──────────────────────────────────────
        Sit in the padding margins around the card grid — not over headings
        or card bodies. The cards render above this layer at z-10.
      */}

      {/* Crown — top-right, partially above section edge */}
      <div
        className="absolute hidden md:block"
        style={{ top: '-3%', right: '7%', opacity: 0.08, transform: 'rotate(7deg)' }}
      >
        <CrownSvg size={72} />
      </div>

      {/* Checker flag — top-right corner, partially clipped off-screen */}
      <div
        className="absolute hidden md:block"
        style={{ top: '4%', right: '-2%', opacity: 0.07, transform: 'rotate(14deg)' }}
      >
        <CheckerFlagSvg size={90} />
      </div>

      {/* Star burst — left edge, card row height */}
      <div
        className="absolute hidden md:block"
        style={{ left: '-1%', top: '32%', opacity: 0.07, transform: 'rotate(-12deg)' }}
      >
        <StarBurstSvg size={80} />
      </div>

      {/* Curved arrow — top-left, inside section padding zone */}
      <div
        className="absolute hidden md:block"
        style={{ left: '2%', top: '9%', opacity: 0.09, transform: 'rotate(0deg)' }}
      >
        <CurvedArrowSvg size={58} />
      </div>

      {/* Music note — bottom-left */}
      <div
        className="absolute hidden md:block"
        style={{ left: '3%', bottom: '7%', opacity: 0.07, transform: 'rotate(-14deg)' }}
      >
        <MusicNoteSvg size={54} />
      </div>

      {/* Smiley — right edge, lower half */}
      <div
        className="absolute hidden md:block"
        style={{ right: '1%', bottom: '14%', opacity: 0.08, transform: 'rotate(-6deg)' }}
      >
        <SmileySvg size={66} />
      </div>

      {/* Doodle burst — above card grid, right of centre heading (safe zone) */}
      <div
        className="absolute hidden md:block"
        style={{ right: '15%', top: '-1%', opacity: 0.08, transform: 'rotate(18deg)' }}
      >
        <DoodleBurstSvg size={40} />
      </div>

      {/* Chunky arrow — bottom-right */}
      <div
        className="absolute hidden md:block"
        style={{ right: '5%', bottom: '5%', opacity: 0.08, transform: 'rotate(9deg)' }}
      >
        <ChunkyArrowSvg size={56} />
      </div>

      {/*
        ── MOBILE FRAGMENTS (< md only) ─────────────────────────────────
        Fewer, smaller, lower opacity — corner-only so no interference
        with card text or section heading.
      */}

      {/* Small star — top-right corner */}
      <div
        className="absolute md:hidden"
        style={{ top: '2%', right: '3%', opacity: 0.06, transform: 'rotate(14deg)' }}
      >
        <StarBurstSvg size={30} />
      </div>

      {/* Small chunky arrow — bottom-left */}
      <div
        className="absolute md:hidden"
        style={{ bottom: '4%', left: '2%', opacity: 0.06, transform: 'rotate(-4deg)' }}
      >
        <ChunkyArrowSvg size={28} />
      </div>
    </div>
  )
}
