import { useState, useEffect } from 'react'
import { Layers } from 'lucide-react'
import { supabase, type Story } from '../../lib/supabase'
import { AdminPageHeader, AdminTable, PlaceholderSection } from '../../components/AdminLayout'

export default function AdminWallPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .order('published_at', { ascending: false })
      setStories((data as Story[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader
        title="The Wall"
        description="Published stories and content on the public Wall."
      />

      <div className="mb-6 bg-blue-pale border border-blue-mein/20 rounded-xl px-4 py-3 text-sm font-sora text-blue-mein">
        Wall publishing and content preparation will be built in Phase 6. This page is read-only.
      </div>

      {stories.length === 0 && !loading ? (
        <PlaceholderSection
          icon={Layers}
          title="No published stories yet."
          note="Approved submissions can be published to The Wall once the Phase 6 publishing workflow is complete."
        />
      ) : (
        <AdminTable heads={['Title', 'Author', 'Category', 'Featured', 'Published', 'Sort']} loading={loading} empty="No stories yet.">
          {stories.map((s) => (
            <tr key={s.id} className="hover:bg-blue-pale/20 transition-colors">
              <td className="px-4 py-3.5">
                <p className="font-sora font-medium text-charcoal text-sm">{s.title}</p>
                {s.excerpt && <p className="text-xs text-gray-mid font-sora mt-0.5 truncate max-w-[200px]">{s.excerpt}</p>}
              </td>
              <td className="px-4 py-3.5 font-sora text-sm text-charcoal">{s.author_display_name}</td>
              <td className="px-4 py-3.5">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                  {s.category.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3.5">
                {s.featured ? (
                  <span className="bg-gold-pale text-gold-dark px-2 py-0.5 rounded-full text-xs font-sora font-semibold">Featured</span>
                ) : (
                  <span className="text-xs text-gray-mid font-sora">—</span>
                )}
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
                {new Date(s.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{s.sort_order}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  )
}
