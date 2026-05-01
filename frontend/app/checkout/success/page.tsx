'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import { CheckCircleIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/react/24/outline';

interface PaymentStatus {
  payment: {
    id: string;
    status: string;
    method: string;
    amount: number;
    transactionId?: string;
  } | null;
  orderStatus: string | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams?.get('orderId') ?? null;
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/boutique');
      return;
    }
    clearCart();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';
    fetch(`${API_URL}/api/payment/status/${orderId}`)
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const shortOrderId = orderId ? orderId.substring(0, 8).toUpperCase() : '';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircleIcon className="w-14 h-14 text-green-500" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Paiement confirmé !
      </h1>

      {loading ? (
        <p className="text-gray-500 mb-4">Vérification du statut...</p>
      ) : (
        <p className="text-gray-600 mb-4">Votre commande est en cours de traitement.</p>
      )}

      {orderId && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 mb-8 inline-block">
          <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
          <p className="text-xl font-bold text-orange-600 tracking-wider">#{shortOrderId}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8 text-left space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          <TruckIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <span className="text-sm">Votre commande sera traitée et expédiée dans les plus brefs délais.</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <ShoppingBagIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <span className="text-sm">Un email de confirmation vous a été envoyé.</span>
        </div>
        {status?.payment && (
          <div className="flex items-center gap-3 text-gray-700">
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">
              Statut du paiement :{' '}
              <span className="font-semibold text-green-600">
                {status.payment.status === 'COMPLETED' ? 'Complété' : status.payment.status}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {orderId && (
          <Link
            href={`/commande/${orderId}`}
            className="py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 shadow transition-all"
          >
            Suivre ma commande
          </Link>
        )}
        <Link
          href="/boutique"
          className="py-3 px-6 bg-white border-2 border-orange-300 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
        >
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      <Suspense fallback={<div className="py-24 text-center text-gray-400">Chargement...</div>}>
        <SuccessContent />
      </Suspense>
      <PublicFooter />
    </div>
  );
}
