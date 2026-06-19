import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    tagline,
    navCtaText,
    navCtaLink,
    navLinks[] { _key, label, href, openInNewTab },
    footerText,
    socialLinks { twitter, linkedin, github }
  }
`)
