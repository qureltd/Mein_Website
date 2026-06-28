import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { supabase, type ContactMessage, type ContactMessageStatus } from '../../lib/supabase'
import { AdminPageHeader, AdminTable } from '../../components/AdminLayout'

const STATUS_COLORS: Record<ContactMessageStatus, string> = {
  new:         'bg-blue-pale text-blue-mein',
  read:        'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-50 text-yellow-700',
  resolved:    'bg-green-50 text-green-700',
  archived:    'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  new: 'New', read: 'Read', in_progress: 'In Progress', resolved: 'Resolved', archived: 'Archived',
}

const TYPE_LABELS: Record<string, string> = {
  young_person: 'Young person', parent: 'Parent', school: 'School',
  organisation: 'Organisation', creator: 'Creator', shop: 'Shop', general: 'General',
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [updating, setUpdating] = useState(false)

  async function fetchMessages() {
    setLoading(true)
    let q = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    const { data } = await q
    setMessages((data as ContactMessage[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [statusFilter])

  async function updateStatus(id: string, status: ContactMessageStatus) {
    setUpdating(true)
    await supabase.from('contact_messages').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setUpdating(false)
    await fetchMessages()
    if (selected?.id === id) setSelected((m) => m ? { ...m, status } : null)
  }

  return (
    <>
      <AdminPageHeader title="Contact Messages" description="Messages submitted via the Contact and Schools pages." />

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={fetchMessages} className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein font-sora transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <AdminTable heads={['From', 'Type', 'Subject', 'Status', 'Date', '']} loading={loading} empty="No messages found.">
        {messages.map((msg) => (
          <tr key={msg.id} className="hover:bg-blue-pale/20 transition-colors">
            <td className="px-4 py-3.5">
              <p className="font-sora font-medium text-charcoal text-sm">{msg.name || '—'}</p>
              <p className="text-xs text-gray-mid font-sora">{msg.email}</p>
            </td>
            <td className="px-4 py-3.5">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                {TYPE_LABELS[msg.contact_type] ?? msg.contact_type}
              </span>
            </td>
            <td className="px-4 py-3.5 max-w-[200px]">
              <p className="text-sm font-sora text-charcoal truncate">{msg.subject || '—'}</p>
              <p className="text-xs text-gray-mid font-sora truncate mt-0.5">{msg.message.slice(0, 60)}…</p>
            </td>
            <td className="px-4 py-3.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[msg.status]}`}>
                {STATUS_LABELS[msg.status]}
              </span>
            </td>
            <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
              {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-4 py-3.5">
              <button onClick={() => setSelected(msg)} className="text-xs text-blue-mein hover:underline font-sora">View</button>
            </td>
          </tr>
        ))}
      </AdminTable>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                  {TYPE_LABELS[selected.contact_type] ?? selected.contact_type}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-mid">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">From</p>
                  <p className="font-sora text-charcoal">{selected.name || '—'}</p>
                  <p className="text-xs text-gray-mid font-sora">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Received</p>
                  <p className="font-sora text-charcoal text-xs">{new Date(selected.created_at).toLocaleString('en-GB')}</p>
                </div>
              </div>
              {selected.subject && (
                <div>
                  <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Subject</p>
                  <p className="font-sora text-sm text-charcoal">{selected.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm font-sora text-charcoal leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {selected.message}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Update status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as ContactMessageStatus[]).map((s) => (
                    <button
                      key={s}
                      disabled={updating || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sora font-semibold border transition-colors ${
                        selected.status === s
                          ? 'border-blue-mein bg-blue-mein text-white'
                          : 'border-gray-200 bg-white text-charcoal hover:border-blue-mein hover:text-blue-mein'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
