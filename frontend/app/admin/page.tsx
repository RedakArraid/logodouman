'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, Product, Category } from '../contexts/StoreContext';

export default function AdminDashboard() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    resetData
  } = useStore();

  // États pour les modals et formulaires
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // États pour les formulaires
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: '',
    icon: '',
    description: '',
    stock: 0
  });

  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    icon: '',
    description: ''
  });

  // Fonctions de gestion des produits
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      category: '',
      icon: '',
      description: '',
      stock: 0
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      icon: product.icon,
      description: product.description,
      stock: product.stock || 0
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Modifier produit existant
      updateProduct(editingProduct.id, productForm);
    } else {
      // Ajouter nouveau produit
      addProduct(productForm);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(productId);
    }
  };

  // Fonctions de gestion des catégories
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      icon: '',
      description: ''
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      id: category.id,
      name: category.name,
      icon: category.icon,
      description: category.description
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Modifier catégorie existante
      updateCategory(editingCategory.id, categoryForm);
    } else {
      // Ajouter nouvelle catégorie
      addCategory(categoryForm);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        deleteCategory(categoryId);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleResetData = () => {
    if (confirm('⚠️ ATTENTION ! Ceci va supprimer TOUS vos produits et catégories personnalisés et restaurer les données par défaut. Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?')) {
      resetData();
      alert('✅ Données réinitialisées avec succès !');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h1 className="text-3xl font-bold">Administration LogoDouman</h1>
              <p className="opacity-90">Gestion des produits et catégories</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-medium transition-all duration-300 mr-4"
          >
            🏠 Retour au site
          </Link>
          <button
            onClick={handleResetData}
            className="bg-red-500/80 hover:bg-red-600 px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm"
          >
            🔄 Réinitialiser
          </button>
        </div>
      </header>

      {/* Statistiques */}
      <section className="p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Produits</p>
                  <p className="text-3xl font-bold text-orange-600">{products.length}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Catégories</p>
                  <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
                </div>
                <div className="text-4xl">🏷️</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Stock Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    {products.reduce((total, p) => total + (p.stock || 0), 0)}
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Valeur Stock</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(products.reduce((total, p) => total + (p.price * (p.stock || 0)), 0)).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="p-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Navigation des onglets */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-4 px-6 font-medium transition-all duration-300 ${
                  activeTab === 'products'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                📦 Gestion des Produits
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 py-4 px-6 font-medium transition-all duration-300 ${
                  activeTab === 'categories'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                🏷️ Gestion des Catégories
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
              {activeTab === 'products' && (
                <div>
                  {/* Header produits */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Produits</h2>
                    <button
                      onClick={handleAddProduct}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                    >
                      ➕ Ajouter un produit
                    </button>
                  </div>

                  {/* Table des produits */}
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Produit</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Catégorie</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Prix</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Stock</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{product.icon}</div>
                                <div>
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-500">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                                {categories.find(c => c.id === product.category)?.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-orange-600">
                              {product.price.toLocaleString()} FCFA
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                                (product.stock || 0) > 5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock || 0} unités
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleProductStatus(product.id)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  product.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {product.status === 'active' ? '✅ Actif' : '❌ Inactif'}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  ✏️ Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  🗑️ Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div>
                  {/* Header catégories */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Catégories</h2>
                    <button
                      onClick={handleAddCategory}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                    >
                      ➕ Ajouter une catégorie
                    </button>
                  </div>

                  {/* Grille des catégories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-4xl">{category.icon}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCategoryStatus(category.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                category.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {category.status === 'active' ? 'Actif' : 'Inactif'}
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{category.productCount || 0} produit(s)</span>
                          <span>ID: {category.id}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Produit */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nom du produit"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Prix en FCFA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icône (emoji)</label>
                  <input
                    type="text"
                    value={productForm.icon}
                    onChange={(e) => setProductForm({...productForm, icon: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="🛍️"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Description du produit"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Quantité en stock"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catégorie */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID de la catégorie</label>
                  <input
                    type="text"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="fashion, electronics, etc."
                    disabled={!!editingCategory}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la catégorie</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Mode & Style"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icône (emoji)</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="👗"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Description de la catégorie"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {editingCategory ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}