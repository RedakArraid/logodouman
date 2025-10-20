'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  HomeIcon,
  NewspaperIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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

          {/* Bouton Panier (futur) */}
          <div className="hidden md:flex items-center gap-3">
            <button className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors">
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
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
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                      ${isActive(link.href)
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'text-gray-700 hover:bg-orange-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Panier mobile */}
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 font-medium">
                <ShoppingBagIcon className="w-5 h-5" />
                Panier (0)
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

