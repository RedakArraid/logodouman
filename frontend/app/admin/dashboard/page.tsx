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
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import AuthGuard from '../components/AuthGuard';
import ProductsManager from '../components/ProductsManager';
import CategoriesManager from '../components/CategoriesManager';
import OrdersManager from '../components/OrdersManager';
import CustomersManager from '../components/CustomersManager';
import KPIGrid from '../components/KPIGrid';
import SalesCharts from '../components/SalesCharts';
import AlertsManager from '../components/AlertsManager';
import { apiService, CategoryService } from '../../config/api';

// Interface Category définie localement
interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

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
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
    topProducts: Array<{ id: number; name: string; revenue: number; units: number }>;
    revenueByCategory: Array<{ category: string; revenue: number; percentage: number }>;
  };
  customers: {
    total: number;
    newThisMonth: number;
    customerGrowth: number;
  };
  inventory: {
    totalProducts: number;
    stockValue: number;
    lowStockProducts: number;
    stockHealth: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      
      if (!token) return;

      // Charger les vraies données depuis l'API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';
      
      const [dashboardRes, categoriesRes, alertsRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/dashboard/overview?period=30`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json()),
        CategoryService.getAll(),
        fetch(`${API_URL}/api/dashboard/alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ]);

      // Charger les données du dashboard
      if (dashboardRes.status === 'fulfilled') {
        const dashData = dashboardRes.value;
        
        // Formater les données pour correspondre à l'interface DashboardStats
        const formattedStats: DashboardStats = {
          sales: {
            totalRevenue: dashData.sales?.totalRevenue || 0,
            totalOrders: dashData.sales?.totalOrders || 0,
            averageOrderValue: dashData.sales?.averageOrderValue || 0,
            revenueGrowth: dashData.sales?.revenueGrowth || 0,
            dailyRevenue: dashData.sales?.dailyRevenue || [],
            monthlyRevenue: dashData.sales?.monthlyRevenue || [],
            topProducts: dashData.sales?.topProducts || [],
            revenueByCategory: dashData.sales?.revenueByCategory || []
          },
          customers: {
            total: dashData.customers?.total || 0,
            newThisMonth: dashData.customers?.newThisMonth || 0,
            customerGrowth: dashData.customers?.customerGrowth || 0
          },
          inventory: {
            totalProducts: dashData.inventory?.totalProducts || 0,
            stockValue: dashData.inventory?.stockValue || 0,
            lowStockProducts: dashData.inventory?.lowStockProducts || 0,
            stockHealth: dashData.inventory?.stockHealth || 0
          }
        };
        
        setStats(formattedStats);
        console.log('✅ Données du dashboard chargées depuis la BDD:', formattedStats);
      } else {
        console.error('Erreur chargement dashboard:', dashboardRes.reason);
      }

      // Charger les catégories
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value);
      }
      
      // Charger les alertes
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setRefreshing(false);
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

  const handleRefresh = () => {
    loadDashboardData();
  };

  // Page de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman Admin</h2>
          <p className="text-gray-600">Chargement du dashboard analytics...</p>
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
              <p className="text-orange-600 font-medium">Analytics Dashboard</p>
              <p className="text-sm text-gray-500 mt-1">Connecté: {user.email}</p>
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
                Dashboard Analytics
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
            <DashboardAnalytics 
              stats={stats} 
              alerts={alerts} 
              loading={refreshing}
              onRefresh={handleRefresh}
            />
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
          
          {activeSection === 'orders' && token && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Commandes</h1>
              <OrdersManager token={token} />
            </div>
          )}
          
          {activeSection === 'customers' && token && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Clients</h1>
              <CustomersManager token={token} />
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

// Composant Dashboard Analytics Principal
function DashboardAnalytics({ 
  stats, 
  alerts, 
  loading,
  onRefresh 
}: { 
  stats: DashboardStats | null; 
  alerts: any[]; 
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header avec bouton refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité e-commerce</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* KPIs principaux */}
      <KPIGrid data={stats} loading={loading} />

      {/* Graphiques de ventes */}
      <SalesCharts data={stats?.sales || null} loading={loading} />

      {/* Alertes */}
      <AlertsManager alerts={alerts} loading={loading} />
    </div>
  );
}

// Placeholders supprimés - Les vrais composants OrdersManager et CustomersManager sont maintenant utilisés
