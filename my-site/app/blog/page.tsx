import Image from 'next/image'
import Link from 'next/link'
import {createDataAttribute} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {urlFor, shimmerBlur} from '@/sanity/lib/image'
import {ALL_POSTS_QUERY} from '@/sanity/queries/posts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export const metadata = {
  title: 'Blog | PayFlow',
  description: 'Product news, engineering deep-dives, and fintech perspectives from the PayFlow team.',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function postAttr(id: string, path: string): string {
  return createDataAttribute({id, type: 'post', path}).toString()
}

export default async function BlogPage() {
  const {data: posts} = await sanityFetch({query: ALL_POSTS_QUERY})

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />

      {/* ── Hero ── */}
      <section className="bg-[#0f172a] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-indigo-600/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Insights & Updates
          </h1>
          <p className="text-slate-400 text-lg">
            Product news, engineering deep-dives, and fintech perspectives from the PayFlow team.
          </p>
        </div>
      </section>

      {/* ── Posts Grid ── */}
      <main className="flex-1 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {!posts?.length ? (
            <p className="text-center text-slate-400 py-20">No posts yet — check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Cover image */}
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

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-6 gap-3">
                    {/* Categories */}
                    {post.categories?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((cat: string) => (
                          <span
                            key={cat}
                            className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Title */}
                    <h2
                      data-sanity={postAttr(post._id, 'title')}
                      className="text-slate-900 font-bold text-lg leading-snug group-hover:text-indigo-600 transition-colors"
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p
                        data-sanity={postAttr(post._id, 'excerpt')}
                        className="text-slate-500 text-sm leading-relaxed line-clamp-3"
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
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
                        <span
                          data-sanity={postAttr(post._id, 'author')}
                          className="text-slate-600 text-xs font-medium"
                        >
                          {post.author?.name}
                        </span>
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
