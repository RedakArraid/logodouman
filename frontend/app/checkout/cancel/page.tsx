'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import { XCircleIcon, ArrowPathIcon, TruckIcon } from '@heroicons/react/24/outline';

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get('orderId') ?? null;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortOrderId = orderId ? orderId.substring(0, 8).toUpperCase() : '';

  const handlePayCOD = async () => {
    if (!orderId) { router.push('/checkout'); return; }
    setIsProcessing(true);
    setError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';
    try {
      const response = await fetch(`${API_URL}/api/payment/status/${orderId}`);
      if (response.ok) { router.push(`/commande/${orderId}`); }
      else throw new Error('Impossible de récupérer la commande.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <XCircleIcon className="w-14 h-14 text-red-500" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Paiement annulé
      </h1>

      <p className="text-gray-600 mb-4">
        Votre commande a été créée mais le paiement n&apos;a pas été complété.
      </p>

      {orderId && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 mb-8 inline-block">
          <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
          <p className="text-xl font-bold text-orange-600 tracking-wider">#{shortOrderId}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8 text-left">
        <p className="text-sm text-gray-600">
          Votre commande est enregistrée et en attente de paiement. Vous pouvez réessayer le
          paiement en ligne ou choisir de payer à la livraison.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 shadow transition-all"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Réessayer le paiement
        </Link>
        <button
          onClick={handlePayCOD}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 px-6 bg-white border-2 border-orange-300 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all disabled:opacity-60"
        >
          {isProcessing ? (
            <><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />Traitement...</>
          ) : (
            <><TruckIcon className="w-5 h-5" />Payer à la livraison</>
          )}
        </button>
      </div>

      <div className="mt-8">
        <Link href="/boutique" className="text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium">
          Continuer les achats sans payer maintenant
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      <Suspense fallback={<div className="py-24 text-center text-gray-400">Chargement...</div>}>
        <CancelContent />
      </Suspense>
      <PublicFooter />
    </div>
  );
}
