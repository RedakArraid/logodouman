'use client';

import { useState } from 'react';
import { useCart, CartItem } from '../contexts/CartContext';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Découvrez nos produits et remplissez votre panier !</p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Continuer vos achats
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const priceInFCFA = Math.round(totalPrice / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon panier</h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles - groupés par vendeur */}
          <div className="lg:col-span-2 space-y-4">
              {Object.entries(
                items.reduce((acc, item) => {
                  const sellerKey = item.product.seller?.id ?? 'plateforme';
                  if (!acc[sellerKey]) acc[sellerKey] = [];
                  acc[sellerKey].push(item);
                  return acc;
                }, {} as Record<string, CartItem[]>)
              ).map(([sellerKey, sellerItems]) => (
                <div key={sellerKey} className="space-y-3">
                  {sellerKey !== 'plateforme' && (
                    <p className="text-sm font-medium text-orange-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                      Vendu par: {sellerItems[0]?.product.seller?.storeName || 'Vendeur'}
                    </p>
                  )}
                  {sellerItems.map((item, index) => {
                const itemPrice = Math.round(item.product.price / 100);
                const itemTotal = Math.round((item.product.price * item.quantity) / 100);
                const uniqueKey = `${item.product.id}-${item.selectedColor || 'default'}-${index}`;
                
                    return (
                      <div
                        key={uniqueKey}
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                      >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop`;
                          }}
                        />
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/boutique/${item.product.id}`}
                            className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.selectedColor && (
                            <p className="text-sm text-gray-600 mt-1">
                              Couleur: <span className="font-semibold">{item.selectedColor}</span>
                            </p>
                          )}
                          <p className="text-xl font-bold text-gray-900 mt-2">
                            {itemPrice.toLocaleString()} FCFA
                          </p>
                        </div>

                        {/* Supprimer */}
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantité */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-bold text-gray-900 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                            disabled={item.quantity >= (item.product.stock || 0)}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Sous-total</p>
                          <p className="text-xl font-bold text-gray-900">
                            {itemTotal.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                    );
                  })}
                </div>
              ))}

            {/* Vider le panier */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total ({totalItems} {totalItems === 1 ? 'article' : 'articles'})</span>
                  <span className="font-bold">{priceInFCFA.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Livraison</span>
                  <span className="font-bold text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{priceInFCFA.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CreditCardIcon className="w-6 h-6" />
                {isProcessing ? 'Traitement...' : 'Passer la commande'}
              </button>

              <Link
                href="/boutique"
                className="block w-full mt-4 text-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5 inline mr-2" />
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

