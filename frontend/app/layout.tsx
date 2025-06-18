import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'LogoDouman - Plateforme E-commerce de Nouvelle Génération',
  description: 'Découvrez notre sélection de produits de qualité : mode, sacs, électronique et décoration. Shopping en ligne simple et sécurisé.',
  keywords: 'e-commerce, shopping, mode, sacs, électronique, décoration, LogoDouman',
  authors: [{ name: 'LogoDouman Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
