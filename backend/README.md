# ⚙️ Backend LogoDouman - Node.js API

## 📋 Architecture Backend

```
backend/
├── 📁 src/
│   ├── 📁 controllers/         # Contrôleurs API
│   │   ├── auth.controller.js
│   │   ├── products.controller.js
│   │   ├── orders.controller.js
│   │   ├── users.controller.js
│   │   └── payments.controller.js
│   ├── 📁 middleware/          # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── cors.middleware.js
│   │   └── rateLimit.middleware.js
│   ├── 📁 models/              # Modèles de données
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── 📁 routes/              # Routes API
│   │   ├── auth.routes.js
│   │   ├── products.routes.js
│   │   ├── orders.routes.js
│   │   └── admin.routes.js
│   ├── 📁 services/            # Logique métier
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── payment.service.js
│   │   └── inventory.service.js
│   ├── 📁 utils/               # Utilitaires
│   │   ├── database.js
│   │   ├── logger.js
│   │   ├── encryption.js
│   │   └── validators.js
│   ├── 📁 config/              # Configuration
│   │   ├── database.config.js
│   │   ├── auth.config.js
│   │   └── stripe.config.js
│   └── app.js                  # Application principale
├── 📁 tests/                   # Tests
├── 📁 docs/                    # Documentation API
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## 🛠️ Configuration Package.json

```json
{
  "name": "logodouman-backend",
  "version": "1.0.0",
  "description": "Backend API pour la plateforme e-commerce LogoDouman",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest --testTimeout=10000",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "node scripts/seed.js",
    "build": "babel src -d dist",
    "docker:build": "docker build -t logodouman-backend .",
    "docker:run": "docker run -p 4000:4000 logodouman-backend"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    
    "@prisma/client": "^5.7.1",
    "prisma": "^5.7.1",
    
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    
    "stripe": "^14.9.0",
    "nodemailer": "^6.9.7",
    
    "joi": "^17.11.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    
    "redis": "^4.6.11",
    "ioredis": "^5.3.2",
    
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.1",
    "aws-sdk": "^2.1509.0",
    
    "dotenv": "^16.3.1",
    "crypto": "^1.0.1",
    "uuid": "^9.0.1",
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.56.0",
    "eslint-config-node": "^4.1.0",
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

---

**Cette architecture backend complète de LogoDouman offre une API robuste, sécurisée et scalable pour gérer tous les aspects de la plateforme e-commerce.**
