import {defineQuery} from 'next-sanity'

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage"][0] {
    logo { "url": asset->url, alt },
    navCtaText,
    heroTitle,
    heroSubtitle,
    heroCtaText,
    heroCtaLink,
    heroDashboardImage { "url": asset->url, alt },
    logosTitle,
    logos[] {
      _key,
      name,
      logo { "url": asset->url, alt }
    },
    featuresTitle,
    featuresSubtitle,
    features[] {
      _key,
      title,
      description,
      image { "url": asset->url, alt }
    },
    statsTitle,
    stats[] { _key, number, label },
    testimonialsTitle,
    testimonials[] {
      _key,
      quote,
      authorName,
      authorRole,
      authorAvatar { "url": asset->url, alt }
    },
    ctaTitle,
    ctaSubtitle,
    ctaButtonText,
    ctaButtonLink,
    footerCopyright
  }
`)
