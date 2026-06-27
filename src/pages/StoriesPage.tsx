import { useState, useEffect } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
  StickerNote,
} from '../components/BrandElements'
import { supabase, type Story, type StoryCategory } from '../lib/supabase'

// Short wall-voice labels for card stickers
const categoryWallLabels: Record<StoryCategory, string> = {
  future_self_letters: 'Future Me',
  mein_mover_videos: 'Mover Video',
  youth_stories: 'Youth Voice',
  creative_submissions: 'Creative Move',
  art_gallery: 'Art',
  writing: 'Writing',
  behind_the_scenes: 'Behind the Movement',
  merch_drops: 'Merch',
}

// Full labels for filter pills
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

const categoryRotation: Record<StoryCategory, number> = {
  future_self_letters: -2,
  mein_mover_videos: 1,
  youth_stories: -1,
  creative_submissions: 2,
  art_gallery: -2,
  writing: 1,
  behind_the_scenes: -1,
  merch_drops: 2,
}

const categoryColor: Record<StoryCategory, 'blue' | 'gold'> = {
  future_self_letters: 'gold',
  mein_mover_videos: 'blue',
  youth_stories: 'blue',
  creative_submissions: 'gold',
  art_gallery: 'gold',
  writing: 'blue',
  behind_the_scenes: 'blue',
  merch_drops: 'gold',
}

const filterOptions = [
  { value: 'all', label: 'All Moves' },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
]

function GhostCard({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-blue-mein/30 rounded-2xl bg-blue-pale/20 min-h-[180px] flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <OpenMIcon size={120} />
      </div>
      <span className="relative font-caveat text-xl text-blue-mein">{label}</span>
      <span className="relative mt-1.5 font-sora text-xs text-gray-mid tracking-wide">Coming soon</span>
    </div>
  )
}

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

  const filtered = stories.filter(
    (s) =>
      search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author_display_name.toLowerCase().includes(search.toLowerCase())
  )

  const featuredStory = filtered.find((s) => s.featured) ?? filtered[0]
  const supportingStories = filtered.filter((s) => s.id !== featuredStory?.id)

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <OpenMIcon size={600} className="absolute -right-20 -bottom-10" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <HandwrittenAccent text="The Wall" className="text-xl md:text-2xl block mb-3" />
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
          <FadeUp delay={260}>
            <div className="mt-5">
              <ConsentBadge />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="bg-white border-b border-gray-support sticky top-[64px] md:top-[72px] z-20">
        <div className="container-wide section-padding py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
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
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search moves..."
                className="input-field pl-8 py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WALL CONTENT ─── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-wide section-padding">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-gray-support/40 h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* ── Empty state ── */
            <FadeUp>
              <div className="text-center max-w-2xl mx-auto">
                <HandwrittenAccent text="Nothing here yet." className="text-lg block mb-1" />
                <h3 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                  Your move could live here.
                </h3>
                <p className="mt-4 text-gray-dark font-sora max-w-md mx-auto leading-relaxed">
                  The Wall is where Mein Movers share what they are creating, building, saying, and becoming.
                </p>

                {/* Decorative ghost cards */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <GhostCard label="Future message" />
                  <GhostCard label="Creative move" />
                  <GhostCard label="Story loading..." />
                </div>

                {/* Single focused CTA */}
                <div className="mt-10 flex flex-col items-center gap-4">
                  <Link to="/make-your-move" className="btn-primary inline-flex">
                    Go first. Make a move.
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/future-me"
                    className="text-sm font-sora font-semibold text-blue-mein hover:underline"
                  >
                    Take the Future Me Challenge
                  </Link>
                  <div className="mt-1">
                    <ConsentBadge />
                  </div>
                </div>
              </div>
            </FadeUp>
          ) : (
            <>
              {/* ── Featured card ── */}
              {featuredStory && (
                <FadeUp>
                  <Link
                    to={`/stories/${featuredStory.id}`}
                    className="group block rounded-2xl overflow-hidden bg-charcoal mb-6 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {featuredStory.media_url && (
                        <div className="md:w-2/5 h-56 md:h-auto overflow-hidden flex-shrink-0">
                          <img
                            src={featuredStory.media_url}
                            alt={featuredStory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-7 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-end pr-8">
                          <OpenMIcon size={220} />
                        </div>
                        <div className="relative z-10">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <StickerNote
                              text={categoryWallLabels[featuredStory.category]}
                              rotate={categoryRotation[featuredStory.category]}
                              color={
                                categoryColor[featuredStory.category] === 'gold'
                                  ? 'gold-bold'
                                  : 'white-blue'
                              }
                            />
                            {featuredStory.featured && (
                              <span
                                className="font-caveat text-gold-mein text-sm"
                                style={{ transform: 'rotate(1deg)', display: 'inline-block' }}
                              >
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white leading-snug group-hover:text-gold-mein transition-colors duration-200">
                            {featuredStory.title}
                          </h2>
                          {featuredStory.excerpt && (
                            <p className="mt-3 text-white/65 font-sora text-sm md:text-base leading-relaxed line-clamp-3">
                              {featuredStory.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="relative z-10 mt-6 flex items-center justify-between">
                          <span className="text-sm text-white/50 font-sora">
                            {featuredStory.author_display_name}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-white/70 text-sm font-sora group-hover:text-white transition-colors">
                            Read{' '}
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              )}

              {/* ── Supporting grid ── */}
              {supportingStories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {supportingStories.map((story, i) => (
                    <FadeUp key={story.id} delay={i * 60}>
                      <Link
                        to={`/stories/${story.id}`}
                        className="move-card flex flex-col group h-full"
                      >
                        {story.media_url && (
                          <div className="w-full h-44 rounded-xl bg-gray-support/50 overflow-hidden mb-4">
                            <img
                              src={story.media_url}
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="mb-3">
                          <StickerNote
                            text={categoryWallLabels[story.category]}
                            rotate={categoryRotation[story.category]}
                            color={categoryColor[story.category] === 'gold' ? 'gold' : 'blue'}
                          />
                        </div>
                        {story.featured && (
                          <span
                            className="font-caveat text-gold-mein text-sm mb-1"
                            style={{ transform: 'rotate(-1deg)', display: 'inline-block' }}
                          >
                            ★ Featured
                          </span>
                        )}
                        <h3 className="font-sora font-bold text-charcoal leading-snug group-hover:text-blue-mein transition-colors flex-1">
                          {story.title}
                        </h3>
                        {story.excerpt && (
                          <p className="mt-2 text-sm text-gray-dark leading-relaxed font-sora line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-mid font-sora">
                            {story.author_display_name}
                          </span>
                          <ArrowRight
                            size={16}
                            className="text-blue-mein group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </Link>
                    </FadeUp>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-14 md:py-16 bg-blue-pale">
        <div className="container-wide section-padding text-center max-w-2xl mx-auto">
          <FadeUp>
            <SectionDivider className="mx-auto mb-5" />
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              Your story belongs on this wall.
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Show us what you're creating, saying, and building.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/make-your-move" className="btn-primary inline-flex">
                Make Your Move
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/future-me"
                className="font-sora font-semibold text-sm text-blue-mein hover:underline"
              >
                Take the Future Me Challenge
              </Link>
            </div>
            <div className="mt-5 flex justify-center">
              <ConsentBadge />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
