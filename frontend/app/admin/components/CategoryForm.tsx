'use client';

import { useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { Category } from '../../../types/index';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    icon: category?.icon || '',
    image: category?.image || '',
    description: category?.description || '',
    status: category?.status || 'active'
  });

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const iconOptions = [
    { value: '💎', label: '💎 Diamant (Luxe)' },
    { value: '🕰️', label: '🕰️ Horloge (Vintage)' },
    { value: '💼', label: '💼 Mallette (Business)' },
    { value: '👜', label: '👜 Sac (Casual)' },
    { value: '✨', label: '✨ Étoiles (Premium)' },
    { value: '🌟', label: '🌟 Étoile (Tendance)' },
    { value: '💫', label: '💫 Étincelle (Mode)' },
    { value: '🎨', label: '🎨 Palette (Créatif)' },
    { value: '🏆', label: '🏆 Trophée (Élite)' },
    { value: '💝', label: '💝 Cadeau (Spécial)' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nom de la catégorie"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône *
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner une icône...</option>
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image de la catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de la catégorie
          </label>
          <ImageUpload
            currentImage={formData.image}
            onImageChange={handleImageChange}
            type="category"
            placeholder="Choisir une image de catégorie"
            maxSize={3}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Description de la catégorie..."
            required
          />
        </div>

        {/* Statut */}
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

        {/* Aperçu de la catégorie */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{formData.icon || '📦'}</div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {formData.name || 'Nom de la catégorie'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Description de la catégorie'}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  formData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            {category ? 'Mettre à jour' : 'Ajouter'} la catégorie
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
