const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('./middleware.auth');
const router = express.Router();
const db = new PrismaClient();

// GET /api/dashboard - statistiques globales
router.get('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const products = await db.product.findMany();
    const categories = await db.category.findMany();
    const stockTotal = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const valeurStock = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    res.json({
      nbProduits: products.length,
      nbCategories: categories.length,
      stockTotal,
      valeurStock
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router; 