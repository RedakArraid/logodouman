'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  TagIcon,
  CogIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import AuthGuard from '../components/AuthGuard';
import ProductsManager from '../components/ProductsManager';
import CategoriesManager from '../components/CategoriesManager';
import { DashboardService, CategoryService } from '../../config/api';
import { Category } from '../../types';

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface DashboardStats {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
  };
  inventory: {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    stockHealth: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
    retentionRate: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour les données
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alerts, setAlerts] = useState([]);

  // États pour la navigation
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers'>('dashboard');

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/admin/login');
      return;
    }
    setLoading(false);
  }, [router]);

  // Charger les données du tableau de bord
  useEffect(() => {
    if (user && token) {
      loadDashboardData();
    }
  }, [user, token]);

  const loadDashboardData = async () => {
    try {
      const [statsRes, categoriesRes, alertsRes] = await Promise.allSettled([
        DashboardService.getOverview(),
        CategoryService.getAll(),
        DashboardService.getAlerts()
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value);
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  const handleDataChange = () => {
    loadDashboardData();
  };

  // Page de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman Admin</h2>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirection si non connecté
  if (!user) {
    return null;
  }

  // Interface principale
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-orange-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-orange-200 flex flex-col justify-between shadow-lg">
          <div>
            <div className="p-6 border-b border-orange-200">
              <h1 className="text-2xl font-bold text-gray-900">LogoDouman</h1>
              <p className="text-orange-600 font-medium">Administration</p>
              <p className="text-sm text-gray-500 mt-1">Connecté en tant que {user.email}</p>
            </div>
            
            <nav className="flex flex-col gap-2 p-4">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === 'dashboard' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <ChartBarIcon className="w-5 h-5" />
                Tableau de bord
              </button>
              
              <button
                onClick={() => setActiveSection('products')}
                className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === 'products' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Produits
              </button>
              
              <button
                onClick={() => setActiveSection('categories')}
                className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === 'categories' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <TagIcon className="w-5 h-5" />
                Catégories
              </button>
              
              <button
                onClick={() => setActiveSection('orders')}
                className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === 'orders' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <CogIcon className="w-5 h-5" />
                Commandes
              </button>
              
              <button
                onClick={() => setActiveSection('customers')}
                className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === 'customers' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                Clients
              </button>
            </nav>
          </div>
          
          <div className="p-4 border-t border-orange-200">
            <button
              onClick={handleLogout}
              className="w-full bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <DashboardSection stats={stats} alerts={alerts} />
          )}
          
          {activeSection === 'products' && (
            <ProductsManager 
              categories={categories} 
              onProductChange={handleDataChange} 
            />
          )}
          
          {activeSection === 'categories' && (
            <CategoriesManager 
              onCategoryChange={handleDataChange} 
            />
          )}
          
          {activeSection === 'orders' && (
            <OrdersSection />
          )}
          
          {activeSection === 'customers' && (
            <CustomersSection />
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

// Composant Tableau de Bord
function DashboardSection({ stats, alerts }: { stats: DashboardStats | null, alerts: any[] }) {
  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-orange-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Chiffre d'Affaires</h3>
          <p className="text-2xl font-bold text-gray-900">{(stats.sales.totalRevenue / 100).toFixed(2)}€</p>
          <p className={`text-sm ${stats.sales.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.sales.revenueGrowth >= 0 ? '+' : ''}{stats.sales.revenueGrowth.toFixed(1)}% vs période précédente
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-orange-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Commandes</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.sales.totalOrders}</p>
          <p className="text-sm text-gray-600">Panier moyen: {(stats.sales.averageOrderValue / 100).toFixed(2)}€</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-orange-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Clients</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.customers.total}</p>
          <p className="text-sm text-gray-600">{stats.customers.new} nouveaux ce mois</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-orange-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.inventory.totalProducts}</p>
          <p className="text-sm text-red-600">{stats.inventory.outOfStockProducts} en rupture</p>
        </div>
      </div>

      {/* Alertes */}
      {alerts && alerts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-orange-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alertes</h2>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <BellIcon className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Commandes (placeholder)
function OrdersSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Commandes</h1>
      <div className="bg-white p-8 rounded-lg shadow border text-center">
        <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Commandes</h3>
        <p className="text-gray-600">Cette section sera développée prochainement avec toutes les fonctionnalités de gestion des commandes.</p>
      </div>
    </div>
  );
}

// Composant Clients (placeholder)
function CustomersSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Clients</h1>
      <div className="bg-white p-8 rounded-lg shadow border text-center">
        <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Clients</h3>
        <p className="text-gray-600">Cette section sera développée prochainement avec toutes les fonctionnalités de gestion des clients.</p>
      </div>
    </div>
  );
}
