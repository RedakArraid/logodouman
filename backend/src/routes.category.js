const express = require('express');
const { z } = require('zod');
const prisma = require('@prisma/client').PrismaClient;
const router = express.Router();
const db = new prisma();
const { requireAuth, requireAdmin, requireRole } = require('./middleware.auth');

// Zod schema for category validation
const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  image: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional()
});

// GET all categories
router.get('/', async (req, res) => {
  const categories = await db.category.findMany({ include: { products: true } });
  res.json(categories);
});

// GET category by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const category = await db.category.findUnique({ where: { id }, include: { products: true } });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// POST create category
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await db.category.create({ data });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// PUT update category
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  const id = req.params.id;
  try {
    const data = categorySchema.partial().parse(req.body);
    const category = await db.category.update({ where: { id }, data });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// DELETE category
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    // Vérifier qu'il n'y a pas de produits dans la catégorie
    const products = await db.product.findMany({ where: { categoryId: id } });
    if (products.length > 0) {
      return res.status(400).json({ error: 'Impossible de supprimer une catégorie contenant des produits.' });
    }
    await db.category.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: 'Category not found' });
  }
});

module.exports = router; 