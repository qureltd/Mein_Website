import { Settings } from 'lucide-react'
import { AdminPageHeader, PlaceholderSection } from '../../components/AdminLayout'

const PLACEHOLDER_SECTIONS = [
  { title: 'Admin users', note: 'Manage admin accounts, roles, and access. Will be built in a hardening phase.' },
  { title: 'Email settings', note: 'Configure Postmark templates, sender addresses, and notification preferences.' },
  { title: 'Consent text version', note: 'Manage the versioned consent language shown to guardians during the consent flow.' },
  { title: 'Community rules version', note: 'Update and version the community rules displayed on the public Community Rules page.' },
  { title: 'Shop display settings', note: 'Control drop countdown timers, early access windows, and shop visibility.' },
]

export default function AdminSettingsPage() {
  return (
    <>
      <AdminPageHeader title="Settings" description="Platform configuration for Mein." />

      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm font-sora text-yellow-800">
        Settings editing will be implemented in a future hardening phase. All sections below are placeholders.
      </div>

      <div className="space-y-4">
        {PLACEHOLDER_SECTIONS.map((s) => (
          <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <Settings size={15} className="text-gray-mid" />
              <p className="font-sora font-semibold text-sm text-charcoal">{s.title}</p>
            </div>
            <p className="text-xs text-gray-mid font-sora leading-relaxed">{s.note}</p>
          </div>
        ))}
      </div>
    </>
  )
}
