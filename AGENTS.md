# 🤖 Agents LogoDouman

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

## Usage

Les skills sont dans `.cursor/skills/`. Cursor les utilise automatiquement selon le contexte.

Pour une tâche full-stack marketplace :
1. Manager découpe en : schema (backend) → API (backend) → UI (frontend) → deploy (infra)
2. Chaque agent travaille sur son périmètre
3. Manager valide la cohérence
