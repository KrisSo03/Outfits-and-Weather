import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSensorReadings } from '../../../../lib/google-sheets'
export async function GET(request: Request) {
  try { const limit = z.coerce.number().int().min(1).max(200).default(50).parse(new URL(request.url).searchParams.get('limit') ?? 50); const rows = await getSensorReadings(); return NextResponse.json({ success: true, data: rows.slice(-limit) }) }
  catch { return NextResponse.json({ success: false, error: { code: 'SHEETS_ERROR', message: 'No se pudo leer el historial.' } }, { status: 500 }) }
}
