import 'server-only'
import { google } from 'googleapis'
import { z } from 'zod'
import { env } from './env'

export const SENSOR_HEADERS = ['timestamp','indoor_temperature','indoor_humidity','indoor_pressure','interaction','comfort_status','data_source'] as const
export const QUERY_HEADERS = ['timestamp','origin_temperature','origin_humidity','destination_name','destination_country','destination_latitude','destination_longitude','arrival_datetime','destination_temperature','apparent_temperature','destination_humidity','precipitation_probability','wind_speed','uv_index','temperature_difference','gender_preference','style_preference','activity_type','cold_sensitivity','outfit_category','outfit_recommendation','pinterest_query'] as const
export const FEEDBACK_HEADERS = ['timestamp','query_timestamp','thermal_feeling','layers_adequate','rain_item_used','helpful'] as const
export const EVENT_HEADERS = ['timestamp','session_id','event_name','screen','duration_ms','metadata'] as const

const SensorSchema = z.object({
  timestamp: z.string().min(1), indoor_temperature: z.coerce.number().finite(),
  indoor_humidity: z.coerce.number().finite(), indoor_pressure: z.coerce.number().finite(),
  interaction: z.string().default(''), comfort_status: z.string().default(''), data_source: z.string().default('')
})
export type SensorReading = z.infer<typeof SensorSchema>
export type TravelQuery = Record<(typeof QUERY_HEADERS)[number], string | number>

const mockReadings: SensorReading[] = Array.from({ length: 20 }, (_, index) => ({
  timestamp: new Date(Date.now() - (19 - index) * 60_000).toISOString(),
  indoor_temperature: 24.4 + Math.sin(index / 3) * 1.4,
  indoor_humidity: 61 + Math.cos(index / 3) * 4,
  indoor_pressure: 1012 + Math.sin(index / 4) * 1.5,
  interaction: 'automatic_reading', comfort_status: index % 5 === 0 ? 'WARM' : 'COMFORTABLE', data_source: 'wokwi_simulation'
}))

function configured() { return Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY) }
function sheetsClient() {
  if (!configured()) throw new Error('Configura GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY')
  const auth = new google.auth.JWT({ email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: env.GOOGLE_PRIVATE_KEY, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
  return google.sheets({ version: 'v4', auth })
}
function validDate(value: string) { const time = Date.parse(value); return Number.isFinite(time) ? time : null }
export function sanitizeCellValue(value: unknown): string {
  const text = value == null ? '' : String(value)
  return /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text
}

export async function getSensorReadings(): Promise<SensorReading[]> {
  if (!configured() && process.env.NODE_ENV !== 'production') return mockReadings
  const response = await sheetsClient().spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, range: `'${env.GOOGLE_SENSOR_SHEET_NAME.replace(/'/g, "''")}'!A:G` })
  const rows = response.data.values ?? []
  if (!rows.length) return []
  const headers = rows[0].map(String)
  return rows.slice(1).flatMap((row) => {
    const raw = Object.fromEntries(headers.map((header, index) => [header.trim(), row[index] ?? '']))
    const parsed = SensorSchema.safeParse(raw)
    return parsed.success && validDate(parsed.data.timestamp) !== null ? [parsed.data] : []
  }).sort((a, b) => (validDate(a.timestamp) ?? 0) - (validDate(b.timestamp) ?? 0))
}
export async function getLatestSensorReading() { const rows = await getSensorReadings(); return rows.at(-1) ?? null }

