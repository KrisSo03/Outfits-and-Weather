import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getForecastWindow } from '../../../lib/open-meteo'
import { errorMessage } from '../../../lib/validators'
const schema = z.object({ latitude: z.coerce.number().min(-90).max(90), longitude: z.coerce.number().min(-180).max(180), timezone: z.string().max(80).default('auto'), dateTime: z.string().min(1), durationHours:z.coerce.number().int().min(0).max(12).default(3) })
export async function GET(request: Request) {
  try { const url = new URL(request.url); const input = schema.parse(Object.fromEntries(url.searchParams)); return NextResponse.json({ success: true, data: await getForecastWindow(input.latitude, input.longitude, input.timezone, input.dateTime,input.durationHours) }) }
  catch (error) { return NextResponse.json({ success: false, error: { code: 'FORECAST_ERROR', message: errorMessage(error) } }, { status: 400 }) }
}
