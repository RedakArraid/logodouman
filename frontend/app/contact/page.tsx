'use client';

import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">LogoDouman</Link>
            <span className="ml-2 text-sm text-gray-500">Côte d'Ivoire</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">Accueil</Link>
            <Link href="/boutique" className="text-gray-700 hover:text-gray-900 transition-colors">Boutique</Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/contact" className="text-gray-900 font-medium">Nous contacter</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/admin" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              ⚙️ Admin
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 text-gray-700 hover:text-gray-900">Accueil</Link>
              <Link href="/boutique" className="py-2 text-gray-700 hover:text-gray-900">Boutique</Link>
              <Link href="/blog" className="py-2 text-gray-700 hover:text-gray-900">Blog</Link>
              <Link href="/contact" className="py-2 text-gray-900 font-medium">Nous contacter</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Merci pour votre envoi !</h2>
            <p className="text-xl text-gray-600">Votre message a été envoyé avec succès.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nous Contacter</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Une question ? Un conseil personnalisé ? Notre équipe est là pour vous accompagner.
            </p>
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
              📍 Abidjan, Côte d'Ivoire
            </span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                    placeholder="Nom complet"
                  />
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                    placeholder="Email"
                  />
                </div>
                
                <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500">
                  <option value="">Sélectionner un sujet</option>
                  <option value="info">Information produit</option>
                  <option value="commande">Question sur commande</option>
                  <option value="conseil">Conseil personnalisé</option>
                  <option value="autre">Autre</option>
                </select>
                
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="Décrivez votre demande..."
                />
                
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">📍</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Adresse</h3>
                      <p className="text-gray-600">Abidjan, Côte d'Ivoire</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">📧</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@logodouman.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">📱</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-gray-600">+225 XX XX XX XX XX</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">🕒</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Horaires</h3>
                      <p className="text-gray-600">
                        Lundi - Vendredi: 9h00 - 18h00<br />
                        Samedi: 9h00 - 16h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-900">Délai de livraison ?</h4>
                    <p className="text-sm text-gray-600">2-5 jours ouvrés sur Abidjan</p>
                  </div>
                  <div className="border-l-4 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-900">Politique de retour ?</h4>
                    <p className="text-sm text-gray-600">Retour sous 14 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LogoDouman</h3>
              <p className="text-gray-400">Sacs à main de qualité premium en Côte d'Ivoire.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                <li><Link href="/boutique" className="hover:text-white">Boutique</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Livraison</a></li>
                <li><a href="#" className="hover:text-white">Retours</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Abidjan, Côte d'Ivoire</li>
                <li>📧 contact@logodouman.com</li>
                <li>📱 +225 XX XX XX XX XX</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LogoDouman. Tous droits réservés. | Côte d'Ivoire</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
