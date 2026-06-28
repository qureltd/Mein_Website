import { Link } from 'react-router-dom'
import { OpenMIcon } from '../components/BrandElements'

export default function ConsentPlaceholderPage() {
  return (
    <div className="min-h-screen bg-blue-pale flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8 opacity-20">
          <OpenMIcon size={56} />
        </div>

        <h1 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal mb-4 leading-snug">
          Consent form coming soon
        </h1>

        <p className="font-sora text-gray-dark text-base leading-relaxed mb-8">
          This secure consent link is being prepared. If you received this link, please contact the Mein team for support.
        </p>

        <Link
          to="/contact"
          className="btn-primary inline-flex"
        >
          Contact Mein
        </Link>

        <p className="mt-6 font-sora text-xs text-gray-mid">
          <Link to="/" className="hover:text-blue-mein transition-colors">Return to site</Link>
        </p>
      </div>
    </div>
  )
}
