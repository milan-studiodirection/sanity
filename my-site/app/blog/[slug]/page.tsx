import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from 'next-sanity'
import type {PortableTextComponents} from 'next-sanity'
import {createDataAttribute} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {urlFor, shimmerBlur} from '@/sanity/lib/image'
import {POST_QUERY, POST_SLUGS_QUERY} from '@/sanity/queries/posts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import CopyButton from '@/app/components/CopyButton'

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params
  const {data: post} = await sanityFetch({query: POST_QUERY, params: {slug}, stega: false})
  if (!post) return {}
  const title = post.seo?.metaTitle ?? post.title ?? 'Blog Post'
  const description = post.seo?.metaDescription ?? post.excerpt ?? ''
  const ogImage = post.seo?.ogImage?.asset
    ? urlFor(post.seo.ogImage).width(1200).height(630).format('webp').quality(90).url()
    : post.coverImage?.asset
      ? urlFor(post.coverImage).width(1200).height(630).format('webp').quality(90).url()
      : undefined
  return {
    title,
    description,
    openGraph: {title, description, ...(ogImage && {images: [ogImage]})},
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function makeAttr(id: string) {
  return (path: string) => createDataAttribute({id, type: 'post', path}).toString()
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return match?.[1] ?? null
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="text-slate-700 leading-relaxed mb-5">{children}</p>,
    h2: ({children}) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-indigo-400 pl-5 my-6 text-slate-500 italic">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => (
      <code className="bg-slate-100 text-indigo-700 rounded px-1.5 py-0.5 text-sm font-mono">{children}</code>
    ),
    link: ({value, children}) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
        {children}
      </a>
    ),
  },
  types: {
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="rounded-xl overflow-hidden">
            <Image
              src={urlFor(value).width(900).height(500).format('webp').quality(85).url()}
              alt={value.alt ?? ''}
              width={900}
              height={500}
              className="w-full object-cover"
              placeholder="blur"
              blurDataURL={shimmerBlur(900, 500)}
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-slate-400 text-sm mt-3 italic">{value.caption}</figcaption>
          )}
        </figure>
      )
    },

    callToAction: ({value}) => {
      const isDark = value.style === 'dark'
      return (
        <div className={`my-10 rounded-2xl p-8 text-center ${isDark ? 'bg-[#0f172a] text-white' : 'bg-indigo-600 text-white'}`}>
          <p className="text-xl font-bold mb-2">{value.title}</p>
          {value.subtitle && (
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-indigo-200'}`}>{value.subtitle}</p>
          )}
          {value.buttonText && value.buttonUrl && (
            <a
              href={value.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block font-semibold px-6 py-3 rounded-lg transition-colors text-sm ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-white hover:bg-indigo-50 text-indigo-600'
              }`}
            >
              {value.buttonText}
            </a>
          )}
        </div>
      )
    },

    codeBlock: ({value}) => {
      if (!value?.code) return null
      return (
        <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/10 text-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              {(value.filename || value.language) && (
                <span className="text-xs text-slate-400 font-mono ml-2">
                  {value.filename ?? value.language}
                </span>
              )}
            </div>
            <CopyButton code={value.code} />
          </div>
          <pre className="p-5 overflow-x-auto leading-relaxed">
            <code className="font-mono text-slate-200 text-[13px]">{value.code}</code>
          </pre>
        </div>
      )
    },

    youtubeEmbed: ({value}) => {
      if (!value?.url) return null
      const videoId = getYouTubeId(value.url)
      if (!videoId) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={value.caption ?? 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-slate-400 text-sm mt-3 italic">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

export async function generateStaticParams() {
  const {data: slugs} = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return slugs?.map((s: {slug: string}) => ({slug: s.slug})) ?? []
}

export default async function PostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const {data: post} = await sanityFetch({query: POST_QUERY, params: {slug}})

  if (!post) notFound()

  const attr = makeAttr(post._id)

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />

      <main className="flex-1">
        {/* Cover image */}
        {post.coverImage?.asset && (
          <div className="w-full h-72 md:h-96 overflow-hidden bg-slate-100">
            <Image
              src={urlFor(post.coverImage).width(1400).height(600).format('webp').quality(90).url()}
              alt={post.coverImage.alt ?? post.title ?? ''}
              width={1400}
              height={600}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL={shimmerBlur(1400, 600)}
              priority
            />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-6 py-14">
          {/* Categories */}
          {post.categories?.length ? (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.categories.map((cat: string) => (
                <span key={cat} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          ) : null}

          {/* Title */}
          <h1 data-sanity={attr('title')} className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {post.author?.avatar?.asset ? (
                <Image
                  src={urlFor(post.author.avatar).width(80).height(80).format('webp').quality(85).url()}
                  alt={post.author.avatar.alt ?? post.author.name ?? ''}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  placeholder="blur"
                  blurDataURL={shimmerBlur(40, 40)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  {post.author?.name?.[0] ?? '?'}
                </div>
              )}
              <div>
                <p data-sanity={attr('author')} className="text-slate-900 font-semibold text-sm">
                  {post.author?.name}
                </p>
                {post.author?.role && <p className="text-slate-400 text-xs">{post.author.role}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm ml-auto">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readTime && (
                <span data-sanity={attr('readTime')} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {post.readTime} min read
                </span>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p data-sanity={attr('excerpt')} className="text-lg text-slate-500 leading-relaxed mb-8 italic border-l-4 border-indigo-200 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Body */}
          {post.body && (
            <div data-sanity={attr('body')}>
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          )}

          {/* Author bio */}
          {post.author && (
            <div className="mt-14 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6">
                {post.author.avatar?.asset ? (
                  <Image
                    src={urlFor(post.author.avatar).width(112).height(112).format('webp').quality(85).url()}
                    alt={post.author.avatar.alt ?? post.author.name ?? ''}
                    width={56}
                    height={56}
                    className="rounded-full object-cover shrink-0"
                    placeholder="blur"
                    blurDataURL={shimmerBlur(56, 56)}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold shrink-0">
                    {post.author.name?.[0] ?? '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 font-semibold text-sm">{post.author.name}</p>
                  {post.author.role && <p className="text-indigo-600 text-xs mb-2">{post.author.role}</p>}
                  {post.author.bio && <p className="text-slate-500 text-sm leading-relaxed">{post.author.bio}</p>}
                  {(post.author.twitter || post.author.linkedin) && (
                    <div className="flex gap-4 mt-3">
                      {post.author.twitter && (
                        <a href={`https://x.com/${post.author.twitter}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 text-xs transition-colors">
                          @{post.author.twitter}
                        </a>
                      )}
                      {post.author.linkedin && (
                        <a href={post.author.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 text-xs transition-colors">
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">
              ← Back to all posts
            </Link>
          </div>
        </article>

        {/* Related posts */}
        {post.relatedPosts?.length ? (
          <section className="bg-slate-50 border-t border-slate-100 py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Continue reading</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {post.relatedPosts.map((related: {
                  _id: string
                  title: string
                  slug: string
                  excerpt?: string | null
                  coverImage?: {asset?: unknown; alt?: string | null} | null
                  publishedAt?: string | null
                  readTime?: number | null
                  author?: {name?: string | null; avatar?: {asset?: unknown; alt?: string | null} | null} | null
                }) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      {related.coverImage?.asset ? (
                        <Image
                          src={urlFor(related.coverImage as Parameters<typeof urlFor>[0]).width(400).height(225).format('webp').quality(80).url()}
                          alt={related.coverImage.alt ?? related.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL={shimmerBlur(400, 225)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-100" />
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-slate-900 font-semibold text-sm leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{related.excerpt}</p>
                      )}
                      <div className="mt-auto flex items-center gap-2 text-xs text-slate-400">
                        {related.author?.avatar?.asset ? (
                          <Image
                            src={urlFor(related.author.avatar as Parameters<typeof urlFor>[0]).width(32).height(32).format('webp').url()}
                            alt={related.author.avatar.alt ?? related.author.name ?? ''}
                            width={16}
                            height={16}
                            className="rounded-full object-cover"
                          />
                        ) : null}
                        {related.author?.name && <span>{related.author.name}</span>}
                        {related.readTime && <span>· {related.readTime} min</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
