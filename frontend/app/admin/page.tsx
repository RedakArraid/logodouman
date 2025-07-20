'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore, Product } from '../contexts/StoreContext';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import Dashboard from './Dashboard';

export default function AdminDashboard() {
  // Remplacement du StoreContext par un fetch API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4002/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
  if (!loading) {
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

  // Ajout des fonctions CRUD produits via l'API
  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:4002/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  // Ajout des états pour les notifications et le feedback utilisateur
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Ajout d'un helper pour afficher un message temporaire
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // Modifie les fonctions CRUD pour afficher les notifications
  const addProduct = async (productData) => {
    try {
      const res = await fetch('http://localhost:4002/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de l\'ajout');
      fetchProducts();
      showMessage('Produit ajouté !');
    } catch (e) {
      showError(e.message);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`http://localhost:4002/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la modification');
      fetchProducts();
      showMessage('Produit modifié !');
    } catch (e) {
      showError(e.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:4002/api/products/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la suppression');
      fetchProducts();
      showMessage('Produit supprimé !');
    } catch (e) {
      showError(e.message);
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:4002/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors du changement de statut');
      fetchProducts();
      showMessage('Statut du produit modifié !');
    } catch (e) {
      showError(e.message);
    }
  };

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
      // resetData(); // This line was removed from the original file
      alert('✅ Données réinitialisées !');
    }
  };

  // Ajout d'un champ fichier pour l'image produit
  // Ajout d'une fonction handleImageUpload pour envoyer le fichier à l'API et récupérer l'URL
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:4002/api/products/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setForm({ ...form, image: data.url });
  };

  // Gestion des catégories via l'API backend
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = () => {
    setLoadingCategories(true);
    fetch('http://localhost:4002/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoadingCategories(false);
      });
  };

  const addCategory = async (categoryData) => {
    try {
      const res = await fetch('http://localhost:4002/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de l\'ajout catégorie');
      fetchCategories();
      showMessage('Catégorie ajoutée !');
    } catch (e) {
      showError(e.message);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const res = await fetch(`http://localhost:4002/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la modification catégorie');
      fetchCategories();
      showMessage('Catégorie modifiée !');
    } catch (e) {
      showError(e.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`http://localhost:4002/api/categories/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la suppression catégorie');
      fetchCategories();
      showMessage('Catégorie supprimée !');
    } catch (e) {
      showError(e.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Affichage de la liste des catégories dans l'admin, avec boutons d'ajout, modification, suppression

  // Gestion de l'authentification admin (JWT)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('http://localhost:4002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } else {
      setLoginError(data.error || 'Erreur de connexion');
    }
  };

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    const u = localStorage.getItem('admin_user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>
          {loginError && <div className="mb-4 text-red-600 text-sm">{loginError}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500" required />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 font-semibold">Se connecter</button>
        </form>
      </div>
    );
  }

  // Ajout d'un state pour la navigation
  const [section, setSection] = useState<'dashboard' | 'products' | 'categories'>('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">LogoDouman</h1>
            <p className="text-gray-500">Administration</p>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <button onClick={() => setSection('dashboard')} className={`text-left px-4 py-2 rounded-lg ${section === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>📊 Dashboard</button>
            <button onClick={() => setSection('products')} className={`text-left px-4 py-2 rounded-lg ${section === 'products' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>👜 Produits</button>
            <button onClick={() => setSection('categories')} className={`text-left px-4 py-2 rounded-lg ${section === 'categories' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>🏷️ Catégories</button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300">Se déconnecter</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {message && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow z-50">{message}</div>}
        {error && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded shadow z-50">{error}</div>}

        {section === 'dashboard' && <Dashboard token={token} />}
        {section === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Gestion des produits</h2>
              <button onClick={() => openModal()} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 shadow">
                <PlusIcon className="w-5 h-5" /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><img src={product.image ? `http://localhost:4002${product.image}` : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop'} alt={product.name} className="w-16 h-16 object-cover rounded" /></td>
                      <td className="px-6 py-4 font-semibold">{product.name}</td>
                      <td className="px-6 py-4">{product.price.toLocaleString()} F</td>
                      <td className="px-6 py-4">{product.stock || 0}</td>
                      <td className="px-6 py-4">
                        {product.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs"><CheckCircleIcon className="w-4 h-4" /> Actif</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"><XCircleIcon className="w-4 h-4" /> Inactif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button onClick={() => openModal(product)} className="p-2 bg-blue-100 hover:bg-blue-200 rounded"><PencilIcon className="w-5 h-5 text-blue-700" /></button>
                        <button onClick={() => toggleProductStatus(product.id, product.status)} className={`p-2 rounded ${product.status === 'active' ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-green-100 hover:bg-green-200'}`}>{product.status === 'active' ? <XCircleIcon className="w-5 h-5 text-yellow-700" /> : <CheckCircleIcon className="w-5 h-5 text-green-700" />}</button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-100 hover:bg-red-200 rounded"><TrashIcon className="w-5 h-5 text-red-700" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Section catégories à ajouter de façon similaire */}
      </main>

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
              
              {/*
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Sélectionner...</option>
                  {categories && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500" />
                {form.image && <img src={`http://localhost:4002${form.image}`} alt="aperçu" className="mt-2 w-24 h-24 object-cover rounded" />}
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
