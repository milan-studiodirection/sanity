import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {urlFor, shimmerBlur} from '@/sanity/lib/image'
import {TAG_QUERY, TAG_SLUGS_QUERY, POSTS_BY_TAG_QUERY} from '@/sanity/queries/tags'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const colorMap: Record<string, {bg: string; text: string}> = {
  indigo: {bg: 'bg-indigo-50', text: 'text-indigo-600'},
  blue: {bg: 'bg-blue-50', text: 'text-blue-600'},
  green: {bg: 'bg-green-50', text: 'text-green-600'},
  red: {bg: 'bg-red-50', text: 'text-red-600'},
  orange: {bg: 'bg-orange-50', text: 'text-orange-600'},
  purple: {bg: 'bg-purple-50', text: 'text-purple-600'},
  pink: {bg: 'bg-pink-50', text: 'text-pink-600'},
}

function getColor(color?: string | null) {
  return colorMap[color ?? 'indigo'] ?? colorMap.indigo
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({query: TAG_SLUGS_QUERY, perspective: 'published', stega: false})
  return (data ?? []).filter((t) => t.slug != null).map((t) => ({slug: t.slug as string}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const {data: tag} = await sanityFetch({query: TAG_QUERY, params: {slug}, stega: false})
  if (!tag) return {}
  return {
    title: `${tag.name} | Blog | PayFlow`,
    description: tag.description ?? `Posts tagged with ${tag.name}`,
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function TagPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [{data: tag}, ] = await Promise.all([
    sanityFetch({query: TAG_QUERY, params: {slug}}),
  ])

  if (!tag) notFound()

  const {data: posts} = await sanityFetch({
    query: POSTS_BY_TAG_QUERY,
    params: {tagId: tag._id},
  })

  const color = getColor(tag.color)

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />

      {/* ── Hero ── */}
      <section className="bg-[#0f172a] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-block text-slate-400 text-sm mb-6 hover:text-white transition-colors"
          >
            ← Back to Blog
          </Link>
          <div
            className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 ${color.bg} ${color.text}`}
          >
            Tag
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{tag.name}</h1>
          {tag.description && (
            <p className="text-slate-400 text-lg">{tag.description}</p>
          )}
          <p className="text-slate-500 text-sm mt-4">
            {posts?.length ?? 0} {posts?.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </section>

      {/* ── Posts Grid ── */}
      <main className="flex-1 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {!posts?.length ? (
            <p className="text-center text-slate-400 py-20">No posts with this tag yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {post.coverImage?.asset ? (
                      <Image
                        src={urlFor(post.coverImage).width(600).height(340).format('webp').quality(85).url()}
                        alt={post.coverImage.alt ?? post.title ?? ''}
                        width={600}
                        height={340}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL={shimmerBlur(600, 340)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center">
                        <span className="text-slate-300 text-4xl">✍️</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-6 gap-3">
                    {post.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((t) => {
                          const c = getColor(t.color)
                          return (
                            <span
                              key={t._id}
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}
                            >
                              {t.name}
                            </span>
                          )
                        })}
                      </div>
                    ) : null}

                    <h2 className="text-slate-900 font-bold text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {post.author?.avatar?.asset ? (
                          <Image
                            src={urlFor(post.author.avatar).width(56).height(56).format('webp').quality(85).url()}
                            alt={post.author.avatar.alt ?? post.author.name ?? ''}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                            placeholder="blur"
                            blurDataURL={shimmerBlur(28, 28)}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            {post.author?.name?.[0] ?? '?'}
                          </div>
                        )}
                        <span className="text-slate-600 text-xs font-medium">{post.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                        {post.readTime && <span>· {post.readTime} min read</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
