'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ProductService } from '../../config/api';
import CloudinaryImageUpload from '../../components/CloudinaryImageUpload';

// Interfaces définies localement
interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  stock: number;
  image?: string;
  sku?: string;
  material?: string;
  dimensions?: string;
  weight?: number;
  colors?: string[];
  features?: string[];
  status: 'active' | 'inactive';
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

interface ProductsManagerProps {
  categories: Category[];
  onProductChange?: () => void;
}

export default function ProductsManager({ categories, onProductChange }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    categoryId: '',
    description: '',
    stock: 0,
    image: '',
    sku: '',
    material: '',
    dimensions: '',
    weight: 0,
    colors: [] as string[],
    features: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  // Charger les produits
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      categoryId: '',
      description: '',
      stock: 0,
      image: '',
      sku: '',
      material: '',
      dimensions: '',
      weight: 0,
      colors: [],
      features: [],
      status: 'active'
    });
    setEditingProduct(null);
  };

  // Ouvrir le modal pour ajouter
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price / 100, // Convertir centimes en FCFA
      categoryId: product.categoryId,
      description: product.description,
      stock: product.stock,
      image: product.image || '',
      sku: product.sku || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
      weight: product.weight || 0,
      colors: product.colors || [],
      features: product.features || [],
      status: product.status
    });
    setShowModal(true);
  };

  // Sauvegarder le produit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: Math.round(formData.price * 100), // Convertir en centimes
      };

      if (editingProduct) {
        await ProductService.update(editingProduct.id, productData);
      } else {
        await ProductService.create(productData);
      }

      await loadProducts();
      setShowModal(false);
      resetForm();
      onProductChange?.();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 5000); // Reset après 5s
      return;
    }

    try {
      setLoading(true);
      const response = await ProductService.delete(id);
      await loadProducts();
      setDeleteConfirm(null);
      onProductChange?.();
      
      // Gérer le cas où le produit a été désactivé au lieu d'être supprimé
      if (response && response.action === 'deactivated') {
        alert('⚠️ ' + response.message);
      } else {
        alert('✅ Produit supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du produit';
      alert(errorMessage);
      setDeleteConfirm(null);
    } finally {
      setLoading(false);
    }
  };

  // Changer le statut
  const toggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await ProductService.update(product.id, { status: newStatus });
      await loadProducts();
      onProductChange?.();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <button
          onClick={handleAdd}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Total Produits</h3>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Produits Actifs</h3>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Stock Faible</h3>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.stock <= 10).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Valeur Stock</h3>
          <p className="text-2xl font-bold text-blue-600">
            {(products.reduce((sum, p) => sum + (p.price * p.stock), 0) / 100).toFixed(0)} FCFA
          </p>
        </div>
      </div>

      {/* Table des produits */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
            {products.map((product) => {
              const category = categories.find(c => c.id === product.categoryId);
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.image ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <PhotoIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category?.name || 'Sans catégorie'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(product.price / 100).toFixed(0)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.status === 'active' ? (
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={`${
                          deleteConfirm === product.id
                            ? 'text-red-800 bg-red-100 px-2 py-1 rounded'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        title={deleteConfirm === product.id ? 'Confirmer la suppression' : 'Supprimer'}
                      >
                        <TrashIcon className="w-4 h-4" />
                        {deleteConfirm === product.id && <span className="ml-1 text-xs">Confirmer</span>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par ajouter votre premier produit.</p>
            <div className="mt-6">
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Ajouter un produit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.filter(c => c.status === 'active').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Matériau */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Matériau</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
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
                  />
                </div>

                {/* Image Upload avec Cloudinary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                  <CloudinaryImageUpload
                    currentImage={formData.image}
                    onImageChange={(imageUrl) => setFormData({...formData, image: imageUrl})}
                    placeholder="Choisir une image pour ce produit"
                    maxSize={5 * 1024 * 1024}
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
                    {loading ? 'Sauvegarde...' : (editingProduct ? 'Mettre à jour' : 'Ajouter')}
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
