import { NextResponse } from 'next/server'
import { getLatestSensorReading } from '../../../../lib/google-sheets'

export async function GET() {
  try {
    const latest = await getLatestSensorReading()
    return NextResponse.json({ success: true, data: latest })
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SHEETS_ERROR', message: 'No se pudo leer la última medición.' } }, { status: 500 })
  }
}
