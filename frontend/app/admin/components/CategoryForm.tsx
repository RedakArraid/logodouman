'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../../types/index';

interface CategoryFormProps {
  category?: Category;
  categories: Category[]; // Pour le select de catégorie parente
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, categories, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    status: category?.status || 'active',
    parentId: category?.parentId || null,
    displayOrder: category?.displayOrder || 0
  });

  // Auto-générer le slug à partir du nom
  useEffect(() => {
    if (!category && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nettoyer les données avant envoi
    const cleanData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      status: formData.status,
      parentId: formData.parentId && formData.parentId !== '' ? formData.parentId : null,
      displayOrder: formData.displayOrder
    };
    onSubmit(cleanData);
  };

  // Catégories principales (sans parent) pour le select
  const mainCategories = categories.filter(c => !c.parentId && c.id !== category?.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom et Slug */}
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
              placeholder="Ex: Sacs à main"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
              placeholder="Ex: sacs-a-main"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Généré automatiquement depuis le nom
            </p>
          </div>
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

        {/* Catégorie parente et Ordre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie parente
            </label>
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Aucune (catégorie principale)</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour une catégorie principale
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Plus petit = affiché en premier
            </p>
          </div>
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
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {formData.name || 'Nom de la catégorie'}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    formData.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {formData.description || 'Description de la catégorie'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    /{formData.slug || 'slug'}
                  </span>
                  {formData.parentId && (
                    <span className="text-orange-600 font-semibold">
                      Sous-catégorie de: {categories.find(c => c.id === formData.parentId)?.name}
                    </span>
                  )}
                  <span>
                    Ordre: {formData.displayOrder}
                  </span>
                </div>
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
