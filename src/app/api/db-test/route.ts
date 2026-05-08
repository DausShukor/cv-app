import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const maxDuration = 30

export async function GET() {
  const timings: Record<string, number> = {}
  const t0 = Date.now()

  try {
    timings.start = 0
    const payload = await getPayload({ config: configPromise })
    timings.payloadInit = Date.now() - t0

    const result = await payload.find({ collection: 'frontend-users', limit: 1 })
    timings.query = Date.now() - t0

    return NextResponse.json({
      ok: true,
      timings,
      count: result.totalDocs,
      region: process.env.VERCEL_REGION || process.env.AWS_REGION || 'unknown',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    timings.error = Date.now() - t0
    return NextResponse.json({ ok: false, error: msg, timings }, { status: 500 })
  }
}
