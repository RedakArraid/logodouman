import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boutique - Sacs, alimentation, électronique | LogoDouman',
  description: 'Découvrez notre collection de sacs, alimentation ivoirienne, électronique et mode. Produits de qualité à prix justes, livraison en Côte d\'Ivoire.',
  openGraph: {
    title: 'Boutique LogoDouman - E-commerce Côte d\'Ivoire',
    description: 'Sacs, chocolats ivoiriens, chargeurs, écouteurs et plus. Livraison rapide à Abidjan.',
  },
};

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
