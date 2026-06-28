import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent } from '../components/BrandElements'
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

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [related, setRelated] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchStory() {
      setLoading(true)

      const { data, error } = await supabase
        .from('stories')
        .select('id, title, excerpt, category, author_display_name, featured, published_at, unpublished_at, media_url, submission_id')
        .eq('id', id)
        .is('unpublished_at', null)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setStory(data as Story)

      const { data: relatedData } = await supabase
        .from('stories')
        .select('id, title, excerpt, category, author_display_name, featured, published_at, media_url, submission_id')
        .eq('category', data.category)
        .neq('id', id)
        .is('unpublished_at', null)
        .limit(3)

      setRelated((relatedData as Story[]) || [])
      setLoading(false)
    }

    fetchStory()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound || !story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-20">
        <OpenMIcon size={64} className="mb-6 opacity-20" />
        <h1 className="font-sora font-extrabold text-3xl text-charcoal">Story not found</h1>
        <p className="mt-3 text-gray-dark font-sora">This story may have been moved or removed.</p>
        <Link to="/wall" className="mt-7 btn-primary inline-flex">
          Back to The Wall
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const content = story.excerpt ?? ''
  const publishedDate = new Date(story.published_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const authorInitial = story.author_display_name.charAt(0).toUpperCase()

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <OpenMIcon size={500} className="absolute -right-20 -bottom-10" />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <Link
              to="/wall"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-sora transition-colors mb-8"
            >
              <ArrowLeft size={15} />
              Back to The Wall
            </Link>
          </FadeUp>

          <FadeUp delay={60}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center bg-white/10 text-white text-xs font-sora font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
                {categoryLabels[story.category]}
              </span>
              {story.featured && (
                <span className="inline-flex items-center bg-gold-mein/20 text-gold-mein text-xs font-sora font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-white leading-tight">
              {story.title}
            </h1>
          </FadeUp>

          <FadeUp delay={140}>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/50 font-sora">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-mein/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">{authorInitial}</span>
                </div>
                <span className="text-white/80">{story.author_display_name}</span>
              </div>
              <span>·</span>
              <span>{publishedDate}</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── CONTENT ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide section-padding max-w-2xl mx-auto">
          {story.media_url && (
            <FadeUp>
              <div className="rounded-2xl overflow-hidden mb-10 border border-gray-support">
                <img
                  src={story.media_url}
                  alt={story.title}
                  className="w-full object-cover max-h-[28rem]"
                />
              </div>
            </FadeUp>
          )}

          <FadeUp>
            <p className="font-sora text-charcoal text-base md:text-lg leading-[1.85] whitespace-pre-wrap">
              {content}
            </p>
          </FadeUp>

          <FadeUp delay={120}>
            <div className="mt-14 pt-8 border-t-2 border-gray-support flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-pale flex items-center justify-center flex-shrink-0">
                <span className="font-sora font-bold text-blue-mein text-lg leading-none">{authorInitial}</span>
              </div>
              <div>
                <p className="font-sora font-semibold text-charcoal">{story.author_display_name}</p>
                <p className="text-xs text-gray-mid font-sora mt-0.5">{publishedDate}</p>
              </div>
              <Link
                to="/wall"
                className="ml-auto text-xs font-sora font-semibold text-blue-mein hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                The Wall
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── RELATED STORIES ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-support/30">
          <div className="container-wide section-padding">
            <FadeUp>
              <div className="mb-10 text-center">
                <SectionDivider />
                <h2 className="mt-4 font-sora font-extrabold text-2xl text-charcoal">
                  More {categoryLabels[story.category]}
                </h2>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((s, i) => (
                <FadeUp key={s.id} delay={i * 70}>
                  <Link to={`/stories/${s.id}`} className="move-card flex flex-col group h-full">
                    {s.media_url && (
                      <div className="w-full h-36 rounded-xl bg-gray-support/50 overflow-hidden mb-4">
                        <img
                          src={s.media_url}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="tag-badge mb-3 self-start text-xs">{categoryLabels[s.category]}</span>
                    <h3 className="font-sora font-bold text-charcoal leading-snug group-hover:text-blue-mein transition-colors flex-1">
                      {s.title}
                    </h3>
                    {s.excerpt && (
                      <p className="mt-2 text-xs text-gray-dark leading-relaxed font-sora line-clamp-2">{s.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-mid font-sora">{s.author_display_name}</span>
                      <ArrowRight size={14} className="text-blue-mein group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-pale">
        <div className="container-wide section-padding text-center max-w-2xl mx-auto">
          <FadeUp>
            <div className="flex justify-center gap-2 mb-5">
              <StarAccent />
              <StarAccent />
            </div>
            <HandwrittenAccent
              text="Inspired? Make your own move."
              className="text-2xl md:text-3xl block mb-4"
            />
            <p className="text-gray-dark font-sora mb-7">
              You have a story, a creation, or an idea waiting to be shared. This wall is yours too.
            </p>
            <Link to="/make-your-move" className="btn-primary inline-flex">
              Make Your Move
              <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
