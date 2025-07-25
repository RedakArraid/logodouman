'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import Link from 'next/link';

// Header Component
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
            <Link href="/boutique" className="text-gray-900 font-medium">Boutique</Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">Nous contacter</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              ⚙️ Admin
            </Link>

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
              <Link href="/" className="py-2 text-gray-700 hover:text-gray-900">Accueil</Link>
              <Link href="/boutique" className="py-2 text-gray-900 font-medium">Boutique</Link>
              <Link href="/blog" className="py-2 text-gray-700 hover:text-gray-900">Blog</Link>
              <Link href="/contact" className="py-2 text-gray-700 hover:text-gray-900">Nous contacter</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default function BoutiquePage() {
  const { getActiveProducts, getActiveCategories, isHydrated } = useStore();
  
  // États des filtres - tous déclarés en premier
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Obtenir les données seulement après hydratation
  const products = isHydrated ? getActiveProducts() : [];
  const categories = isHydrated ? getActiveCategories() : [];

  // Calculer les prix min/max des produits
  const priceStats = useMemo(() => {
    if (!isHydrated || products.length === 0) return { min: 0, max: 50000 };
    
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [isHydrated, products]);

  // Initialiser les prix quand les produits sont chargés
  useEffect(() => {
    if (isHydrated && products.length > 0 && minPrice === 0 && maxPrice === 50000) {
      setMinPrice(priceStats.min);
      setMaxPrice(priceStats.max);
    }
  }, [isHydrated, products.length, priceStats.min, priceStats.max, minPrice, maxPrice]);

  // Filtrage et tri des produits - seulement après hydratation
  const filteredProducts = useMemo(() => {
    if (!isHydrated || products.length === 0) return [];

    let filtered = products.filter(product => {
      // Filtre par catégorie
      const categoryMatch = selectedCategory === 'all' || product.categoryId === selectedCategory;
      
      // Filtre par prix
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      
      // Filtre par recherche
      const searchMatch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && priceMatch && searchMatch;
    });

    // Tri
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'stock':
        return filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      default:
        return filtered;
    }
  }, [isHydrated, products, selectedCategory, minPrice, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
    setSearchQuery('');
    setSortBy('name');
  };

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman</h2>
          <p className="text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">Accueil</Link>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-900 font-medium">Boutique</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section Boutique */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Collection LogoDouman
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sacs à main premium - Élégance et qualité pour toutes les occasions
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtres */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              
              {/* Header filtres avec toggle mobile */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filtrer</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </button>
              </div>

              {/* Contenu des filtres */}
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                
                {/* Recherche */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nom, description..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <p className="text-xs text-gray-500 mt-1">
                      Recherche active: &quot;{searchQuery}&quot;
                    </p>
                  )}
                </div>

                {/* Catégories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="mr-3 text-gray-600"
                      />
                      <span className="text-sm text-gray-600">
                        Tous les produits ({products.length})
                      </span>
                    </label>
                    {categories.map(category => {
                      const count = products.filter(p => p.categoryId === category.id).length;
                      return (
                        <label key={category.id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(category.id)}
                            className="mr-3 text-gray-600"
                          />
                          <span className="text-sm text-gray-600">
                            {category.name} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Prix (FCFA)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                        placeholder="Min"
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gray-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                        placeholder="Max"
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Disponible: {priceStats.min.toLocaleString()} - {priceStats.max.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="name">Nom A-Z</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                    <option value="stock">Stock disponible</option>
                  </select>
                </div>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:w-3/4">
            
            {/* Barre de résultats */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  </h2>
                  {selectedCategory !== 'all' && (
                    <p className="text-sm text-gray-600">
                      dans {categories.find(c => c.id === selectedCategory)?.name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {priceStats.min.toLocaleString()} - {priceStats.max.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* Grille de produits */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    
                    {/* Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`;
                        }}
                      />
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                      {/* Prix et badge stock */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xl font-bold text-gray-900">
                          {product.price.toLocaleString()} FCFA
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                          (product.stock || 0) > 5 ? 'bg-yellow-100 text-yellow-800' :
                          (product.stock || 0) > 0 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(product.stock || 0) > 0 ? `${product.stock} en stock` : 'Rupture'}
                        </span>
                      </div>

                      {/* Nom */}
                      <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description}
                      </p>

                      {/* Catégorie */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === product.categoryId)?.name}
                        </span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="space-y-2">
                        <button 
                          className={`w-full py-2.5 px-4 rounded-lg transition-colors font-medium ${
                            (product.stock || 0) === 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                          disabled={(product.stock || 0) === 0}
                        >
                          {(product.stock || 0) > 0 ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Message aucun résultat
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucun produit ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LogoDouman</h3>
              <p className="text-gray-400">
                Votre destination pour les sacs à main de qualité premium en Côte d&apos;Ivoire.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Catégories</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 4).map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => setSelectedCategory(category.id)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Abidjan, Côte d&apos;Ivoire</li>
                <li>📧 contact@logodouman.com</li>
                <li>📱 +225 XX XX XX XX XX</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LogoDouman. Tous droits réservés. | Côte d&apos;Ivoire</p>
          </div>
        </div>
      </footer>
    </div>
  );
}