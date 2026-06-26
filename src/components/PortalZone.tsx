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

      {/* Sticker notes — larger, readable pill labels */}
      <div className="absolute -top-5 left-6">
        <StickerNote text="Creating it." rotate={-3} color="blue" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      <div className="absolute bottom-8 -left-4">
        <StickerNote text="My move." rotate={2} color="gold" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>
      <div className="absolute bottom-0 right-0">
        <StickerNote text="Future me." rotate={-1.5} color="white" className="text-base px-4 py-2 font-semibold shadow-lg" />
      </div>

      {/* Movement fragment — larger, higher contrast */}
      <div className="absolute top-[14%] -right-8">
        <span className="font-caveat text-base font-semibold text-charcoal leading-none">
          Building it.
        </span>
      </div>

      {/* Small orbit accent dots */}
      <div className="absolute top-[9%] right-[22%] w-2.5 h-2.5 rounded-full bg-gold-mein" />
      <div className="absolute bottom-[18%] left-[9%] w-2 h-2 rounded-full bg-blue-mein/50" />
    </div>
  )
}
