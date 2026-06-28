import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
  StickerNote,
} from '../components/BrandElements'
import { supabase, type Story, type StoryCategory } from '../lib/supabase'

// ── Story filter config ───────────────────────────────────────────────────────

// Visible filter chips. Only include slugs that map cleanly to real DB categories.
// TODO: Add 'build' and 'represent' chips once matching DB categories exist.
const VISIBLE_FILTERS = [
  { slug: 'all',       label: 'All Moves' },
  { slug: 'future-me', label: 'Future Me' },
  { slug: 'creative',  label: 'Creative' },
  { slug: 'story',     label: 'Stories' },
] as const

type VisibleFilterSlug = typeof VISIBLE_FILTERS[number]['slug']

// All accepted inbound URL slugs (including hidden ones that normalize safely)
const VALID_FILTER_SLUGS = ['all', 'future-me', 'creative', 'story', 'build', 'represent'] as const
type FilterSlug = typeof VALID_FILTER_SLUGS[number]

// Mapping from URL slug to Supabase category column value
const FILTER_TO_DB: Record<FilterSlug, string | null> = {
  'all':        null,
  'future-me':  'future_self_letters',
  'creative':   'creative_submissions',
  'story':      'youth_stories',
  // build and represent normalize to 'all' — no matching DB category yet
  'build':      null,
  'represent':  null,
}

function normalizeStoryFilterParam(raw: string | null): FilterSlug {
  if (!raw) return 'all'
  const s = raw.trim().toLowerCase()
  const aliases: Record<string, FilterSlug> = {
    future:          'future-me',
    'future-message': 'future-me',
    voice:           'story',
    speak:           'story',
    create:          'creative',
    art:             'creative',
    // build and represent are valid params but resolve to all — no visible chip yet
    build:           'build',
    represent:       'represent',
  }
  if (aliases[s]) return aliases[s]
  if ((VALID_FILTER_SLUGS as readonly string[]).includes(s)) return s as FilterSlug
  return 'all'
}

// ── Category display maps ─────────────────────────────────────────────────────

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

// ── Ghost card ────────────────────────────────────────────────────────────────

