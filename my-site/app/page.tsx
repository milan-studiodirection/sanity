import type {Metadata} from 'next'
import Image from 'next/image'
import {createDataAttribute} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {urlFor, shimmerBlur} from '@/sanity/lib/image'
import {HOMEPAGE_QUERY} from '@/sanity/queries/homepage'
import Header from './components/Header'
import Footer from './components/Footer'
import AnimateIn from './components/AnimateIn'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: HOMEPAGE_QUERY, stega: false})
  const title = data?.seo?.metaTitle ?? 'PayFlow — Payments Platform Built for Scale'
  const description = data?.seo?.metaDescription ?? 'Accept payments, manage subscriptions, and grow revenue — all from one unified dashboard.'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(data?.seo?.ogImage?.asset && {
        images: [urlFor(data.seo.ogImage).width(1200).height(630).format('webp').quality(90).url()],
      }),
    },
  }
}

const FALLBACK = {
  navCtaText: 'Get Started',
  heroTitle: 'The Payments Platform Built for Scale',
  heroSubtitle: 'Accept payments, manage subscriptions, and grow revenue — all from one unified dashboard.',
  heroCtaText: 'Start for free',
  heroCtaLink: '#',
  logosTitle: 'Trusted by teams at',
  featuresTitle: 'Everything you need to get paid',
  featuresSubtitle: 'Powerful tools to accept payments, detect fraud, and grow your business.',
  features: [
    {_key: 'f1', title: 'Global Payments', description: 'Accept payments in 135+ currencies with automatic local payment methods.', image: null},
    {_key: 'f2', title: 'Smart Analytics', description: 'Real-time revenue dashboards and cohort analysis to understand your growth.', image: null},
    {_key: 'f3', title: 'Fraud Protection', description: 'AI-powered fraud detection that adapts to your business in real time.', image: null},
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
    {_key: 't1', quote: '"Switching to this platform cut our payment failures by 40%. The dashboard alone is worth it."', authorName: 'Sarah Chen', authorRole: 'CFO, NovaTech', authorAvatar: null},
    {_key: 't2', quote: '"We went global in 3 weeks. The multi-currency support and docs are genuinely best-in-class."', authorName: 'Marcus Reid', authorRole: 'Head of Engineering, Launchpad', authorAvatar: null},
    {_key: 't3', quote: '"The fraud detection saved us $200k in the first quarter. Pays for itself immediately."', authorName: 'Priya Nair', authorRole: 'CEO, CartFlow', authorAvatar: null},
  ],
  ctaTitle: 'Ready to grow your revenue?',
  ctaSubtitle: 'Join 10,000+ businesses already using our platform.',
  ctaButtonText: 'Create free account',
  ctaButtonLink: '#',
  footerCopyright: '© 2026 PayFlow Inc. All rights reserved.',
  howItWorksTitle: 'Get started in minutes',
  howItWorksSubtitle: 'From signup to first payment in under an hour.',
  howItWorksSteps: [
    {_key: 'h1', step: 1, icon: '🔐', title: 'Create an account', description: 'Sign up in seconds — no credit card required. Connect your bank and verify your identity to start accepting payments.'},
    {_key: 'h2', step: 2, icon: '⚡', title: 'Integrate our API', description: 'Drop in our SDK for any language. Detailed docs and sample code get you from zero to processing in under an hour.'},
    {_key: 'h3', step: 3, icon: '💸', title: 'Start getting paid', description: 'Accept payments globally, track revenue in real time, and receive automatic payouts to your bank account.'},
  ],
  pricingTitle: 'Simple, transparent pricing',
  pricingSubtitle: 'No hidden fees. Start free and scale as you grow.',
  pricingPlans: [
    {_key: 'p1', name: 'Starter', price: '$0', period: '/month', description: 'For individuals and early-stage startups.', features: ['Up to $10k/month volume', '2.9% + 30¢ per transaction', '1 team member', 'Basic analytics', 'Email support'], ctaText: 'Start for free', ctaLink: '#', highlighted: false},
    {_key: 'p2', name: 'Growth', price: '$49', period: '/month', description: 'For growing businesses that need more power and lower rates.', features: ['Unlimited volume', '2.4% + 20¢ per transaction', '10 team members', 'Advanced analytics', 'Priority support', 'Custom integrations', 'Fraud protection'], ctaText: 'Start 14-day trial', ctaLink: '#', highlighted: true},
    {_key: 'p3', name: 'Enterprise', price: 'Custom', period: '', description: 'For large-scale businesses with custom requirements.', features: ['Custom pricing', 'Volume discounts', 'Unlimited team members', 'Dedicated account manager', 'SLA guarantee', 'On-premise option', 'Custom contracts'], ctaText: 'Contact sales', ctaLink: '#', highlighted: false},
  ],
  trustTitle: 'Built on a foundation of trust',
  trustSubtitle: 'Enterprise-grade security and compliance built into every transaction.',
  trustBadges: [
    {_key: 'tb1', icon: '🔒', title: 'SOC 2 Type II', description: 'Independently audited for security, availability, and confidentiality.'},
    {_key: 'tb2', icon: '🛡️', title: 'PCI DSS Level 1', description: 'The highest level of PCI compliance for handling card data.'},
    {_key: 'tb3', icon: '✅', title: 'GDPR Compliant', description: 'Full compliance with EU data protection and privacy regulations.'},
    {_key: 'tb4', icon: '⚡', title: '99.99% Uptime SLA', description: 'Contractual guarantee backed by our global infrastructure.'},
  ],
}

