import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function MobileCtaBanner() {
  const { pathname } = useLocation()

  // On Join page the bottom CTA is page-specific; suppress the global banner
  if (pathname === '/join') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-blue-mein shadow-2xl shadow-blue-mein/40">
      <Link
        to="/make-your-move"
        className="flex items-center justify-center gap-2 w-full py-4 font-sora font-bold text-white text-base tracking-wide"
      >
        Make Your Move
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
