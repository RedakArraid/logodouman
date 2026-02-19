'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { 
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  HomeIcon,
  NewspaperIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, items } = useCart();

  // Debug: vérifier la valeur du panier quand elle change
  useEffect(() => {
    console.log('🛒 Header - Total items dans le panier:', totalItems, 'Items:', items.length);
  }, [totalItems, items.length]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Accueil', icon: HomeIcon },
    { href: '/boutique', label: 'Boutique', icon: ShoppingBagIcon },
    { href: '/blog', label: 'Blog', icon: NewspaperIcon },
    { href: '/contact', label: 'Contact', icon: EnvelopeIcon },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-orange-700 transition-all duration-300">
              LogoDouman
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
              🇨🇮 Côte d'Ivoire
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive(link.href)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bouton Panier + Vendeur */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/vendeur"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              Devenir vendeur
            </Link>
            <button
              onClick={() => {
                console.log('🛒 Clic sur le panier - Navigation vers /panier, totalItems:', totalItems);
                window.location.href = '/panier';
              }}
              className="relative inline-block p-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
              title="Voir le panier"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span 
                  className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Menu Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-orange-100 text-orange-600 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.href = '/panier';
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                  isActive('/panier')
                    ? 'bg-orange-100 text-orange-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Panier {totalItems > 0 && `(${totalItems})`}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

