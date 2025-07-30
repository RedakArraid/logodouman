# 📸 Guide d'Utilisation - Upload d'Images

## 🎯 Fonctionnalités Implémentées

### ✅ Backend Sécurisé
- **Upload authentifié** : Seuls les admins peuvent uploader
- **Validation stricte** : JPG, PNG, WebP uniquement
- **Limites de taille** : 5MB produits, 3MB catégories
- **Stockage séparé** : /uploads/products et /uploads/categories
- **Routes sécurisées** : Téléchargement et suppression

### ✅ Frontend Intuitif
- **Drag & Drop** : Interface moderne de glisser-déposer
- **Prévisualisation** : Aperçu immédiat des images
- **États visuels** : Loading, erreurs, succès
- **Téléchargement** : Bouton pour télécharger les images
- **Intégration** : Composants prêts pour formulaires admin

### ✅ Docker Persistant
- **Volumes** : Sauvegarde automatique des images
- **Permissions** : Configuration correcte des droits
- **Backup** : Possibilité de sauvegarde des uploads

## 🚀 Utilisation dans l'Admin

### Ajouter un Produit avec Image

```tsx
import ProductForm from './components/ProductForm';

// Dans votre page admin
<ProductForm
  onSubmit={(data) => {
    // data.image contiendra l'URL de l'image uploadée
    console.log('Image URL:', data.image);
    // http://localhost:4002/uploads/1642789123456-mon_image.jpg
  }}
  onCancel={() => setShowForm(false)}
/>
```

### Ajouter une Catégorie avec Image

```tsx
import CategoryForm from './components/CategoryForm';

// Dans votre page admin
<CategoryForm
  onSubmit={(data) => {
    // data.image contiendra l'URL de l'image uploadée  
    console.log('Image URL:', data.image);
    // http://localhost:4002/uploads/categories/category-1642789123456-image.jpg
  }}
  onCancel={() => setShowForm(false)}
/>
```

### Utilisation Directe du Composant

```tsx
import ImageUpload from '../components/ImageUpload';

const [imageUrl, setImageUrl] = useState('');

<ImageUpload
  currentImage={imageUrl}
  onImageChange={setImageUrl}
  type="product" // ou "category"
  placeholder="Choisir une image"
  maxSize={5} // en MB
/>
```

## 🔧 API Endpoints

### Upload Produit
```bash
POST /api/products/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data
image: <file>
```

### Upload Catégorie
```bash
POST /api/categories/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data
image: <file>
```

### Télécharger Image
```bash
GET /api/products/download/<filename>
# Force le téléchargement du fichier
```

### Supprimer Image
```bash
DELETE /api/products/image/<filename>
Authorization: Bearer <token>
```

## 📁 Structure des Fichiers

```
uploads/
├── products/
│   ├── 1642789123456-sac_rouge.jpg
│   ├── 1642789234567-pochette_noire.png
│   └── ...
├── categories/
│   ├── category-1642789345678-luxe.jpg
│   ├── category-1642789456789-vintage.png
│   └── ...
└── temp/
    └── (fichiers temporaires)
```

## 🛡️ Sécurité

### Validation Côté Serveur
- **Types MIME** vérifiés
- **Taille limitée** et appliquée
- **Noms sanitisés** pour éviter les injections
- **Authentification** obligatoire

### Validation Côté Client
- **Types de fichiers** pré-vérifiés
- **Taille** validée avant upload
- **Feedback** utilisateur en temps réel
- **Gestion d'erreurs** robuste

## 🚀 Démarrage

### 1. Redémarrer les Services
```bash
# Arrêter les services
docker-compose down

# Reconstruire avec les nouvelles modifications
docker-compose up --build

# Vérifier les logs
docker-compose logs backend
```

### 2. Tester l'Upload
1. Aller sur http://localhost:3000/admin
2. Se connecter (si authentification active)
3. Aller dans "Gestion des Produits"
4. Cliquer "Ajouter un produit"
5. Glisser une image dans la zone d'upload
6. Vérifier que l'image s'affiche
7. Sauvegarder le produit

### 3. Vérifier le Stockage
```bash
# Voir les fichiers uploadés
docker-compose exec backend ls -la /app/uploads/

# Voir les logs d'upload
docker-compose logs backend | grep upload
```

## 🔍 Dépannage

### Erreur "Fichier trop volumineux"
- Vérifier la taille max (5MB produits, 3MB catégories)
- Compresser l'image avant upload

### Erreur "Type de fichier non autorisé"
- Utiliser uniquement JPG, PNG, WebP
- Vérifier l'extension du fichier

### Image ne s'affiche pas
- Vérifier que l'URL commence par http://localhost:4002/uploads/
- Vérifier que le fichier existe dans le conteneur Docker
- Contrôler les logs backend pour les erreurs

### Upload qui ne fonctionne pas
- Vérifier l'authentification (token valide)
- Vérifier les permissions utilisateur (admin/manager)
- Contrôler les logs frontend (console du navigateur)

## 📊 Exemple de Réponse API

### Upload Réussi
```json
{
  "success": true,
  "data": {
    "url": "/uploads/1642789123456-mon_image.jpg",
    "filename": "1642789123456-mon_image.jpg",
    "originalName": "mon_image.jpg",
    "mimetype": "image/jpeg",
    "size": 245760,
    "uploadedAt": "2024-01-21T10:30:00.000Z"
  },
  "message": "Image uploadée avec succès"
}
```

### Erreur d'Upload
```json
{
  "success": false,
  "error": "Type de fichier non autorisé. Utilisez: JPG, PNG, WebP, GIF"
}
```

## 🎉 Succès !

Votre système d'upload d'images est maintenant **entièrement fonctionnel** avec :

- ✅ **Sécurité renforcée**
- ✅ **Interface utilisateur moderne**
- ✅ **Stockage persistant**
- ✅ **Gestion d'erreurs complète**
- ✅ **Performance optimisée**

**Profitez de votre nouvel système d'upload d'images !** 📸
