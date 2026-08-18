import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_SPREADSHEET_ID: z.string(),
  GOOGLE_SENSOR_SHEET_NAME: z.string().default('sensor_readings'),
  GOOGLE_QUERIES_SHEET_NAME: z.string().default('travel_queries'),
  GOOGLE_FEEDBACK_SHEET_NAME: z.string().default('outfit_feedback')
  ,GOOGLE_EVENTS_SHEET_NAME: z.string().default('interaction_events')
})

export const env = envSchema.parse({
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID || '1GXkIZUXrm_zW6Wn_XSkwf5H6_y9ShQzO52m5FCVv3TM',
  GOOGLE_SENSOR_SHEET_NAME: process.env.GOOGLE_SENSOR_SHEET_NAME,
  GOOGLE_QUERIES_SHEET_NAME: process.env.GOOGLE_QUERIES_SHEET_NAME,
  GOOGLE_FEEDBACK_SHEET_NAME: process.env.GOOGLE_FEEDBACK_SHEET_NAME,
  GOOGLE_EVENTS_SHEET_NAME: process.env.GOOGLE_EVENTS_SHEET_NAME
})
