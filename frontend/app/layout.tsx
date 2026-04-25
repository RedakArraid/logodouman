import type { Metadata, Viewport } from 'next'
import './styles.css'
import { StoreProvider } from './contexts/StoreContext'
import { CartProvider } from './contexts/CartContext'

export const metadata: Metadata = {
  title: 'LogoDouman - Plateforme E-commerce de Nouvelle Génération',
  description: 'Découvrez notre marketplace : sacs, alimentation, électronique, mode et plus. Produits de qualité à prix justes. Shopping en ligne simple et sécurisé.',
  keywords: 'e-commerce, marketplace, sacs, alimentation, électronique, mode, LogoDouman, Côte d\'Ivoire',
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
          <CartProvider>
            {children}
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