export async function ensureTravelQueriesHeaders() {
  const sheets = sheetsClient()
  const meta = await sheets.spreadsheets.get({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, fields: 'sheets.properties.title' })
  const exists = meta.data.sheets?.some((sheet) => sheet.properties?.title === env.GOOGLE_QUERIES_SHEET_NAME)
  if (!exists) await sheets.spreadsheets.batchUpdate({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, requestBody: { requests: [{ addSheet: { properties: { title: env.GOOGLE_QUERIES_SHEET_NAME } } }] } })
  const range = `'${env.GOOGLE_QUERIES_SHEET_NAME.replace(/'/g, "''")}'!A1:V1`
  const current = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, range })
  if (!current.data.values?.length) await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, range, valueInputOption: 'RAW', requestBody: { values: [[...QUERY_HEADERS]] } })
}
export async function appendTravelQuery(row: TravelQuery) {
  if (!configured() && process.env.NODE_ENV !== 'production') return
  await ensureTravelQueriesHeaders()
  await sheetsClient().spreadsheets.values.append({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, range: `'${env.GOOGLE_QUERIES_SHEET_NAME.replace(/'/g, "''")}'!A:V`, valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS', requestBody: { values: [QUERY_HEADERS.map((key) => sanitizeCellValue(row[key]))] } })
}
export async function getTravelQueries(): Promise<Record<string, string>[]> {
  if (!configured() && process.env.NODE_ENV !== 'production') return []
  const response = await sheetsClient().spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID, range: `'${env.GOOGLE_QUERIES_SHEET_NAME.replace(/'/g, "''")}'!A:V` })
  const rows = response.data.values ?? []; if (!rows.length) return []
  const headers = rows[0].map(String)
  return rows.slice(1).filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(headers.map((h, i) => [h, String(row[i] ?? '')])))
}

export async function appendOutfitFeedback(row: Record<(typeof FEEDBACK_HEADERS)[number], string | number>) {
  if (!configured() && process.env.NODE_ENV !== 'production') return
  const sheets=sheetsClient(), sheetName=env.GOOGLE_FEEDBACK_SHEET_NAME
  const meta=await sheets.spreadsheets.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,fields:'sheets.properties.title'})
  if(!meta.data.sheets?.some(sheet=>sheet.properties?.title===sheetName)) await sheets.spreadsheets.batchUpdate({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,requestBody:{requests:[{addSheet:{properties:{title:sheetName}}}]}})
  const headerRange=`'${sheetName.replace(/'/g,"''")}'!A1:F1`
  const current=await sheets.spreadsheets.values.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:headerRange})
  if(!current.data.values?.length) await sheets.spreadsheets.values.update({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:headerRange,valueInputOption:'RAW',requestBody:{values:[[...FEEDBACK_HEADERS]]}})
  await sheets.spreadsheets.values.append({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:`'${sheetName.replace(/'/g,"''")}'!A:F`,valueInputOption:'RAW',insertDataOption:'INSERT_ROWS',requestBody:{values:[FEEDBACK_HEADERS.map(key=>sanitizeCellValue(row[key]))]}})
}

async function ensureAuxiliarySheet(sheetName:string,headers:readonly string[]){const sheets=sheetsClient(),meta=await sheets.spreadsheets.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,fields:'sheets.properties.title'});if(!meta.data.sheets?.some(sheet=>sheet.properties?.title===sheetName))await sheets.spreadsheets.batchUpdate({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,requestBody:{requests:[{addSheet:{properties:{title:sheetName}}}]}});const range=`'${sheetName.replace(/'/g,"''")}'!A1:${String.fromCharCode(64+headers.length)}1`,current=await sheets.spreadsheets.values.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range});if(!current.data.values?.length)await sheets.spreadsheets.values.update({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range,valueInputOption:'RAW',requestBody:{values:[[...headers]]}});return sheets}
export async function appendInteractionEvent(row:Record<(typeof EVENT_HEADERS)[number],string|number>){if(!configured()&&process.env.NODE_ENV!=='production')return;const sheets=await ensureAuxiliarySheet(env.GOOGLE_EVENTS_SHEET_NAME,EVENT_HEADERS);await sheets.spreadsheets.values.append({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:`'${env.GOOGLE_EVENTS_SHEET_NAME.replace(/'/g,"''")}'!A:F`,valueInputOption:'RAW',insertDataOption:'INSERT_ROWS',requestBody:{values:[EVENT_HEADERS.map(key=>sanitizeCellValue(row[key]))]}})}
export async function getInteractionEvents():Promise<Record<string,string>[]>{if(!configured()&&process.env.NODE_ENV!=='production')return[];const sheets=await ensureAuxiliarySheet(env.GOOGLE_EVENTS_SHEET_NAME,EVENT_HEADERS),response=await sheets.spreadsheets.values.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:`'${env.GOOGLE_EVENTS_SHEET_NAME.replace(/'/g,"''")}'!A:F`}),rows=response.data.values??[];if(!rows.length)return[];const headers=rows[0].map(String);return rows.slice(1).filter(row=>row.some(Boolean)).map(row=>Object.fromEntries(headers.map((header,index)=>[header,String(row[index]??'')])))}
