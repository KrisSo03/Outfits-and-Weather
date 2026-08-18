import { describe, expect, it } from 'vitest'
import { analyzeRecommendation, buildHistoricalProfile } from '../lib/data-science'
import { recommendOutfit, type Preference, type WeatherInput } from '../lib/outfit-engine'
import type { SensorReading } from '../lib/google-sheets'

function history(temperatures:number[]):SensorReading[] { return temperatures.map((temperature,index)=>({timestamp:new Date(Date.now()-(temperatures.length-index)*60_000).toISOString(),indoor_temperature:temperature,indoor_humidity:60+index%3,indoor_pressure:1012,interaction:'automatic',comfort_status:'COMFORTABLE',data_source:'test'})) }
const preference:Preference={gender:'unisex',style:'classic',activity:'tourism',coldSensitivity:'medium'}
const destination:WeatherInput={originTemp:25,originHum:60,destTemp:15,apparentTemp:12,destHum:80,precipProb:20,precip:0,wind:8,uv:2}

describe('Modelo histórico explicable',()=>{
  it('calcula baseline robusto, variabilidad y tendencia',()=>{
    const profile=buildHistoricalProfile(history([22,22.5,23,23.5,24]))
    expect(profile.sampleSize).toBe(5)
    expect(profile.effectiveOriginTemperature).toBeGreaterThan(23)
    expect(profile.temperatureTrendPerHour).toBeGreaterThan(0)
    expect(profile.temperatureStdDev).toBeGreaterThan(0)
  })
  it('el histórico cambia el índice y las capas recomendadas',()=>{
    const warmProfile=buildHistoricalProfile(history([28,28,29,29,30]))
    const coolProfile=buildHistoricalProfile(history([16,16,17,17,18]))
    const warmModel=analyzeRecommendation(warmProfile,destination,preference)
    const coolModel=analyzeRecommendation(coolProfile,destination,preference)
    expect(warmModel.thermalAdaptationScore).toBeGreaterThan(coolModel.thermalAdaptationScore)
    expect(recommendOutfit(preference,destination,warmModel).layers).toBeGreaterThanOrEqual(recommendOutfit(preference,destination,coolModel).layers)
  })
  it('puntúa prendas con factores trazables',()=>{
    const profile=buildHistoricalProfile(history([24,24.5,25,25.5,26]))
    const model=analyzeRecommendation(profile,{...destination,precipProb:90,precip:4,wind:25},preference)
    expect(model.garmentScores[0].score).toBeGreaterThan(0)
    expect(model.garmentScores.every(item=>item.factors.length>0)).toBe(true)
  })
  it('calcula variables derivadas y detecta valores atípicos robustos',()=>{
    const profile=buildHistoricalProfile(history([24,24.1,23.9,24.2,24,40,24.1,23.8]))
    expect(profile.dewPoint).toBeTypeOf('number')
    expect(profile.absoluteHumidity).toBeGreaterThan(0)
    expect(profile.outlierCount).toBeGreaterThan(0)
  })
  it('descubre regímenes y produce contrafactuales e importancia',()=>{
    const profile=buildHistoricalProfile(history([18,18.2,18.4,25,25.2,25.4,30,30.2,30.4]))
    const model=analyzeRecommendation(profile,destination,preference)
    expect(profile.regimes.length).toBeGreaterThan(1)
    expect(model.featureImportance.reduce((sum,item)=>sum+item.importance,0)).toBeGreaterThanOrEqual(98)
    expect(model.counterfactuals).toHaveLength(3)
  })
})
