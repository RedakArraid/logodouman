const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { checkConfiguration } = require('./services/cloudinary.service');

const app = express();
const PORT = process.env.PORT || 4002;

// Vérifier la configuration Cloudinary au démarrage
console.log('\n🔍 Vérification de la configuration Cloudinary...');
checkConfiguration();

// Import des routes
const productRoutes = require('./routes.product');
const categoryRoutes = require('./routes.category');
const authRoutes = require('./routes.auth');
const dashboardRoutes = require('./routes.dashboard');
const orderRoutes = require('./routes.orders');
const customerRoutes = require('./routes.customers');
const promotionRoutes = require('./routes.promotions');

// Configuration CORS pour Docker et production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://frontend:3000',
  'http://frontend:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://logodouman-frontend:3001',
  'https://logodouman.genea.space',
  'https://apilogodouman.genea.space',
];

// Ajouter les origines depuis l'environnement
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⚠️  CORS: Origine non autorisée: ${origin}`);
      callback(null, true); // En production, changer à: callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/promotions', promotionRoutes);

// Routes de test
app.get('/', (req, res) => {
  res.json({
    message: '🚀 LogoDouman API est opérationnelle !',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      customers: '/api/customers',
      promotions: '/api/promotions',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API de test fonctionnelle',
    data: {
      products: [
        { id: 1, name: 'T-shirt Premium', price: 29.99 },
        { id: 2, name: 'Jean Moderne', price: 79.99 },
        { id: 3, name: 'Sneakers Style', price: 149.99 }
      ]
    }
  });
});

// Route pour tester la connexion à la base de données
app.get('/api/db-test', (req, res) => {
  // Pour l'instant, on simule une connexion réussie
  res.json({
    message: 'Test de connexion base de données',
    database: {
      host: process.env.DB_HOST || 'postgres',
      name: process.env.DB_NAME || 'logodouman',
      status: 'Simulé - OK'
    }
  });
});

// Gestionnaire d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Une erreur interne s\'est produite',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 LogoDouman Backend v2.0 démarré !

📊 Informations:
   Port: ${PORT}
   Environnement: ${process.env.NODE_ENV || 'development'}
   
🔗 URLs disponibles:
   API: http://localhost:${PORT}
   Health: http://localhost:${PORT}/health
   Test: http://localhost:${PORT}/api/test
   
📱 Frontend: http://localhost:3000
🗄️  Adminer: http://localhost:8080

🆕 Nouvelles fonctionnalités:
   ✅ Gestion des commandes
   ✅ Gestion des clients
   ✅ Système de promotions
   ✅ Analyse des ventes
   ✅ Segmentation clients
   ✅ Alertes automatisées
  `);
});

module.exports = app;
