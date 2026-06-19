import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries/siteSettings'

export default async function Footer() {
  const {data: settings} = await sanityFetch({query: SITE_SETTINGS_QUERY})

  const siteName = settings?.siteName ?? 'PayFlow'
  const footerText = settings?.footerText ?? `© ${new Date().getFullYear()} ${siteName} Inc. All rights reserved.`

  return (
    <footer className="bg-[#0f172a] border-t border-white/10 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-white font-bold text-lg hover:opacity-80 transition-opacity">
          {siteName}
        </Link>

        <p className="text-slate-500 text-sm text-center">{footerText}</p>

        <div className="flex items-center gap-6">
          {[
            {label: 'Privacy', href: '#'},
            {label: 'Terms', href: '#'},
            {label: 'Contact', href: '#'},
          ].map((link) => (
            <a key={link.label} href={link.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
