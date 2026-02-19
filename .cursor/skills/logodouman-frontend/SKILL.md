---
name: logodouman-frontend
description: Développe le frontend LogoDouman (Next.js 14, React, TypeScript, Tailwind). Pages boutique, admin, espace vendeur, composants, contextes React. Use when working on LogoDouman UI, React components, Next.js pages, or frontend integration.
---

# LogoDouman - Agent Frontend

## Stack

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **État** : React Context (StoreContext, CartContext)
- **API** : fetch vers `NEXT_PUBLIC_API_URL`

## Répertoires clés

```
logodouman/frontend/
├── app/                    # Pages et layouts
│   ├── page.tsx           # Accueil
│   ├── boutique/          # Catalogue
│   ├── admin/             # Admin plateforme
│   ├── vendeur/           # Espace vendeur (marketplace)
│   ├── components/        # Composants publics
│   ├── contexts/          # Contextes React
│   ├── config/            # api.ts, analytics, currency
│   └── types/             # Types (dans frontend/types via ../../types)
```

## Conventions

- Prix **toujours en centimes** côté API, format FCFA à l'affichage via `formatPrice()`
- Composants fonctionnels avec hooks
- Utiliser les types de `types/index.ts`
- Images : Cloudinary (composant `CloudinaryImageUpload`)

## Marketplace - À implémenter

- Page `/vendeur` : inscription vendeur, dashboard vendeur
- Produits liés au vendeur dans les listings
- Panier multi-vendeurs (groupement par vendeur)
- Profil vendeur public (`/vendeur/[slug]`)
- Filtre par vendeur dans la boutique

## API à consommer

- `GET/POST /api/products` (avec ?sellerId pour filtrage)
- `GET /api/sellers` (liste, profil)
- `POST /api/auth/register-seller` (inscription vendeur)
- `GET /api/sellers/me/*` (dashboard vendeur, protégé)
