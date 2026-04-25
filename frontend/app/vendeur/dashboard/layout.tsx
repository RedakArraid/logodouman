'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../../config/api';
import DashboardLayout from '../../components/DashboardLayout';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CogIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function VendeurDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    const u = AuthService.getUser();
    if (u) {
      if (u.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }
      setUser(u);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
    window.location.reload();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, href: '/vendeur/dashboard' },
    { id: 'produits', label: 'Produits', icon: ShoppingBagIcon, href: '/vendeur/dashboard/produits' },
    { id: 'commandes', label: 'Commandes', icon: CogIcon, href: '/vendeur/dashboard/commandes' },
    { id: 'paiements', label: 'Paiements & Versements', icon: BanknotesIcon, href: '/vendeur/dashboard/paiements' },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Espace vendeur</h2>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Vendeur"
      subtitle="Espace vendeur"
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
}
