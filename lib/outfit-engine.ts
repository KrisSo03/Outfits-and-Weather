import type { DataScienceResult } from './data-science'

export type Preference = {
  gender: 'women' | 'men' | 'unisex'
  style: 'casual' | 'formal' | 'sport' | 'elegant' | 'urban' | 'minimalist' | 'bohemian' | 'classic' | 'streetwear' | 'romantic' | 'business'
  activity: 'work' | 'university' | 'walk' | 'tourism' | 'event' | 'exercise' | 'dinner' | 'party' | 'shopping' | 'outdoors' | 'beach' | 'date' | 'conference'
  coldSensitivity: 'low' | 'medium' | 'high'
  bodyShape?: 'hourglass' | 'triangle' | 'inverted_triangle' | 'rectangle' | 'oval' | 'unsure' | 'prefer_not'
  wardrobe?: string[]
}
export type WeatherInput = { originTemp: number; originHum: number; destTemp: number; apparentTemp: number; destHum: number; precipProb: number; precip: number; wind: number; uv: number }
export type LookVariant = { id:'principal'|'editorial'|'functional'; eyebrow:string; title:string; concept:string; palette:{name:string;hex:string}[]; pieces:string[]; climateFit:number; pinterestQuery:string }
export const OUTFIT_MODEL_VERSION='smarttrip-hybrid-2.2'
export type OutfitRecommendation = { modelVersion:string; thermalCategory: string; layers: number; top: string[]; bottom: string[]; outerwear: string[]; footwear: string[]; accessories: string[]; alerts: string[]; explanation: string; pinterestQuery: string; reasons: { rule: string; explanation: string }[]; lookVariants:LookVariant[]; wardrobePlan?:{available:string[];missing:string[];coverage:number}; dataScience?: DataScienceResult }

