import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Gestión de Transportes',
  description: 'Sistema completo para gestión de transportes, clientes y vehículos',
  metadataBase: new URL('https://alpha.dualite.dev'),
  authors: [{ name: 'Dualite Alpha' }],
  openGraph: {
    title: 'Sistema de Gestión de Transportes',
    description: 'Sistema completo para gestión de transportes, clientes y vehículos',
    url: 'https://alpha.dualite.dev',
    siteName: 'SGT - Sistema de Gestión de Transportes',
    images: [
      {
        url: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Vista previa del Sistema de Gestión de Transportes',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistema de Gestión de Transportes',
    description: 'Sistema completo para gestión de transportes, clientes y vehículos',
    site: '@dualitedev',
    images: ['https://img-wrapper.vercel.app/image?url=https://placehold.co/1200x630.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
