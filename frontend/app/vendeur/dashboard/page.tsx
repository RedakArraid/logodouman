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
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { AuthService, SellerService } from '../../config/api';

const PAYMENT_METHODS = [
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mtn_money', label: 'MTN Money' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
];

export default function VendeurDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    method: 'mobile_money',
    accountNumber: '',
    accountName: '',
    operator: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }
      try {
        const [p, e, prodRes, ordRes, payRes] = await Promise.all([
          SellerService.getMyProfile(),
          SellerService.getMyEarnings(),
          SellerService.getMyProducts(1),
          SellerService.getMyOrders(1),
          SellerService.getMyPayouts(),
        ]);
        setProfile(p);
        setEarnings(e);
        setProducts(prodRes?.products || []);
        setOrders(ordRes?.orders || []);
        setPayouts(Array.isArray(payRes) ? payRes : payRes?.payouts || []);
        if (p?.paymentInfo) {
          setPaymentForm({
            method: p.paymentInfo.method || 'mobile_money',
            accountNumber: p.paymentInfo.accountNumber || '',
            accountName: p.paymentInfo.accountName || '',
            operator: p.paymentInfo.operator || '',
          });
        }
      } catch (err) {
        router.push('/vendeur');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const savePaymentInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await SellerService.updateMyProfile({ paymentInfo: paymentForm });
      setProfile((prev: any) => ({ ...prev, paymentInfo: paymentForm }));
      setShowPaymentForm(false);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const requestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Math.round(parseFloat(payoutAmount) * 100);
    if (!amount || amount <= 0) {
      alert('Montant invalide');
      return;
    }
    if (!profile?.paymentInfo?.accountNumber) {
      alert('Configurez vos informations de paiement d\'abord.');
      return;
    }
    setSaving(true);
    try {
      await SellerService.requestPayout(amount);
      setPayoutAmount('');
      const payRes = await SellerService.getMyPayouts();
      setPayouts(Array.isArray(payRes) ? payRes : payRes?.payouts || []);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setSaving(false);
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
              href="/vendeur/dashboard/produits"
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

        {/* Paiements & Versements */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-orange-500" />
              Informations de paiement
            </h2>
            {profile?.paymentInfo?.accountNumber ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {PAYMENT_METHODS.find(m => m.value === profile.paymentInfo?.method)?.label || profile.paymentInfo?.method}
                </p>
                <p className="font-medium">{profile.paymentInfo.accountName}</p>
                <p className="text-sm text-gray-500">***{String(profile.paymentInfo.accountNumber).slice(-4)}</p>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="text-orange-600 text-sm hover:underline"
                >
                  Modifier
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">Configurez vos coordonnées pour recevoir vos versements.</p>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Ajouter
                </button>
              </div>
            )}
            {showPaymentForm && (
              <form onSubmit={savePaymentInfo} className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Méthode</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PAYMENT_METHODS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">N° compte / téléphone</label>
                  <input
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm(f => ({ ...f, accountNumber: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du titulaire</label>
                  <input
                    value={paymentForm.accountName}
                    onChange={(e) => setPaymentForm(f => ({ ...f, accountName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Enregistrer</button>
                  <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 border rounded-lg">Annuler</button>
                </div>
              </form>
            )}
          </div>
          <div className="bg-white rounded-xl shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-orange-500" />
              Demander un versement
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Solde disponible : <strong>{(Number(earnings?.totalEarnings ?? 0) / 100).toLocaleString('fr-FR')} FCFA</strong>
            </p>
            <form onSubmit={requestPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={saving || !profile?.paymentInfo?.accountNumber}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Envoi...' : 'Demander le versement'}
              </button>
            </form>
            {payouts.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Historique</h3>
                <ul className="space-y-2">
                  {payouts.slice(0, 5).map((p: any) => (
                    <li key={p.id} className="flex justify-between text-sm">
                      <span>{(Number(p.amount) / 100).toLocaleString('fr-FR')} FCFA</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        p.status === 'completed' ? 'bg-green-100 text-green-800' :
                        p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>{p.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
