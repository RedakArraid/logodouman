'use client';

import { useState, useEffect } from 'react';
import { StorefrontIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { SellerService } from '../../config/api';

interface Seller {
  id: string;
  storeName: string;
  slug: string;
  description?: string;
  status: string;
  commissionRate: number;
  productCount?: number;
  user?: { email: string; name?: string };
  createdAt: string;
}

export default function SellersManager() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await SellerService.adminGetAll(filter === 'all' ? undefined : filter);
      setSellers(Array.isArray(res) ? res : res.sellers || []);
    } catch (err) {
      console.error(err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      await SellerService.adminApprove(id, { status: 'approved' });
      load();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await SellerService.adminApprove(id, { status: 'suspended' });
      load();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <StorefrontIcon className="w-6 h-6 text-orange-500" />
          Gestion des vendeurs
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvés</option>
          <option value="suspended">Suspendus</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun vendeur.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{s.storeName}</p>
                      <p className="text-sm text-gray-500">/{s.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{s.user?.email}</p>
                    {s.user?.name && <p className="text-xs text-gray-500">{s.user.name}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        s.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : s.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{s.productCount ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    {s.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleApprove(s.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleSuspend(s.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Refuser
                        </button>
                      </div>
                    )}
                    {s.status === 'approved' && (
                      <button
                        onClick={() => handleSuspend(s.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                      >
                        Suspendre
                      </button>
                    )}
                    {s.status === 'suspended' && (
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                      >
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
