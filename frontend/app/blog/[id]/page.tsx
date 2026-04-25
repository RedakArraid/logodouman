'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BlogPostPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article #{id}</h1>
          <p className="text-gray-600 mb-8">
            Cet article est en cours de rédaction. Revenez bientôt pour découvrir son contenu.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Retour au blog
          </Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
