# Agents LogoDouman

Organisation des agents pour le développement de la marketplace LogoDouman.

## Architecture

```
                    ┌─────────────────────┐
                    │  Agent Manager       │
                    │  (ne code pas)      │
                    └──────────┬──────────┘
                               │ orchestre
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Agent Frontend  │ │ Agent Backend   │ │ Agent Infra     │
│ Next.js, React  │ │ Express, Prisma │ │ Docker, Traefik │
│ UI, UX          │ │ API, métier     │ │ Déploiement     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Rôles

| Agent | Skill | Code | Périmètre |
|-------|-------|------|-----------|
| **Manager** | logodouman-manager | Non | Coordination, priorisation, validation |
| **Frontend** | logodouman-frontend | Oui | Pages, composants, contextes, UI |
| **Backend** | logodouman-backend | Oui | API, Prisma, auth, logique métier |
| **Infra** | logodouman-infra | Oui | Docker, Traefik, volumes, déploiement |

Les définitions détaillées des skills sont dans :

- `.cursor/skills/logodouman-manager/SKILL.md`
- `.cursor/skills/logodouman-frontend/SKILL.md`
- `.cursor/skills/logodouman-backend/SKILL.md`
- `.cursor/skills/logodouman-infra/SKILL.md`

## Documentation produit / technique

| Document | Rôle |
|----------|------|
| [README.md](./README.md) | Démarrage, structure du dépôt, liens |
| [MARKETPLACE.md](./MARKETPLACE.md) | Vendeurs, commissions, API |
| [ANALYSE_PROJET.md](./ANALYSE_PROJET.md) | Analyse technique, schéma, endpoints |
| [CREDENTIALS.md](./CREDENTIALS.md) | Comptes de test |
| [CLOUDINARY_GUIDE.md](./CLOUDINARY_GUIDE.md) | Médias |
| [README-WINDOWS.md](./README-WINDOWS.md) | Installation Windows |
| Modèles Docker | `backend/.env.docker.example`, `frontend/.env.docker.example` |

## Usage

Pour une tâche full-stack marketplace :

1. Le **Manager** découpe en : schéma/API (backend) → UI (frontend) → déploiement (infra).
2. Chaque agent technique reste sur son périmètre.
3. Le **Manager** valide la cohérence des livrables.

---

*Index documentation — 1ᵉʳ mai 2026.*
