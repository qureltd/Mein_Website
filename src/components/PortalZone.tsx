import { OpenMIcon, StickerNote } from './BrandElements'

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

      {/* ── Sticker: Creating it. (top-left) ── */}
      <div className="absolute -top-6 left-4">
        <StickerNote text="Creating it." rotate={-3} color="blue" className="text-lg px-5 py-2.5 font-bold shadow-xl" />
      </div>
      {/* Chunky blue arrow accent below "Creating it." — points energetically right-downward */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: 38, left: 26, width: 56, height: 44 }}
        viewBox="0 0 56 44"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 38C8 26 20 14 40 10"
          stroke="#2F6BFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M35 4L40 10L34 16"
          stroke="#2F6BFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        />
      </svg>

      {/* ── Sticker: My move. (bottom-left) ── */}
      <div className="absolute bottom-10 -left-5">
        <StickerNote text="My move." rotate={2} color="gold" className="text-lg px-5 py-2.5 font-bold shadow-xl" />
      </div>
      {/* Gold starburst accent above-right of "My move." */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 104, left: 78, width: 34, height: 34 }}
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#F4B400" strokeWidth="2.8" strokeLinecap="round" opacity="0.85">
          <line x1="17" y1="2" x2="17" y2="32" />
          <line x1="2" y1="17" x2="32" y2="17" />
          <line x1="6" y1="6" x2="28" y2="28" />
          <line x1="28" y1="6" x2="6" y2="28" />
          <line x1="17" y1="2" x2="20" y2="7" />
          <line x1="32" y1="17" x2="27" y2="14" />
        </g>
      </svg>

      {/* ── Sticker: Future me. (bottom-right) ── */}
      <div className="absolute -bottom-2 right-0">
        <StickerNote text="Future me." rotate={-1.5} color="white" className="text-lg px-5 py-2.5 font-bold shadow-xl" />
      </div>
      {/* Charcoal curved swoosh accent above "Future me." */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 52, right: 14, width: 64, height: 22 }}
        viewBox="0 0 64 22"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 18C12 6 28 2 44 8C52 12 58 10 62 6"
          stroke="#2A2A2A"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.28"
        />
      </svg>

      {/* ── Sticker: Building it. (right side) ── */}
      <div className="absolute top-[13%] -right-12">
        <StickerNote text="Building it." rotate={3} color="white" className="text-lg px-5 py-2.5 font-bold shadow-xl" />
      </div>
      {/* Checker/flag accent below "Building it." */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: '30%', right: 50, width: 28, height: 28 }}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        {/* 3×3 checker: dark on corners + center, light on edges */}
        <rect x="1"  y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.45" />
        <rect x="11" y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.12" />
        <rect x="21" y="1"  width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.45" />
        <rect x="1"  y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.12" />
        <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.45" />
        <rect x="21" y="11" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.12" />
        <rect x="1"  y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.45" />
        <rect x="11" y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.12" />
        <rect x="21" y="21" width="8" height="8" rx="1.5" fill="#2A2A2A" opacity="0.45" />
      </svg>
    </div>
  )
}
