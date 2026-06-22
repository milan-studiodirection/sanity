import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  slug?: string
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(req, secret, true)

    if (!isValidSignature) {
      return new Response(JSON.stringify({message: 'Invalid signature'}), {status: 401})
    }

    if (!body?._type) {
      return new Response(JSON.stringify({message: 'Bad Request', body}), {status: 400})
    }

    const revalidated: string[] = []

    switch (body._type) {
      case 'post':
        revalidatePath('/blog')
        revalidated.push('/blog')
        if (body.slug) {
          revalidatePath(`/blog/${body.slug}`)
          revalidated.push(`/blog/${body.slug}`)
        }
        break
      case 'tag':
        revalidatePath('/blog')
        revalidated.push('/blog')
        if (body.slug) {
          revalidatePath(`/blog/tag/${body.slug}`)
          revalidated.push(`/blog/tag/${body.slug}`)
        }
        break
      case 'author':
        // Author changes affect all blog posts — revalidate the whole blog tree
        revalidatePath('/blog', 'layout')
        revalidated.push('/blog (layout)')
        break
      case 'homepage':
        revalidatePath('/')
        revalidated.push('/')
        break
      case 'siteSettings':
        // Site settings affect every page (header/footer)
        revalidatePath('/', 'layout')
        revalidated.push('/ (layout — all pages)')
        break
      default:
        revalidatePath('/', 'layout')
        revalidated.push('/ (layout fallback)')
    }

    return NextResponse.json({revalidated, body})
  } catch (err: unknown) {
    console.error('[revalidate]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, {status: 500})
  }
}
