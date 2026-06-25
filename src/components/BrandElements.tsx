interface OpenMIconProps {
  className?: string
  size?: number
}

export function OpenMIcon({ className = '', size = 40 }: OpenMIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1474 1585"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 1436 35 L 735 458 L 36 80 L 37 1542 L 284 1460 L 285 468 L 732 718 L 1185 450 L 1188 1470 L 1438 1547 Z"
        fill="#2F6BFF"
        fillRule="evenodd"
      />
      <path
        d="M 1054 664 L 841 797 L 841 1353 L 1056 1432 L 1059 667 Z"
        fill="#F4B400"
        fillRule="evenodd"
      />
    </svg>
  )
}

interface MoveCardProps {
  label: string
  color?: 'blue' | 'gold' | 'dark' | 'light'
}

export function MeinTagBadge({ label, color = 'blue' }: MoveCardProps) {
  const colors = {
    blue: 'bg-blue-pale text-blue-mein',
    gold: 'bg-gold-pale text-gold-dark',
    dark: 'bg-charcoal text-white',
    light: 'bg-gray-support text-gray-dark',
  }
  return (
    <span className={`inline-flex items-center text-xs font-sora font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest ${colors[color]}`}>
      {label}
    </span>
  )
}

export function HandwrittenAccent({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`font-caveat text-blue-mein ${className}`}>{text}</span>
  )
}

export function SectionDivider() {
  return <div className="w-10 h-1 bg-blue-mein rounded-full" />
}

export function StarAccent({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 1L12.39 7.26L19 8.27L14.5 12.64L15.78 19L10 15.77L4.22 19L5.5 12.64L1 8.27L7.61 7.26L10 1Z"
        fill="#F4B400"
      />
    </svg>
  )
}

export function ArrowAccent({ className = '' }: { className?: string }) {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className={className}>
      <path
        d="M2 12C2 12 10 6 20 12C24 14.5 28 14 30 12"
        stroke="#2F6BFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 7L30 12L25 17"
        stroke="#2F6BFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
