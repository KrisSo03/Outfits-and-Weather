# SmartTrip Outfit Advisor

Aplicación full-stack universitaria de IoT e Interacción Persona‑Máquina. Compara las condiciones de origen simuladas por un ESP32 virtual en Wokwi con el pronóstico horario real de Open‑Meteo y produce una recomendación de vestimenta determinista.

## Arquitectura

El ESP32 escribe en `sensor_readings` mediante Google Apps Script. Next.js lee esa pestaña desde Route Handlers usando Google Sheets API y una Service Account. El navegador nunca recibe credenciales ni accede directamente a Sheets. Las búsquedas y pronósticos se obtienen mediante Open‑Meteo; las consultas se registran en `travel_queries` para alimentar la analítica.

Tecnologías: Next.js App Router, TypeScript estricto, Tailwind CSS, Zod, Recharts, Google Sheets API, Open‑Meteo y Vitest. Todos los servicios utilizados son gratuitos.

## Configuración de Google Sheets

1. En Google Cloud, cree un proyecto y habilite **Google Sheets API**.
2. Cree una Service Account y una clave JSON.
3. Copie `client_email` como `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `private_key` como `GOOGLE_PRIVATE_KEY`.
4. En la hoja de Google Sheets, pulse **Compartir** y agregue el correo de la Service Account como **Editor**.
5. No haga pública la hoja. No descargue CSV ni coloque el JSON de credenciales en el proyecto.
6. Confirme que la pestaña de entrada se llame `sensor_readings`. La app crea/inicializa `travel_queries`; nunca sobrescribe `sensor_readings`.

Copie `.env.example` a `.env.local` y configure:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1GXkIZUXrm_zW6Wn_XSkwf5H6_y9ShQzO52m5FCVv3TM
GOOGLE_SENSOR_SHEET_NAME=sensor_readings
GOOGLE_QUERIES_SHEET_NAME=travel_queries
GOOGLE_FEEDBACK_SHEET_NAME=outfit_feedback
GOOGLE_EVENTS_SHEET_NAME=interaction_events
```

La clave acepta saltos de línea escapados (`\n`). `.env.local` y archivos de Service Account están ignorados por Git.

## Ejecutar y comprobar

```bash
npm install
npm run dev
npm run lint
npm test -- --run
npm run build
```

Abra `http://localhost:3000`. Para comprobar Sheets, revise que “Tu ambiente actual” muestre la fila válida más reciente. Sin credenciales, el entorno de desarrollo usa datos mock claramente identificados; producción falla de forma segura. Haga una recomendación y compruebe que aparece una fila en `travel_queries`.

## Motor de recomendaciones

Usa un modelo híbrido explicable: construye un baseline histórico robusto con última lectura, promedio móvil exponencial y mediana; calcula variabilidad, tendencias, un índice de adaptación térmica y puntuaciones por prenda. Luego combina esos resultados con estilo, actividad, sensibilidad, forma corporal opcional, lluvia, viento, UV y humedad. La interfaz muestra los factores y un índice de confianza. No usa IA externa. El feedback posterior se guarda separadamente en `outfit_feedback` para crear un conjunto de datos supervisado que permita calibrar los pesos en futuras iteraciones. Pinterest se utiliza únicamente mediante un enlace de búsqueda; no se usa su API ni scraping.

El diagnóstico avanzado también calcula punto de rocío, índice de calor, humedad absoluta, tendencia de presión, predicción lineal a una hora, drift reciente, regularidad de muestreo, duplicados y anomalías mediante MAD robusta. Aplica k-means determinista para descubrir regímenes ambientales, ejecuta backtesting walk-forward contra el baseline de última lectura, estima importancia relativa de variables y genera escenarios contrafactuales. Como Wokwi genera datos simulados, estas métricas demuestran y evalúan el método, pero no representan evidencia fisiológica real.

Cada recomendación incluye un carrusel editorial propio con tres interpretaciones: selección principal, versión editorial y versión funcional. Cada tarjeta combina prendas, paleta, concepto, puntuación de adecuación climática y una búsqueda específica de Pinterest. Las tarjetas no descargan ni incrustan imágenes de Pinterest y no realizan scraping.

El usuario selecciona una duración aproximada de 1, 3, 6 o 12 horas. La recomendación analiza la llegada y cada hora posterior: usa la sensación térmica más exigente, lluvia máxima, precipitación acumulada, viento máximo, UV máximo y humedad máxima. La comparación principal conserva las condiciones exactas de llegada, mientras una línea temporal desplegable explica cómo ajustar las capas durante la estancia.

La interfaz ofrece modo Simple y modo Investigador. El segundo expone observabilidad del pipeline, analítica avanzada y métricas HCI. Los eventos anónimos se almacenan en `interaction_events` para medir sesiones, finalización del quiz, conversión del flujo, tiempo de recomendación y errores de validación. No se recopilan nombres ni correos. El estado distingue siempre ambiente simulado en Wokwi, pronóstico real de Open-Meteo e interacciones reales de usuarios.

La telemetría requiere consentimiento explícito y puede rechazarse sin limitar funciones. El armario opcional se guarda únicamente en `localStorage`, no en Sheets, y permite calcular qué porcentaje del look puede cubrirse con prendas existentes. Cada resultado muestra `smarttrip-hybrid-2.2` como versión trazable del modelo utilizado.

## Despliegue gratuito en Vercel

Importe el repositorio en Vercel, conserve el preset Next.js, agregue las cinco variables en **Settings → Environment Variables** y despliegue. No prefije ninguna con `NEXT_PUBLIC_`. La hoja debe continuar compartida solo con la Service Account. Vercel ejecutará `npm run build`. https://outfits-and-weather.vercel.app 


Limitaciones: Wokwi simula el ambiente de origen; Open‑Meteo limita el rango futuro; el enlace de Pinterest abre un servicio externo; no hay autenticación multiusuario ni tiempo real por WebSockets.
