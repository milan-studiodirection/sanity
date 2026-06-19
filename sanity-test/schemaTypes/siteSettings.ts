import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon, LinkIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short phrase shown in the browser tab and OG share cards.',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      description: 'Links shown in the main header navigation.',
      of: [
        defineArrayMember({
          type: 'object',
          icon: LinkIcon,
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'href', title: 'URL / Path', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({
      name: 'navCtaText',
      title: 'Nav CTA Button Text',
      type: 'string',
      description: 'e.g. Get Started, Sign Up, Try for free',
    }),
    defineField({
      name: 'navCtaLink',
      title: 'Nav CTA Button Link',
      type: 'string',
      description: 'URL or path the button links to.',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
      description: 'e.g. © 2026 PayFlow Inc. All rights reserved.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      icon: LinkIcon,
      fields: [
        defineField({name: 'twitter', title: 'Twitter / X URL', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
        defineField({name: 'github', title: 'GitHub URL', type: 'url'}),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
