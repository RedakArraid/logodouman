const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4002;

const productRoutes = require('./routes.product');
const categoryRoutes = require('./routes.category');
const authRoutes = require('./routes.auth');
const dashboardRoutes = require('./routes.dashboard');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Routes de test
app.get('/', (req, res) => {
  res.json({
    message: '🚀 LogoDouman API est opérationnelle !',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
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
🚀 LogoDouman Backend démarré !

📊 Informations:
   Port: ${PORT}
   Environnement: ${process.env.NODE_ENV || 'development'}
   
🔗 URLs disponibles:
   API: http://localhost:${PORT}
   Health: http://localhost:${PORT}/health
   Test: http://localhost:${PORT}/api/test
   
📱 Frontend: http://localhost:3000
🗄️  Adminer: http://localhost:8080
  `);
});

module.exports = app;
