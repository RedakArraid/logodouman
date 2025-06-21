'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, Product } from '../contexts/StoreContext';

export default function AdminDashboard() {
  const {
    products,
    categories,
    isHydrated,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    resetData
  } = useStore();

  // États pour la modal et le formulaire
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    category: '',
    image: '',
    description: '',
    stock: 0
  });

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman Admin</h2>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Fonctions
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image || '',
        description: product.description,
        stock: product.stock || 0
      });
    } else {
      setEditingProduct(null);
      setForm({
        name: '',
        price: 0,
        category: '',
        image: '',
        description: '',
        stock: 0
      });
    }
    setShowModal(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      deleteProduct(id);
    }
  };

  const handleReset = () => {
    if (confirm('⚠️ Réinitialiser toutes les données ?')) {
      resetData();
      alert('✅ Données réinitialisées !');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LogoDouman</h1>
              <p className="text-gray-500">Administration</p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                ← Boutique
              </Link>
              <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Produits</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="text-4xl">👜</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Catégories</p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Stock</p>
                <p className="text-3xl font-bold">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Valeur</p>
                <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0).toLocaleString()} F</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Gestion produits */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Sacs</h2>
              <button 
                onClick={() => openModal()}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                + Ajouter
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">{product.price.toLocaleString()} F</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                      (product.stock || 0) > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock || 0} en stock
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openModal(product)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => toggleProductStatus(product.id)}
                      className={`flex-1 py-2 px-3 rounded text-sm ${
                        product.status === 'active' 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {product.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👜</div>
                <p className="text-xl text-gray-500">Aucun produit</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Modifier le sac' : 'Ajouter un sac'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="Sac à main élégant..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({...form, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="15000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL Image</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({...form, image: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                  rows={3}
                  placeholder="Description détaillée..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({...form, stock: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={saveProduct}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
