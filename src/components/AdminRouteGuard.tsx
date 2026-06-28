import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type GuardState = 'checking' | 'allowed' | 'denied'

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>('checking')
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    async function verify() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        if (!cancelled) setState('denied')
        return
      }

      // Check the authenticated user is in admin_users
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle()

      if (!cancelled) setState(data ? 'allowed' : 'denied')
    }

    verify()

    // Re-run on auth state changes (logout triggers re-check)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setState('checking')
      verify()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
      </div>
    )
  }

  if (state === 'denied') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
