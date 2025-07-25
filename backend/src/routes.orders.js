const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const db = new PrismaClient();
const { requireAuth, requireRole } = require('./middleware.auth');

// Schémas de validation
const orderSchema = z.object({
  customerId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  totalAmount: z.number().positive(),
  taxAmount: z.number().min(0).optional(),
  shippingCost: z.number().min(0).optional(),
  discountAmount: z.number().min(0).optional(),
  promotionCode: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive()
  }))
});

const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  notes: z.string().optional()
});

// GET toutes les commandes avec pagination et filtres
router.get('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      customerId, 
      startDate, 
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construire les filtres
    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Construire le tri
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          customer: true,
          user: true,
          items: {
            include: {
              product: true
            }
          },
          payment: true,
          shipping: true
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      db.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET commande par ID
router.get('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          include: {
            address: true
          }
        },
        user: true,
        items: {
          include: {
            product: true
          }
        },
        payment: true,
        shipping: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer une nouvelle commande
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = orderSchema.parse(req.body);
    
    // Calculer le total des items
    const itemsTotal = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    // Créer la commande avec les items
    const order = await db.order.create({
      data: {
        customerId: data.customerId,
        userId: data.userId,
        status: data.status || 'PENDING',
        totalAmount: data.totalAmount,
        taxAmount: data.taxAmount || 0,
        shippingCost: data.shippingCost || 0,
        discountAmount: data.discountAmount || 0,
        promotionCode: data.promotionCode,
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Mettre à jour l'inventaire
    for (const item of data.items) {
      await db.inventory.update({
        where: { productId: item.productId },
        data: {
          reserved: { increment: item.quantity },
          available: { decrement: item.quantity }
        }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour le statut d'une commande
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = orderUpdateSchema.parse(req.body);
    
    const order = await db.order.update({
      where: { id: req.params.id },
      data,
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET statistiques des commandes
router.get('/stats/overview', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders
    ] = await Promise.all([
      db.order.count({ where }),
      db.order.aggregate({
        where: { ...where, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true }
      }),
      db.order.groupBy({
        by: ['status'],
        where,
        _count: { id: true }
      }),
      db.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 