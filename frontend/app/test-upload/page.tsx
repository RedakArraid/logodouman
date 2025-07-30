'use client';

import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { ImageUploadService } from '../config/api';

export default function TestUploadPage() {
  const [productImage, setProductImage] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [message, setMessage] = useState('');

  const handleTestUpload = async () => {
    setMessage('Test des fonctionnalités d\'upload...');
    
    try {
      // Test de connectivité API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (response.ok) {
        setMessage('✅ API Backend connectée avec succès !');
      } else {
        setMessage('❌ Problème de connexion avec l\'API Backend');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion: ' + error.message);
    }
  };

  const clearImages = () => {
    setProductImage('');
    setCategoryImage('');
    setMessage('Images supprimées');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🧪 Test Upload d'Images - LogoDouman
            </h1>
            <p className="text-gray-600">
              Testez les fonctionnalités d'upload pour produits et catégories
            </p>
          </div>

          {/* Boutons de test */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={handleTestUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Tester Connexion API
            </button>
            <button
              onClick={clearImages}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🗑️ Vider les Images
            </button>
          </div>

          {/* Message d'état */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center font-medium">{message}</p>
            </div>
          )}

          {/* Section Upload Produits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  📦 Upload Image Produit
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Testez l'upload d'images pour les produits (max 5MB)
                </p>
                
                <ImageUpload
                  currentImage={productImage}
                  onImageChange={setProductImage}
                  type="product"
                  placeholder="Choisir une image de produit"
                  maxSize={5}
                />

                {productImage && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-sm">
                      ✅ Image uploadée: {productImage.split('/').pop()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section Upload Catégories */}
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  🏷️ Upload Image Catégorie
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Testez l'upload d'images pour les catégories (max 3MB)
                </p>
                
                <ImageUpload
                  currentImage={categoryImage}
                  onImageChange={setCategoryImage}
                  type="category"
                  placeholder="Choisir une image de catégorie"
                  maxSize={3}
                />

                {categoryImage && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-sm">
                      ✅ Image uploadée: {categoryImage.split('/').pop()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informations Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Formats Supportés:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>JPG / JPEG</li>
                  <li>PNG</li>
                  <li>WebP</li>
                  <li>GIF (produits seulement)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Limites de Taille:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Produits: 5MB maximum</li>
                  <li>Catégories: 3MB maximum</li>
                  <li>Stockage: Volumes Docker persistants</li>
                  <li>Sécurité: Authentification requise</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Liens Utiles</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/admin/login"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                🔑 Interface Admin
              </a>
              <a
                href="http://localhost:4002"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📡 API Backend
              </a>
              <a
                href="http://localhost:8080"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🗄️ Adminer DB
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
