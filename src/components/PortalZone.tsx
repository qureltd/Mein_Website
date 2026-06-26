import { OpenMIcon } from './BrandElements'

const stickers = [
  {
    src: '/assets/icons/ChatGPT_Image_Jun_26,_2026,_01_15_08_PM_(1).png',
    alt: 'Creating it.',
    rotate: -4,
    className: 'absolute -top-8 left-2',
  },
  {
    src: '/assets/icons/ChatGPT_Image_Jun_26,_2026,_01_15_09_PM_(2).png',
    alt: 'My move.',
    rotate: 2.5,
    className: 'absolute bottom-14 -left-8',
  },
  {
    src: '/assets/icons/ChatGPT_Image_Jun_26,_2026,_01_15_09_PM_(3).png',
    alt: 'Building it.',
    rotate: 3.5,
    className: 'absolute top-[8%] -right-16',
  },
  {
    src: '/assets/icons/ChatGPT_Image_Jun_26,_2026,_01_15_10_PM_(4).png',
    alt: 'Future me.',
    rotate: -2,
    className: 'absolute -bottom-6 -right-4',
  },
]

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

      {/* PNG sticker images */}
      {stickers.map(({ src, alt, rotate, className }) => (
        <div key={alt} className={className}>
          <img
            src={src}
            alt={alt}
            width={155}
            draggable={false}
            className="pointer-events-none"
            style={{ transform: `rotate(${rotate}deg)` }}
          />
        </div>
      ))}
    </div>
  )
}
