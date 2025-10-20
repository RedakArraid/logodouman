'use client';

import Link from 'next/link';
import { useStore } from '../contexts/StoreContext';
import { 
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function PublicFooter() {
  const { getActiveCategories, isHydrated } = useStore();
  const categories = isHydrated ? getActiveCategories() : [];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Restez Informé
            </h3>
            <p className="text-gray-400 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* À Propos */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              LogoDouman
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Votre destination pour les sacs à main de qualité premium en Côte d'Ivoire.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <HeartIcon className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Made in Côte d'Ivoire</span>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-400 text-lg">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all"></span>
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Catégories */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-400 text-lg">Catégories</h4>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    href={`/boutique?category=${category.id}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-400 text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPinIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <EnvelopeIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@logodouman.com" className="hover:text-white transition-colors">
                  contact@logodouman.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <PhoneIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>+225 XX XX XX XX XX</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LogoDouman. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
              <Link href="/confidentialite" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

