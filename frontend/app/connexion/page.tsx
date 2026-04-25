'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../config/api';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('retour') || searchParams?.get('redirect') || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await AuthService.login(email, password);
      if (data.user?.role === 'admin') {
        if (typeof window !== 'undefined') localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push(returnUrl || '/admin/dashboard');
      } else if (data.user?.role === 'seller') {
        if (typeof window !== 'undefined') localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push(returnUrl || '/vendeur/dashboard');
      } else {
        router.push(returnUrl || '/mon-compte');
      }
    } catch (err: any) {
      setError(err?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <PublicHeader />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
            <LockClosedIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">Accédez à votre compte LogoDouman</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="votre@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="text-orange-600 font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">
              ← Retour à l&apos;accueil
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-gray-400">
            <Link href="/admin/login" className="hover:text-orange-600">
              Accès admin / vendeur
            </Link>
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  );
}
