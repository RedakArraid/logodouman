'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard principal
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">LogoDouman Admin</h2>
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
} 