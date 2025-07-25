const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Script de réparation Prisma pour LogoDouman...\n');

// Fonction pour exécuter des commandes avec gestion d'erreur
function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} - Terminé\n`);
  } catch (error) {
    console.log(`❌ Erreur lors de: ${description}`);
    console.log(`Commande: ${command}`);
    console.log(`Erreur: ${error.message}\n`);
    return false;
  }
  return true;
}

// 1. Vérifier que le fichier .env existe
if (!fs.existsSync('.env')) {
  console.log('📝 Création du fichier .env...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ Fichier .env créé\n');
}

// 2. Nettoyer les anciens fichiers générés
console.log('🧹 Nettoyage des fichiers générés...');
try {
  if (fs.existsSync('node_modules/.prisma')) {
    fs.rmSync('node_modules/.prisma', { recursive: true, force: true });
  }
  if (fs.existsSync('prisma/generated')) {
    fs.rmSync('prisma/generated', { recursive: true, force: true });
  }
  console.log('✅ Nettoyage terminé\n');
} catch (error) {
  console.log('⚠️ Erreur lors du nettoyage (non critique)\n');
}

// 3. Régénérer le client Prisma
if (!runCommand('npx prisma generate', 'Génération du client Prisma')) {
  process.exit(1);
}

// 4. Pousser le schéma vers la base de données (si la DB est disponible)
console.log('🗄️ Test de connexion à la base de données...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Schéma synchronisé avec la base de données\n');
} catch (error) {
  console.log('⚠️ Impossible de se connecter à la base de données');
  console.log('💡 Assurez-vous que PostgreSQL est démarré avec:');
  console.log('   docker-compose up postgres\n');
}

console.log('🎉 Script de réparation terminé !');
console.log('🚀 Vous pouvez maintenant démarrer le serveur avec: npm run dev');
