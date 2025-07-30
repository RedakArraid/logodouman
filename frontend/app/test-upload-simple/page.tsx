'use client';

import { useState, useRef } from 'react';

export default function TestUploadPage() {
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError('');
    
    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 5MB.');
      return;
    }

    // Prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🧡 Test Upload Images - LogoDouman
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">❌ {error}</p>
          </div>
        )}

        {preview && (
          <div className="mb-6">
            <img src={preview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg border shadow-md" />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <div className="text-6xl text-gray-400 mb-4">📸</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Glissez-déposez une image ou cliquez pour parcourir
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP (max 5MB)
            </p>
          </div>
          
          <button
            onClick={handleClick}
            className="w-full mt-4 py-4 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
          >
            📁 Parcourir et sélectionner une image
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">📋 Instructions de test:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cliquez sur le bouton orange "Parcourir et sélectionner une image"</li>
            <li>• Ou faites glisser-déposer une image dans la zone</li>
            <li>• Sélectionnez une image depuis votre ordinateur</li>
            <li>• L'image devrait s'afficher en aperçu</li>
            <li>• Si ça ne fonctionne pas, ouvrez la console (F12) pour voir les erreurs</li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>💡 Ce test vérifie uniquement l'interface de sélection de fichiers.</strong><br/>
              Pour tester l'upload complet vers le serveur, utilisez l'interface admin:
              <br/>🔗 <span className="font-mono">http://localhost:3000/admin/login</span>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">🔧 Debug Info:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Status: {uploading ? 'En cours' : 'Prêt'}</p>
            <p>• Preview: {preview ? 'Image chargée' : 'Aucune image'}</p>
            <p>• Erreur: {error || 'Aucune'}</p>
            <p>• Input ref: {fileInputRef.current ? 'Connecté' : 'Non connecté'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}