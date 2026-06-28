import { useState, useEffect } from 'react'
import { ShieldCheck } from 'lucide-react'
import { supabase, type ConsentRequest } from '../../lib/supabase'
import { AdminPageHeader, AdminTable, PlaceholderSection } from '../../components/AdminLayout'

export default function AdminConsentPage() {
  const [records, setRecords] = useState<ConsentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('consent_requests')
        .select('*')
        .order('created_at', { ascending: false })
      setRecords((data as ConsentRequest[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader
        title="Consent"
        description="Guardian consent requests linked to under-18 submissions."
      />

      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm font-sora text-yellow-800">
        Consent request sending and the public consent form will be built in Phase 5. This page is read-only.
      </div>

      {records.length === 0 && !loading ? (
        <PlaceholderSection
          icon={ShieldCheck}
          title="No consent requests yet."
          note="When a submission is flagged as requiring guardian consent, a consent request will appear here. Sending consent emails via Postmark is planned for Phase 5."
        />
      ) : (
        <AdminTable heads={['Submission ID', 'Guardian email', 'Status', 'Consent type', 'Created', 'Responded']} loading={loading} empty="No consent requests yet.">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-blue-pale/20 transition-colors">
              <td className="px-4 py-3.5 font-sora text-xs text-gray-mid font-mono">{r.submission_id.slice(0, 8)}…</td>
              <td className="px-4 py-3.5 font-sora text-sm text-charcoal">{r.guardian_email}</td>
              <td className="px-4 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${
                  r.status === 'approved' ? 'bg-green-50 text-green-700' :
                  r.status === 'declined' ? 'bg-red-50 text-red-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>{r.status}</span>
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora">
                {r.consent_type ? r.consent_type.join(', ') : '—'}
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
                {r.responded_at ? new Date(r.responded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  )
}
