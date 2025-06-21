'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from './contexts/StoreContext';

// Header Component - Identique au site original
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">LogoDouman</h1>
            <span className="ml-2 text-sm text-gray-500">Côte d'Ivoire</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-900 font-medium">Accueil</a>
            <Link href="/boutique" className="text-gray-700 hover:text-gray-900 transition-colors">Boutique</Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">Nous contacter</Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-gray-900 transition-colors flex items-center">
                More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Administration</Link>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Aide</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">À propos</a>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="py-2 text-gray-900 font-medium">Accueil</a>
              <Link href="/boutique" className="py-2 text-gray-700 hover:text-gray-900">Boutique</Link>
              <Link href="/blog" className="py-2 text-gray-700 hover:text-gray-900">Blog</Link>
              <Link href="/contact" className="py-2 text-gray-700 hover:text-gray-900">Nous contacter</Link>
              <div className="border-t pt-2 mt-2">
                <p className="py-1 text-sm text-gray-500">More</p>
                <Link href="/admin" className="py-2 text-gray-700 hover:text-gray-900">Administration</Link>
                <a href="#" className="py-2 text-gray-700 hover:text-gray-900">Aide</a>
                <a href="#" className="py-2 text-gray-700 hover:text-gray-900">À propos</a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => (
  <section id="home" className="bg-gradient-to-br from-gray-50 to-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Meilleure offre
          <span className="block text-gray-600">sac à main</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Découvrez notre collection exclusive de sacs à main premium, 
          alliant élégance et fonctionnalité pour toutes les occasions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/boutique"
            className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Découvrir la boutique
          </Link>
          <Link
            href="/contact"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition-colors font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Section Produits - Simple comme le site original
const ProductsSection = () => {
  const { getActiveProducts } = useStore();
  const products = getActiveProducts();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Produits phares - Pas de filtres complexes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map(product => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop';
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer simplifié
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">LogoDouman</h3>
        <p className="text-gray-400 mb-4">Côte d'Ivoire</p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
          <p>&copy; 2024 LogoDouman. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </footer>
);

// App principal
export default function LogoDouman() {
  const { isHydrated } = useStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman</h2>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductsSection />
      <Footer />
    </div>
  );
}
