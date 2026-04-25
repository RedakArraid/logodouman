'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useStore } from '../contexts/StoreContext';
import { useCart } from '../contexts/CartContext';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import ProductFiltersAmazon from '../components/ProductFiltersAmazon';
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
import Link from 'next/link';

const normalizeString = (str: string): string => {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { getActiveProducts, getActiveCategories, isHydrated } = useStore();
  const { addItem } = useCart();
  
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
  const [selectedSellerId, setSelectedSellerId] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = isHydrated ? getActiveProducts() : [];
  const categories = isHydrated ? getActiveCategories() : [];
  
  // Ref pour éviter que la lecture URL ne réapplique un filtre qu'on vient de retirer (race condition)
  const justSyncedFromStateRef = useRef(false);

  // Lire les filtres depuis l'URL au chargement uniquement (ou navigation externe: partage, back/forward)
  useEffect(() => {
    if (categories.length === 0) return;
    if (justSyncedFromStateRef.current) {
      justSyncedFromStateRef.current = false;
      return; // Ne pas écraser l'état qu'on vient de synchroniser nous-mêmes
    }
    const slug = searchParams?.get('category');
    if (slug) {
      const cat = categories.find((c: { slug: string }) => c.slug === slug);
      if (cat) setSelectedCategory(cat.id);
    } else {
      setSelectedCategory('all');
    }
    const q = searchParams?.get('q') ?? '';
    setSearchQuery(q);
    setDebouncedSearchQuery(q);
    const brandsParam = searchParams?.get('brand');
    setSelectedBrands(brandsParam ? brandsParam.split(',').filter(Boolean) : []);
    setInStockOnly(searchParams?.get('stock') === '1');
    const min = searchParams?.get('min');
    const max = searchParams?.get('max');
    const minVal = min ? Number(min) : NaN;
    const maxVal = max ? Number(max) : NaN;
    if (!isNaN(minVal)) setMinPrice(minVal);
    if (!isNaN(maxVal)) setMaxPrice(maxVal);
  }, [searchParams, categories]);

  // Synchroniser les filtres avec l'URL (pour partage et SEO) - après le premier cycle
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isHydrated) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      const cat = categories.find((c: { id: string }) => c.id === selectedCategory);
      if (cat?.slug) params.set('category', cat.slug);
    }
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (selectedBrands.length > 0) params.set('brand', selectedBrands.join(','));
    if (inStockOnly) params.set('stock', '1');
    if (minPrice > 0 || maxPrice < 20000000) {
      if (minPrice > 0) params.set('min', String(minPrice));
      if (maxPrice < 20000000) params.set('max', String(maxPrice));
    }
    const qs = params.toString();
    const base = pathname ?? '/boutique';
    const newUrl: string = qs ? `${base}?${qs}` : base;
    if (window.location.pathname + (window.location.search || '') !== newUrl) {
      justSyncedFromStateRef.current = true;
      router.replace(newUrl, { scroll: false });
    }
  }, [isHydrated, selectedCategory, debouncedSearchQuery, selectedBrands, inStockOnly, minPrice, maxPrice, categories, pathname, router]);

  // Résoudre les IDs de catégories pour le filtre (département = tous les enfants)
  const getCategoryIdsForFilter = useCallback((catId: string) => {
    const children = categories.filter((c: any) => c.parentId === catId);
    if (children.length > 0) return children.map((c: any) => c.id);
    return [catId];
  }, [categories]);

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

  const categoriesTree = useMemo(() => {
    const roots = categories.filter((c: any) => !c.parentId && c.status !== 'inactive');
    return roots.map((r: any) => ({
      ...r,
      subcategories: categories.filter((c: any) => c.parentId === r.id && c.status !== 'inactive')
    }));
  }, [categories]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (p.brand && typeof p.brand === 'string') brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  const availableSellers = useMemo(() => {
    const seen = new Map<string, { id: string; storeName: string; slug: string }>();
    products.forEach(p => {
      if (p.seller?.id && !seen.has(p.seller.id)) {
        seen.set(p.seller.id, { id: p.seller.id, storeName: p.seller.storeName, slug: p.seller.slug });
      }
    });
    return Array.from(seen.values()).sort((a, b) => a.storeName.localeCompare(b.storeName));
  }, [products]);

  // 🔧 FIX: Debounce pour la recherche (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔧 FIX: Initialiser les prix SEULEMENT au premier chargement (sauf si déjà dans l'URL)
  useEffect(() => {
    if (isHydrated && products.length > 0 && isFirstLoad.current) {
      const fromUrl = searchParams?.get('min') ?? searchParams?.get('max');
      if (!fromUrl) {
        setMinPrice(priceStats.min);
        setMaxPrice(priceStats.max);
      }
      isFirstLoad.current = false;
    }
  }, [isHydrated, products.length, searchParams, priceStats.min, priceStats.max]);

  // 🔧 FIX: Filtrage optimisé avec normalisation et null-safe
  const filteredProducts = useMemo(() => {
    if (!isHydrated || products.length === 0) return [];

    // Normaliser la recherche une seule fois
    const normalizedSearch = normalizeString(debouncedSearchQuery);

    const categoryIds = selectedCategory === 'all' ? [] : getCategoryIdsForFilter(selectedCategory);

    const filtered = products.filter(product => {
      // Filtre catégorie (supporte hiérarchie : département = tous les enfants)
      const categoryMatch = selectedCategory === 'all' || (categoryIds.length > 0 && categoryIds.includes(product.categoryId));
      
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

      // Filtre vendeur
      const sellerMatch = selectedSellerId === 'all' || product.sellerId === selectedSellerId;

      // Filtre marque
      const brandMatch = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));

      // Filtre disponibilité
      const stockMatch = !inStockOnly || (product.stock || 0) > 0;
      
      return categoryMatch && priceMatch && searchMatch && colorMatch && materialMatch && sellerMatch && brandMatch && stockMatch;
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
  }, [isHydrated, products, selectedCategory, minPrice, maxPrice, debouncedSearchQuery, sortBy, selectedColors, selectedMaterials, selectedSellerId, selectedBrands, inStockOnly, getCategoryIdsForFilter]);

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
    setSelectedSellerId('all');
    setSelectedBrands([]);
    setInStockOnly(false);
  }, [priceStats.min, priceStats.max]);

  // 🔧 FIX: Compteur de filtres actifs avec tolérance pour les prix
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (inStockOnly) count++;
    
    // Tolérance de 100 centimes (1 FCFA) pour les comparaisons de prix
    const priceTolerance = 100;
    if (Math.abs(minPrice - priceStats.min) > priceTolerance || 
        Math.abs(maxPrice - priceStats.max) > priceTolerance) {
      count++;
    }
    
    if (debouncedSearchQuery !== '') count++;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedSellerId !== 'all') count++;
    return count;
  }, [selectedCategory, minPrice, maxPrice, debouncedSearchQuery, selectedColors, selectedMaterials, selectedSellerId, selectedBrands, inStockOnly, priceStats.min, priceStats.max]);

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
              Sacs, alimentation, électronique et plus - produits de qualité à prix justes
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.filter((c: any) => !c.parentId).map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-semibold hover:scale-105"
                >
                  {category.name}
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
                {selectedBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrands(prev => prev.filter(b => b !== brand))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors"
                  >
                    {brand}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                ))}
                {inStockOnly && (
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors"
                  >
                    En stock
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
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
              <ProductFiltersAmazon
                categories={categoriesTree}
                availableColors={availableColors}
                availableMaterials={availableMaterials}
                availableBrands={availableBrands}
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
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                availableSellers={availableSellers}
                selectedSellerId={selectedSellerId}
                setSelectedSellerId={setSelectedSellerId}
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
                        <Link
                          href={`/boutique/${product.id}`}
                          className="absolute inset-0 z-0"
                          aria-label={`Voir les détails de ${product.name}`}
                        />
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
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`; }}
                            />
                          </div>

                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  {product.brand && (
                                    <span className="text-xs font-bold text-amber-700">
                                      {product.brand}
                                    </span>
                                  )}
                                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                                    {category?.name}
                                  </span>
                                  {product.seller?.slug && (
                                    <Link
                                      href={`/vendeur/${product.seller.slug}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-xs text-gray-500 hover:text-orange-600"
                                    >
                                      Vendu par {product.seller.storeName}
                                    </Link>
                                  )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-3xl font-bold text-gray-900">
                                  {Math.round(product.price / 100).toLocaleString()} FCFA
                                  {product.unit && product.unit !== 'piece' && (
                                    <span className="text-base font-normal text-gray-500"> / {product.unit}</span>
                                  )}
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

                            <div className="flex gap-3 mt-auto relative z-10">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if ((product.stock || 0) > 0) addItem(product, 1);
                                }}
                                className={`flex-1 py-3 px-6 rounded-xl transition-all font-bold ${
                                  (product.stock || 0) === 0 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105'
                                }`}
                                disabled={(product.stock || 0) === 0}
                              >
                                🛒 Ajouter au panier
                              </button>
                              <Link
                                href={`/boutique/${product.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all font-bold inline-block text-center relative z-10"
                              >
                                Détails
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Vue grille
                  return (
                    <Link
                      key={product.id}
                      href={`/boutique/${product.id}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 relative block"
                    >
                      
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
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop`; }}
                        />
                        
                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <Link
                              href={`/boutique/${product.id}`}
                              className="block w-full bg-white text-gray-900 py-2.5 px-4 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all shadow-xl text-center"
                            >
                              Voir les détails
                            </Link>
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
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {product.brand && (
                            <span className="text-xs font-bold text-amber-700">
                              {product.brand}
                            </span>
                          )}
                          <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                            {category?.name}
                          </span>
                          {product.seller?.slug && (
                            <Link
                              href={`/vendeur/${product.seller.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-gray-500 hover:text-orange-600"
                            >
                              Vendu par {product.seller.storeName}
                            </Link>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
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
                              {Math.round(product.price / 100).toLocaleString()} FCFA
                              {product.unit && product.unit !== 'piece' && (
                                <span className="text-sm font-normal text-gray-500"> / {product.unit}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              Prix TTC
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if ((product.stock || 0) > 0) addItem(product, 1);
                            }}
                            className={`p-3 rounded-xl transition-all relative z-10 ${
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
                    </Link>
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

              <ProductFiltersAmazon
                categories={categoriesTree}
                availableColors={availableColors}
                availableMaterials={availableMaterials}
                availableBrands={availableBrands}
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
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                availableSellers={availableSellers}
                selectedSellerId={selectedSellerId}
                setSelectedSellerId={setSelectedSellerId}
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

export default function BoutiquePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    }>
      <BoutiqueContent />
    </Suspense>
  );
}