function GhostCard({
  label,
  accent = 'blue',
  featured = false,
}: {
  label: string
  accent?: 'blue' | 'gold'
  featured?: boolean
}) {
  const isGold = accent === 'gold'
  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed overflow-hidden flex flex-col justify-between select-none bg-white/80 shadow-sm ${
        isGold ? 'border-gold-mein/40' : 'border-blue-mein/40'
      } ${featured ? 'min-h-[220px] md:min-h-[240px]' : 'min-h-[180px]'}`}
    >
      <div
        className={`h-1 w-full ${
          isGold
            ? 'bg-gradient-to-r from-gold-mein/60 to-gold-light/60'
            : 'bg-gradient-to-r from-blue-mein/60 to-blue-light/60'
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <OpenMIcon size={100} />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-6">
        <span className={`font-caveat text-2xl md:text-3xl ${isGold ? 'text-gold-dark' : 'text-blue-mein'}`}>
          {label}
        </span>
        <span className="mt-2 font-sora text-xs text-gray-mid tracking-wide">
          Coming soon
        </span>
      </div>
      <div className="relative z-10 px-5 pb-4">
        <div className={`inline-block w-2 h-2 rounded-full ${isGold ? 'bg-gold-mein/40' : 'bg-blue-mein/40'}`} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterSlug>(() =>
    normalizeStoryFilterParam(searchParams.get('filter'))
  )
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const isFirstMount = useRef(true)

  // Respond to browser back/forward updating the URL param
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    const slug = normalizeStoryFilterParam(searchParams.get('filter'))
    setFilter(slug)
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch stories when filter changes
  useEffect(() => {
    async function fetchStories() {
      setLoading(true)
      let query = supabase
        .from('stories')
        .select('*')
        .order('published_at', { ascending: false })

      const dbCategory = FILTER_TO_DB[filter]
      if (dbCategory) {
        query = query.eq('category', dbCategory)
      }

      const { data, error } = await query
      if (!error && data) {
        setStories(data as Story[])
      }
      setLoading(false)
    }
    fetchStories()
  }, [filter])

  function handleFilterClick(slug: VisibleFilterSlug) {
    setFilter(slug)
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: slug })
    }
  }

  const filtered = stories.filter(
    (s) =>
      search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author_display_name.toLowerCase().includes(search.toLowerCase())
  )

  const featuredStory = filtered.find((s) => s.featured) ?? filtered[0]
  const supportingStories = filtered.filter((s) => s.id !== featuredStory?.id)
  const isEmpty = !loading && filtered.length === 0

  // Determine the active chip slug — build/represent show no active chip (they resolve to all)
  const activeChipSlug: VisibleFilterSlug =
    filter === 'build' || filter === 'represent'
      ? 'all'
      : (filter as VisibleFilterSlug)

  return (
    <div className="with-mobile-cta">

      {/* ─── 1. WALL HERO ────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-12 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <OpenMIcon size={600} className="absolute -right-20 -bottom-10" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <HandwrittenAccent
              text="The Wall."
              className="text-2xl md:text-3xl block mb-3 text-gold-mein"
            />
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-2xl">
              Your story belongs here.
            </h1>
          </FadeUp>
          <FadeUp delay={120}>
            <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl font-sora leading-relaxed">
              A curated space for young people's moves, stories, ideas, art, future messages, and creative energy.
            </p>
          </FadeUp>
          <FadeUp delay={220}>
            <div className="mt-5">
              <ConsentBadge />
            </div>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link to="/make-your-move" className="btn-primary text-sm py-2.5">
                Make Your Move
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/future-me"
                className="text-sm font-sora font-semibold text-white/70 hover:text-white transition-colors"
              >
                Take the Future Me Challenge →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 2. FILTER / SEARCH BAR ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-support sticky top-[64px] md:top-[72px] z-20">
        <div className="container-wide section-padding py-2.5">
          <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 no-scrollbar">
              {VISIBLE_FILTERS.map((opt) => (
                <button
                  key={opt.slug}
                  onClick={() => handleFilterClick(opt.slug)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-sora font-semibold transition-colors duration-200 ${
                    activeChipSlug === opt.slug
                      ? 'bg-blue-mein text-white'
                      : 'bg-gray-support text-gray-dark hover:bg-blue-pale hover:text-blue-mein'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-52 flex-shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search moves..."
                className="input-field pl-8 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. WALL CONTENT ─────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-[#FAFAF8]">
        <div className="container-wide section-padding">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-gray-support/40 h-52 animate-pulse" />
              ))}
            </div>
          ) : isEmpty ? (
            <FadeUp>
              <div className="relative bg-white rounded-3xl border border-blue-mein/15 shadow-xl overflow-hidden px-6 py-10 md:px-12 md:py-14 max-w-4xl mx-auto">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-mein via-gold-light to-gold-mein" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-[0.04]">
                  <OpenMIcon size={380} />
                </div>

                <div className="relative z-10">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <HandwrittenAccent text="This wall is waiting." className="text-xl block mb-2" />
                    <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                      Your move could live here.
                    </h2>
                    <p className="mt-4 text-gray-dark font-sora leading-relaxed">
                      The Wall is where Mein Movers share what they are creating, building, saying, and becoming.
                    </p>
                    <p className="mt-2 text-sm text-gray-mid font-sora">
                      The first stories are coming soon — yours could be one of them.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="sm:col-span-1">
                      <GhostCard label="Future message" accent="gold" featured />
                    </div>
                    <div className="sm:col-span-1">
                      <GhostCard label="Creative move" accent="blue" />
                    </div>
                    <div className="sm:col-span-1">
                      <GhostCard label="Story loading..." accent="blue" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 text-center">
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
                  </div>
                </div>
              </div>
            </FadeUp>
          ) : (
            <>
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
                              color={categoryColor[featuredStory.category] === 'gold' ? 'gold-bold' : 'white-blue'}
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
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              )}

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

      {/* ─── 4. LOWER CTA — only when stories are populated ─────────────────── */}
      {!isEmpty && (
        <section className="py-12 md:py-14 bg-blue-pale">
          <div className="container-wide section-padding text-center max-w-2xl mx-auto">
            <FadeUp>
              <SectionDivider className="mx-auto mb-4" />
              <h2 className="font-sora font-extrabold text-xl md:text-2xl text-charcoal">
                Your story belongs on this wall.
              </h2>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <div className="mt-4 flex justify-center">
                <ConsentBadge />
              </div>
            </FadeUp>
          </div>
        </section>
      )}
    </div>
  )
}
