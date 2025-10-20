#!/usr/bin/env node
/**
 * Script de test Cloudinary pour LogoDouman
 * 
 * Usage:
 *   node scripts/test-cloudinary.js
 * 
 * Ou avec Docker:
 *   docker-compose exec backend node scripts/test-cloudinary.js
 */

require('dotenv').config();
const { cloudinary, checkConfiguration } = require('../src/services/cloudinary.service');

console.log('\n🧪 Test de configuration Cloudinary\n');
console.log('═'.repeat(60));

// 1. Vérifier les variables d'environnement
console.log('\n📋 Étape 1/4 : Vérification des variables d\'environnement\n');

const config = cloudinary.config();
const requiredVars = {
  'CLOUDINARY_CLOUD_NAME': config.cloud_name,
  'CLOUDINARY_API_KEY': config.api_key,
  'CLOUDINARY_API_SECRET': config.api_secret
};

let allVarsPresent = true;

for (const [varName, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`   ❌ ${varName} : NON DÉFINIE`);
    allVarsPresent = false;
  } else {
    // Masquer partiellement les secrets
    let displayValue = value;
    if (varName !== 'CLOUDINARY_CLOUD_NAME') {
      displayValue = value.substring(0, 6) + '***' + value.substring(value.length - 4);
    }
    console.log(`   ✅ ${varName} : ${displayValue}`);
  }
}

if (!allVarsPresent) {
  console.log('\n❌ ERREUR : Variables d\'environnement manquantes !\n');
  console.log('💡 Solution :');
  console.log('   1. Créez un compte sur https://cloudinary.com');
  console.log('   2. Récupérez vos credentials dans le Dashboard');
  console.log('   3. Ajoutez-les dans docker-compose.yml ou .env\n');
  process.exit(1);
}

// 2. Tester la connexion
console.log('\n🔌 Étape 2/4 : Test de connexion à Cloudinary\n');

cloudinary.api.ping()
  .then(result => {
    console.log('   ✅ Connexion réussie !');
    console.log(`   📊 Statut : ${result.status}`);
    return cloudinary.api.usage();
  })
  .then(usage => {
    // 3. Afficher les informations du compte
    console.log('\n📊 Étape 3/4 : Informations du compte\n');
    
    const usedStorage = (usage.storage.usage / 1024 / 1024).toFixed(2);
    const totalStorage = (usage.plan === 'Free' ? 25 * 1024 : usage.storage.limit / 1024 / 1024).toFixed(2);
    const storagePercent = ((usage.storage.usage / (totalStorage * 1024 * 1024)) * 100).toFixed(1);
    
    console.log(`   📦 Plan : ${usage.plan}`);
    console.log(`   💾 Stockage : ${usedStorage} MB / ${totalStorage} MB (${storagePercent}%)`);
    console.log(`   📸 Ressources : ${usage.resources || 0} images`);
    console.log(`   🔄 Transformations : ${usage.transformations?.usage || 0} / ${usage.transformations?.limit || 'illimité'}`);
    console.log(`   📊 Bande passante : ${((usage.bandwidth?.usage || 0) / 1024 / 1024).toFixed(2)} MB ce mois`);
    
    // 4. Lister les dossiers
    console.log('\n📁 Étape 4/4 : Structure des dossiers\n');
    return cloudinary.api.root_folders();
  })
  .then(folders => {
    if (folders.folders && folders.folders.length > 0) {
      console.log('   Dossiers trouvés :');
      folders.folders.forEach(folder => {
        console.log(`   📁 ${folder.name} ${folder.path === 'logodouman' ? '← LogoDouman' : ''}`);
      });
      
      // Vérifier si le dossier logodouman existe
      const logodoumanFolder = folders.folders.find(f => f.path === 'logodouman');
      if (logodoumanFolder) {
        console.log('\n   ✅ Le dossier "logodouman" existe déjà');
        return cloudinary.api.resources({ type: 'upload', prefix: 'logodouman/', max_results: 10 });
      } else {
        console.log('\n   ℹ️  Le dossier "logodouman" sera créé au premier upload');
        return { resources: [] };
      }
    } else {
      console.log('   ℹ️  Aucun dossier trouvé (normal pour un nouveau compte)');
      return { resources: [] };
    }
  })
  .then(resources => {
    if (resources.resources && resources.resources.length > 0) {
      console.log(`\n   📸 Images dans "logodouman" : ${resources.resources.length}`);
      resources.resources.slice(0, 5).forEach(resource => {
        console.log(`      • ${resource.public_id.split('/').pop()} (${(resource.bytes / 1024).toFixed(1)} KB)`);
      });
      if (resources.resources.length > 5) {
        console.log(`      ... et ${resources.resources.length - 5} autres`);
      }
    }
    
    // Résumé final
    console.log('\n' + '═'.repeat(60));
    console.log('\n🎉 Test réussi ! Cloudinary est correctement configuré.\n');
    console.log('📋 Prochaines étapes :');
    console.log('   1. Démarrez le backend : docker-compose up -d');
    console.log('   2. Connectez-vous à l\'admin : http://localhost:3000/admin/login');
    console.log('   3. Uploadez une image de produit');
    console.log('   4. Vérifiez sur https://cloudinary.com/console/media_library\n');
    
  })
  .catch(error => {
    console.log('\n❌ ERREUR lors du test :\n');
    
    if (error.http_code === 401) {
      console.log('   🔑 Credentials invalides');
      console.log('   💡 Vérifiez que vous avez bien copié :');
      console.log('      - CLOUDINARY_CLOUD_NAME');
      console.log('      - CLOUDINARY_API_KEY');
      console.log('      - CLOUDINARY_API_SECRET');
      console.log('\n   🔗 Récupérez-les sur : https://cloudinary.com/console\n');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('   🌐 Erreur de connexion réseau');
      console.log('   💡 Vérifiez votre connexion internet\n');
    } else {
      console.log(`   ${error.message}`);
      console.log('\n   📚 Consultez la documentation : https://cloudinary.com/documentation\n');
    }
    
    process.exit(1);
  });

