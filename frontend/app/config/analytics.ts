import { apiService } from './api';

export interface AnalyticsData {
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
    activeThisMonth: number;
    retentionRate: number;
    customerGrowth: number;
    topCustomers: Array<{ id: string; name: string; totalSpent: number; orders: number }>;
    customersBySegment: Array<{ segment: string; count: number; revenue: number }>;
  };
  inventory: {
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    stockValue: number;
    stockHealth: number;
    stockMovement: Array<{ date: string; inbound: number; outbound: number }>;
    topMovingProducts: Array<{ id: number; name: string; movement: number; currentStock: number }>;
  };
  alerts: Array<{
    id: string;
    type: 'stock' | 'order' | 'customer' | 'system';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    actionRequired: boolean;
  }>;
}

export interface TimeRange {
  period: '7d' | '30d' | '90d' | '1y';
  startDate?: string;
  endDate?: string;
}

export const AnalyticsService = {
  // Données générales du dashboard
  getDashboardOverview: (timeRange: TimeRange): Promise<AnalyticsData> =>
    apiService.get(`/api/analytics/overview?period=${timeRange.period}&start=${timeRange.startDate || ''}&end=${timeRange.endDate || ''}`),

  // Données de ventes détaillées
  getSalesAnalytics: (timeRange: TimeRange) =>
    apiService.get(`/api/analytics/sales?period=${timeRange.period}&start=${timeRange.startDate || ''}&end=${timeRange.endDate || ''}`),

  // Analytics clients
  getCustomerAnalytics: (timeRange: TimeRange) =>
    apiService.get(`/api/analytics/customers?period=${timeRange.period}&start=${timeRange.startDate || ''}&end=${timeRange.endDate || ''}`),

  // Analytics inventaire
  getInventoryAnalytics: (timeRange: TimeRange) =>
    apiService.get(`/api/analytics/inventory?period=${timeRange.period}&start=${timeRange.startDate || ''}&end=${timeRange.endDate || ''}`),

  // Alertes
  getAlerts: (filters?: { type?: string; priority?: string }) =>
    apiService.get(`/api/analytics/alerts?${new URLSearchParams(filters || {})}`),

  // Marquer une alerte comme lue
  markAlertAsRead: (alertId: string) =>
    apiService.put(`/api/analytics/alerts/${alertId}/read`),

  // Données temps réel
  getRealTimeMetrics: () =>
    apiService.get('/api/analytics/realtime'),

  // Export des données
  exportAnalytics: (type: 'sales' | 'customers' | 'inventory', timeRange: TimeRange, format: 'csv' | 'excel' | 'pdf') =>
    apiService.get(`/api/analytics/export/${type}?period=${timeRange.period}&format=${format}`),
};

// Utilitaires de formatage
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Conversion centimes → euros
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const getGrowthIcon = (growth: number): string => {
  if (growth > 0) return '📈';
  if (growth < 0) return '📉';
  return '➡️';
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
