'use client';

import { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { SellerService } from '../../../config/api';

const PAYMENT_METHODS = [
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mtn_money', label: 'MTN Money' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
];

export default function VendeurPaiementsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState({
    method: 'mobile_money',
    accountNumber: '',
    accountName: '',
    operator: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, e, payRes] = await Promise.all([
          SellerService.getMyProfile(),
          SellerService.getMyEarnings(),
          SellerService.getMyPayouts(),
        ]);
        setProfile(p);
        setEarnings(e);
        setPayouts(Array.isArray(payRes) ? payRes : payRes?.payouts || []);
        if (p?.paymentInfo) {
          setPaymentForm({
            method: p.paymentInfo.method || 'mobile_money',
            accountNumber: p.paymentInfo.accountNumber || '',
            accountName: p.paymentInfo.accountName || '',
            operator: p.paymentInfo.operator || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paiements & Versements</h1>
        <p className="text-gray-600 mt-1">Configurez vos coordonnées et demandez vos versements</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCardIcon className="w-6 h-6 text-orange-500" />
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
            <form onSubmit={savePaymentInfo} className="mt-6 p-4 bg-gray-50 rounded-xl space-y-4">
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

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BanknotesIcon className="w-6 h-6 text-orange-500" />
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
                {payouts.map((p: any) => (
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
  );
}
