import { useState, useEffect } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase, type Story, type StoryCategory } from '../lib/supabase'

const categoryLabels: Record<StoryCategory, string> = {
  future_self_letters: 'Future-Self Letters',
  mein_mover_videos: 'Mein Mover Videos',
  youth_stories: 'Youth Stories',
  creative_submissions: 'Creative Work',
  art_gallery: 'Art Gallery',
  writing: 'Writing',
  behind_the_scenes: 'Behind the Scenes',
  merch_drops: 'Merch Drops',
}

const filterOptions = [
  { value: 'all', label: 'All Stories' },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
]

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchStories() {
      setLoading(true)
      let query = supabase
        .from('stories')
        .select('*')
        .order('published_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('category', filter)
      }

      const { data, error } = await query
      if (!error && data) {
        setStories(data as Story[])
      }
      setLoading(false)
    }
    fetchStories()
  }, [filter])

  const filtered = stories.filter((s) =>
    search === '' ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.author_display_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <OpenMIcon size={600} className="absolute -right-20 -bottom-10" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <span className="inline-flex items-center text-xs font-sora font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest bg-white/10 text-white mb-5">
              The Wall
            </span>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-white leading-tight">
              Real moves.<br />
              <HandwrittenAccent text="Real stories." className="text-5xl md:text-6xl text-gold-mein" />
              <br />Real futures.
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-white/70 text-lg max-w-xl font-sora">
              See what young people are creating, saying, building, and becoming through Mein.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="bg-white border-b border-gray-support sticky top-[64px] md:top-[72px] z-20">
        <div className="container-wide section-padding py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {filterOptions.slice(0, 6).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-sora font-semibold transition-colors duration-200 ${
                    filter === opt.value
                      ? 'bg-blue-mein text-white'
                      : 'bg-gray-support text-gray-dark hover:bg-blue-pale hover:text-blue-mein'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="input-field pl-8 py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STORIES GRID ─── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-wide section-padding">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-gray-support/40 h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <FadeUp>
              <div className="text-center py-20">
                <OpenMIcon size={80} className="mx-auto mb-6 opacity-20" />
                <h3 className="font-sora font-bold text-2xl text-charcoal">
                  The first Mein stories are coming soon.
                </h3>
                <HandwrittenAccent
                  text="Want yours to be one of them?"
                  className="text-xl block mt-3"
                />
                <p className="mt-4 text-gray-dark font-sora max-w-md mx-auto">
                  Be part of the first wave of Mein Movers to share their story on the wall.
                </p>
                <Link to="/make-your-move" className="mt-8 btn-primary inline-flex">
                  Make Your Move
                  <ArrowRight size={16} />
                </Link>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((story, i) => (
                <FadeUp key={story.id} delay={i * 60}>
                  <div className="move-card flex flex-col group">
                    {story.media_url && (
                      <div className="w-full h-44 rounded-xl bg-gray-support/50 overflow-hidden mb-4">
                        <img
                          src={story.media_url}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="tag-badge mb-3 self-start">
                      {categoryLabels[story.category]}
                    </span>
                    {story.featured && (
                      <span className="tag-badge-gold mb-2 self-start">Featured</span>
                    )}
                    <h3 className="font-sora font-bold text-charcoal leading-snug group-hover:text-blue-mein transition-colors">
                      {story.title}
                    </h3>
                    {story.excerpt && (
                      <p className="mt-2 text-sm text-gray-dark leading-relaxed font-sora line-clamp-2">
                        {story.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-mid font-sora">{story.author_display_name}</span>
                      <ArrowRight size={16} className="text-blue-mein group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-blue-pale">
        <div className="container-wide section-padding text-center max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              Your story belongs on this wall.
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Show us what you're creating, saying, and building.
            </p>
            <Link to="/make-your-move" className="mt-7 btn-primary inline-flex">
              Make Your Move
              <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
