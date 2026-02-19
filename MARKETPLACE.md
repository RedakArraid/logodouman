# 🛒 LogoDouman - Marketplace

## Vue d'ensemble

LogoDouman est désormais une **marketplace complète** permettant à plusieurs vendeurs de proposer leurs produits sur la plateforme.

## Fonctionnalités

### Pour les vendeurs
- **Inscription** : `/vendeur` — créer un compte vendeur (nécessite un compte utilisateur)
- **Dashboard vendeur** : `/vendeur/dashboard` — revenus, produits, commandes
- **Gestion produits** : Les vendeurs peuvent créer/modifier leurs produits via l'admin (redirigés selon leur rôle)

### Pour les acheteurs
- **Panier multi-vendeurs** : Les articles sont groupés par vendeur dans le panier
- **Profil vendeur** : `/vendeur/[slug]` — page publique (à venir)
- **Filtre par vendeur** : `GET /api/products?sellerId=xxx`

### Pour l'administrateur
- **Gestion des vendeurs** : Onglet "Vendeurs" dans le dashboard admin
- **Approuver / Suspendre** : Validation des demandes d'inscription vendeur
- **Commission** : Taux configurable par vendeur (défaut 10 %)

## Modèle de données

- **Seller** : storeName, slug, status (pending/approved/suspended), commissionRate
- **Product.sellerId** : nullable — `null` = produit plateforme, sinon = vendeur
- **OrderItem** : sellerId, commissionAmount, sellerEarnings (calculés à la création de commande)
- **SellerPayout** : suivi des versements aux vendeurs

## API vendeurs

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/sellers | Liste des vendeurs approuvés |
| GET | /api/sellers/slug/:slug | Profil public par slug |
| POST | /api/sellers/register | Inscription vendeur (auth requise) |
| GET | /api/sellers/me/profile | Mon profil (vendeur) |
| PUT | /api/sellers/me/profile | Modifier mon profil |
| GET | /api/sellers/me/products | Mes produits |
| GET | /api/sellers/me/orders | Mes commandes |
| GET | /api/sellers/me/earnings | Mes revenus |
| GET | /api/sellers/admin/all | Tous les vendeurs (admin) |
| PUT | /api/sellers/admin/:id/approve | Approuver/suspendre (admin) |

## Migration

Exécuter les migrations Prisma :
```bash
cd logodouman/backend
npx prisma migrate deploy
```

Ou au démarrage Docker (automatique).

## Agents

Voir [AGENTS.md](./AGENTS.md) pour l'organisation des sous-agents (Manager, Frontend, Backend, Infra).
