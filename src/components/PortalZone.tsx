import { OpenMIcon, StickerNote, MovementFragment } from './BrandElements'

export default function PortalZone() {
  return (
    <div
      className="relative w-full max-w-[360px] mx-auto select-none"
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

      {/* Sticker notes positioned around the orbit */}
      <div className="absolute -top-3 left-4">
        <StickerNote text="Creating it." rotate={-3} color="blue" />
      </div>
      <div className="absolute bottom-10 -left-1">
        <StickerNote text="My move." rotate={2} color="gold" />
      </div>
      <div className="absolute bottom-4 right-2">
        <StickerNote text="Future me." rotate={-1.5} color="white" />
      </div>

      {/* Movement fragment */}
      <div className="absolute top-[16%] -right-6">
        <MovementFragment text="Building it." className="text-sm text-gray-mid" />
      </div>

      {/* Small orbit accent dots */}
      <div className="absolute top-[9%] right-[22%] w-2 h-2 rounded-full bg-gold-mein" />
      <div className="absolute bottom-[18%] left-[9%] w-1.5 h-1.5 rounded-full bg-blue-mein/50" />
    </div>
  )
}
