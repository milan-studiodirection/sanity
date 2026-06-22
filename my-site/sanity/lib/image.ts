import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// SVG shimmer used as a blur placeholder for Next.js <Image placeholder="blur">
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#e2e8f0"/>
      <stop offset="50%"  stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>`

function toBase64(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}

export function shimmerBlur(w: number, h: number) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}
