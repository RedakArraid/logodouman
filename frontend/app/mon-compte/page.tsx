'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../config/api';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function MonComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/connexion?retour=/mon-compte');
      return;
    }
    const u = AuthService.getUser();
    if (u) {
      setUser(u);
      if (u.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }
      if (u.role === 'seller') {
        router.push('/vendeur/dashboard');
        return;
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
    window.location.reload();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon compte</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Mon profil'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Gérez vos informations et préférences
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
            >
              Continuer mes achats
              <ArrowRightOnRectangleIcon className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBagIcon className="w-5 h-5" />
              Mes commandes
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Consultez l&apos;historique et le suivi de vos commandes
            </p>
            <p className="text-sm text-gray-500 italic">
              Fonctionnalité à venir — Les commandes seront visibles ici.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
