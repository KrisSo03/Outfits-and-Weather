import { NextResponse } from 'next/server'
import { computeAnalytics } from '../../../lib/analytics'

export async function GET() {
  try {
    const data = await computeAnalytics()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: { code: 'ANALYTICS_ERROR', message: 'No se pudo calcular la analítica.' } }, { status: 500 })
  }
}
