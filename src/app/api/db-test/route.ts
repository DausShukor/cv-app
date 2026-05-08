import { NextResponse } from 'next/server'

export const maxDuration = 30

export async function GET() {
  const start = Date.now()
  try {
    // Dynamically import pg so we don't affect other routes
    const { Client } = await import('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URI || '',
      connectionTimeoutMillis: 10000,
    })
    await client.connect()
    const result = await client.query('SELECT count(*) FROM frontend_users')
    await client.end()
    return NextResponse.json({
      ok: true,
      duration: Date.now() - start,
      count: result.rows[0].count,
      region: process.env.VERCEL_REGION || process.env.AWS_REGION || 'unknown',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg, duration: Date.now() - start }, { status: 500 })
  }
}
