import { NextResponse } from 'next/server'
import { z } from 'zod'
import { appendOutfitFeedback } from '../../../lib/google-sheets'
import { errorMessage } from '../../../lib/validators'

const schema=z.object({queryTimestamp:z.string().datetime(),thermalFeeling:z.enum(['cold','comfortable','hot']),layersAdequate:z.enum(['too_few','adequate','too_many']),rainItemUsed:z.boolean(),helpful:z.boolean()})
export async function POST(request:Request){
  try{const input=schema.parse(await request.json());await appendOutfitFeedback({timestamp:new Date().toISOString(),query_timestamp:input.queryTimestamp,thermal_feeling:input.thermalFeeling,layers_adequate:input.layersAdequate,rain_item_used:String(input.rainItemUsed),helpful:String(input.helpful)});return NextResponse.json({success:true,data:{saved:true}})}
  catch(error){return NextResponse.json({success:false,error:{code:'FEEDBACK_ERROR',message:errorMessage(error)}},{status:400})}
}
