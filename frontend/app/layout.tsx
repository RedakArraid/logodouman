import type { Metadata, Viewport } from 'next'
import './styles.css'
import { StoreProvider } from './contexts/StoreContext'

export const metadata: Metadata = {
  title: 'LogoDouman - Plateforme E-commerce de Nouvelle Génération',
  description: 'Découvrez notre sélection de produits de qualité : mode, sacs, électronique et décoration. Shopping en ligne simple et sécurisé.',
  keywords: 'e-commerce, shopping, mode, sacs, électronique, décoration, LogoDouman',
  authors: [{ name: 'LogoDouman Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
