'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  CubeIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { SellerService } from '../../config/api';

export default function VendeurDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [p, e, prodRes, ordRes] = await Promise.all([
        SellerService.getMyProfile(),
        SellerService.getMyEarnings(),
        SellerService.getMyProducts(1),
        SellerService.getMyOrders(1),
      ]);
      setProfile(p);
      setEarnings(e);
      setProducts(prodRes?.products || []);
      setOrders(ordRes?.orders || []);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vue d&apos;ensemble de votre boutique</p>
        </div>
        <button
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: BanknotesIcon, label: 'Revenus totaux', value: earnings?.totalEarnings ?? 0, format: true },
          { icon: ChartBarIcon, label: 'Chiffre d\'affaires', value: earnings?.totalSales ?? 0, format: true },
          { icon: CubeIcon, label: 'Produits', value: products.length, format: false },
          { icon: ShoppingBagIcon, label: 'Commandes', value: earnings?.totalOrders ?? 0, format: false },
        ].map(({ icon: Icon, label, value, format }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <Icon className="w-8 h-8 text-orange-500 mb-3" />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {format ? `${(Number(value) / 100).toLocaleString('fr-FR')} FCFA` : value}
            </p>
          </div>
        ))}
      </div>

      {/* Produits & Commandes */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mes produits</h2>
            <Link
              href="/vendeur/dashboard/produits"
              className="text-orange-600 hover:underline text-sm font-medium"
            >
              Gérer →
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-gray-500 py-4">Aucun produit. Ajoutez des produits pour commencer.</p>
          ) : (
            <ul className="space-y-3">
              {products.slice(0, 5).map((p: any) => (
                <li key={p.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-orange-600 font-medium shrink-0 ml-2">
                    {(p.price / 100).toLocaleString('fr-FR')} FCFA
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Commandes récentes</h2>
            <Link
              href="/vendeur/dashboard/commandes"
              className="text-orange-600 hover:underline text-sm font-medium"
            >
              Voir tout →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-gray-500 py-4">Aucune commande pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 5).map((o: any) => (
                <li key={o.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm">
                    #{o.id?.slice(0, 8)} — {o.customer?.firstName} {o.customer?.lastName}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                    o.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                  }`}>
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
