'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Vérifier le token avec l'API
        const response = await fetch('http://localhost:4002/api/auth/verify', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalide, nettoyer et rediriger
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error);
        // En cas d'erreur réseau, on peut soit rediriger soit permettre l'accès
        // Pour le développement, on permet l'accès
        const token = localStorage.getItem('admin_token');
        if (token) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Page de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification...</h2>
          <p className="text-gray-600">Authentification en cours</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, on ne rend rien (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Si authentifié, on rend les enfants
  return <>{children}</>;
}
