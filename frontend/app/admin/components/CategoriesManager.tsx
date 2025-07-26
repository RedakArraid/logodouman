'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { CategoryService } from '../../config/api';

// Interface Category définie localement
interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

interface CategoriesManagerProps {
  onCategoryChange?: () => void;
}

export default function CategoriesManager({ onCategoryChange }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    image: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Charger les catégories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      description: '',
      image: '',
      status: 'active'
    });
    setEditingCategory(null);
  };

  // Ouvrir le modal pour ajouter
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description,
      image: category.image || '',
      status: category.status
    });
    setShowModal(true);
  };

  // Sauvegarder la catégorie
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        ...formData,
        id: editingCategory?.id || `${formData.name.toLowerCase().replace(/\s+/g, '-')}-cat-${Date.now()}`
      };

      if (editingCategory) {
        await CategoryService.update(editingCategory.id, categoryData);
      } else {
        await CategoryService.create(categoryData);
      }

      await loadCategories();
      setShowModal(false);
      resetForm();
      onCategoryChange?.();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      setLoading(true);
      await CategoryService.delete(id);
      await loadCategories();
      setDeleteConfirm(null);
      onCategoryChange?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // Changer le statut
  const toggleStatus = async (category: Category) => {
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      await CategoryService.update(category.id, { status: newStatus });
      await loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  // Icônes suggérées
  const suggestedIcons = ['💎', '🕰️', '💼', '👜', '🎒', '👛', '🛍️', '🎁', '⭐', '🔥'];

  if (loading && !showModal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
        <button
          onClick={handleAdd}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Total Catégories</h3>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Catégories Actives</h3>
          <p className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Produits Total</h3>
          <p className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border">
            <div className="p-6">
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.productCount || 0} produits</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(category)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.status === 'active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {category.status === 'active' ? (
                    <>
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Actif
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      Inactif
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                  title="Modifier"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className={`p-2 rounded ${
                    deleteConfirm === category.id
                      ? 'text-red-800 bg-red-100'
                      : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                  }`}
                  title={deleteConfirm === category.id ? 'Confirmer la suppression' : 'Supprimer'}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* État vide */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune catégorie</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par ajouter votre première catégorie.</p>
          <div className="mt-6">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Ajouter une catégorie
            </button>
          </div>
        </div>
      )}

      {/* Modal de formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ex: Sacs de luxe"
                  />
                </div>

                {/* Icône */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icône</label>
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ex: 💎"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500">Suggestions:</span>
                      {suggestedIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({...formData, icon})}
                          className="text-lg hover:bg-gray-100 p-1 rounded"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Décrivez cette catégorie..."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de l'image (optionnel)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : (editingCategory ? 'Mettre à jour' : 'Ajouter')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
