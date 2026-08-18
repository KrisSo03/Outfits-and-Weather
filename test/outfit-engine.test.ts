import { describe, it, expect } from 'vitest'
import { recommendOutfit } from '../lib/outfit-engine'

describe('Outfit engine', () => {
  it('destino frío, lluvia alta y viento fuerte', () => {
    const rec = recommendOutfit({ gender: 'women', style: 'casual', activity: 'tourism', coldSensitivity: 'medium' }, { originTemp: 25, originHum: 60, destTemp: 10, apparentTemp: 8, destHum: 80, precipProb: 80, precip: 5, wind: 25, uv: 2 })
    expect(rec.alerts.length).toBeGreaterThan(0)
    expect(rec.outerwear).toContain('Chaqueta impermeable')
  })

  it('destino muy cálido con UV alto', () => {
    const rec = recommendOutfit({ gender: 'men', style: 'casual', activity: 'walk', coldSensitivity: 'low' }, { originTemp: 20, originHum: 50, destTemp: 35, apparentTemp: 36, destHum: 40, precipProb: 0, precip: 0, wind: 5, uv: 8 })
    expect(rec.accessories.join(' ')).toMatch(/Protector solar/)
  })

  it('destino templado y seco', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'urban', activity: 'work', coldSensitivity: 'medium' }, { originTemp: 22, originHum: 50, destTemp: 20, apparentTemp: 20, destHum: 45, precipProb: 10, precip: 0, wind: 5, uv: 3 })
    expect(rec.layers).toBeGreaterThanOrEqual(1)
  })

  it('usuario alta sensibilidad al frío', () => {
    const rec = recommendOutfit({ gender: 'women', style: 'formal', activity: 'event', coldSensitivity: 'high' }, { originTemp: 22, originHum: 50, destTemp: 15, apparentTemp: 14, destHum: 60, precipProb: 20, precip: 0, wind: 10, uv: 2 })
    expect(rec.layers).toBeGreaterThanOrEqual(3)
  })

  it('usuario baja sensibilidad al frío', () => {
    const rec = recommendOutfit({ gender: 'men', style: 'casual', activity: 'university', coldSensitivity: 'low' }, { originTemp: 22, originHum: 50, destTemp: 12, apparentTemp: 11, destHum: 60, precipProb: 20, precip: 0, wind: 10, uv: 2 })
    expect(rec.layers).toBeLessThanOrEqual(3)
  })

  it('destino 10°C más frío que el origen', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'casual', activity: 'walk', coldSensitivity: 'medium' }, { originTemp: 25, originHum: 50, destTemp: 15, apparentTemp: 14, destHum: 60, precipProb: 10, precip: 0, wind: 5, uv: 2 })
    expect(rec.alerts.join(' ')).toMatch(/más frío/)
  })

  it('destino 8°C más cálido que el origen', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'casual', activity: 'walk', coldSensitivity: 'medium' }, { originTemp: 15, originHum: 50, destTemp: 23, apparentTemp: 23, destHum: 60, precipProb: 10, precip: 0, wind: 5, uv: 2 })
    expect(rec.alerts.join(' ')).toMatch(/más cálido/)
  })

  it('cambia las prendas cuando cambia el estilo', () => {
    const weather = { originTemp: 24, originHum: 55, destTemp: 21, apparentTemp: 20, destHum: 60, precipProb: 10, precip: 0, wind: 5, uv: 3 }
    const classic = recommendOutfit({ gender: 'unisex', style: 'classic', activity: 'dinner', coldSensitivity: 'medium' }, weather)
    const street = recommendOutfit({ gender: 'unisex', style: 'streetwear', activity: 'dinner', coldSensitivity: 'medium' }, weather)
    expect(classic.top).not.toEqual(street.top)
    expect(classic.bottom).not.toEqual(street.bottom)
    expect(classic.explanation).not.toEqual(street.explanation)
  })

  it('adapta calzado y accesorios a la actividad', () => {
    const weather = { originTemp: 24, originHum: 55, destTemp: 27, apparentTemp: 28, destHum: 65, precipProb: 10, precip: 0, wind: 5, uv: 4 }
    const beach = recommendOutfit({ gender: 'women', style: 'bohemian', activity: 'beach', coldSensitivity: 'medium' }, weather)
    const conference = recommendOutfit({ gender: 'women', style: 'bohemian', activity: 'conference', coldSensitivity: 'medium' }, weather)
    expect(beach.footwear).not.toEqual(conference.footwear)
    expect(beach.accessories).not.toEqual(conference.accessories)
  })

  it('personaliza cortes según la forma corporal opcional', () => {
    const weather = { originTemp: 24, originHum: 55, destTemp: 21, apparentTemp: 20, destHum: 60, precipProb: 10, precip: 0, wind: 5, uv: 3 }
    const triangle = recommendOutfit({ gender: 'unisex', style: 'classic', activity: 'work', coldSensitivity: 'medium', bodyShape: 'triangle' }, weather)
    const rectangle = recommendOutfit({ gender: 'unisex', style: 'classic', activity: 'work', coldSensitivity: 'medium', bodyShape: 'rectangle' }, weather)
    expect(triangle.top).not.toEqual(rectangle.top)
    expect(triangle.reasons.some(reason => reason.rule === 'forma_triangle')).toBe(true)
  })

  it('continúa funcionando cuando se omite la forma corporal', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'minimalist', activity: 'tourism', coldSensitivity: 'medium' }, { originTemp: 23, originHum: 55, destTemp: 19, apparentTemp: 18, destHum: 60, precipProb: 20, precip: 0, wind: 8, uv: 3 })
    expect(rec.top.length).toBeGreaterThan(0)
    expect(rec.reasons.some(reason => reason.rule.startsWith('forma_'))).toBe(false)
  })

  it('genera tres looks distintos para el carrusel editorial', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'elegant', activity: 'dinner', coldSensitivity: 'medium' }, { originTemp: 24, originHum: 55, destTemp: 18, apparentTemp: 17, destHum: 70, precipProb: 65, precip: 2, wind: 16, uv: 2 })
    expect(rec.lookVariants.map(look => look.id)).toEqual(['principal', 'editorial', 'functional'])
    expect(new Set(rec.lookVariants.map(look => look.pinterestQuery)).size).toBe(3)
    expect(rec.lookVariants.every(look => look.palette.length >= 2 && look.pieces.length >= 4)).toBe(true)
  })

  it('compara las necesidades del look con el armario opcional', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'casual', activity: 'tourism', coldSensitivity: 'medium', wardrobe: ['camiseta', 'jeans', 'suéter', 'botas impermeables', 'impermeable'] }, { originTemp: 25, originHum: 60, destTemp: 15, apparentTemp: 13, destHum: 80, precipProb: 80, precip: 3, wind: 10, uv: 2 })
    expect(rec.wardrobePlan?.coverage).toBeGreaterThan(70)
    expect(rec.wardrobePlan?.available).toContain('impermeable')
    expect(rec.modelVersion).toMatch(/smarttrip-hybrid/)
  })

  it('no genera diagnóstico de armario cuando se omite', () => {
    const rec = recommendOutfit({ gender: 'unisex', style: 'classic', activity: 'work', coldSensitivity: 'medium' }, { originTemp: 22, originHum: 55, destTemp: 20, apparentTemp: 20, destHum: 60, precipProb: 10, precip: 0, wind: 5, uv: 3 })
    expect(rec.wardrobePlan).toBeUndefined()
  })
})
