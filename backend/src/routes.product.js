const express = require('express');
const { z } = require('zod');
const prisma = require('@prisma/client').PrismaClient;
const router = express.Router();
const db = new prisma();
const { requireAuth, requireAdmin, requireRole } = require('./middleware.auth');
const { uploadSingle, deleteImage, extractPublicId, getResponsiveUrls } = require('./services/cloudinary.service');

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

// Upload endpoint avec Cloudinary
router.post('/upload', (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error('❌ Erreur upload:', err);
      return res.status(400).json({ 
        error: err.message || 'Erreur lors de l\'upload de l\'image' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image reçue.' });
    }
    
    try {
      // URL de l'image uploadée sur Cloudinary
      const imageUrl = req.file.path; // Cloudinary URL
      const publicId = req.file.filename; // Public ID Cloudinary
      
      // Générer les URLs responsives (optionnel)
      const responsiveUrls = getResponsiveUrls(publicId);
      
      console.log('✅ Image uploadée sur Cloudinary:', imageUrl);
      
      res.status(201).json({ 
        url: imageUrl,
        publicId: publicId,
        responsive: responsiveUrls
      });
    } catch (error) {
      console.error('❌ Erreur traitement upload:', error);
      res.status(500).json({ error: 'Erreur serveur lors du traitement de l\'image' });
    }
  });
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de produit invalide' });
    }
    
    const product = await db.product.findUnique({ 
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create product
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    
    // Vérifier que la catégorie existe
    const category = await db.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Catégorie non trouvée. Veuillez sélectionner une catégorie valide.' });
    }
    
    const product = await db.product.create({ 
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Erreur création produit:', err);
    if (err.errors) {
      // Erreur de validation Zod
      res.status(400).json({ error: 'Données invalides', details: err.errors });
    } else {
      res.status(400).json({ error: err.message || 'Erreur lors de la création du produit' });
    }
  }
});

// PUT update product
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de produit invalide' });
  }
  
  try {
    const data = productSchema.partial().parse(req.body);
    
    // Vérifier que le produit existe
    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Si on change la catégorie, vérifier qu'elle existe
    if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
      const category = await db.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Catégorie non trouvée. Veuillez sélectionner une catégorie valide.' });
      }
    }
    
    // Si on change l'image, supprimer l'ancienne de Cloudinary
    if (data.image && data.image !== existingProduct.image) {
      if (existingProduct.image && existingProduct.image.includes('cloudinary')) {
        const oldPublicId = extractPublicId(existingProduct.image);
        if (oldPublicId) {
          try {
            await deleteImage(oldPublicId);
            console.log('✅ Ancienne image supprimée de Cloudinary');
          } catch (error) {
            console.error('⚠️ Erreur suppression ancienne image:', error);
            // On continue quand même la mise à jour
          }
        }
      }
    }
    
    const product = await db.product.update({ 
      where: { id }, 
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });
    
    res.json(product);
  } catch (err) {
    console.error('Erreur mise à jour produit:', err);
    if (err.errors) {
      res.status(400).json({ error: 'Données invalides', details: err.errors });
    } else {
      res.status(400).json({ error: err.message || 'Erreur lors de la mise à jour du produit' });
    }
  }
});

// DELETE product
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de produit invalide' });
  }
  
  try {
    // Récupérer le produit pour obtenir l'image
    const product = await db.product.findUnique({ where: { id } });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Vérifier si le produit est dans des commandes en cours
    const ordersCount = await db.orderItem.count({ 
      where: { productId: id } 
    });
    
    if (ordersCount > 0) {
      // Plutôt que supprimer, on désactive le produit
      await db.product.update({
        where: { id },
        data: { status: 'inactive' }
      });
      
      return res.status(200).json({ 
        message: 'Le produit a été désactivé car il apparaît dans des commandes. Vous pouvez le supprimer manuellement depuis la base de données si nécessaire.',
        action: 'deactivated'
      });
    }
    
    // Supprimer l'image de Cloudinary si elle existe
    if (product.image && product.image.includes('cloudinary')) {
      const publicId = extractPublicId(product.image);
      if (publicId) {
        try {
          await deleteImage(publicId);
          console.log('✅ Image supprimée de Cloudinary lors de la suppression du produit');
        } catch (error) {
          console.error('⚠️ Erreur suppression image Cloudinary:', error);
          // On continue quand même la suppression du produit
        }
      }
    }
    
    // Supprimer l'inventaire associé (si existe)
    try {
      await db.inventory.deleteMany({ where: { productId: id } });
      console.log(`✅ Inventaire du produit ${id} supprimé`);
    } catch (error) {
      console.error('⚠️ Erreur suppression inventaire:', error);
      // On continue quand même
    }
    
    // Supprimer le produit
    await db.product.delete({ where: { id } });
    console.log(`✅ Produit ${id} supprimé avec succès`);
    res.status(204).end();
  } catch (err) {
    console.error('Erreur suppression produit:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

module.exports = router; 