import { OpenMIcon, StickerNote } from './BrandElements'

export default function PortalZone() {
  return (
    <div
      className="relative w-full max-w-[380px] mx-auto select-none"
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
          <OpenMIcon size={120} />
        </div>
      </div>

      {/* ── Sticker: Creating it. (top-left) ── */}
      <div className="absolute -top-5 left-6">
        <StickerNote text="Creating it." rotate={-3} color="blue" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      {/* Arrow from "Creating it." → M center */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: 28, left: 118, width: 60, height: 48 }}
        viewBox="0 0 60 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6C10 10 22 18 36 26C42 29 50 32 54 38"
          stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45"
        />
        <path d="M49 44L54 38L48 36" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      </svg>

      {/* ── Sticker: My move. (bottom-left) ── */}
      <div className="absolute bottom-8 -left-4">
        <StickerNote text="My move." rotate={2} color="gold" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      {/* Arrow from "My move." → M center */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 80, left: 80, width: 64, height: 52 }}
        viewBox="0 0 64 52"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 46C10 36 20 22 32 16C38 13 50 10 58 8"
          stroke="#F4B400" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"
        />
        <path d="M53 4L58 8L53 13" stroke="#F4B400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>

      {/* ── Sticker: Future me. (bottom-right) ── */}
      <div className="absolute bottom-0 right-0">
        <StickerNote text="Future me." rotate={-1.5} color="white" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      {/* Arrow from "Future me." → M center */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: 44, right: 108, width: 56, height: 44 }}
        viewBox="0 0 56 44"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M52 38C44 30 30 22 18 16C12 13 6 10 4 6"
          stroke="#111111" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.22"
        />
        <path d="M8 2L4 6L9 10" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />
      </svg>

      {/* ── Sticker: Building it. (right side — proper sticker, replacing plain text) ── */}
      <div className="absolute top-[14%] -right-10">
        <StickerNote text="Building it." rotate={3} color="white" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      {/* Arrow from "Building it." → M center */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: '18%', right: 72, width: 52, height: 42 }}
        viewBox="0 0 52 42"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M48 6C40 12 28 20 18 26C12 30 6 33 4 36"
          stroke="#111111" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.22"
        />
        <path d="M2 31L4 36L9 33" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />
      </svg>
    </div>
  )
}
