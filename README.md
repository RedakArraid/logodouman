# LogoDouman - Plateforme E-commerce 🧡

## 🚀 Site e-commerce moderne avec interface d'administration

### ✨ Fonctionnalités principales

#### 🛍️ **Site Client** (`/`)
- **Design orange harmonieux** avec textes noirs
- **8 produits** répartis dans 4 catégories
- **Système de panier** fonctionnel
- **Recherche en temps réel** 
- **Filtrage par catégories**
- **Interface responsive** (mobile/desktop)
- **Animations** et effets visuels

#### ⚙️ **Interface d'Administration** (`/admin`)
- **Gestion complète des produits** (CRUD)
- **Gestion des catégories** (CRUD)
- **Statistiques en temps réel**
- **Activation/désactivation** des éléments
- **Interface intuitive** avec onglets
- **Synchronisation automatique** avec le site

### 🛠️ Installation et lancement

```bash
# 1. Cloner le projet
git clone https://github.com/RedakArraid/logodouman.git
cd logodouman/frontend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
http://localhost:3000
```

### 📱 Navigation

- **Site principal** : `http://localhost:3000`
- **Administration** : `http://localhost:3000/admin`
- **Lien Admin** : Bouton "⚙️ Admin" dans le header du site

### 🎨 Design et Couleurs

**Palette harmonieuse :**
- 🧡 **Orange** : Fonds, boutons, accents (`orange-100` à `orange-700`)
- ⚫ **Noir/Gris** : Textes principaux (`text-black`, `text-gray-600`)
- ⚪ **Blanc** : Cartes, zones de contenu

### 📦 Structure du projet

```
logodouman/
├── frontend/                    # Site Next.js
│   ├── app/
│   │   ├── page.tsx            # 🏠 Page principale (site client)
│   │   ├── admin/
│   │   │   └── page.tsx        # ⚙️ Interface d'administration
│   │   ├── contexts/
│   │   │   └── StoreContext.tsx # 🔄 Gestion d'état globale
│   │   ├── layout.tsx          # 📄 Layout principal
│   │   └── styles.css          # 🎨 Styles Tailwind
│   ├── tailwind.config.js      # ⚙️ Configuration Tailwind
│   ├── postcss.config.js       # 📦 Configuration PostCSS
│   └── package.json            # 📋 Dépendances
├── backend/                     # 🔧 API (à développer)
├── documentation/               # 📚 Documentation technique
├── docker-compose.yml          # 🐳 Configuration Docker
└── README.md                   # 📖 Ce fichier
```

### ⚙️ Interface d'Administration

#### **Fonctionnalités Produits :**
- ✅ **Ajouter** un nouveau produit
- ✏️ **Modifier** un produit existant
- 🗑️ **Supprimer** un produit
- 🔘 **Activer/Désactiver** un produit
- 📊 **Gestion du stock**
- 🏷️ **Attribution aux catégories**

#### **Fonctionnalités Catégories :**
- ✅ **Ajouter** une nouvelle catégorie
- ✏️ **Modifier** une catégorie
- 🗑️ **Supprimer** une catégorie (si vide)
- 🔘 **Activer/Désactiver** une catégorie
- 📈 **Comptage automatique** des produits

#### **Statistiques Temps Réel :**
- 📦 **Total produits**
- 🏷️ **Nombre de catégories**
- 📊 **Stock total**
- 💰 **Valeur du stock** (en FCFA)

### 🔄 Synchronisation des Données

**Contexte React** (`StoreContext`) :
- 🔄 **Synchronisation automatique** entre site et admin
- 💾 **État global partagé**
- ⚡ **Mises à jour en temps réel**
- 📊 **Calculs automatiques** (compteurs, totaux)

### 🎯 Utilisation de l'Admin

1. **Accéder à l'admin** : Cliquer sur "⚙️ Admin" dans le header
2. **Gérer les produits** : Onglet "📦 Gestion des Produits"
3. **Gérer les catégories** : Onglet "🏷️ Gestion des Catégories"
4. **Ajouter un élément** : Bouton "➕ Ajouter"
5. **Modifier** : Bouton "✏️ Modifier" sur chaque élément
6. **Supprimer** : Bouton "🗑️ Supprimer" (avec confirmation)
7. **Changer le statut** : Cliquer sur le badge de statut

### 🚀 Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS 3.4** - Styles utilitaires
- **React Context** - Gestion d'état
- **React Hooks** - Logique composants

### 🔧 Configuration Tailwind

**Classes orange personnalisées :**
```javascript
orange: {
  50: '#fff7ed',   // Très clair
  100: '#ffedd5',  // Clair
  200: '#fed7aa',  // Moyen clair
  300: '#fdba74',  // Moyen
  400: '#fb923c',  // Moyen foncé
  500: '#f97316',  // Standard
  600: '#ea580c',  // Foncé
  700: '#c2410c',  // Très foncé
  800: '#9a3412',  // Ultra foncé
  900: '#7c2d12',  // Maximum
}
```

### 📸 Gestion des images avec Cloudinary

**LogoDouman utilise Cloudinary** pour le stockage et l'optimisation des images :

- ✅ **Stockage cloud** sécurisé (25 GB gratuit)
- ✅ **CDN mondial** pour performances maximales
- ✅ **Optimisation automatique** (WebP, compression)
- ✅ **Transformations** à la volée (resize, crop, etc.)

**Configuration :** Les credentials Cloudinary sont déjà configurés dans `docker-compose.yml`

📚 **Guide complet :** [CLOUDINARY_GUIDE.md](./CLOUDINARY_GUIDE.md)

### 📱 Responsive Design

- **Mobile** : Interface adaptée, navigation simplifiée
- **Tablet** : Grilles optimisées, touch-friendly
- **Desktop** : Interface complète, hover effects

### 🔒 Fonctionnalités de Sécurité

- **Confirmations** pour les suppressions
- **Validation** des formulaires
- **Vérification** des dépendances (catégories/produits)
- **États** de chargement et erreurs

### 🎨 Personnalisation

**Modifier les couleurs :**
1. Éditer `tailwind.config.js`
2. Changer les valeurs dans la section `colors.orange`
3. Redémarrer le serveur : `npm run dev`

**Ajouter des champs produits :**
1. Modifier l'interface `Product` dans `StoreContext.tsx`
2. Mettre à jour les formulaires dans `admin/page.tsx`
3. Adapter l'affichage dans `page.tsx`

### 🐛 Dépannage

**Styles ne se chargent pas :**
```bash
rm -rf .next
npm run dev
```

**Erreurs TypeScript :**
```bash
npm run type-check
```

**Problèmes de dépendances :**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 🚀 Déploiement

**Build de production :**
```bash
npm run build
npm start
```

**Variables d'environnement :**
Créer `.env.local` si nécessaire pour la configuration.

### 📧 Support

Pour toute question ou problème :
- Vérifier la console du navigateur
- Consulter les logs du serveur
- Redémarrer le serveur de développement

---

**🧡 LogoDouman - E-commerce de nouvelle génération** 
*Créé avec ❤️ pour révolutionner le shopping en ligne*