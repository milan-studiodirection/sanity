import {defineQuery} from 'next-sanity'

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage"][0] {
    _id,
    logo { asset, alt },
    navCtaText,
    heroTitle,
    heroSubtitle,
    heroCtaText,
    heroCtaLink,
    heroDashboardImage { asset, alt },
    logosTitle,
    logos[] {
      _key,
      name,
      logo { asset, alt }
    },
    featuresTitle,
    featuresSubtitle,
    features[] {
      _key,
      title,
      description,
      image { asset, alt }
    },
    statsTitle,
    stats[] { _key, number, label },
    testimonialsTitle,
    testimonials[] {
      _key,
      quote,
      authorName,
      authorRole,
      authorAvatar { asset, alt }
    },
    ctaTitle,
    ctaSubtitle,
    ctaButtonText,
    ctaButtonLink,
    footerCopyright,
    howItWorksTitle,
    howItWorksSubtitle,
    howItWorksSteps[] { _key, step, icon, title, description },
    pricingTitle,
    pricingSubtitle,
    pricingPlans[] {
      _key, name, price, period, description,
      features,
      ctaText, ctaLink, highlighted
    },
    trustTitle,
    trustSubtitle,
    trustBadges[] { _key, icon, title, description },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset }
    }
  }
`)
