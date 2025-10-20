'use client';

import { useMemo } from 'react';
import { 
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Product {
  id: number;
  categoryId: string;
  price: number;
  status: string;
  colors?: string[];
  material?: string;
}

interface ProductFiltersProps {
  // Données
  categories: Category[];
  availableColors: string[];
  availableMaterials: string[];
  priceStats: { min: number; max: number };
  allProducts: Product[]; // Tous les produits (pour compteurs)
  
  // États
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  
  // Actions
  onReset: () => void;
  activeFiltersCount: number;
  
  // Options
  productsCount: number;
}

export default function ProductFilters({
  categories,
  availableColors,
  availableMaterials,
  priceStats,
  allProducts,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedColors,
  setSelectedColors,
  selectedMaterials,
  setSelectedMaterials,
  onReset,
  activeFiltersCount,
  productsCount
}: ProductFiltersProps) {

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color) 
        ? selectedColors.filter(c => c !== color) 
        : [...selectedColors, color]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(material) 
        ? selectedMaterials.filter(m => m !== material) 
        : [...selectedMaterials, material]
    );
  };

  // 🔧 FIX: Calculer le nombre de produits PAR catégorie
  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(product => {
      if (product.status === 'active') {
        counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  // 🔧 FIX: Gérer les valeurs min/max pour éviter les inversions
  const handleMinPriceChange = (value: number) => {
    const newMin = Math.min(value, maxPrice - 100); // Garder au moins 1 FCFA d'écart
    setMinPrice(Math.max(priceStats.min, newMin));
  };

  const handleMaxPriceChange = (value: number) => {
    const newMax = Math.max(value, minPrice + 100);
    setMaxPrice(Math.min(priceStats.max, newMax));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
        </div>
        {activeFiltersCount > 0 && (
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Catégories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Catégories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🛍️ Tous les produits</span>
            <span className="text-sm opacity-80">({productsCount})</span>
          </button>
          
          {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            const count = categoryProductCounts[category.id] || 0;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  {category.name}
                </span>
                <span className={`text-sm ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Prix (FCFA)
        </h3>
        <div className="space-y-4">
          {/* 🔧 FIX: Deux sliders pour min ET max */}
          <div className="px-2 space-y-3">
            {/* Slider Minimum */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Prix minimum</label>
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={minPrice}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                style={{
                  background: `linear-gradient(to right, #fed7aa 0%, #f97316 ${((minPrice - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%, #fed7aa ${((minPrice - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%, #fed7aa 100%)`
                }}
              />
            </div>
            
            {/* Slider Maximum */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Prix maximum</label>
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                style={{
                  background: `linear-gradient(to right, #fed7aa 0%, #fed7aa ${((maxPrice - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%, #f97316 ${((maxPrice - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%, #f97316 100%)`
                }}
              />
            </div>
          </div>
          
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-medium">Minimum</label>
              <input
                type="number"
                value={Math.round(minPrice / 100)}
                onChange={(e) => handleMinPriceChange(Number(e.target.value) * 100)}
                min={Math.round(priceStats.min / 100)}
                max={Math.round(maxPrice / 100) - 1}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-medium">Maximum</label>
              <input
                type="number"
                value={Math.round(maxPrice / 100)}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value) * 100)}
                min={Math.round(minPrice / 100) + 1}
                max={Math.round(priceStats.max / 100)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          {/* Display actuel */}
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-bold">
              {Math.round(minPrice / 100).toLocaleString()} - {Math.round(maxPrice / 100).toLocaleString()} F
            </span>
          </div>
        </div>
      </div>

      {/* Couleurs */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Couleurs ({availableColors.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedColors.includes(color)
                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matériaux */}
      {availableMaterials.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Matériaux ({availableMaterials.length})
          </h3>
          <div className="space-y-2">
            {availableMaterials.map(material => (
              <label key={material} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => toggleMaterial(material)}
                  className="mr-3 w-5 h-5 rounded text-orange-600 focus:ring-orange-500 transition-all"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {activeFiltersCount > 0 && (
        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 py-3 px-4 rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all font-semibold border-2 border-gray-200 hover:border-gray-300"
        >
          🔄 Réinitialiser ({activeFiltersCount})
        </button>
      )}
    </div>
  );
}
