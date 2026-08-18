import { z } from 'zod'

export const preferencesSchema = z.object({
  gender: z.enum(['women', 'men', 'unisex']), style: z.enum(['casual', 'formal', 'sport', 'elegant', 'urban', 'minimalist', 'bohemian', 'classic', 'streetwear', 'romantic', 'business']),
  activity: z.enum(['work', 'university', 'walk', 'tourism', 'event', 'exercise', 'dinner', 'party', 'shopping', 'outdoors', 'beach', 'date', 'conference']), coldSensitivity: z.enum(['low', 'medium', 'high']),
  bodyShape: z.enum(['hourglass', 'triangle', 'inverted_triangle', 'rectangle', 'oval', 'unsure', 'prefer_not']).optional(),
  wardrobe: z.array(z.string().trim().min(1).max(60)).max(30).optional()
})
export const recommendationSchema = z.object({
  destination: z.object({ name: z.string().trim().min(1).max(100), country: z.string().trim().max(100).default(''), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), timezone: z.string().max(80).default('auto') }),
  arrivalDateTime: z.string().min(1), stayDurationHours: z.union([z.literal(1),z.literal(3),z.literal(6),z.literal(12)]).default(3), preference: preferencesSchema
})
export function errorMessage(error: unknown) { return error instanceof z.ZodError ? 'Los datos enviados no son válidos.' : error instanceof Error ? error.message : 'Ocurrió un error inesperado.' }
