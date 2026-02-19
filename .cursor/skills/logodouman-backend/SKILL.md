---
name: logodouman-backend
description: Développe le backend LogoDouman (Express, Prisma, Node.js). Routes API, logique métier, auth JWT, Cloudinary, Redis. Use when working on LogoDouman API, database schema, business logic, or backend services.
---

# LogoDouman - Agent Backend

## Stack

- **Framework** : Express.js 4.18
- **ORM** : Prisma
- **Validation** : Zod
- **Auth** : JWT (jsonwebtoken), bcrypt
- **Base** : PostgreSQL
- **Cache** : Redis
- **Upload** : Multer + Cloudinary

## Répertoires clés

```
logodouman/backend/
├── src/
│   ├── app.js              # Point d'entrée, routes
│   ├── routes.*.js         # Routes par ressource
│   ├── middleware.auth.js  # requireAuth, requireAdmin, requireSeller
│   ├── services/           # cloudinary.service.js
│   └── prisma/             # schema.prisma, migrations
```

## Conventions

- Prix **toujours en centimes** en BDD
- Validation Zod sur toutes les entrées
- `requireAuth` : utilisateur connecté
- `requireAdmin` : role === 'admin'
- `requireSeller` : User avec Seller lié (nouveau pour marketplace)

## Marketplace - À implémenter

### Modèles Prisma
- `Seller` : storeName, slug, userId, status, commissionRate
- `Product.sellerId` : lien optionnel (null = produits plateforme)
- `OrderItem.sellerId` : pour commission / payout
- `SellerPayout` : suivi des versements
- `Commission` : taux par catégorie ou global

### Routes
- `POST /api/auth/register-seller`
- `GET /api/sellers` (liste publique)
- `GET /api/sellers/:slug` (profil public)
- `GET/PUT /api/sellers/me` (dashboard vendeur, protégé)
- `GET /api/sellers/me/products`
- `GET /api/sellers/me/orders`
- `GET /api/sellers/me/earnings`
- Produits : filtre `?sellerId=xxx` sur GET /api/products
