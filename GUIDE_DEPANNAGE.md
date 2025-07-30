# 🔧 Guide de Dépannage - Bouton Upload d'Images

## 🎯 Problème Identifié
**Symptôme :** Pas de bouton "Parcourir" visible pour sélectionner des images dans les formulaires admin.

## 🚀 Solutions par Étapes

### 1. Test Rapide de Base
```bash
# Aller dans le projet
cd /Users/kader/Desktop/projet-en-cours/logodouman

# Lancer le diagnostic automatique
node fix-image-upload.js

# Démarrer le projet
npm run dev
```

### 2. Tester la Sélection de Fichiers
Accéder à la page de test : **http://localhost:3000/test-upload-simple**

**✅ Si ça fonctionne :** Le problème est dans l'intégration admin  
**❌ Si ça ne fonctionne pas :** Le problème est plus profond

### 3. Vérifier l'Interface Admin

```bash
# Accéder à l'admin
http://localhost:3000/admin/login

# Connexion
Email: admin@logodouman.com
Mot de passe: admin123

# Tester
Produits > Ajouter un produit > Section "Image du produit"
```

### 4. Diagnostic Console Navigateur

1. **Ouvrir les outils développeur** : `F12` ou `Ctrl+Shift+I`
2. **Onglet Console** : Chercher les erreurs en rouge
3. **Onglet Network** : Vérifier les requêtes API

**Erreurs communes :**
- `NEXT_PUBLIC_API_URL is not defined`
- `Cannot read properties of undefined`
- `Failed to fetch` (backend non démarré)

### 5. Vérifications Techniques

#### Variables d'Environnement
```bash
# Vérifier frontend/.env.local
cat frontend/.env.local

# Doit contenir:
NEXT_PUBLIC_API_URL=http://localhost:4002
```

#### Services Actifs
```bash
# Vérifier que le backend est démarré
curl http://localhost:4002/health

# Ou vérifier les ports
lsof -i :3000  # Frontend
lsof -i :4002  # Backend
```

#### Composants Frontend
```bash
# Vérifier que le composant existe
ls -la frontend/app/components/ImageUpload.tsx
ls -la frontend/app/admin/components/ProductForm.tsx
```

## 🛠️ Solutions Spécifiques

### Solution A : Redémarrage Complet
```bash
# Arrêter tout
pkill -f node
pkill -f next

# Nettoyer
rm -rf frontend/.next
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Réinstaller
npm run install:all

# Redémarrer
npm run dev
```

### Solution B : Mode Docker
```bash
# Si le mode dev ne fonctionne pas
npm run docker:down
npm run docker:clean
npm run docker:setup
```

### Solution C : Réparation Manuelle

#### Vérifier le Composant ImageUpload
Le bouton devrait être visible dans le code :

```tsx
<button
  onClick={handleClick}
  disabled={uploading}
  type="button"
  className="flex-1 py-2 px-4 rounded-lg text-sm font-medium..."
>
  📁 {uploading ? 'Upload...' : 'Parcourir'}
</button>
```

#### Vérifier l'Import dans ProductForm
```tsx
import ImageUpload from '../../components/ImageUpload';

// Usage dans le formulaire
<ImageUpload
  currentImage={formData.image}
  onImageChange={handleImageChange}
  type="product"
/>
```

### Solution D : Debug CSS
Parfois le bouton est masqué par du CSS :

```css
/* Dans la console navigateur, tester : */
.hidden { display: block !important; }
input[type="file"] { display: block !important; }
```

## 🎯 Points de Contrôle

### ✅ Checklist de Vérification
- [ ] Backend démarré sur port 4002
- [ ] Frontend démarré sur port 3000  
- [ ] Variables d'environnement configurées
- [ ] Aucune erreur en console navigateur
- [ ] Authentification admin fonctionnelle
- [ ] Page de test fonctionne
- [ ] Composant ImageUpload importé correctement

### 🚨 Signaux d'Alerte
- Page blanche ou erreur 500
- "Cannot connect to backend"
- Boutons grisés ou non-cliquables
- Erreurs TypeScript en console
- Redirections infinies

## 📞 Support Avancé

### Logs à Collecter
```bash
# Frontend
npm run dev 2>&1 | tee frontend.log

# Backend  
cd backend && npm run dev 2>&1 | tee backend.log

# Docker
docker-compose logs --tail=50
```

### Informations Système
```bash
# Versions
node --version
npm --version
docker --version

# Processus actifs
ps aux | grep node
ps aux | grep next
```

## 🎉 Solution Garantie

Si rien ne fonctionne, cette commande recrée un environnement propre :

```bash
cd /Users/kader/Desktop/projet-en-cours/logodouman

# Reset total
git clean -fd
git reset --hard HEAD

# Réinstallation complète
npm run fresh-install

# Test final
npm run dev
```

Puis accéder à : **http://localhost:3000/test-upload-simple**

---

**📧 En cas de problème persistant :**
Partagez les erreurs de la console navigateur (F12) et les logs du terminal.
