'use client';

import { useState, useEffect } from 'react';
import { SellerService } from '../../../config/api';

export default function VendeurCommandesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SellerService.getMyOrders(1)
      .then((res: any) => setOrders(res?.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-600 mt-1">Gérez les commandes de vos produits</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucune commande pour le moment.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-sm">#{o.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    {o.customer?.firstName} {o.customer?.lastName}
                  </td>
                  <td className="px-4 py-3">
                    {((o.totalAmount || 0) / 100).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      o.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
