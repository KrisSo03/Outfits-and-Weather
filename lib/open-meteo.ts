import { z } from 'zod'

export const LocationSchema = z.object({ id: z.number().optional(), name: z.string(), latitude: z.number(), longitude: z.number(), country: z.string().default(''), admin1: z.string().optional(), timezone: z.string().default('auto') })
const GeocodingSchema = z.object({ results: z.array(LocationSchema).optional() })
const HourlySchema = z.object({
  time: z.array(z.string()), temperature_2m: z.array(z.number().nullable()), apparent_temperature: z.array(z.number().nullable()),
  relative_humidity_2m: z.array(z.number().nullable()), precipitation_probability: z.array(z.number().nullable()), precipitation: z.array(z.number().nullable()),
  weather_code: z.array(z.number().nullable()), wind_speed_10m: z.array(z.number().nullable()), uv_index: z.array(z.number().nullable())
})
const ForecastSchema = z.object({ timezone: z.string(), hourly: HourlySchema })
export type Location = z.infer<typeof LocationSchema>
export type ForecastPoint = { time:string;temperature_2m:number;apparent_temperature:number;relative_humidity_2m:number;precipitation_probability:number;precipitation:number;weather_code:number;wind_speed_10m:number;uv_index:number;timezone:string }
export type ForecastWindow = { arrival:ForecastPoint;points:ForecastPoint[];summary:{durationHours:number;minTemperature:number;maxTemperature:number;minApparentTemperature:number;maxApparentTemperature:number;maxHumidity:number;maxPrecipitationProbability:number;totalPrecipitation:number;maxWindSpeed:number;maxUvIndex:number;temperatureChange:number} }
export function summarizeForecastPoints(points:ForecastPoint[],durationHours:number):ForecastWindow['summary'] { if(!points.length)throw new Error('No hay datos horarios para resumir');const temperatures=points.map(point=>point.temperature_2m),apparent=points.map(point=>point.apparent_temperature);return{durationHours,minTemperature:Math.min(...temperatures),maxTemperature:Math.max(...temperatures),minApparentTemperature:Math.min(...apparent),maxApparentTemperature:Math.max(...apparent),maxHumidity:Math.max(...points.map(point=>point.relative_humidity_2m)),maxPrecipitationProbability:Math.max(...points.map(point=>point.precipitation_probability)),totalPrecipitation:points.reduce((sum,point)=>sum+point.precipitation,0),maxWindSpeed:Math.max(...points.map(point=>point.wind_speed_10m)),maxUvIndex:Math.max(...points.map(point=>point.uv_index)),temperatureChange:temperatures.at(-1)!-temperatures[0]}}

async function fetchJson(url: string) { const response = await fetch(url, { cache: 'no-store' }); if (!response.ok) throw new Error('Open-Meteo no respondió correctamente'); return response.json() }
export async function geocode(query: string): Promise<Location[]> {
  const data = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=es&format=json`)
  return GeocodingSchema.parse(data).results ?? []
}
export async function getForecastWindow(latitude:number,longitude:number,timezone:string,dateTime:string,durationHours=3):Promise<ForecastWindow> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), timezone: timezone || 'auto', forecast_days: '16', hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index' })
  const forecast = ForecastSchema.parse(await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`))
  const target = Date.parse(dateTime); if (!Number.isFinite(target)) throw new Error('La fecha y hora no son válidas')
  let index = -1; let distance = Infinity
  forecast.hourly.time.forEach((time, i) => { const d = Math.abs(Date.parse(time) - target); if (d < distance) { index = i; distance = d } })
  if (index < 0 || distance > 60 * 60 * 1000) throw new Error('La fecha está fuera del rango disponible del pronóstico')
  const h=forecast.hourly,value=(values:(number|null)[],pointIndex:number)=>values[pointIndex]??0,toPoint=(pointIndex:number):ForecastPoint=>({time:h.time[pointIndex],temperature_2m:value(h.temperature_2m,pointIndex),apparent_temperature:value(h.apparent_temperature,pointIndex),relative_humidity_2m:value(h.relative_humidity_2m,pointIndex),precipitation_probability:value(h.precipitation_probability,pointIndex),precipitation:value(h.precipitation,pointIndex),weather_code:value(h.weather_code,pointIndex),wind_speed_10m:value(h.wind_speed_10m,pointIndex),uv_index:value(h.uv_index,pointIndex),timezone:forecast.timezone})
  const end=Math.min(index+durationHours,h.time.length-1),points=Array.from({length:end-index+1},(_,offset)=>toPoint(index+offset));if(points.length<durationHours+1)throw new Error('No hay suficientes horas disponibles para cubrir toda la estancia')
  return{arrival:points[0],points,summary:summarizeForecastPoints(points,durationHours)}
}
export async function getForecastPoint(latitude:number,longitude:number,timezone:string,dateTime:string){return(await getForecastWindow(latitude,longitude,timezone,dateTime,0)).arrival}
