import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  DocumentTextIcon,
  ImageIcon,
  StarIcon,
  TrendUpwardIcon,
  UsersIcon,
} from '@sanity/icons'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'nav', title: 'Navigation'},
    {name: 'hero', title: 'Hero'},
    {name: 'logos', title: 'Logos'},
    {name: 'features', title: 'Features'},
    {name: 'stats', title: 'Stats'},
    {name: 'testimonials', title: 'Testimonials'},
    {name: 'cta', title: 'CTA'},
    {name: 'footer', title: 'Footer'},
    {name: 'howItWorks', title: 'How It Works'},
    {name: 'pricing', title: 'Pricing'},
    {name: 'trust', title: 'Trust & Security'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── Navigation ──────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'nav',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'navCtaText',
      title: 'Nav CTA Button Text',
      type: 'string',
      group: 'nav',
    }),

    // ── Hero ─────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Link',
      type: 'url',
      group: 'hero',
    }),
    defineField({
      name: 'heroDashboardImage',
      title: 'Hero Dashboard Image',
      type: 'image',
      group: 'hero',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),

    // ── Logos ─────────────────────────────────────────────────
    defineField({
      name: 'logosTitle',
      title: 'Logos Section Title',
      type: 'string',
      group: 'logos',
    }),
    defineField({
      name: 'logos',
      title: 'Partner Logos',
      type: 'array',
      group: 'logos',
      of: [
        defineArrayMember({
          type: 'object',
          icon: ImageIcon,
          fields: [
            defineField({name: 'name', title: 'Company Name', type: 'string'}),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
            }),
          ],
          preview: {
            select: {title: 'name'},
            prepare: ({title}) => ({title: title ?? 'Logo'}),
          },
        }),
      ],
    }),

    // ── Features ──────────────────────────────────────────────
    defineField({
      name: 'featuresTitle',
      title: 'Features Section Title',
      type: 'string',
      group: 'features',
    }),
    defineField({
      name: 'featuresSubtitle',
      title: 'Features Section Subtitle',
      type: 'text',
      rows: 2,
      group: 'features',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'features',
      of: [
        defineArrayMember({
          type: 'object',
          icon: StarIcon,
          fields: [
            defineField({name: 'title', title: 'Feature Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare: ({title}) => ({title: title ?? 'Feature'}),
          },
        }),
      ],
    }),

    // ── Stats ─────────────────────────────────────────────────
    defineField({
      name: 'statsTitle',
      title: 'Stats Section Title',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          icon: TrendUpwardIcon,
          fields: [
            defineField({name: 'number', title: 'Number / Value', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
          preview: {
            select: {title: 'number', subtitle: 'label'},
          },
        }),
      ],
    }),

    // ── Testimonials ──────────────────────────────────────────
    defineField({
      name: 'testimonialsTitle',
      title: 'Testimonials Section Title',
      type: 'string',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      of: [
        defineArrayMember({
          type: 'object',
          icon: UsersIcon,
          fields: [
            defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4}),
            defineField({name: 'authorName', title: 'Author Name', type: 'string'}),
            defineField({name: 'authorRole', title: 'Author Role / Company', type: 'string'}),
            defineField({
              name: 'authorAvatar',
              title: 'Author Avatar',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
            }),
          ],
          preview: {
            select: {title: 'authorName', subtitle: 'authorRole'},
            prepare: ({title, subtitle}) => ({title: title ?? 'Testimonial', subtitle}),
          },
        }),
      ],
    }),

    // ── CTA ───────────────────────────────────────────────────
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'url',
      group: 'cta',
    }),

    // ── Footer ────────────────────────────────────────────────
    defineField({
      name: 'footerCopyright',
      title: 'Footer Copyright Text',
      type: 'string',
      group: 'footer',
    }),

    // ── How It Works ──────────────────────────────────────────
    defineField({
      name: 'howItWorksTitle',
      title: 'How It Works Title',
      type: 'string',
      group: 'howItWorks',
    }),
    defineField({
      name: 'howItWorksSubtitle',
      title: 'How It Works Subtitle',
      type: 'text',
      rows: 2,
      group: 'howItWorks',
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'Steps',
      type: 'array',
      group: 'howItWorks',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'step', title: 'Step Number', type: 'number'}),
            defineField({name: 'icon', title: 'Icon (emoji)', type: 'string', description: 'Paste an emoji, e.g. 🔐'}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
            prepare: ({title, subtitle}) => ({title: title ?? 'Step', subtitle}),
          },
        }),
      ],
    }),

    // ── Pricing ───────────────────────────────────────────────
    defineField({
      name: 'pricingTitle',
      title: 'Pricing Title',
      type: 'string',
      group: 'pricing',
    }),
    defineField({
      name: 'pricingSubtitle',
      title: 'Pricing Subtitle',
      type: 'text',
      rows: 2,
      group: 'pricing',
    }),
    defineField({
      name: 'pricingPlans',
      title: 'Pricing Plans',
      type: 'array',
      group: 'pricing',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Plan Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'price', title: 'Price', type: 'string', description: 'e.g. $49 or Custom'}),
            defineField({name: 'period', title: 'Period', type: 'string', description: 'e.g. /month — leave blank for Custom'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({name: 'ctaText', title: 'CTA Button Text', type: 'string'}),
            defineField({name: 'ctaLink', title: 'CTA Button Link', type: 'string'}),
            defineField({name: 'highlighted', title: 'Highlight as Most Popular', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {title: 'name', subtitle: 'price'},
            prepare: ({title, subtitle}) => ({title: title ?? 'Plan', subtitle}),
          },
        }),
      ],
    }),

    // ── Trust & Security ──────────────────────────────────────
    defineField({
      name: 'trustTitle',
      title: 'Trust Section Title',
      type: 'string',
      group: 'trust',
    }),
    defineField({
      name: 'trustSubtitle',
      title: 'Trust Section Subtitle',
      type: 'text',
      rows: 2,
      group: 'trust',
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Icon (emoji)', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
            prepare: ({title, subtitle}) => ({title: title ?? 'Badge', subtitle}),
          },
        }),
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the page title in search results. Keep under 60 characters.',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Overrides the page description in search results. Keep under 160 characters.',
        }),
        defineField({
          name: 'ogImage',
          title: 'OG / Social Share Image',
          type: 'image',
          description: 'Image shown when sharing on social media. Ideal size: 1200×630px.',
          options: {hotspot: true},
        }),
      ],
    }),
  ],

  preview: {
    prepare: () => ({title: 'Homepage'}),
  },
})
