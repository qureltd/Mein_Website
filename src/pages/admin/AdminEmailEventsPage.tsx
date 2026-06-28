import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { supabase, type EmailEvent, type EmailEventStatus } from '../../lib/supabase'
import { AdminPageHeader, AdminTable } from '../../components/AdminLayout'

const STATUS_COLORS: Record<EmailEventStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  sent:    'bg-green-50 text-green-700',
  failed:  'bg-red-50 text-red-700',
  bounced: 'bg-orange-50 text-orange-700',
}

export default function AdminEmailEventsPage() {
  const [events, setEvents] = useState<EmailEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  async function fetchEvents() {
    setLoading(true)
    let q = supabase.from('email_events').select('id, recipient_email, recipient_name, email_type, template_alias, related_table, related_id, postmark_message_id, status, error_message, sent_at, created_at').order('created_at', { ascending: false }).limit(200)
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    const { data } = await q
    setEvents((data as EmailEvent[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [statusFilter])

  return (
    <>
      <AdminPageHeader title="Email Events" description="Log of all email sends, failures, and bounces." />

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="bounced">Bounced</option>
        </select>
        <button onClick={fetchEvents} className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein font-sora transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <AdminTable
        heads={['Type', 'Recipient', 'Template', 'Status', 'Error', 'Sent at']}
        loading={loading}
        empty="No email events yet."
      >
        {events.map((e) => (
          <tr key={e.id} className="hover:bg-blue-pale/20 transition-colors">
            <td className="px-4 py-3.5">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                {e.email_type.replace(/_/g, ' ')}
              </span>
            </td>
            <td className="px-4 py-3.5">
              <p className="font-sora text-sm text-charcoal">{e.recipient_name || '—'}</p>
              <p className="text-xs text-gray-mid font-sora">{e.recipient_email}</p>
            </td>
            <td className="px-4 py-3.5 text-xs text-gray-mid font-sora font-mono">{e.template_alias || '—'}</td>
            <td className="px-4 py-3.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[e.status]}`}>
                {e.status}
              </span>
            </td>
            <td className="px-4 py-3.5 max-w-[200px]">
              {e.error_message ? (
                <p className="text-xs text-red-600 font-sora truncate" title={e.error_message}>{e.error_message}</p>
              ) : (
                <span className="text-xs text-gray-mid font-sora">—</span>
              )}
            </td>
            <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
              {e.sent_at
                ? new Date(e.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : '—'}
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  )
}