function makeAttr(id: string | null | undefined) {
  return function attr(path: string): string | undefined {
    if (!id) return undefined
    return createDataAttribute({id, type: 'homepage', path}).toString()
  }
}

type SanityImg = {asset?: unknown; alt?: string | null} | null | undefined

export default async function HomePage() {
  const {data} = await sanityFetch({query: HOMEPAGE_QUERY})

  const d = {
    ...FALLBACK,
    ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null)),
    features: data?.features?.length ? data.features : FALLBACK.features,
    stats: data?.stats?.length ? data.stats : FALLBACK.stats,
    testimonials: data?.testimonials?.length ? data.testimonials : FALLBACK.testimonials,
    logos: data?.logos?.length ? data.logos : [],
    howItWorksSteps: data?.howItWorksSteps?.length ? data.howItWorksSteps : FALLBACK.howItWorksSteps,
    pricingPlans: data?.pricingPlans?.length ? data.pricingPlans : FALLBACK.pricingPlans,
    trustBadges: data?.trustBadges?.length ? data.trustBadges : FALLBACK.trustBadges,
  }

  const attr = makeAttr(data?._id)

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-[#0f172a] text-white pt-28 pb-0 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="animate-orb absolute -top-32 left-1/4 w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="animate-orb-delayed absolute top-10 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            {/* Badge */}
            <div className="animate-fade-up animate-float inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border border-indigo-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              New — Global payouts now in 50+ countries
            </div>

            <h1
              data-sanity={attr('heroTitle')}
              className="animate-fade-up anim-delay-100 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
            >
              {d.heroTitle}
            </h1>
            <p
              data-sanity={attr('heroSubtitle')}
              className="animate-fade-up anim-delay-200 text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              {d.heroSubtitle}
            </p>

            <div className="animate-fade-up anim-delay-300 flex items-center justify-center gap-4 flex-wrap">
              <a
                href={d.heroCtaLink}
                data-sanity={attr('heroCtaText')}
                className="group relative bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              >
                {d.heroCtaText}
              </a>
              <a href="#" className="text-slate-300 hover:text-white font-medium px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/30 transition-all hover:-translate-y-0.5">
                Watch demo →
              </a>
            </div>
          </div>

          {/* Dashboard image */}
          <div className="animate-fade-up anim-delay-400 relative mx-auto max-w-5xl rounded-t-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-950/60">
            <div className="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/10 pointer-events-none z-10" />
            {data?.heroDashboardImage?.asset ? (
              <Image
                src={urlFor(data.heroDashboardImage).width(1200).height(720).format('webp').quality(90).url()}
                alt={(data.heroDashboardImage as SanityImg)?.alt ?? 'Dashboard'}
                width={1200}
                height={720}
                className="w-full object-cover"
                placeholder="blur"
                blurDataURL={shimmerBlur(1200, 720)}
                priority
              />
            ) : (
              <Image
                src="https://picsum.photos/1200/720?grayscale&blur=1"
                alt="Dashboard preview"
                width={1200}
                height={720}
                className="w-full object-cover opacity-50"
                unoptimized
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Logos ────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <p
            data-sanity={attr('logosTitle')}
            className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8"
          >
            {d.logosTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {d.logos.length > 0
              ? d.logos.map((logo) => (
                  <div key={logo._key} data-sanity={attr(`logos[_key=="${logo._key}"].name`)} className="text-slate-400 font-semibold text-base">
                    {logo.logo?.asset ? (
                      <Image src={urlFor(logo.logo).width(160).height(56).format('webp').url()} alt={(logo.logo as SanityImg)?.alt ?? logo.name ?? ''} width={80} height={28} className="h-7 w-auto object-contain opacity-60" />
                    ) : (
                      <span>{logo.name}</span>
                    )}
                  </div>
                ))
              : ['Stripe', 'Shopify', 'Notion', 'Linear', 'Vercel', 'Figma'].map((name) => (
                  <span key={name} className="text-slate-400 font-semibold text-base hover:text-slate-600 transition-colors">{name}</span>
                ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">How it works</span>
            <h2
              data-sanity={attr('howItWorksTitle')}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              {d.howItWorksTitle}
            </h2>
            <p
              data-sanity={attr('howItWorksSubtitle')}
              className="text-slate-500 text-lg max-w-xl mx-auto"
            >
              {d.howItWorksSubtitle}
            </p>
          </AnimateIn>

          <div className="relative grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute top-10 left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200 hidden md:block" />

            {d.howItWorksSteps.map((step, i) => (
              <AnimateIn key={step._key} delay={i * 150} className="relative text-center">
                <div className="relative inline-flex w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 items-center justify-center shadow-xl shadow-indigo-500/25">
                  <span className="text-3xl">{step.icon ?? String(i + 1)}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-400 text-indigo-400 text-xs font-bold flex items-center justify-center">
                    {step.step ?? i + 1}
                  </span>
                </div>
                <h3
                  data-sanity={attr(`howItWorksSteps[_key=="${step._key}"].title`)}
                  className="text-lg font-bold text-slate-900 mb-3"
                >
                  {step.title}
                </h3>
                <p
                  data-sanity={attr(`howItWorksSteps[_key=="${step._key}"].description`)}
                  className="text-slate-500 text-sm leading-relaxed"
                >
                  {step.description}
                </p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="bg-slate-50 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Features</span>
            <h2
              data-sanity={attr('featuresTitle')}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              {d.featuresTitle}
            </h2>
            <p
              data-sanity={attr('featuresSubtitle')}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >
              {d.featuresSubtitle}
            </p>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-8">
            {d.features.map((feature, i) => (
              <AnimateIn key={feature._key} delay={i * 100}>
                <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {feature.image?.asset ? (
                      <Image
                        src={urlFor(feature.image).width(600).height(340).format('webp').quality(85).url()}
                        alt={(feature.image as SanityImg)?.alt ?? feature.title ?? ''}
                        width={600}
                        height={340}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL={shimmerBlur(600, 340)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 data-sanity={attr(`features[_key=="${feature._key}"].title`)} className="text-lg font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p data-sanity={attr(`features[_key=="${feature._key}"].description`)} className="text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white py-24 px-6 relative overflow-hidden">
        <div className="animate-orb absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-transparent to-violet-900/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto text-center">
          <AnimateIn>
            <h2 data-sanity={attr('statsTitle')} className="text-3xl md:text-4xl font-bold mb-16">
              {d.statsTitle}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {d.stats.map((stat, i) => (
              <AnimateIn key={stat._key} delay={i * 100}>
                <div className="flex flex-col gap-2 group">
                  <span
                    data-sanity={attr(`stats[_key=="${stat._key}"].number`)}
                    className="text-4xl md:text-5xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                  >
                    {stat.number}
                  </span>
                  <span data-sanity={attr(`stats[_key=="${stat._key}"].label`)} className="text-slate-400 text-sm">
                    {stat.label}
                  </span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Pricing</span>
            <h2 data-sanity={attr('pricingTitle')} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {d.pricingTitle}
            </h2>
            <p data-sanity={attr('pricingSubtitle')} className="text-slate-500 text-lg max-w-xl mx-auto">
              {d.pricingSubtitle}
            </p>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {d.pricingPlans.map((plan, i) => (
              <AnimateIn key={plan._key} delay={i * 100}>
                <div className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400 scale-[1.03] md:-translate-y-2'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}>
                  {plan.highlighted && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most popular
                    </span>
                  )}

                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${plan.highlighted ? 'text-indigo-200' : 'text-indigo-600'}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-3">
                      <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className={`text-sm mb-1.5 ${plan.highlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {plan.features?.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? 'text-indigo-200' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlighted ? 'text-indigo-100' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaLink ?? '#'}
                    className={`mt-auto block text-center font-semibold px-6 py-3 rounded-xl transition-all text-sm ${
                      plan.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                    }`}
                  >
                    {plan.ctaText}
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="bg-slate-50 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Testimonials</span>
            <h2 data-sanity={attr('testimonialsTitle')} className="text-3xl md:text-4xl font-bold text-slate-900">
              {d.testimonialsTitle}
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-8">
            {d.testimonials.map((t, i) => (
              <AnimateIn key={t._key} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-md transition-shadow">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({length: 5}).map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p data-sanity={attr(`testimonials[_key=="${t._key}"].quote`)} className="text-slate-600 text-sm leading-relaxed">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      {t.authorAvatar?.asset ? (
                        <Image
                          src={urlFor(t.authorAvatar).width(80).height(80).format('webp').quality(85).url()}
                          alt={(t.authorAvatar as SanityImg)?.alt ?? t.authorName ?? ''}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                          blurDataURL={shimmerBlur(40, 40)}
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
                          {t.authorName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p data-sanity={attr(`testimonials[_key=="${t._key}"].authorName`)} className="text-slate-900 font-semibold text-sm">
                        {t.authorName}
                      </p>
                      <p data-sanity={attr(`testimonials[_key=="${t._key}"].authorRole`)} className="text-slate-400 text-xs">
                        {t.authorRole}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Security ─────────────────────────────── */}
      <section className="bg-[#0f172a] text-white py-24 px-6 relative overflow-hidden">
        <div className="animate-orb absolute right-0 top-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mb-4 border border-indigo-400/20">Security</span>
            <h2 data-sanity={attr('trustTitle')} className="text-3xl md:text-4xl font-bold mb-4">
              {d.trustTitle}
            </h2>
            <p data-sanity={attr('trustSubtitle')} className="text-slate-400 text-lg max-w-xl mx-auto">
              {d.trustSubtitle}
            </p>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {d.trustBadges.map((badge, i) => (
              <AnimateIn key={badge._key} delay={i * 100}>
                <div className="flex flex-col items-center text-center bg-white/5 hover:bg-white/8 rounded-2xl p-7 border border-white/10 hover:border-indigo-500/30 transition-all group">
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <h3 data-sanity={attr(`trustBadges[_key=="${badge._key}"].title`)} className="text-white font-bold text-sm mb-2">
                    {badge.title}
                  </h3>
                  <p data-sanity={attr(`trustBadges[_key=="${badge._key}"].description`)} className="text-slate-400 text-xs leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative bg-indigo-600 py-28 px-6 overflow-hidden">
        <div className="animate-orb absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="animate-orb-delayed absolute -bottom-20 -left-20 w-80 h-80 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
        <AnimateIn className="relative max-w-3xl mx-auto text-center text-white">
          <h2 data-sanity={attr('ctaTitle')} className="text-3xl md:text-5xl font-bold mb-5">
            {d.ctaTitle}
          </h2>
          <p data-sanity={attr('ctaSubtitle')} className="text-indigo-200 text-lg mb-10">
            {d.ctaSubtitle}
          </p>
          <a
            href={d.ctaButtonLink}
            data-sanity={attr('ctaButtonText')}
            className="inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {d.ctaButtonText}
          </a>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  )
}
