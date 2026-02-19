'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { CategoryService } from '../../config/api';
import CategoryForm from './CategoryForm';
import { Category } from '../../../types/index';

interface CategoriesManagerProps {
  onCategoryChange?: () => void;
}

export default function CategoriesManager({ onCategoryChange }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Charger les catégories avec hiérarchie
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
      
      // Expand toutes les catégories principales par défaut
      const mainCats = data.filter(c => !c.parentId).map(c => c.id);
      setExpandedCategories(mainCats);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Ouvrir le modal pour ajouter
  const handleAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  // Sauvegarder la catégorie
  const handleSave = async (formData: any) => {
    setLoading(true);

    try {
      if (editingCategory) {
        await CategoryService.update(editingCategory.id, formData);
      } else {
        await CategoryService.create(formData);
      }

      await loadCategories();
      setShowModal(false);
      setEditingCategory(null);
      
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (id: string) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    setLoading(true);
    try {
      await CategoryService.delete(id);
      await loadCategories();
      setDeleteConfirm(null);
      
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
      setDeleteConfirm(null);
    } finally {
      setLoading(false);
    }
  };

  // Basculer le statut
  const toggleStatus = async (category: Category) => {
    setLoading(true);
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      await CategoryService.update(category.id, { status: newStatus });
      await loadCategories();
      
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut');
    } finally {
      setLoading(false);
    }
  };

  // Organiser les catégories par hiérarchie
  const mainCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parentId === parentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Catégories</h2>
          <p className="text-gray-600 mt-2">Gérez vos catégories et sous-catégories</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Liste des catégories avec hiérarchie */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mainCategories.map(category => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  subcategories={getSubcategories(category.id)}
                  expanded={expandedCategories.includes(category.id)}
                  onToggleExpand={toggleExpand}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={toggleStatus}
                  deleteConfirm={deleteConfirm}
                  level={0}
                />
              ))}
            </tbody>
          </table>

          {mainCategories.length === 0 && (
            <div className="text-center py-12">
              <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre première catégorie
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Créer une catégorie
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CategoryForm
              category={editingCategory || undefined}
              categories={categories}
              onSubmit={handleSave}
              onCancel={() => {
                setShowModal(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour une ligne de catégorie (avec sous-catégories)
function CategoryRow({ 
  category, 
  subcategories,
  expanded, 
  onToggleExpand, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  deleteConfirm,
  level 
}: {
  category: Category;
  subcategories: Category[];
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (cat: Category) => void;
  deleteConfirm: string | null;
  level: number;
}) {
  const hasSubcategories = subcategories.length > 0;
  const indent = level * 32; // 32px par niveau

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
            {hasSubcategories && (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {expanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            <div className={`${!hasSubcategories && level > 0 ? 'ml-7' : ''}`}>
              <div className="font-medium text-gray-900">{category.name}</div>
              {level > 0 && (
                <div className="text-xs text-gray-500">Sous-catégorie</div>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
            /{category.slug}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-700 max-w-xs truncate">
            {category.description}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-700">
            {category.productCount || 0}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => onToggleStatus(category)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              category.status === 'active'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.status === 'active' ? (
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                Actif
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                Inactif
              </span>
            )}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(category)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded"
              title="Modifier"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className={`transition-colors p-2 rounded ${
                deleteConfirm === category.id
                  ? 'bg-red-100 text-red-800'
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
              }`}
              title={deleteConfirm === category.id ? 'Confirmer la suppression' : 'Supprimer'}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>

      {/* Sous-catégories */}
      {hasSubcategories && expanded && subcategories.map(sub => (
        <CategoryRow
          key={sub.id}
          category={sub}
          subcategories={[]}
          expanded={false}
          onToggleExpand={onToggleExpand}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          deleteConfirm={deleteConfirm}
          level={level + 1}
        />
      ))}
    </>
  );
}
