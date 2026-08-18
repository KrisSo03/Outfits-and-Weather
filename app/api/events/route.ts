import { NextResponse } from 'next/server'
import { z } from 'zod'
import { appendInteractionEvent } from '../../../lib/google-sheets'

const schema=z.object({sessionId:z.string().uuid(),eventName:z.enum(['destination_search_started','destination_selected','quiz_started','quiz_completed','recommendation_generated','advanced_analysis_opened','carousel_changed','pinterest_opened','feedback_submitted','mode_changed','validation_error']),screen:z.string().max(40),durationMs:z.number().int().min(0).max(3_600_000).default(0),metadata:z.record(z.union([z.string(),z.number(),z.boolean(),z.null()])).default({})})
export async function POST(request:Request){try{const input=schema.parse(await request.json());await appendInteractionEvent({timestamp:new Date().toISOString(),session_id:input.sessionId,event_name:input.eventName,screen:input.screen,duration_ms:input.durationMs,metadata:JSON.stringify(input.metadata).slice(0,1000)});return NextResponse.json({success:true,data:{saved:true}})}catch{return NextResponse.json({success:false,error:{code:'EVENT_ERROR',message:'No se pudo registrar el evento.'}},{status:400})}}
