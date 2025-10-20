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
  try {
    const categories = await db.category.findMany({ 
      include: { 
        _count: {
          select: { products: true }
        }
      } 
    });
    
    // Transformer pour ajouter productCount
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      productCount: cat._count.products
    }));
    
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET category by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const category = await db.category.findUnique({ 
      where: { id }, 
      include: { 
        products: true,
        _count: {
          select: { products: true }
        }
      } 
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Ajouter productCount
    const categoryWithCount = {
      ...category,
      productCount: category._count.products
    };
    
    res.json(categoryWithCount);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create category
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    
    // Ne pas inclure l'ID dans les données si fourni par le client
    const { id, ...categoryData } = data;
    
    const category = await db.category.create({ 
      data: categoryData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    const categoryWithCount = {
      ...category,
      productCount: category._count.products
    };
    
    res.status(201).json(categoryWithCount);
  } catch (err) {
    console.error('Erreur création catégorie:', err);
    res.status(400).json({ error: err.errors || err.message });
  }
});

// PUT update category
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  const id = req.params.id;
  try {
    const data = categorySchema.partial().parse(req.body);
    
    // Vérifier que la catégorie existe
    const existingCategory = await db.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    const category = await db.category.update({ 
      where: { id }, 
      data,
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    const categoryWithCount = {
      ...category,
      productCount: category._count.products
    };
    
    res.json(categoryWithCount);
  } catch (err) {
    console.error('Erreur mise à jour catégorie:', err);
    res.status(400).json({ error: err.errors || err.message });
  }
});

// DELETE category
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    // Vérifier que la catégorie existe
    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    // Vérifier qu'il n'y a pas de produits dans la catégorie
    const productsCount = await db.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `Impossible de supprimer une catégorie contenant ${productsCount} produit(s). Veuillez d'abord supprimer ou déplacer les produits.`
      });
    }
    
    await db.category.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('Erreur suppression catégorie:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
  }
});

module.exports = router; 