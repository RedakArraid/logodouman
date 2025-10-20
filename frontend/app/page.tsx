'use client';

import { useStore } from './contexts/StoreContext';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import Link from 'next/link';
import { 
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { getActiveProducts, getActiveCategories, isHydrated } = useStore();
  const products = isHydrated ? getActiveProducts().slice(0, 6) : [];
  const categories = isHydrated ? getActiveCategories() : [];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman</h2>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-orange-400/30">
              <SparklesIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">Collection 2024</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Meilleure offre
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                sac à main premium
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Découvrez notre collection exclusive de sacs à main premium, 
              alliant élégance, qualité et fonctionnalité pour toutes vos occasions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Découvrir la boutique
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all font-bold border border-white/20"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: TruckIcon, title: 'Livraison Rapide', desc: 'Livraison en 48h à Abidjan' },
              { icon: ShieldCheckIcon, title: 'Qualité Garantie', desc: 'Produits authentiques et certifiés' },
              { icon: CreditCardIcon, title: 'Paiement Sécurisé', desc: 'Transactions 100% sécurisées' },
              { icon: SparklesIcon, title: 'Nouveautés', desc: 'Collections régulièrement renouvelées' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl mb-4 group-hover:from-orange-500 group-hover:to-orange-600 transition-all group-hover:scale-110 group-hover:shadow-xl">
                    <Icon className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 bg-gradient-to-br from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Catégories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez nos collections soigneusement sélectionnées
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/boutique?category=${category.id}`}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
                  <img
                    src={category.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-400 font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Découvrir</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produits Vedettes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Produits Vedettes
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez nos meilleures ventes
              </p>
            </div>
            <Link
              href="/boutique"
              className="hidden md:inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all"
            >
              Voir tout
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const category = categories.find(c => c.id === product.categoryId);
              const isNew = new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
              
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 relative">
                  {isNew && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                        <SparklesIcon className="w-3 h-3" />
                        Nouveau
                      </span>
                    </div>
                  )}

                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop`; }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link
                          href="/boutique"
                          className="w-full block bg-white text-gray-900 py-2.5 px-4 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all shadow-xl text-center"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                        (product.stock || 0) > 10 ? 'bg-green-500 text-white' :
                        (product.stock || 0) > 5 ? 'bg-yellow-500 text-white' :
                        (product.stock || 0) > 0 ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {(product.stock || 0) > 0 ? `${product.stock}` : 'Rupture'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{category?.icon}</span>
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                        {category?.name}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round(product.price / 100).toLocaleString()} F
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          Prix TTC
                        </div>
                      </div>
                      <button 
                        className={`p-3 rounded-xl transition-all ${
                          (product.stock || 0) === 0 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-110'
                        }`}
                        disabled={(product.stock || 0) === 0}
                      >
                        <ShoppingBagIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Voir toute la collection
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à découvrir votre prochain sac favori ?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits en Côte d'Ivoire
          </p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold shadow-2xl hover:scale-105 text-lg"
          >
            Commencer le shopping
            <ArrowRightIcon className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
