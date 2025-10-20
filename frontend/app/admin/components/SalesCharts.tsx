'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '../../config/analytics';

interface SalesChartsProps {
  data: {
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
    topProducts: Array<{ id: number; name: string; revenue: number; units: number }>;
    revenueByCategory: Array<{ category: string; revenue: number; percentage: number }>;
  } | null;
  loading?: boolean;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const SalesCharts: React.FC<SalesChartsProps> = ({ data, loading = false }) => {
  const [activeChart, setActiveChart] = useState<'daily' | 'monthly'>('daily');
  const [viewMode, setViewMode] = useState<'revenue' | 'orders'>('revenue');

  // Données par défaut vides si pas de data
  const defaultData = {
    dailyRevenue: [],
    monthlyRevenue: [],
    topProducts: [],
    revenueByCategory: []
  };

  const chartData = data || defaultData;
  
  // Si pas de données, afficher un message
  if (!data || (chartData.dailyRevenue.length === 0 && chartData.topProducts.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée de vente</h3>
        <p className="text-gray-500">
          Les graphiques s'afficheront dès que vous aurez des commandes dans votre système.
        </p>
      </div>
    );
  }

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'revenue') return formatCurrency(value);
    return value.toString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graphique principal - Évolution des ventes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution des {viewMode === 'revenue' ? 'Ventes' : 'Commandes'}
            </h3>
            <p className="text-sm text-gray-500">
              Analyse sur les {activeChart === 'daily' ? '7 derniers jours' : '12 derniers mois'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Sélecteur période */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveChart('daily')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeChart === 'daily'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                7 jours
              </button>
              <button
                onClick={() => setActiveChart('monthly')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeChart === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="w-4 h-4 inline mr-1" />
                12 mois
              </button>
            </div>

            {/* Sélecteur métrique */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('revenue')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'revenue'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                CA
              </button>
              <button
                onClick={() => setViewMode('orders')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'orders'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Commandes
              </button>
            </div>

            {/* Bouton export */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={activeChart === 'daily' ? chartData.dailyRevenue : chartData.monthlyRevenue}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={activeChart === 'daily' ? 'date' : 'month'}
              tickFormatter={(value) => formatDate(value)}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={(value) => viewMode === 'revenue' ? formatCurrency(value) : value.toString()}
              className="text-xs"
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(value) => formatDate(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey={viewMode}
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Produits
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData.topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), 'Chiffre d\'affaires']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par Catégorie */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventes par Catégorie
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {chartData.revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesCharts;
