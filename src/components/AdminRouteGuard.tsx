import { useState, useEffect, createContext, useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase, type AdminUser } from '../lib/supabase'

// Context shared with AdminLayout and page-level role guards
interface AdminUserCtx {
  adminUser: AdminUser | null
  loaded: boolean
}

const AdminUserContext = createContext<AdminUserCtx>({ adminUser: null, loaded: false })

export function useAdminUser(): AdminUserCtx {
  return useContext(AdminUserContext)
}

type GuardState = 'checking' | 'allowed' | 'denied'

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>('checking')
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    async function verify() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        if (!cancelled) setState('denied')
        return
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, last_login, created_at')
        .eq('email', session.user.email)
        .maybeSingle()

      if (error) {
        console.error('[AdminRouteGuard] admin_users lookup failed:', error.message, error.code)
      }

      if (!cancelled) {
        setAdminUser(data as AdminUser | null)
        setState(data ? 'allowed' : 'denied')
      }
    }

    verify()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setState('checking')
      setAdminUser(null)
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

  return (
    <AdminUserContext.Provider value={{ adminUser, loaded: true }}>
      {children}
    </AdminUserContext.Provider>
  )
}

// Wrap a page that requires specific roles. Redirects to /admin if the current
// user's role is not in the allowed list.
export function RequireRole({
  roles,
  children,
}: {
  roles: AdminUser['role'][]
  children: React.ReactNode
}) {
  const { adminUser, loaded } = useAdminUser()

  if (!loaded) return null

  if (!adminUser || !roles.includes(adminUser.role)) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
