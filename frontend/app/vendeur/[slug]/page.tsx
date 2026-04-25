'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import { StarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { SellerService } from '../../config/api';

export default function VendeurProfilPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? '';
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    SellerService.getBySlug(slug)
      .then(setSeller)
      .catch(() => setSeller(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique introuvable</h1>
          <p className="text-gray-600 mb-6">Cette boutique n&apos;existe pas ou a été supprimée.</p>
          <Link href="/boutique" className="text-orange-600 hover:underline font-medium">
            Voir tous les produits →
          </Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const products = seller.products || [];
  const productCount = seller.productCount ?? products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* En-tête boutique */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {seller.logo ? (
              <img
                src={seller.logo}
                alt={seller.storeName}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <BuildingStorefrontIcon className="w-12 h-12 text-orange-500" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{seller.storeName}</h1>
              {seller.description && (
                <p className="text-gray-600 mb-4">{seller.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1 text-orange-600">
                  {seller.rating > 0 ? (
                    <>
                      <StarSolidIcon className="w-5 h-5" />
                      {seller.rating.toFixed(1)} ({seller.reviewCount} avis)
                    </>
                  ) : (
                    <>
                      <StarIcon className="w-5 h-5" />
                      Nouvelle boutique
                    </>
                  )}
                </span>
                <span className="text-gray-500">{productCount} produit{productCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Produits de {seller.storeName}
          </h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
              <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p>Aucun produit pour le moment.</p>
              <Link href="/boutique" className="mt-4 inline-block text-orange-600 hover:underline">
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/boutique/${p.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
                    <p className="text-orange-600 font-bold mt-1">
                      {(p.price / 100).toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
