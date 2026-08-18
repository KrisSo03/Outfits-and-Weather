import { NextResponse } from 'next/server'
import { getSensorReadings, appendTravelQuery, type TravelQuery } from '../../../lib/google-sheets'
import { getForecastWindow } from '../../../lib/open-meteo'
import { recommendOutfit } from '../../../lib/outfit-engine'
import { recommendationSchema, errorMessage } from '../../../lib/validators'
import { codeToSpanish } from '../../../lib/weather-codes'
import { analyzeRecommendation, buildHistoricalProfile } from '../../../lib/data-science'

export async function POST(request: Request) {
  try {
    const input = recommendationSchema.parse(await request.json())
    const readings = await getSensorReadings(); const origin = readings.at(-1); if (!origin) throw new Error('No hay lecturas válidas del ESP32')
    const forecastWindow = await getForecastWindow(input.destination.latitude, input.destination.longitude, input.destination.timezone, input.arrivalDateTime, input.stayDurationHours)
    const forecast=forecastWindow.arrival,summary=forecastWindow.summary
    const representativeApparent=summary.minApparentTemperature<18?summary.minApparentTemperature:summary.maxApparentTemperature
    const weather = { originTemp: origin.indoor_temperature, originHum: origin.indoor_humidity, destTemp: forecast.temperature_2m, apparentTemp: representativeApparent, destHum: summary.maxHumidity, precipProb: summary.maxPrecipitationProbability, precip: summary.totalPrecipitation, wind: summary.maxWindSpeed, uv: summary.maxUvIndex }
    const profile = buildHistoricalProfile(readings)
    const dataScience = analyzeRecommendation(profile, weather, input.preference)
    const recommendation = recommendOutfit(input.preference, weather, dataScience)
    const queryTimestamp = new Date().toISOString()
    const row: TravelQuery = { timestamp: queryTimestamp, origin_temperature: origin.indoor_temperature, origin_humidity: origin.indoor_humidity, destination_name: input.destination.name, destination_country: input.destination.country, destination_latitude: input.destination.latitude, destination_longitude: input.destination.longitude, arrival_datetime: forecast.time, destination_temperature: weather.destTemp, apparent_temperature: weather.apparentTemp, destination_humidity: weather.destHum, precipitation_probability: weather.precipProb, wind_speed: weather.wind, uv_index: weather.uv, temperature_difference: weather.destTemp - weather.originTemp, gender_preference: input.preference.gender, style_preference: input.preference.style, activity_type: input.preference.activity, cold_sensitivity: input.preference.coldSensitivity, outfit_category: recommendation.thermalCategory, outfit_recommendation: recommendation.explanation, pinterest_query: recommendation.pinterestQuery }
    await appendTravelQuery(row)
    const timeline=forecastWindow.points.map((point,index)=>({ ...point,description:codeToSpanish(point.weather_code),adjustment:point.precipitation_probability>=60?'Usa la protección impermeable':point.wind_speed_10m>=20?'Añade la capa cortaviento':point.apparent_temperature<=representativeApparent+1&&representativeApparent<18?'Usa todas las capas recomendadas':index===0?'Outfit base':'Mantén capas removibles' }))
    return NextResponse.json({ success: true, data: { origin, destination: input.destination, forecast: { ...forecast, description: codeToSpanish(forecast.weather_code) }, forecastWindow:{summary,timeline}, comparison: { temperatureDifference: forecast.temperature_2m - weather.originTemp, humidityDifference: forecast.relative_humidity_2m - weather.originHum }, recommendation, queryTimestamp } })
  } catch (error) { return NextResponse.json({ success: false, error: { code: 'RECOMMENDATION_ERROR', message: errorMessage(error) } }, { status: 400 }) }
}
