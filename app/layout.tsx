import './globals.css'

export const metadata = {
  title: 'SmartTrip Outfit Advisor',
  description: 'Compara tu ambiente actual con el clima de tu destino y descubre cómo vestirte.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