type StyleProfile = { top: string; bottom: string; shoe: string; layer: string; detail: string; palette: string }
const styles: Record<Preference['style'], StyleProfile> = {
  casual: { top: 'camiseta de algodón de corte limpio', bottom: 'jeans de corte recto', shoe: 'tenis minimalistas', layer: 'sobrecamisa', detail: 'una silueta relajada pero pulida', palette: 'neutros cálidos y azul denim' },
  formal: { top: 'camisa estructurada', bottom: 'pantalón de vestir con pinzas', shoe: 'zapatos de vestir', layer: 'blazer estructurado', detail: 'líneas definidas y proporciones precisas', palette: 'negro, marfil y azul noche' },
  sport: { top: 'camiseta técnica transpirable', bottom: 'pantalón deportivo tapered', shoe: 'tenis con soporte', layer: 'chaqueta técnica ligera', detail: 'movilidad, ventilación y tejidos de secado rápido', palette: 'gris grafito con un acento vibrante' },
  elegant: { top: 'top de tejido fluido', bottom: 'pantalón palazzo de caída limpia', shoe: 'calzado estilizado de tacón cómodo', layer: 'abrigo de corte largo', detail: 'una silueta alargada con acabados refinados', palette: 'negro, crema y borgoña' },
  urban: { top: 'camiseta gráfica de buena estructura', bottom: 'pantalón cargo de corte moderno', shoe: 'tenis urbanos', layer: 'bomber ligera', detail: 'capas funcionales y proporciones contemporáneas', palette: 'carbón, oliva y blanco' },
  minimalist: { top: 'top liso de cuello limpio', bottom: 'pantalón recto sin detalles', shoe: 'mocasines depurados', layer: 'gabardina sin adornos', detail: 'volúmenes simples y ausencia de elementos innecesarios', palette: 'marfil, arena y negro' },
  bohemian: { top: 'blusa de textura natural', bottom: 'pantalón amplio de lino', shoe: 'sandalias de cuero suave', layer: 'kimono ligero', detail: 'movimiento, textura y superposición relajada', palette: 'terracota, crema y verde salvia' },
  classic: { top: 'camisa Oxford atemporal', bottom: 'pantalón chino de corte recto', shoe: 'mocasines clásicos', layer: 'trench clásico', detail: 'piezas atemporales y proporción equilibrada', palette: 'camel, marino y blanco' },
  streetwear: { top: 'camiseta oversize de gramaje medio', bottom: 'pantalón cargo amplio', shoe: 'sneakers protagonistas', layer: 'bomber oversize', detail: 'contraste de volúmenes y una pieza protagonista', palette: 'negro, gris cemento y un color acento' },
  romantic: { top: 'blusa suave con detalle delicado', bottom: 'falda midi fluida', shoe: 'bailarinas o tacón bajo', layer: 'cárdigan fino', detail: 'texturas suaves y líneas fluidas', palette: 'rosa empolvado, crema y vino' },
  business: { top: 'camisa impecable o top sastre', bottom: 'pantalón sastre de tiro medio', shoe: 'mocasines o zapatos ejecutivos', layer: 'blazer coordinado', detail: 'autoridad visual, comodidad y estructura', palette: 'azul noche, gris piedra y marfil' }
}
const paletteHex:Record<Preference['style'],{name:string;hex:string}[]>={
  casual:[{name:'Denim',hex:'#52677d'},{name:'Marfil',hex:'#f3eee4'},{name:'Camel',hex:'#a77b50'}],formal:[{name:'Negro',hex:'#171412'},{name:'Marfil',hex:'#f5f0e8'},{name:'Noche',hex:'#1f2a44'}],sport:[{name:'Grafito',hex:'#454545'},{name:'Blanco',hex:'#f8f8f4'},{name:'Cobalto',hex:'#234f9b'}],elegant:[{name:'Negro',hex:'#171412'},{name:'Crema',hex:'#e9dfcf'},{name:'Borgoña',hex:'#7b1e32'}],urban:[{name:'Carbón',hex:'#34312f'},{name:'Oliva',hex:'#68705a'},{name:'Blanco',hex:'#f7f6f1'}],minimalist:[{name:'Marfil',hex:'#f5f0e8'},{name:'Arena',hex:'#c9ad88'},{name:'Negro',hex:'#171412'}],bohemian:[{name:'Terracota',hex:'#a8553a'},{name:'Crema',hex:'#efe2ce'},{name:'Salvia',hex:'#82927a'}],classic:[{name:'Camel',hex:'#a77b50'},{name:'Marino',hex:'#202a44'},{name:'Blanco',hex:'#f7f6f1'}],streetwear:[{name:'Negro',hex:'#171412'},{name:'Cemento',hex:'#77736f'},{name:'Rojo',hex:'#9c293c'}],romantic:[{name:'Rosa',hex:'#d5a8ab'},{name:'Crema',hex:'#f5eadc'},{name:'Vino',hex:'#713142'}],business:[{name:'Noche',hex:'#222c43'},{name:'Piedra',hex:'#99938b'},{name:'Marfil',hex:'#f5f0e8'}]
}
const activityNotes: Record<Preference['activity'], { adjustment: string; accessory: string; shoe?: string }> = {
  work: { adjustment: 'prioriza prendas pulidas que permitan una jornada completa', accessory: 'bolso o portadocumentos estructurado' }, university: { adjustment: 'permite movimiento y capas fáciles de guardar', accessory: 'mochila compacta' }, walk: { adjustment: 'evita largos incómodos y prioriza libertad de movimiento', accessory: 'bolso cruzado ligero', shoe: 'calzado con suela acolchada' }, tourism: { adjustment: 'equilibra presencia en fotografías con comodidad prolongada', accessory: 'bolso cruzado seguro', shoe: 'calzado cómodo para recorrer la ciudad' }, event: { adjustment: 'eleva el acabado y conserva una silueta especial', accessory: 'accesorio protagonista discreto' }, exercise: { adjustment: 'usa tejidos técnicos, elásticos y de secado rápido', accessory: 'botella reutilizable', shoe: 'tenis deportivos adecuados al ejercicio' }, dinner: { adjustment: 'refina la silueta para una transición elegante de tarde a noche', accessory: 'joyería o reloj discreto' }, party: { adjustment: 'incorpora una textura o pieza protagonista sin perder movilidad', accessory: 'bolso pequeño seguro' }, shopping: { adjustment: 'facilita caminar y probar capas durante varias horas', accessory: 'bolso liviano', shoe: 'calzado acolchado fácil de quitar' }, outdoors: { adjustment: 'prioriza resistencia, libertad de movimiento y secado rápido', accessory: 'mochila ligera', shoe: 'calzado de senderismo con agarre' }, beach: { adjustment: 'elige fibras frescas, prendas fáciles de poner y protección solar', accessory: 'sombrero de ala y bolso resistente al agua', shoe: 'sandalias resistentes al agua' }, date: { adjustment: 'elige una pieza con personalidad y un conjunto que se sienta natural', accessory: 'accesorio focal equilibrado' }, conference: { adjustment: 'proyecta autoridad sin sacrificar comodidad al estar sentado', accessory: 'bolso estructurado para documentos' }
}

