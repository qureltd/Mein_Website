import { OpenMIcon, StickerNote } from './BrandElements'

const STICKER = 'text-xl px-6 py-3 font-bold rounded-xl'

export default function PortalZone() {
  return (
    <div
      className="relative w-full max-w-[420px] mx-auto select-none"
      style={{ aspectRatio: '1' }}
      aria-hidden="true"
    >
      {/* Outer dashed orbit ring */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-mein/20 animate-spin-slow" />

      {/* Inner dashed orbit ring */}
      <div className="absolute inset-[14%] rounded-full border border-dashed border-gold-mein/30 animate-spin-slow-reverse" />

      {/* Center soft glow */}
      <div className="absolute inset-[28%] rounded-full bg-blue-pale blur-2xl opacity-70" />

      {/* Open M icon — centered, floating */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <OpenMIcon size={130} />
        </div>
      </div>

      {/* ── Creating it. (top-left) — white with blue border, corner fold ── */}
      <div className="absolute -top-8 left-2">
        <StickerNote
          text="Creating it."
          rotate={-4}
          color="white-blue"
          fold
          className={STICKER}
        />
      </div>
      {/* Chunky blue arrow below the sticker, curving into portal energy zone */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: 42, left: 28, width: 56, height: 44 }}
        viewBox="0 0 56 44"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 38C8 26 20 14 40 10" stroke="#2F6BFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M35 4L40 10L34 16" stroke="#2F6BFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      </svg>

      {/* ── My move. (bottom-left) — gold with dark gold border, corner fold ── */}
      <div className="absolute bottom-14 -left-8">
        <StickerNote
          text="My move."
          rotate={2.5}
          color="gold-bold"
          fold
          className={STICKER}
        />
      </div>
      {/* Gold starburst accent above-right of the sticker */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 124, left: 82, width: 34, height: 34 }}
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#C8930A" strokeWidth="2.8" strokeLinecap="round" opacity="0.8">
          <line x1="17" y1="2" x2="17" y2="32" />
          <line x1="2" y1="17" x2="32" y2="17" />
          <line x1="6" y1="6" x2="28" y2="28" />
          <line x1="28" y1="6" x2="6" y2="28" />
        </g>
      </svg>

      {/* ── Future me. (bottom-right) — off-white with gray border ── */}
      <div className="absolute -bottom-6 -right-4">
        <StickerNote
          text="Future me."
          rotate={-2}
          color="offwhite"
          className={STICKER}
        />
      </div>
      {/* Charcoal curved swoosh accent above the sticker */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 56, right: 18, width: 68, height: 24 }}
        viewBox="0 0 68 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 20C12 8 28 2 46 8C54 12 62 10 66 6"
          stroke="#2A2A2A"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.26"
        />
      </svg>

      {/* ── Building it. (right) — white with charcoal border ── */}
      <div className="absolute top-[8%] -right-16">
        <StickerNote
          text="Building it."
          rotate={3.5}
          color="white-dark"
          className={STICKER}
        />
      </div>
      {/* Checker accent below the sticker */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: '27%', right: 52, width: 28, height: 28 }}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect x="1"  y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.42" />
        <rect x="11" y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.1"  />
        <rect x="21" y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.42" />
        <rect x="1"  y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.1"  />
        <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.42" />
        <rect x="21" y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.1"  />
        <rect x="1"  y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.42" />
        <rect x="11" y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.1"  />
        <rect x="21" y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.42" />
      </svg>
    </div>
  )
}
