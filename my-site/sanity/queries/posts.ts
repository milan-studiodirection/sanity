import {defineQuery} from 'next-sanity'

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
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

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
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
      bio,
      avatar { asset, alt },
      twitter,
      linkedin
    },
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset
      }
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset }
    },
    relatedPosts[]-> {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage { asset, alt },
      publishedAt,
      readTime,
      author-> { name, avatar { asset, alt } }
    }
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`)
