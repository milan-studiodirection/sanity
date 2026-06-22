import {defineQuery} from 'next-sanity'

export const ALL_TAGS_QUERY = defineQuery(`
  *[_type == "tag"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    color
  }
`)

export const TAG_QUERY = defineQuery(`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    color
  }
`)

export const TAG_SLUGS_QUERY = defineQuery(`
  *[_type == "tag" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const POSTS_BY_TAG_QUERY = defineQuery(`
  *[_type == "post" && $tagId in tags[]._ref] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage { asset, alt },
    publishedAt,
    readTime,
    tags[]-> {
      _id,
      name,
      "slug": slug.current,
      color
    },
    author-> {
      _id,
      name,
      role,
      avatar { asset, alt }
    }
  }
`)
