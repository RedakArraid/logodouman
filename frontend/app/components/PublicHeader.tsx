'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { AuthService } from '../config/api';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    setUser(AuthService.isAuthenticated() ? AuthService.getUser() : null);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const accountHref = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'seller' ? '/vendeur/dashboard' : '/mon-compte';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
            LogoDouman
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href) ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                </button>
                {showAccountMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                    <div className="absolute right-0 mt-1 w-44 py-1.5 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                      <Link
                        href={accountHref}
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        Mon compte
                      </Link>
                      <Link
                        href="/panier"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        Panier {totalItems > 0 && `(${totalItems})`}
                      </Link>
                      <Link
                        href="/vendeur"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
                      >
                        Devenir vendeur
                      </Link>
                      <hr className="my-1.5 border-gray-100" />
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          AuthService.logout();
                          window.location.href = '/';
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Inscription
                </Link>
                <Link href="/vendeur" className="px-3 py-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                  Vendeur
                </Link>
              </>
            )}
            <Link href="/panier" className="relative p-2 text-gray-600 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
              <ShoppingBagIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: burger + panier */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/panier" className="relative p-2 text-gray-600">
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 right-0 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-orange-50 rounded-lg"
            >
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded-lg ${
                    isActive(link.href) ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={accountHref} onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                    Mon compte
                  </Link>
                  <Link href="/vendeur" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                    Devenir vendeur
                  </Link>
                  <button
                    onClick={() => { AuthService.logout(); window.location.href = '/'; setIsMenuOpen(false); }}
                    className="px-3 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/connexion" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                    Connexion
                  </Link>
                  <Link href="/inscription" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm text-orange-600 font-medium hover:bg-orange-50 rounded-lg">
                    Inscription
                  </Link>
                  <Link href="/vendeur" onClick={() => setIsMenuOpen(false)} className="px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                    Devenir vendeur
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
