'use client';

import { useState } from 'react';
import CloudinaryImageUpload from '../../components/CloudinaryImageUpload';
import { Product } from '../../../types/index';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product ? (product.price / 100) : 0,
    categoryId: product?.categoryId || '',
    image: product?.image || '',
    description: product?.description || '',
    stock: product?.stock || 0,
    status: product?.status || 'active',
    sku: product?.sku || '',
    material: product?.material || '',
    lining: product?.lining || '',
    dimensions: product?.dimensions || '',
    weight: product?.weight || 0,
    shape: product?.shape || '',
    pattern: product?.pattern || '',
    decoration: product?.decoration || '',
    closure: product?.closure || '',
    handles: product?.handles || '',
    season: product?.season || '',
    occasion: product?.occasion || '',
    gender: product?.gender || '',
    ageGroup: product?.ageGroup || ''
  });

  const [styles, setStyles] = useState<string[]>(product?.styles || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleArrayInput = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setter(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir le prix en centimes
    const submitData = {
      ...formData,
      price: Math.round(formData.price * 100),
      weight: formData.weight || undefined,
      styles,
      features,
      colors
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {product ? 'Modifier le produit' : 'Ajouter un produit'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (en FCFA) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Image du produit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image du produit
          </label>
          <CloudinaryImageUpload
            currentImage={formData.image}
            onImageChange={handleImageChange}
            placeholder="Choisir une image de produit"
            maxSize={5 * 1024 * 1024}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Description détaillée du produit..."
          />
        </div>

        {/* Stock et statut */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Code produit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        {/* Caractéristiques techniques */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques techniques</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matériau
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Cuir PU, Cuir véritable..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doublure
              </label>
              <input
                type="text"
                value={formData.lining}
                onChange={(e) => setFormData(prev => ({ ...prev, lining: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Polyester, Coton..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="L x H x P (en cm)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Styles et caractéristiques */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Styles et caractéristiques</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Styles (séparés par des virgules)
              </label>
              <input
                type="text"
                value={styles.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, setStyles)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Mode, Luxe, Vintage..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleurs (séparées par des virgules)
              </label>
              <input
                type="text"
                value={colors.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, setColors)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Noir, Rouge, Beige..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonctionnalités (séparées par des virgules)
              </label>
              <input
                type="text"
                value={features.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, setFeatures)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Résistant, Élégant, Pratique..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasion
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                <option value="Quotidien">Quotidien</option>
                <option value="Travail">Travail</option>
                <option value="Soirée">Soirée</option>
                <option value="Sortie">Sortie</option>
                <option value="Prestige">Prestige</option>
              </select>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            {product ? 'Mettre à jour' : 'Ajouter'} le produit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
