'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomersManager from '../components/CustomersManager';
import AuthGuard from '../components/AuthGuard';
import Link from 'next/link';

export default function CustomersPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/admin/login');
    } else {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="text-2xl font-bold text-gray-900">
                  LogoDouman Admin
                </Link>
                <span className="text-sm text-gray-500">/ Clients</span>
              </div>
              <nav className="flex items-center gap-4">
                <Link 
                  href="/admin/dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin" 
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Produits
                </Link>
                <Link 
                  href="/admin/orders" 
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Commandes
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    router.push('/admin/login');
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600 mt-2">Gérez vos clients, leur historique et leur fidélité</p>
          </div>

          <CustomersManager token={token} />
        </main>
      </div>
    </AuthGuard>
  );
}

