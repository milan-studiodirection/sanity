import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon, ImageIcon, TagIcon, LinkIcon, CodeBlockIcon, PlayIcon} from '@sanity/icons'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'meta', title: 'Meta'},
    {name: 'author', title: 'Author'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short description shown on the blog listing page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      icon: TagIcon,
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'author',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      group: 'meta',
      description: 'Up to 3 posts shown at the bottom of this article.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'post'}]})],
      validation: (rule) => rule.max(3),
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
          description: 'Overrides the post title in search results. Keep under 60 characters.',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Overrides the excerpt in search results. Keep under 160 characters.',
        }),
        defineField({
          name: 'ogImage',
          title: 'OG / Social Share Image',
          type: 'image',
          description: 'Falls back to cover image if not set. Ideal size: 1200×630px.',
          options: {hotspot: true},
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [defineField({name: 'href', type: 'url', title: 'URL'})],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
          preview: {
            select: {media: 'asset', subtitle: 'alt'},
            prepare: ({media, subtitle}) => ({title: 'Image', subtitle, media}),
          },
        }),

        // ── Call to Action block ──────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'callToAction',
          title: 'Call to Action',
          icon: LinkIcon,
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
            defineField({name: 'buttonText', title: 'Button Text', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'buttonUrl', title: 'Button URL', type: 'url', validation: (r) => r.required()}),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Indigo', value: 'indigo'},
                  {title: 'Dark', value: 'dark'},
                ],
                layout: 'radio',
              },
              initialValue: 'indigo',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'buttonText'},
            prepare: ({title, subtitle}) => ({
              title: title ?? 'Call to Action',
              subtitle: subtitle ? `→ ${subtitle}` : undefined,
            }),
          },
        }),

        // ── Code block ────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'codeBlock',
          title: 'Code Block',
          icon: CodeBlockIcon,
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'TSX / JSX', value: 'tsx'},
                  {title: 'CSS', value: 'css'},
                  {title: 'Bash / Shell', value: 'bash'},
                  {title: 'JSON', value: 'json'},
                  {title: 'Python', value: 'python'},
                  {title: 'SQL', value: 'sql'},
                ],
              },
              initialValue: 'javascript',
            }),
            defineField({name: 'filename', title: 'Filename (optional)', type: 'string'}),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 10,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {language: 'language', filename: 'filename'},
            prepare: ({language, filename}) => ({
              title: filename ?? 'Code Block',
              subtitle: language,
            }),
          },
        }),

        // ── YouTube embed ─────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'youtubeEmbed',
          title: 'YouTube Video',
          icon: PlayIcon,
          fields: [
            defineField({
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              validation: (r) => r.required(),
              description: 'Paste the full YouTube watch URL, e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            }),
            defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
          ],
          preview: {
            select: {url: 'url', caption: 'caption'},
            prepare: ({url, caption}) => ({title: caption ?? 'YouTube Video', subtitle: url}),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.name',
      media: 'coverImage',
    },
    prepare: ({title, subtitle, media}) => ({
      title: title ?? 'Untitled post',
      subtitle: subtitle ? `by ${subtitle}` : undefined,
      media,
    }),
  },
})
