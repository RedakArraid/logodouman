'use client';

import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../config/analytics';

interface Alert {
  id: string;
  type: 'stock' | 'order' | 'customer' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
  isRead: boolean;
}

interface AlertsManagerProps {
  alerts?: Alert[];
  loading?: boolean;
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

const AlertsManager: React.FC<AlertsManagerProps> = ({
  alerts = [],
  loading = false,
  onMarkAsRead,
  onDismiss
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Alert['type']>('all');

  // Données de test
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'stock',
      priority: 'critical',
      title: 'Stock Critique',
      message: 'Le produit "Sac à main verni brillant" n\'a plus que 2 unités en stock',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      actionRequired: true,
      isRead: false
    },
    {
      id: '2',
      type: 'order',
      priority: 'high',
      title: 'Commande en Retard',
      message: 'La commande #CMD-001 est en retard de livraison (3 jours)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      actionRequired: true,
      isRead: false
    },
    {
      id: '3',
      type: 'customer',
      priority: 'medium',
      title: 'Client VIP',
      message: 'Marie Dupont (client VIP) a ajouté 3 articles à son panier sans finaliser',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
      actionRequired: false,
      isRead: true
    },
    {
      id: '4',
      type: 'system',
      priority: 'low',
      title: 'Sauvegarde Réussie',
      message: 'La sauvegarde automatique quotidienne s\'est déroulée avec succès',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      actionRequired: false,
      isRead: true
    },
    {
      id: '5',
      type: 'stock',
      priority: 'medium',
      title: 'Stock Faible',
      message: '5 produits ont un stock inférieur à 10 unités',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h ago
      actionRequired: true,
      isRead: false
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  // Filtrage des alertes
  const filteredAlerts = displayAlerts.filter(alert => {
    if (filter === 'unread' && alert.isRead) return false;
    if (filter === 'critical' && alert.priority !== 'critical') return false;
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false;
    return true;
  });

  // Icônes par type
  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'stock': return '📦';
      case 'order': return '🛒';
      case 'customer': return '👤';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  // Couleurs par priorité
  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'medium': return <InformationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  // Formatage du temps relatif
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header avec filtres */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BellIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Alertes ({filteredAlerts.length})
            </h3>
            {filteredAlerts.filter(a => !a.isRead).length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {filteredAlerts.filter(a => !a.isRead).length} non lues
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', 'unread', 'critical'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : 'Critiques'}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', 'stock', 'order', 'customer', 'system'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  typeFilter === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type === 'all' ? 'Tous' : 
                 type === 'stock' ? 'Stock' :
                 type === 'order' ? 'Commandes' :
                 type === 'customer' ? 'Clients' : 'Système'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-500">Parfait ! Tout fonctionne normalement.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                !alert.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icône de type */}
                <div className="flex-shrink-0 mt-1">
                  <span className="text-lg">{getTypeIcon(alert.type)}</span>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(alert.priority)}
                    <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {alert.title}
                    </h4>
                    {alert.actionRequired && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">
                        Action requise
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>{getRelativeTime(alert.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {!alert.isRead && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Marquer comme lu"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      )}
                      {onDismiss && (
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Supprimer"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indicateur non lu */}
                {!alert.isRead && (
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer avec actions */}
      {filteredAlerts.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredAlerts.filter(a => !a.isRead).length} alertes non lues
            </span>
            <div className="flex space-x-2">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Tout marquer comme lu
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                Paramètres alertes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsManager;
