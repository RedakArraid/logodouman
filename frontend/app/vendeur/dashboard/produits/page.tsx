'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { AuthService, SellerService } from '../../../config/api';
import { ProductService } from '../../../config/api';
import { CategoryService } from '../../../config/api';
import CloudinaryImageUpload from '../../../components/CloudinaryImageUpload';

const productTypes = ['article', 'sac', 'alimentation', 'electronique', 'autre'] as const;
const units = ['piece', 'kg', 'g', 'litre', 'ml', 'sachet', 'boite', 'pack', 'lot'] as const;
type ProductForm = {
  name: string; price: number; categoryId: string; description: string; stock: number;
  image: string; status: 'active' | 'inactive'; sku: string; material: string; brand: string;
  productType: typeof productTypes[number]; unit: typeof units[number]; expiryDate: string;
};

export default function VendeurProduitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const defaultForm: ProductForm = {
    name: '', price: 0, categoryId: '', description: '', stock: 0,
    image: '', status: 'active', sku: '', material: '', brand: '',
    productType: 'article', unit: 'piece', expiryDate: ''
  };
  const [form, setForm] = useState<ProductForm>(defaultForm);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    Promise.all([
      SellerService.getMyProducts(1).then(r => r.products || []),
      CategoryService.getAll().then(c => Array.isArray(c) ? c : [])
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats.filter((c: any) => c.status !== 'inactive'));
    }).catch(() => router.push('/vendeur')).finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: Record<string, unknown> = {
        ...form,
        price: Math.round(form.price * 100),
        brand: form.brand || null,
        styles: [], features: [], colors: []
      };
      if (form.expiryDate) data.expiryDate = new Date(form.expiryDate).toISOString();
      else delete data.expiryDate;
      if (editing) {
        await ProductService.update(String(editing.id), data);
      } else {
        await ProductService.create(data);
      }
      setShowForm(false);
      setEditing(null);
      const res = await SellerService.getMyProducts(1);
      setProducts(res.products || []);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await ProductService.delete(String(id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600 mt-1">Gérez les produits de votre boutique</p>
        </div>
        <button
            onClick={() => { setEditing(null); setForm(defaultForm); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter un produit
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">{editing ? 'Modifier' : 'Nouveau produit'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
                  <input type="number" required value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie *</label>
                  <select required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Choisir...</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marque</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Ex: LogoDouman" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type de produit</label>
                  <select value={form.productType} onChange={e => setForm(f => ({ ...f, productType: e.target.value as ProductForm['productType'] }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="article">Article général</option>
                    <option value="sac">Sac / Accessoire</option>
                    <option value="alimentation">Alimentation</option>
                    <option value="electronique">Électronique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Unité de vente</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value as ProductForm['unit'] }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="piece">Pièce</option>
                    <option value="kg">Kg</option>
                    <option value="g">Grammes</option>
                    <option value="litre">Litre</option>
                    <option value="ml">ml</option>
                    <option value="sachet">Sachet</option>
                    <option value="boite">Boîte</option>
                    <option value="pack">Pack</option>
                    <option value="lot">Lot</option>
                  </select>
                </div>
                {form.productType === 'alimentation' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Date limite (DLC)</label>
                    <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" min={new Date().toISOString().split('T')[0]} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <CloudinaryImageUpload currentImage={form.image} onImageChange={url => setForm(f => ({ ...f, image: url }))} placeholder="Choisir image" maxSize={5 * 1024 * 1024} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductForm['status'] }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Enregistrer</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{(p.price / 100).toLocaleString()} F / {(p.unit || 'piece') === 'piece' ? 'u' : (p.unit || 'piece')}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(p); setForm({ ...defaultForm, name: p.name, price: p.price / 100, categoryId: p.categoryId, description: p.description || '', stock: p.stock, image: p.image || '', status: p.status, sku: p.sku || '', material: p.material || '', brand: p.brand || '', productType: (p.productType || 'article') as any, unit: (p.unit || 'piece') as any, expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '' }); setShowForm(true); }} className="p-1 text-orange-600 hover:bg-orange-50 rounded">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded ml-1">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Aucun produit. Cliquez sur &quot;Ajouter un produit&quot; pour commencer.
            </div>
          )}
        </div>
    </div>
  );
}
