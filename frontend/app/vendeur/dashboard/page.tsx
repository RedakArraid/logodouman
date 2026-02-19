'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChartBarIcon,
  CubeIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { AuthService, SellerService } from '../../config/api';

export default function VendeurDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }
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
      } catch (err) {
        router.push('/vendeur');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-orange-600"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour au site
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.storeName || 'Ma boutique'}
          </h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BanknotesIcon, label: 'Revenus totaux', value: earnings?.totalEarnings ?? 0, format: true },
            { icon: ChartBarIcon, label: 'Chiffre d\'affaires', value: earnings?.totalSales ?? 0, format: true },
            { icon: CubeIcon, label: 'Produits', value: products.length },
            { icon: ShoppingBagIcon, label: 'Commandes', value: earnings?.totalOrders ?? 0 },
          ].map(({ icon: Icon, label, value, format }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow border border-orange-100">
              <Icon className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900">
                {format ? `${(Number(value) / 100).toLocaleString('fr-FR')} FCFA` : value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Produits récents */}
          <div className="bg-white rounded-xl shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes produits</h2>
            {products.length === 0 ? (
              <p className="text-gray-500">Aucun produit. Ajoutez des produits depuis l&apos;interface admin.</p>
            ) : (
              <ul className="space-y-2">
                {products.slice(0, 5).map((p: any) => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.name}</span>
                    <span className="text-orange-600 font-medium">
                      {(p.price / 100).toLocaleString('fr-FR')} FCFA
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin/dashboard"
              className="mt-4 inline-block text-orange-600 hover:underline text-sm"
            >
              Gérer mes produits →
            </Link>
          </div>

          {/* Commandes récentes */}
          <div className="bg-white rounded-xl shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Commandes récentes</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">Aucune commande pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {orders.slice(0, 5).map((o: any) => (
                  <li key={o.id} className="flex justify-between items-center">
                    <span>#{o.id.slice(0, 8)} - {o.customer?.firstName} {o.customer?.lastName}</span>
                    <span className="font-medium">{o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
