const express = require('express');
const { z } = require('zod');
const prisma = require('@prisma/client').PrismaClient;
const router = express.Router();
const db = new prisma();
const multer = require('multer');
const path = require('path');
const { requireAuth, requireAdmin, requireRole } = require('./middleware.auth');

// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  image: z.string().optional(),
  description: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sku: z.string().optional(),
  material: z.string().optional(),
  lining: z.string().optional(),
  coating: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().optional(),
  shape: z.string().optional(),
  styles: z.array(z.string()).optional(),
  pattern: z.string().optional(),
  decoration: z.string().optional(),
  closure: z.string().optional(),
  handles: z.string().optional(),
  season: z.string().optional(),
  occasion: z.string().optional(),
  features: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional()
});

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image reçue.' });
  }
  // URL accessible depuis le frontend (adapter si reverse proxy)
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

// GET all products
router.get('/', async (req, res) => {
  const products = await db.product.findMany();
  res.json(products);
});

// GET product by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await db.product.create({ data });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// PUT update product
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await db.product.update({ where: { id }, data });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// DELETE product
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.product.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router; 