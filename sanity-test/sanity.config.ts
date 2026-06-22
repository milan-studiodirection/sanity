import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {CogIcon, HomeIcon, DocumentTextIcon, UsersIcon, TagIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'
import {PresentationNavigator} from './components/PresentationNavigator'

export default defineConfig({
  name: 'default',
  title: 'Sanity Test',

  projectId: 'r0nmxv5e',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.documentTypeListItem('homepage').title('Homepage').icon(HomeIcon),
            S.divider(),
            S.documentTypeListItem('post').title('Blog Posts').icon(DocumentTextIcon),
            S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
            S.documentTypeListItem('tag').title('Tags').icon(TagIcon),
          ]),
    }),
    visionTool(),
    presentationTool({
      components: {
        unstable_navigator: {
          component: PresentationNavigator,
          minWidth: 120,
          maxWidth: 280,
        },
      },
      previewUrl: {
        origin: 'https://my-site-studio-direction.vercel.app',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },

      resolve: {
        // URL → document: populates "Documents on this page" panel
        mainDocuments: defineDocuments([
          {
            // The homepage singleton
            route: '/',
            type: 'homepage',
          },
          {
            // Individual blog post pages
            route: '/blog/:slug',
            filter: ({params}) =>
              `_type == "post" && slug.current == "${params.slug}"`,
          },
        ]),

        // Document → URL: "Open in browser" button & "Where is this document used?"
        locations: {
          siteSettings: defineLocations({
            message: 'Site settings affect every page on the site',
            tone: 'positive',
            locations: [
              {title: 'Homepage', href: '/'},
              {title: 'Blog', href: '/blog'},
            ],
          }),
          homepage: defineLocations({
            message: 'This document controls the homepage',
            tone: 'positive',
            locations: [{title: 'Homepage', href: '/'}],
          }),
          post: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug
                ? {
                    tone: 'positive',
                    locations: [
                      {title: doc.title ?? 'Untitled post', href: `/blog/${doc.slug}`},
                      {title: 'Blog listing', href: '/blog'},
                    ],
                  }
                : null,
          }),
          tag: defineLocations({
            select: {title: 'name', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug
                ? {
                    tone: 'positive',
                    locations: [
                      {title: `Tag: ${doc.title ?? 'Untitled'}`, href: `/blog/tag/${doc.slug}`},
                      {title: 'Blog listing', href: '/blog'},
                    ],
                  }
                : null,
          }),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
