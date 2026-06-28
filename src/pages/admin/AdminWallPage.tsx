import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Globe, EyeOff, Star, StarOff, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'
import { supabase, type Story, type StoryCategory } from '../../lib/supabase'
import { AdminPageHeader } from '../../components/AdminLayout'
import { STORY_CATEGORY_LABELS } from '../../lib/publishingRules'

type WallFilter = 'all' | 'published' | 'unpublished' | StoryCategory

const CATEGORY_FILTER_OPTIONS: { value: WallFilter; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'published',   label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  ...Object.entries(STORY_CATEGORY_LABELS).map(([val, label]) => ({
    value: val as WallFilter,
    label,
  })),
]

export default function AdminWallPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<WallFilter>('all')
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadStories = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('stories')
      .select('id, title, excerpt, category, author_display_name, featured, published_at, unpublished_at, media_url, submission_id, sort_order, admin_notes, created_at, updated_at')
      .order('published_at', { ascending: false })
    setStories((data as Story[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadStories() }, [loadStories])

  async function unpublishStory(storyId: string) {
    setActionId(storyId)
    setError(null)

    const { data, error: fnErr } = await supabase.functions.invoke('unpublish-story', {
      body: { story_id: storyId },
    })

    if (fnErr || !data?.success) {
      setError(data?.error ?? fnErr?.message ?? 'Failed to unpublish story.')
      setActionId(null)
      return
    }

    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, unpublished_at: data.unpublished_at } : s
      )
    )
    setActionId(null)
  }

  async function toggleFeatured(story: Story) {
    setActionId(story.id)
    setError(null)
    const newFeatured = !story.featured
    const now = new Date().toISOString()

    const { error: updateErr } = await supabase
      .from('stories')
      .update({ featured: newFeatured, updated_at: now })
      .eq('id', story.id)

    if (updateErr) {
      setError('Failed to update featured status.')
      setActionId(null)
      return
    }

    const userId = (await supabase.auth.getUser()).data.user?.id ?? null
    await supabase.from('audit_logs').insert({
      admin_id: userId,
      action: newFeatured ? 'story_featured' : 'story_unfeatured',
      entity_type: 'stories',
      entity_id: story.id,
      previous_status: null,
      new_status: null,
      notes: `Story ${newFeatured ? 'set as featured' : 'removed from featured'}`,
    })

    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, featured: newFeatured } : s))
    )
    setActionId(null)
  }

  const filtered = stories.filter((s) => {
    if (filter === 'published')   return !s.unpublished_at
    if (filter === 'unpublished') return !!s.unpublished_at
    if (filter === 'all')         return true
    return s.category === filter
  })

  const publishedCount  = stories.filter((s) => !s.unpublished_at).length
  const unpublishedCount = stories.filter((s) => !!s.unpublished_at).length
  const featuredCount   = stories.filter((s) => s.featured && !s.unpublished_at).length

  return (
    <>
      <AdminPageHeader
        title="Wall Manager"
        description="Manage published stories on The Wall."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Published', value: publishedCount, color: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Featured',  value: featuredCount,  color: 'text-gold-dark bg-gold-pale border-yellow-200' },
          { label: 'Unpublished', value: unpublishedCount, color: 'text-gray-600 bg-gray-100 border-gray-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-4 py-3 ${color}`}>
            <p className="text-xl font-sora font-extrabold">{value}</p>
            <p className="text-xs font-sora font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-sora text-red-700">
          <AlertTriangle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Filter + Refresh */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTER_OPTIONS.slice(0, 5).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-sora font-semibold transition-colors ${
                filter === opt.value
                  ? 'bg-blue-mein text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-pale hover:text-blue-mein'
              }`}
            >
              {opt.label}
            </button>
          ))}
          {CATEGORY_FILTER_OPTIONS.length > 5 && (
            <select
              value={CATEGORY_FILTER_OPTIONS.slice(5).some((o) => o.value === filter) ? filter : ''}
              onChange={(e) => { if (e.target.value) setFilter(e.target.value as WallFilter) }}
              className="px-3 py-1.5 rounded-full text-xs font-sora font-semibold bg-gray-100 text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
            >
              <option value="">More categories…</option>
              {CATEGORY_FILTER_OPTIONS.slice(5).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={loadStories}
          className="flex items-center gap-1.5 text-xs font-sora text-gray-mid hover:text-blue-mein transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Globe size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="font-sora text-gray-mid text-sm">No stories match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Story</th>
                <th className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide hidden lg:table-cell">Author</th>
                <th className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((story) => {
                const isUnpublished = !!story.unpublished_at
                const isActioning = actionId === story.id
                return (
                  <tr key={story.id} className={`border-b border-gray-50 last:border-0 hover:bg-blue-pale/20 transition-colors ${isUnpublished ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="font-sora font-semibold text-charcoal text-sm truncate">{story.title}</p>
                      {story.excerpt && (
                        <p className="text-xs text-gray-mid font-sora mt-0.5 truncate">{story.excerpt}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium whitespace-nowrap">
                        {STORY_CATEGORY_LABELS[story.category] ?? story.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="font-sora text-sm text-charcoal">{story.author_display_name}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-mid font-sora whitespace-nowrap">
                        {new Date(story.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {isUnpublished && story.unpublished_at && (
                        <p className="text-xs text-orange-500 font-sora whitespace-nowrap mt-0.5">
                          Unpublished {new Date(story.unpublished_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isUnpublished ? (
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-sora font-medium">Unpublished</span>
                        ) : (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-sora font-medium">Live</span>
                        )}
                        {story.featured && !isUnpublished && (
                          <span className="bg-gold-pale text-gold-dark px-2 py-0.5 rounded-full text-xs font-sora font-semibold">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View on Wall */}
                        {!isUnpublished && (
                          <Link
                            to={`/stories/${story.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on The Wall"
                            className="p-1.5 rounded-lg text-gray-mid hover:text-blue-mein hover:bg-blue-pale transition-colors"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        )}
                        {/* Toggle featured */}
                        {!isUnpublished && (
                          <button
                            onClick={() => toggleFeatured(story)}
                            disabled={isActioning}
                            title={story.featured ? 'Remove from featured' : 'Set as featured'}
                            className="p-1.5 rounded-lg text-gray-mid hover:text-gold-dark hover:bg-yellow-50 transition-colors disabled:opacity-40"
                          >
                            {story.featured ? <StarOff size={13} /> : <Star size={13} />}
                          </button>
                        )}
                        {/* Unpublish */}
                        {!isUnpublished && (
                          <button
                            onClick={() => unpublishStory(story.id)}
                            disabled={isActioning}
                            title="Unpublish from The Wall"
                            className="p-1.5 rounded-lg text-gray-mid hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            {isActioning ? (
                              <span className="w-3 h-3 rounded-full border border-gray-300 border-t-transparent animate-spin block" />
                            ) : (
                              <EyeOff size={13} />
                            )}
                          </button>
                        )}
                        {/* Submission link */}
                        {story.submission_id && (
                          <Link
                            to={`/admin/submissions/${story.submission_id}`}
                            title="View submission"
                            className="p-1.5 rounded-lg text-gray-mid hover:text-blue-mein hover:bg-blue-pale transition-colors"
                          >
                            <span className="text-[10px] font-sora font-semibold">SUB</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