function category(temp: number) { if (temp >= 30) return 'muy cálido'; if (temp >= 24) return 'cálido'; if (temp >= 18) return 'templado'; if (temp >= 12) return 'fresco'; return 'frío' }
function genderAdjustment(gender: Preference['gender'], bottom: string) {
  if (gender === 'women' && bottom.includes('pantalón')) return `${bottom} — o falda midi si prefieres una silueta femenina`
  if (gender === 'men' && bottom.includes('falda')) return 'pantalón de vestir de caída fluida'
  return bottom
}
function unique(values: string[]) { return [...new Set(values)] }

const bodyShapeAdvice: Record<NonNullable<Preference['bodyShape']>, { top: string; bottom: string; explanation: string }> = {
  hourglass: { top: 'con definición suave en la cintura', bottom: 'de tiro medio o alto y caída limpia', explanation: 'mantener el equilibrio natural entre hombros y cadera y definir la cintura sin comprimir' },
  triangle: { top: 'con estructura, textura o interés visual en hombros', bottom: 'de línea recta y acabado limpio', explanation: 'llevar atención al torso y conservar una línea fluida en la parte inferior' },
  inverted_triangle: { top: 'de líneas limpias y hombro sin volumen extra', bottom: 'con caída amplia, pinzas o volumen moderado', explanation: 'suavizar la línea de hombros y aportar equilibrio visual en la parte inferior' },
  rectangle: { top: 'con capas cortas o detalle que sugiera cintura', bottom: 'de tiro alto o con volumen controlado', explanation: 'crear dimensión y una cintura visual mediante proporción y superposición' },
  oval: { top: 'de línea vertical, cuello abierto y caída que no se adhiera', bottom: 'recto y continuo, sin volumen innecesario', explanation: 'favorecer líneas verticales, buen ajuste en hombros y tejidos con caída' },
  unsure: { top: 'con ajuste correcto en hombros y libertad en el torso', bottom: 'de corte recto y proporción equilibrada', explanation: 'usar proporciones universales y priorizar el ajuste personal' },
  prefer_not: { top: '', bottom: '', explanation: '' }
}

