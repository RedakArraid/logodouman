#!/usr/bin/env node

/**
 * 🔧 Script de diagnostic et correction pour l'upload d'images LogoDouman
 * Vérifie et corrige les problèmes courants d'upload d'images
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic du système d\'upload d\'images LogoDouman\n');

// Configuration
const frontendPath = path.join(__dirname, 'frontend');
const backendPath = path.join(__dirname, 'backend');

// Vérifications
const checks = {
  frontendFiles: [
    'app/components/ImageUpload.tsx',
    'app/admin/components/ProductForm.tsx', 
    'app/admin/components/CategoryForm.tsx',
    'app/config/api.ts',
    'types/index.ts'
  ],
  backendFiles: [
    'src/routes.product.js',
    'src/routes.category.js',
    'src/app.js'
  ],
  envFiles: [
    'frontend/.env.local',
    'backend/.env'
  ]
};

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${filePath}`);
  return exists;
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

function writeFileContent(filePath, content) {
  try {
    fs.writeFileSync(path.join(__dirname, filePath), content, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Erreur écriture ${filePath}:`, error.message);
    return false;
  }
}

// 1. Vérifier les fichiers essentiels
console.log('📂 Vérification des fichiers essentiels:');
let allFilesExist = true;

checks.frontendFiles.forEach(file => {
  if (!checkFileExists(`frontend/${file}`)) {
    allFilesExist = false;
  }
});

checks.backendFiles.forEach(file => {
  if (!checkFileExists(`backend/${file}`)) {
    allFilesExist = false;
  }
});

// 2. Vérifier la configuration environnement
console.log('\n🌐 Vérification des variables d\'environnement:');

const frontendEnv = readFileContent('frontend/.env.local');
if (frontendEnv) {
  const hasApiUrl = frontendEnv.includes('NEXT_PUBLIC_API_URL');
  console.log(`${hasApiUrl ? '✅' : '❌'} NEXT_PUBLIC_API_URL configuré`);
  
  if (!hasApiUrl) {
    console.log('🔧 Correction: Ajout de NEXT_PUBLIC_API_URL');
    const newEnv = frontendEnv + '\nNEXT_PUBLIC_API_URL=http://localhost:4002\n';
    writeFileContent('frontend/.env.local', newEnv);
  }
} else {
  console.log('❌ Frontend .env.local manquant');
  console.log('🔧 Création du fichier .env.local');
  writeFileContent('frontend/.env.local', 'NEXT_PUBLIC_API_URL=http://localhost:4002\n');
}

// 3. Vérifier le composant ImageUpload
console.log('\n🖼️ Vérification du composant ImageUpload:');

const imageUploadContent = readFileContent('frontend/app/components/ImageUpload.tsx');
if (imageUploadContent) {
  const hasParcourrirButton = imageUploadContent.includes('Parcourir');
  const hasFileInput = imageUploadContent.includes('type="file"');
  const hasOnClick = imageUploadContent.includes('onClick={handleClick}');
  
  console.log(`${hasParcourrirButton ? '✅' : '❌'} Bouton "Parcourir" présent`);
  console.log(`${hasFileInput ? '✅' : '❌'} Input file présent`);
  console.log(`${hasOnClick ? '✅' : '❌'} Gestionnaire de clic configuré`);
} else {
  console.log('❌ Composant ImageUpload manquant');
}

// 4. Vérifier les formulaires admin
console.log('\n📝 Vérification des formulaires admin:');

const productFormContent = readFileContent('frontend/app/admin/components/ProductForm.tsx');
const categoryFormContent = readFileContent('frontend/app/admin/components/CategoryForm.tsx');

if (productFormContent) {
  const usesImageUpload = productFormContent.includes('ImageUpload');
  console.log(`${usesImageUpload ? '✅' : '❌'} ProductForm utilise ImageUpload`);
} else {
  console.log('❌ ProductForm manquant');
}

if (categoryFormContent) {
  const usesImageUpload = categoryFormContent.includes('ImageUpload');
  console.log(`${usesImageUpload ? '✅' : '❌'} CategoryForm utilise ImageUpload`);
} else {
  console.log('❌ CategoryForm manquant');
}

// 5. Vérifier les routes backend
console.log('\n🔗 Vérification des routes backend:');

const productRoutes = readFileContent('backend/src/routes.product.js');
const categoryRoutes = readFileContent('backend/src/routes.category.js');

if (productRoutes) {
  const hasUploadRoute = productRoutes.includes('/upload');
  const hasMulter = productRoutes.includes('multer');
  console.log(`${hasUploadRoute ? '✅' : '❌'} Route upload produits`);
  console.log(`${hasMulter ? '✅' : '❌'} Multer configuré`);
} else {
  console.log('❌ Routes produits manquantes');
}

if (categoryRoutes) {
  const hasUploadRoute = categoryRoutes.includes('/upload');
  console.log(`${hasUploadRoute ? '✅' : '❌'} Route upload catégories`);
} else {
  console.log('❌ Routes catégories manquantes');
}

// 6. Créer une page de test
console.log('\n🧪 Création d\'une page de test:');

const testPageContent = `'use client';

import { useState, useRef } from 'react';

export default function TestUploadPage() {
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
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
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
            <img src={preview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg border" />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <button
            onClick={handleClick}
            className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
          >
            📁 Parcourir et sélectionner une image
          </button>
          
          <p className="text-center text-gray-500 mt-4">
            Formats supportés: JPG, PNG, WebP (max 5MB)
          </p>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">📋 Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cliquez sur le bouton orange ci-dessus</li>
            <li>• Sélectionnez une image depuis votre ordinateur</li>
            <li>• L'image devrait s'afficher en aperçu</li>
            <li>• Si ça ne fonctionne pas, vérifiez la console du navigateur (F12)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`;

const testPagePath = 'frontend/app/test-upload-simple/page.tsx';
writeFileContent(testPagePath, testPageContent);
console.log(`✅ Page de test créée: http://localhost:3000/test-upload-simple`);

// 7. Résumé et recommendations
console.log('\n📋 RÉSUMÉ ET RECOMMANDATIONS:\n');

if (allFilesExist) {
  console.log('✅ Tous les fichiers essentiels sont présents');
} else {
  console.log('❌ Certains fichiers sont manquants');
}

console.log(`
🎯 ÉTAPES DE DÉPANNAGE:

1. 🚀 Démarrer le projet:
   npm run dev
   # ou avec Docker:
   npm run docker:up

2. 🌐 Accéder aux interfaces:
   • Site: http://localhost:3000
   • Admin: http://localhost:3000/admin/login  
   • Test: http://localhost:3000/test-upload-simple

3. 🔐 Se connecter à l'admin:
   • Email: admin@logodouman.com
   • Mot de passe: admin123

4. 📱 Tester l'upload:
   • Aller dans "Produits" > "Ajouter un produit"
   • Chercher la section "Image du produit"
   • Cliquer sur "Parcourir les fichiers"

5. 🔧 Si le bouton n'apparaît pas:
   • Ouvrir la console navigateur (F12)
   • Vérifier les erreurs JavaScript
   • Vérifier que NEXT_PUBLIC_API_URL est configuré
   • Redémarrer le serveur de développement

6. 🐳 Avec Docker:
   docker-compose logs frontend
   docker-compose logs backend

🆘 POINTS DE VÉRIFICATION:
• Le backend est-il démarré sur le port 4002 ?
• Les variables d'environnement sont-elles configurées ?
• Y a-t-il des erreurs dans la console du navigateur ?
• L'authentification admin fonctionne-t-elle ?

💡 CONTACT:
Si le problème persiste, partagez les erreurs de la console navigateur (F12).
`);

console.log('🎉 Diagnostic terminé ! Suivez les étapes ci-dessus pour résoudre le problème.\n');
