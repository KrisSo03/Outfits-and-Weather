import { NextResponse } from 'next/server'
import { z } from 'zod'
import { geocode } from '../../../lib/open-meteo'

const QuerySchema = z.object({ query: z.string().min(1).max(100) })

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('query') || ''
    QuerySchema.parse({ query: q })
    const results = await geocode(q)
    return NextResponse.json({ success: true, data: results })
  } catch {
    return NextResponse.json({ success: false, error: { code: 'GEOCODE_ERROR', message: 'No se pudo buscar el destino.' } }, { status: 400 })
  }
}
