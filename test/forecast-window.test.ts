import { describe,expect,it } from 'vitest'
import { summarizeForecastPoints,type ForecastPoint } from '../lib/open-meteo'

const point=(hour:number,temp:number,apparent:number,rain:number,wind:number,precipitation=0):ForecastPoint=>({time:`2026-08-17T${String(hour).padStart(2,'0')}:00`,temperature_2m:temp,apparent_temperature:apparent,relative_humidity_2m:60+rain/5,precipitation_probability:rain,precipitation,weather_code:rain>=60?61:1,wind_speed_10m:wind,uv_index:4,timezone:'America/Costa_Rica'})
describe('Ventana de pronóstico',()=>{
  it('resume llegada y las siguientes tres horas usando extremos',()=>{const summary=summarizeForecastPoints([point(15,20,20,10,8),point(16,19,18,30,12),point(17,17,15,70,18,1),point(18,15,13,85,24,3)],3);expect(summary.minApparentTemperature).toBe(13);expect(summary.maxPrecipitationProbability).toBe(85);expect(summary.totalPrecipitation).toBe(4);expect(summary.maxWindSpeed).toBe(24);expect(summary.temperatureChange).toBe(-5)})
  it('no permite resumir una ventana vacía',()=>{expect(()=>summarizeForecastPoints([],3)).toThrow(/datos horarios/)})
})
