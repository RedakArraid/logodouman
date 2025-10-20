'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useStore } from '../contexts/StoreContext';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import ProductFilters from '../components/ProductFilters';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ShoppingBagIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// 🔧 FIX: Utilitaire pour normaliser les chaînes (accents, casse)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export default function BoutiquePage() {
  const { getActiveProducts, getActiveCategories, isHydrated } = useStore();
  
  // États des filtres
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const products = isHydrated ? getActiveProducts() : [];
  const categories = isHydrated ? getActiveCategories() : [];
  
  // 🔧 FIX: Ref pour savoir si c'est le premier chargement
  const isFirstLoad = useRef(true);

  // 🔧 FIX: Prix min/max avec mémoïsation stable
  const priceStats = useMemo(() => {
    if (!isHydrated || products.length === 0) return { min: 0, max: 20000000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [isHydrated, products.length]); // Seulement quand le nombre de produits change

  // 🔧 FIX: Couleurs et matériaux disponibles avec null-safe
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach(color => {
          if (color && typeof color === 'string') {
            colors.add(color);
          }
        });
      }
    });
    return Array.from(colors).sort();
  }, [products]);

  const availableMaterials = useMemo(() => {
    const materials = new Set<string>();
    products.forEach(p => {
      if (p.material && typeof p.material === 'string') {
        materials.add(p.material);
      }
    });
    return Array.from(materials).sort();
  }, [products]);

  // 🔧 FIX: Debounce pour la recherche (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔧 FIX: Initialiser les prix SEULEMENT au premier chargement
  useEffect(() => {
    if (isHydrated && products.length > 0 && isFirstLoad.current) {
      setMinPrice(priceStats.min);
      setMaxPrice(priceStats.max);
      isFirstLoad.current = false;
    }
  }, [isHydrated, products.length]); // Ne dépend PAS de priceStats pour éviter la boucle

  // 🔧 FIX: Filtrage optimisé avec normalisation et null-safe
  const filteredProducts = useMemo(() => {
    if (!isHydrated || products.length === 0) return [];

    // Normaliser la recherche une seule fois
    const normalizedSearch = normalizeString(debouncedSearchQuery);

    const filtered = products.filter(product => {
      // Filtre catégorie
      const categoryMatch = selectedCategory === 'all' || product.categoryId === selectedCategory;
      
      // Filtre prix
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      
      // Filtre recherche (normalisé)
      const searchMatch = debouncedSearchQuery === '' || 
        normalizeString(product.name || '').includes(normalizedSearch) ||
        normalizeString(product.description || '').includes(normalizedSearch);
      
      // 🔧 FIX: Filtre couleur null-safe
      const colorMatch = selectedColors.length === 0 || 
        (Array.isArray(product.colors) && product.colors.some(c => c && selectedColors.includes(c)));
      
      // Filtre matériau
      const materialMatch = selectedMaterials.length === 0 ||
        (product.material && selectedMaterials.includes(product.material));
      
      return categoryMatch && priceMatch && searchMatch && colorMatch && materialMatch;
    });

    // 🔧 FIX: Tri sans mutation (slice pour créer une copie)
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      default:
        return sorted;
    }
  }, [isHydrated, products, selectedCategory, minPrice, maxPrice, debouncedSearchQuery, sortBy, selectedColors, selectedMaterials]);

  // 🔧 FIX: Reset avec les vraies valeurs de priceStats
  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('newest');
    setSelectedColors([]);
    setSelectedMaterials([]);
  }, [priceStats.min, priceStats.max]);

  // 🔧 FIX: Compteur de filtres actifs avec tolérance pour les prix
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    
    // Tolérance de 100 centimes (1 FCFA) pour les comparaisons de prix
    const priceTolerance = 100;
    if (Math.abs(minPrice - priceStats.min) > priceTolerance || 
        Math.abs(maxPrice - priceStats.max) > priceTolerance) {
      count++;
    }
    
    if (debouncedSearchQuery !== '') count++;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    return count;
  }, [selectedCategory, minPrice, maxPrice, debouncedSearchQuery, selectedColors, selectedMaterials, priceStats.min, priceStats.max]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman</h2>
          <p className="text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Hero Boutique */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-orange-400/30">
              <ShoppingBagIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">Collection Premium</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Découvrez Notre Collection
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Sacs à main de qualité premium - Élégance et style pour chaque occasion
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-semibold hover:scale-105"
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Barre de recherche et actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Recherche avec indicateur de recherche en cours */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit (nom, description)..."
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDebouncedSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              )}
              {searchQuery !== debouncedSearchQuery && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium min-w-[180px]"
              >
                <option value="newest">✨ Nouveautés</option>
                <option value="popular">🔥 Populaires</option>
                <option value="price-low">💰 Prix croissant</option>
                <option value="price-high">💎 Prix décroissant</option>
                <option value="name">🔤 Alphabétique</option>
              </select>

              {/* Vue grille/liste */}
              <div className="hidden md:flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  title="Vue grille"
                >
                  <Squares2X2Icon className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  title="Vue liste"
                >
                  <ListBulletIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Bouton filtres mobile */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-semibold shadow-lg"
              >
                <FunnelIcon className="w-5 h-5" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filtres actifs (badges) */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Filtres actifs:</span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold hover:bg-orange-200 transition-colors"
                  >
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
                {selectedColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColors(prev => prev.filter(c => c !== color))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
                  >
                    {color}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                ))}
                {selectedMaterials.map(material => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterials(prev => prev.filter(m => m !== material))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors"
                  >
                    {material}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                ))}
                <button
                  onClick={resetFilters}
                  className="ml-auto text-sm text-gray-600 hover:text-gray-900 font-semibold underline"
                >
                  Tout effacer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtres Desktop */}
          <aside className="hidden lg:block lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <ProductFilters
                categories={categories}
                availableColors={availableColors}
                availableMaterials={availableMaterials}
                priceStats={priceStats}
                allProducts={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                onReset={resetFilters}
                activeFiltersCount={activeFiltersCount}
                productsCount={products.length}
              />
            </div>
          </aside>

          {/* Produits */}
          <main className="flex-1">
            
            {/* En-tête résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCategory === 'all' ? 'Toutes catégories' : categories.find(c => c.id === selectedCategory)?.name}
                </p>
              </div>
            </div>

            {/* Grille/Liste de produits */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map(product => {
                  const category = categories.find(c => c.id === product.categoryId);
                  const isNew = new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
                  
                  if (viewMode === 'list') {
                    // Vue liste
                    return (
                      <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100 group">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-64 h-64 overflow-hidden relative">
                            {isNew && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                                  <SparklesIcon className="w-3 h-3" />
                                  Nouveau
                                </span>
                              </div>
                            )}
                            <img
                              src={product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`; }}
                            />
                          </div>

                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl">{category?.icon}</span>
                                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                                    {category?.name}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-3xl font-bold text-gray-900">
                                  {Math.round(product.price / 100).toLocaleString()} F
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                                  (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                                  (product.stock || 0) > 5 ? 'bg-yellow-100 text-yellow-800' :
                                  (product.stock || 0) > 0 ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {(product.stock || 0) > 0 ? `${product.stock} en stock` : 'Rupture'}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.material && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                                  {product.material}
                                </span>
                              )}
                              {Array.isArray(product.colors) && product.colors.slice(0, 3).map((color, idx) => (
                                color && (
                                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                    {color}
                                  </span>
                                )
                              ))}
                            </div>

                            <div className="flex gap-3 mt-auto">
                              <button 
                                className={`flex-1 py-3 px-6 rounded-xl transition-all font-bold ${
                                  (product.stock || 0) === 0 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105'
                                }`}
                                disabled={(product.stock || 0) === 0}
                              >
                                🛒 Ajouter au panier
                              </button>
                              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all font-bold">
                                Détails
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Vue grille
                  return (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 relative">
                      
                      {/* Badge "Nouveau" */}
                      {isNew && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                            <SparklesIcon className="w-3 h-3" />
                            Nouveau
                          </span>
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop`; }}
                        />
                        
                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <button className="w-full bg-white text-gray-900 py-2.5 px-4 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                              Voir les détails
                            </button>
                          </div>
                        </div>

                        {/* Badge stock */}
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

                      {/* Contenu */}
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

                        {(product.material || (Array.isArray(product.colors) && product.colors.length > 0)) && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.material && (
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                                {product.material}
                              </span>
                            )}
                            {Array.isArray(product.colors) && product.colors.slice(0, 2).map((color, idx) => (
                              color && (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                  {color}
                                </span>
                              )
                            ))}
                          </div>
                        )}

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
                            title={(product.stock || 0) > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
                          >
                            <ShoppingBagIcon className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="text-7xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Aucun produit ne correspond à vos critères. Essayez de modifier vos filtres.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal filtres mobile */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slideInRight" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <ProductFilters
                categories={categories}
                availableColors={availableColors}
                availableMaterials={availableMaterials}
                priceStats={priceStats}
                allProducts={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                onReset={resetFilters}
                activeFiltersCount={activeFiltersCount}
                productsCount={products.length}
              />

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-lg"
              >
                Afficher les résultats ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
