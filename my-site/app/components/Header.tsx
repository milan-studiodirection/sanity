import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {urlFor, shimmerBlur} from '@/sanity/lib/image'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries/siteSettings'

export default async function Header() {
  const {data: settings} = await sanityFetch({query: SITE_SETTINGS_QUERY})

  const siteName = settings?.siteName ?? 'PayFlow'
  const navLinks = settings?.navLinks ?? [
    {_key: 'products', label: 'Products', href: '#', openInNewTab: false},
    {_key: 'pricing', label: 'Pricing', href: '#', openInNewTab: false},
    {_key: 'docs', label: 'Docs', href: '#', openInNewTab: false},
    {_key: 'blog', label: 'Blog', href: '/blog', openInNewTab: false},
  ]

  return (
    <header className="bg-[#0f172a] sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / wordmark */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white font-bold text-xl tracking-tight">{siteName}</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link: {_key: string; label: string; href: string; openInNewTab?: boolean | null}) => (
            <Link
              key={link._key}
              href={link.href}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA button */}
        <a
          href={settings?.navCtaLink ?? '#'}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {settings?.navCtaText ?? 'Get Started'}
        </a>
      </div>
    </header>
  )
}