export function recommendOutfit(pref: Preference, w: WeatherInput, dataScience?: DataScienceResult): OutfitRecommendation {
  const felt = Number.isFinite(w.apparentTemp) ? w.apparentTemp : w.destTemp
  const thermalCategory = category(felt), profile = styles[pref.style], activity = activityNotes[pref.activity]
  let layers = thermalCategory === 'frío' ? 3 : thermalCategory === 'fresco' || thermalCategory === 'templado' ? 2 : 1
  if (pref.coldSensitivity === 'high') layers += 1
  if (pref.coldSensitivity === 'low' && layers > 1) layers -= 1
  if (dataScience?.thermalAdaptationScore !== undefined) {
    const destinationIsColder = w.apparentTemp < dataScience.profile.effectiveOriginTemperature
    if (destinationIsColder && dataScience.thermalAdaptationScore >= 70) layers = Math.max(layers, 3)
    else if (destinationIsColder && dataScience.thermalAdaptationScore >= 40) layers = Math.max(layers, 2)
  }
  const warm = felt >= 24, cold = felt < 18
  const shape = pref.bodyShape ? bodyShapeAdvice[pref.bodyShape] : null
  const topBase = warm ? `${profile.top}, en lino, algodón o viscosa ligera` : cold ? `${profile.top} sobre una base térmica fina` : profile.top
  const bottomBase = genderAdjustment(pref.gender, warm ? `${profile.bottom}, en tejido fresco` : profile.bottom)
  const top = [`${topBase}${shape?.top ? `, ${shape.top}` : ''}`]
  const bottom = [`${bottomBase}${shape?.bottom ? `, ${shape.bottom}` : ''}`]
  const outerwear: string[] = layers > 1 ? [cold ? `${profile.layer} con suficiente espacio para superponer` : profile.layer] : []
  const footwear = [activity.shoe ?? profile.shoe], accessories = [activity.accessory], alerts: string[] = []
  const reasons = [
    { rule: `estilo_${pref.style}`, explanation: `El estilo ${pref.style} define ${profile.detail} y una paleta de ${profile.palette}.` },
    { rule: `actividad_${pref.activity}`, explanation: `Para esta actividad, ${activity.adjustment}.` },
    { rule: `sensibilidad_${pref.coldSensitivity}`, explanation: `La sensibilidad al frío ${pref.coldSensitivity} ajusta el conjunto a ${layers} capa${layers === 1 ? '' : 's'}.` }
  ]
  if (shape?.explanation) reasons.push({ rule: `forma_${pref.bodyShape}`, explanation: `Según la forma corporal indicada, conviene ${shape.explanation}. Es una guía de proporción, no una regla sobre qué cuerpos pueden usar cada prenda.` })
  if (w.precipProb >= 60 || w.precip > 0) { outerwear.unshift('Chaqueta impermeable'); outerwear.push('Elige un corte compatible con la silueta del conjunto'); footwear[0] = `${footwear[0]}, en versión cerrada y resistente al agua`; accessories.push('paraguas compacto'); reasons.push({ rule: 'lluvia', explanation: 'La lluvia exige protección impermeable sin abandonar la silueta elegida.' }) }
  if (w.wind >= 20) { outerwear.push('capa cortaviento ligera'); reasons.push({ rule: 'viento', explanation: 'El viento fuerte requiere una capa exterior que cierre bien en cuello y puños.' }) }
  if (w.uv >= 6) { accessories.push('Protector solar SPF 50', 'lentes con protección UV'); if (pref.activity !== 'dinner' && pref.activity !== 'event') accessories.push('sombrero o gorra acorde al estilo'); reasons.push({ rule: 'uv', explanation: 'El índice UV alto requiere protección de piel y ojos.' }) }
  if (w.destHum >= 75 && warm) { reasons.push({ rule: 'humedad_calor', explanation: 'La humedad alta favorece fibras naturales, holgura y colores que no retengan calor.' }) }
  if (dataScience) {
    const recommendedScores=dataScience.garmentScores.filter(item=>item.score>=55)
    for (const item of recommendedScores) {
      if (item.garment==='capa térmica'&&!top.some(value=>value.includes('térmica'))) top.push('capa base térmica fina y transpirable')
      if (item.garment==='chaqueta impermeable'&&!outerwear.includes('Chaqueta impermeable')) outerwear.unshift('Chaqueta impermeable')
      if (item.garment==='rompevientos'&&!outerwear.some(value=>value.includes('cortaviento'))) outerwear.push('capa cortaviento ligera')
      if (item.garment==='calzado impermeable'&&!footwear[0].includes('resistente al agua')) footwear[0]=`${footwear[0]}, resistente al agua`
      if (item.garment==='tejidos transpirables') accessories.push('prioriza fibras transpirables y holgura controlada')
      if (item.garment==='protección solar'&&!accessories.some(value=>value.includes('Protector solar'))) accessories.push('Protector solar SPF 50')
    }
    reasons.push({ rule: 'baseline_historico', explanation: `El origen efectivo combina última lectura, promedio móvil exponencial y mediana histórica: ${dataScience.profile.effectiveOriginTemperature.toFixed(1)} °C con ${dataScience.profile.sampleSize} observaciones.` })
    reasons.push({ rule: 'indice_adaptacion', explanation: `El índice de adaptación térmica fue ${dataScience.thermalAdaptationScore}/100 y ajustó capas y prendas según los factores dominantes.` })
  }
  const delta = w.destTemp - w.originTemp
  if (delta <= -5) { alerts.push(`El destino estará ${Math.round(-delta)} °C más frío que tu origen; lleva la capa exterior contigo.`); reasons.push({ rule: 'delta_frio', explanation: 'El cambio térmico entre origen y destino justifica una capa removible.' }) }
  if (delta >= 5) { alerts.push(`El destino estará ${Math.round(delta)} °C más cálido que tu origen; evita tejidos pesados.`); reasons.push({ rule: 'delta_calor', explanation: 'El cambio hacia calor exige materiales más frescos.' }) }
  const shapeText = shape?.explanation ? ` Para la forma corporal indicada, la propuesta busca ${shape.explanation}.` : ''
  const explanation = `Propuesta de modista: una silueta ${pref.style} pensada para ${pref.activity}, en ${profile.palette}. ${activity.adjustment.charAt(0).toUpperCase() + activity.adjustment.slice(1)}.${shapeText} Con sensación térmica de ${felt.toFixed(1)} °C, usa ${layers} capa${layers === 1 ? '' : 's'} y procura que cada una pueda retirarse sin perder la coherencia del conjunto.`
  const mainPieces = [...top, ...bottom, ...outerwear].slice(0, 3).join(' ')
  const pinterestQuery = `${pref.gender} ${pref.style} ${pref.activity} ${thermalCategory} ${w.precipProb >= 60 ? 'rainy waterproof' : ''} ${mainPieces} outfit`.replace(/\s+/g, ' ').trim()
  const mainLookPieces=unique([...top,...bottom,...outerwear,...footwear]).slice(0,6)
  const fitBase=dataScience?.confidence??72, rain=w.precipProb>=60?' impermeable':'', wind=w.wind>=20?' cortaviento':''
  const lookVariants:LookVariant[]=[
    {id:'principal',eyebrow:'01 · Selección del modista',title:'El look esencial',concept:`La interpretación más equilibrada de tu estilo ${pref.style}, la actividad y el clima previsto.`,palette:paletteHex[pref.style],pieces:mainLookPieces,climateFit:Math.min(98,82+Math.round(fitBase*.12)),pinterestQuery},
    {id:'editorial',eyebrow:'02 · Fashion edit',title:'La versión editorial',concept:`Más intención visual: juega con proporción, textura y un acento ${paletteHex[pref.style][2].name.toLowerCase()} sin perder protección climática.`,palette:[paletteHex[pref.style][2],paletteHex[pref.style][0],paletteHex[pref.style][1]],pieces:unique([`${profile.top} con acabado protagonista`,genderAdjustment(pref.gender,profile.bottom),`${profile.layer} de línea marcada`,profile.shoe,'accesorio focal']).slice(0,6),climateFit:Math.min(95,76+Math.round(fitBase*.12)),pinterestQuery:`${pref.gender} editorial ${pref.style}${rain}${wind} ${pref.activity} outfit`},
    {id:'functional',eyebrow:'03 · Smart utility',title:'La versión funcional',concept:`Prioriza movimiento, capas removibles y desempeño para ${pref.activity}; conserva la paleta y la silueta del perfil.`,palette:[paletteHex[pref.style][0],paletteHex[pref.style][1]],pieces:unique([top[0],bottom[0],...(outerwear.length?outerwear:['capa ligera empacable']),footwear[0],activity.accessory]).slice(0,6),climateFit:Math.min(99,88+Math.round(fitBase*.1)),pinterestQuery:`${pref.gender} practical ${pref.style}${rain}${wind} ${pref.activity} travel outfit`}
  ]
  const wardrobe=(pref.wardrobe??[]).map(item=>item.toLowerCase()),requirements=['parte superior','parte inferior',...(layers>1?['suéter o capa ligera']:[]),...(w.precipProb>=60?['impermeable']:[]),...(w.wind>=20?['rompevientos']:[]),...((w.precipProb>=60||w.precip>0)?['calzado resistente al agua']:['calzado cómodo']),...(w.uv>=6?['protección solar']:[])]
  const aliases:Record<string,string[]>={'parte superior':['camiseta','camisa','blusa','top'],'parte inferior':['pantalón','falda','short','jeans'],'suéter o capa ligera':['suéter','cardigan','cárdigan','chaqueta','sobrecamisa'],'impermeable':['impermeable','poncho','trench'],'rompevientos':['rompevientos','cortaviento'],'calzado resistente al agua':['botas impermeables','calzado impermeable'],'calzado cómodo':['tenis','mocasines','sandalias','botas'],'protección solar':['protector solar','gorra','sombrero','lentes de sol']}
  const available=requirements.filter(requirement=>aliases[requirement].some(alias=>wardrobe.some(item=>item.includes(alias)))),missing=requirements.filter(requirement=>!available.includes(requirement)),wardrobePlan=pref.wardrobe?.length?{available,missing,coverage:Math.round(available.length/requirements.length*100)}:undefined
  if(wardrobePlan)reasons.push({rule:'armario_personal',explanation:`El ${wardrobePlan.coverage} % de las necesidades del look tiene una equivalencia registrada en tu armario.`})
  return { modelVersion:OUTFIT_MODEL_VERSION,thermalCategory, layers, top: unique(top), bottom: unique(bottom), outerwear: unique(outerwear), footwear: unique(footwear), accessories: unique(accessories), alerts, explanation, pinterestQuery, reasons, lookVariants, wardrobePlan,dataScience }
}
