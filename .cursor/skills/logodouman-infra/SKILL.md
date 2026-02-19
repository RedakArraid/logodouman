---
name: logodouman-infra
description: Gère l'infrastructure LogoDouman (Docker, Traefik, déploiement). docker-compose.prod.yml, Dockerfiles, labels Traefik, volumes, healthchecks. Use when deploying LogoDouman, modifying Docker config, or Traefik routing.
---

# LogoDouman - Agent Infra

## Contexte

- **Projet** : logodouman (dans /root/logodouman)
- **Traefik** : partagé au niveau VPS (/root/docker-compose.yml)
- **Réseau** : `traefik_network` (externe)
- **URLs** : logodouman.genea.space, apilogodouman.genea.space

## Fichiers clés

```
logodouman/
├── docker-compose.prod.yml   # Services prod
├── backend/Dockerfile
├── frontend/Dockerfile
├── .env.production
└── env.production.example
```

## Services Docker

| Service | Port | Traefik |
|---------|------|---------|
| logodouman-frontend | 3001 | Host(logodouman.genea.space) |
| logodouman-backend | 4002 | Host(apilogodouman.genea.space) |
| logodouman-db | 5432 | interne |
| logodouman-redis | 6379 | interne |

## Commandes

```bash
# Démarrer
docker compose -f logodouman/docker-compose.prod.yml --project-name logodouman-prod --env-file logodouman/.env.production up -d

# Rebuild
docker compose -f logodouman/docker-compose.prod.yml --project-name logodouman-prod up -d --build

# Logs
docker compose -f logodouman/docker-compose.prod.yml --project-name logodouman-prod logs -f
```

## Volumes externes

- root_logodouman_postgres_data
- root_logodouman_redis_data
- root_logodouman_backend_uploads
- root_logodouman_backend_logs

## Règles

- Ne pas modifier le docker-compose racine (Traefik) sans coordination
- Les labels Traefik doivent rester cohérents avec les autres projets
- Healthchecks obligatoires sur frontend et backend
- Variables sensibles dans .env.production (jamais committées)
