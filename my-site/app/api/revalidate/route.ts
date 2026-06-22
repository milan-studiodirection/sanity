import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {
  _type?: string
  // GROQ projection payload
  slug?: string
  // v1 transaction webhook wraps document in 'result'
  result?: {_type?: string; slug?: {current?: string}}
  transition?: string
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET

    let body: WebhookPayload
    const hasSignatureHeader = req.headers.get('sanity-webhook-signature') !== null

    if (secret && hasSignatureHeader) {
      // GROQ webhook with secret — validate signature
      const parsed = await parseBody<WebhookPayload>(req, secret, true)
      if (!parsed.isValidSignature || !parsed.body) {
        return new Response(JSON.stringify({message: 'Invalid signature'}), {status: 401})
      }
      body = parsed.body
    } else {
      // Basic v1 webhook (no secret configured) — parse body directly
      body = await req.json()
    }

    // Normalise: GROQ projection sends {_type, slug}
    // v1 transaction webhook sends {result: {_type, slug: {current}}, transition}
    const docType = body._type ?? body.result?._type
    const docSlug = body.slug ?? body.result?.slug?.current

    if (!docType) {
      return new Response(JSON.stringify({message: 'Bad Request — no _type found', body}), {status: 400})
    }

    const revalidated: string[] = []

    switch (docType) {
      case 'post':
        revalidatePath('/blog')
        revalidated.push('/blog')
        if (docSlug) {
          revalidatePath(`/blog/${docSlug}`)
          revalidated.push(`/blog/${docSlug}`)
        }
        break
      case 'tag':
        revalidatePath('/blog')
        revalidated.push('/blog')
        if (docSlug) {
          revalidatePath(`/blog/tag/${docSlug}`)
          revalidated.push(`/blog/tag/${docSlug}`)
        }
        break
      case 'author':
        revalidatePath('/blog', 'layout')
        revalidated.push('/blog (layout)')
        break
      case 'homepage':
        revalidatePath('/')
        revalidated.push('/')
        break
      case 'siteSettings':
        revalidatePath('/', 'layout')
        revalidated.push('/ (layout — all pages)')
        break
      default:
        revalidatePath('/', 'layout')
        revalidated.push('/ (layout fallback)')
    }

    return NextResponse.json({revalidated, docType, docSlug})
  } catch (err: unknown) {
    console.error('[revalidate]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, {status: 500})
  }
}
