import Image from 'next/image'
import {client} from '@/sanity/lib/client'
import {HOMEPAGE_QUERY} from '@/sanity/queries/homepage'

const FALLBACK = {
  navCtaText: 'Get Started',
  heroTitle: 'The Payments Platform Built for Scale',
  heroSubtitle:
    'Accept payments, manage subscriptions, and grow revenue — all from one unified dashboard.',
  heroCtaText: 'Start for free',
  heroCtaLink: '#',
  logosTitle: 'Trusted by teams at',
  featuresTitle: 'Everything you need to get paid',
  featuresSubtitle: 'Powerful tools to accept payments, detect fraud, and grow your business.',
  features: [
    {
      _key: 'f1',
      title: 'Global Payments',
      description: 'Accept payments in 135+ currencies with automatic local payment methods.',
      image: null,
    },
    {
      _key: 'f2',
      title: 'Smart Analytics',
      description: 'Real-time revenue dashboards and cohort analysis to understand your growth.',
      image: null,
    },
    {
      _key: 'f3',
      title: 'Fraud Protection',
      description: 'AI-powered fraud detection that adapts to your business in real time.',
      image: null,
    },
  ],
  statsTitle: 'Built for businesses that move fast',
  stats: [
    {_key: 's1', number: '$120B+', label: 'Processed annually'},
    {_key: 's2', number: '99.99%', label: 'Uptime SLA'},
    {_key: 's3', number: '135+', label: 'Currencies supported'},
    {_key: 's4', number: '4.2ms', label: 'Avg. API response'},
  ],
  testimonialsTitle: 'Loved by finance teams worldwide',
  testimonials: [
    {
      _key: 't1',
      quote:
        '"Switching to this platform cut our payment failures by 40%. The dashboard alone is worth it."',
      authorName: 'Sarah Chen',
      authorRole: 'CFO, NovaTech',
      authorAvatar: null,
    },
    {
      _key: 't2',
      quote:
        '"We went global in 3 weeks. The multi-currency support and docs are genuinely best-in-class."',
      authorName: 'Marcus Reid',
      authorRole: 'Head of Engineering, Launchpad',
      authorAvatar: null,
    },
    {
      _key: 't3',
      quote:
        '"The fraud detection saved us $200k in the first quarter. Pays for itself immediately."',
      authorName: 'Priya Nair',
      authorRole: 'CEO, CartFlow',
      authorAvatar: null,
    },
  ],
  ctaTitle: 'Ready to grow your revenue?',
  ctaSubtitle: 'Join 10,000+ businesses already using our platform.',
  ctaButtonText: 'Create free account',
  ctaButtonLink: '#',
  footerCopyright: '© 2026 PayFlow Inc. All rights reserved.',
}

function img(url: string | null | undefined, fallback: string, alt: string, w: number, h: number) {
  return (
    <Image
      src={url ?? fallback}
      alt={alt}
      width={w}
      height={h}
      className="object-cover"
      unoptimized={!url}
    />
  )
}

export default async function HomePage() {
  const data = await client.fetch(HOMEPAGE_QUERY, {}, {next: {revalidate: 60}})

  const d = {
    ...FALLBACK,
    ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null)),
    features: data?.features?.length ? data.features : FALLBACK.features,
    stats: data?.stats?.length ? data.stats : FALLBACK.stats,
    testimonials: data?.testimonials?.length ? data.testimonials : FALLBACK.testimonials,
    logos: data?.logos?.length ? data.logos : [],
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="bg-[#0f172a] sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data?.logo?.url ? (
              <Image src={data.logo.url} alt={data.logo.alt ?? 'Logo'} width={120} height={32} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-white font-bold text-xl tracking-tight">PayFlow</span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Products', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <a key={item} href="#" className="text-slate-300 hover:text-white text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
          <a
            href={d.ctaButtonLink}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {d.navCtaText}
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white pt-24 pb-0 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-indigo-600/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              New — Global payouts now in 50+ countries
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              {d.heroTitle}
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">{d.heroSubtitle}</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href={d.heroCtaLink}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {d.heroCtaText}
              </a>
              <a href="#" className="text-slate-300 hover:text-white font-medium px-6 py-3 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                View demo →
              </a>
            </div>
          </div>

          {/* Dashboard screenshot */}
          <div className="relative mx-auto max-w-5xl rounded-t-xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-950/50">
            {data?.heroDashboardImage?.url ? (
              <Image
                src={data.heroDashboardImage.url}
                alt={data.heroDashboardImage.alt ?? 'Dashboard'}
                width={1200}
                height={720}
                className="w-full object-cover"
                priority
              />
            ) : (
              <Image
                src="https://picsum.photos/1200/720?grayscale&blur=1"
                alt="Dashboard preview"
                width={1200}
                height={720}
                className="w-full object-cover opacity-60"
                unoptimized
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Logos ───────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-8">
            {d.logosTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {d.logos.length > 0
              ? d.logos.map((logo: {_key: string; name: string; logo?: {url: string; alt?: string}}) => (
                  <div key={logo._key} className="flex items-center gap-2 text-slate-400 font-semibold text-lg">
                    {logo.logo?.url ? (
                      <Image src={logo.logo.url} alt={logo.logo.alt ?? logo.name} width={80} height={28} className="h-7 w-auto object-contain opacity-60" />
                    ) : (
                      <span>{logo.name}</span>
                    )}
                  </div>
                ))
              : ['Stripe', 'Shopify', 'Notion', 'Linear', 'Vercel', 'Figma'].map((name) => (
                  <span key={name} className="text-slate-400 font-semibold text-base">{name}</span>
                ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{d.featuresTitle}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">{d.featuresSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {d.features.map((feature: {_key: string; title: string; description: string; image?: {url: string; alt?: string} | null}, i: number) => (
              <div key={feature._key} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  {feature.image?.url ? (
                    <Image src={feature.image.url} alt={feature.image.alt ?? feature.title} width={600} height={340} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={`https://picsum.photos/600/340?random=${i + 10}`} alt={feature.title} width={600} height={340} className="w-full h-full object-cover" unoptimized />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">{d.statsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {d.stats.map((stat: {_key: string; number: string; label: string}) => (
              <div key={stat._key} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-bold text-indigo-400">{stat.number}</span>
                <span className="text-slate-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
            {d.testimonialsTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {d.testimonials.map((t: {_key: string; quote: string; authorName: string; authorRole: string; authorAvatar?: {url: string; alt?: string} | null}, i: number) => (
              <div key={t._key} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
                <p className="text-slate-600 text-sm leading-relaxed italic">{t.quote}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    {t.authorAvatar?.url ? (
                      <Image src={t.authorAvatar.url} alt={t.authorAvatar.alt ?? t.authorName} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={`https://picsum.photos/40/40?random=${i + 20}`} alt={t.authorName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    )}
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">{t.authorName}</p>
                    <p className="text-slate-400 text-xs">{t.authorRole}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="bg-indigo-600 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{d.ctaTitle}</h2>
          <p className="text-indigo-200 text-lg mb-8">{d.ctaSubtitle}</p>
          <a
            href={d.ctaButtonLink}
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            {d.ctaButtonText}
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-[#0f172a] border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold text-lg">PayFlow</span>
          <p className="text-slate-500 text-sm">{d.footerCopyright}</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a key={link} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
