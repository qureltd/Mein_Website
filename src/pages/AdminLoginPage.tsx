import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { OpenMIcon } from '../components/BrandElements'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // If already authenticated and in admin_users, skip to dashboard
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', session.user.email)
          .maybeSingle()
        if (data) {
          navigate('/admin', { replace: true })
          return
        }
      }
      setChecking(false)
    }
    checkSession()
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data.session) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Check the signed-in user exists in admin_users
    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', data.session.user.email)
      .maybeSingle()

    if (!adminRecord) {
      await supabase.auth.signOut()
      setError('You do not have admin access.')
      setLoading(false)
      return
    }

    navigate('/admin', { replace: true })
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <OpenMIcon size={36} />
          <span className="font-sora font-bold text-xl text-white">Mein Admin</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="font-sora font-extrabold text-xl text-charcoal mb-1">Sign in</h1>
          <p className="font-sora text-sm text-gray-mid mb-7">Admin access only.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sora text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-field"
                placeholder="admin@mein.co"
              />
            </div>

            <div>
              <label className="block font-sora text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-mid hover:text-charcoal transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-sora text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-sora text-xs text-white/30">
          Not an admin? <a href="/" className="text-white/50 hover:text-white transition-colors">Return to site</a>
        </p>
      </div>
    </div>
  )
}
