# 🚀 Inventa API (Backend NestJS Enterprise & Docker)

Backend REST API conçu avec **NestJS** pour la suite logicielle **Inventa** (Bayecode Tech).  
Ce dépôt est **totalement indépendant** du frontend (`gems-flow-suite`) et n'affecte en rien le fonctionnement actuel de l'application en production.

---

## 🏛️ Architecture Scalable & Modulaire (Modular Monolith)

L'architecture est structurée selon les principes de la **Clean Architecture** et du **Domain-Driven Design (DDD)** :

```text
inventa-api/
├── prisma/
│   └── schema.prisma                # Modèles PostgreSQL (Bijoux, Ventes, Abonnements)
├── src/
│   ├── app.module.ts                # Module racine (imports des domaines & configs)
│   ├── main.ts                      # Point d'entrée, Swagger, CORS, Helmet, Validation
│   ├── config/
│   │   └── configuration.ts         # Configuration typée et centralisée
│   ├── common/
│   │   ├── filters/                 # Gestionnaire global d'exceptions (AllExceptionsFilter)
│   │   └── interceptors/            # Enveloppe de réponse unifiée (TransformResponseInterceptor)
│   └── modules/
│       ├── prisma/                  # Connexion globale à la base PostgreSQL
│       ├── health/                  # Surveillance et statut système (/health)
│       ├── subscriptions/           # Gestion des abonnements & liens Wave
│       ├── payments/                # Réception des Webhooks Wave en temps réel
│       ├── notifications/           # Service Emails (Hostinger SMTP) & WhatsApp
│       └── inventory/               # Gestion des bijoux, or et stocks
├── .env.example                     # Modèle des variables d'environnement
├── .env                             # Variables locales de développement
├── Dockerfile                       # Image Docker Node.js 20 Alpine
├── docker-compose.yml               # Orchestration Docker (API + PostgreSQL + Redis)
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Démarrage Rapide avec Docker

Assurez-vous que Docker Desktop est ouvert sur votre ordinateur, puis exécutez dans un terminal :

### 1. Démarrer tous les conteneurs (API + PostgreSQL + Redis)

```bash
docker compose up -d
```

Docker démarre automatiquement en arrière-plan :
1. **L'API NestJS** : [http://localhost:4000](http://localhost:4000)
2. **PostgreSQL 16** : `localhost:5432` (Base : `inventa_db`, Utilisateur : `inventa_user`)
3. **Redis 7** : `localhost:6379`

---

## 📚 Documentation Interactive Swagger (OpenAPI)

Une fois le conteneur démarré, ouvrez votre navigateur sur :
👉 **[http://localhost:4000/docs](http://localhost:4000/docs)**

Vous pouvez y tester visuellement chaque endpoint en direct :
- `GET /health` : Vérification de l'état du serveur
- `GET /api/v1/subscriptions/wave-url` : Génération du lien de paiement Wave
- `POST /api/v1/subscriptions/reminder` : Déclenchement d'un rappel (Email / WhatsApp)
- `POST /api/v1/payments/webhook/wave` : Webhook de validation de paiement
- `GET /api/v1/inventory` : Liste des bijoux en stock

---

## 🛠️ Commandes Utiles

```bash
# Voir les logs de l'API en direct
docker compose logs -f api

# Arrêter les conteneurs Docker
docker compose down

# Ouvrir Prisma Studio (interface visuelle de la base de données)
npm run db:studio

# Appliquer les migrations de la base
npm run db:migrate
```

---

## 🔒 Sécurité & Robustesse Incluses

- **Helmet** : Sécurisation des en-têtes HTTP contre les failles courantes.
- **Throttler (Rate Limiting)** : Protection contre les attaques par force brute (120 req/min).
- **ValidationPipe** : Validation stricte des données entrantes (les champs non autorisés sont rejetés).
- **AllExceptionsFilter** : Format d'erreur JSON standardisé et traçable.
- **CORS configurable** : Autorise le frontend local (`localhost:5173`) et la production (`inventa.bayecode.com`).
