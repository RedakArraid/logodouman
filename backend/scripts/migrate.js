const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

async function main() {
  console.log('🚀 Début de la migration avec données de test...');

  try {
    // 1. Nettoyer les données existantes (ordre important pour les relations)
    console.log('🧹 Nettoyage des données existantes...');
    await db.orderItem.deleteMany();
    await db.payment.deleteMany();
    await db.shipping.deleteMany();
    await db.order.deleteMany();
    await db.inventory.deleteMany();
    await db.notification.deleteMany();
    await db.promotion.deleteMany();
    await db.address.deleteMany();
    await db.customer.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();
    await db.user.deleteMany();

    // 2. Créer un utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await db.user.create({
      data: {
        email: 'admin@logodouman.com',
        password: adminPassword,
        name: 'Administrateur LogoDouman',
        role: 'admin'
      }
    });
    console.log('✅ Admin créé:', admin.email);

    // 3. Créer les catégories
    console.log('🏷️ Création des catégories...');
    const categories = await Promise.all([
      db.category.create({
        data: {
          id: 'luxury-cat-001',
          name: 'Luxe',
          icon: '💎',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center',
          description: 'Sacs haut de gamme en cuir premium et finitions dorées',
          status: 'active'
        }
      }),
      db.category.create({
        data: {
          id: 'vintage-cat-002',
          name: 'Vintage',
          icon: '🕰️',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
          description: 'Designs rétro et motifs géométriques tendance',
          status: 'active'
        }
      }),
      db.category.create({
        data: {
          id: 'business-cat-003',
          name: 'Business',
          icon: '💼',
          image: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop&crop=center',
          description: 'Sacs professionnels et fonctionnels pour le travail',
          status: 'active'
        }
      }),
      db.category.create({
        data: {
          id: 'casual-cat-005',
          name: 'Casual',
          icon: '👜',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
          description: 'Sacs pratiques et confortables pour tous les jours',
          status: 'active'
        }
      })
    ]);
    console.log('✅ Catégories créées:', categories.length);

    // 4. Créer les produits
    console.log('📦 Création des produits...');
    const products = [
      {
        name: "Sac à main verni brillant avec anneau de levage",
        price: 10000000, // 100,000 FCFA en centimes
        categoryId: "luxury-cat-001",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
        description: "Sac à main élégant avec finition vernie brillante et anneau de levage doré pour femme",
        stock: 12,
        status: "active",
        sku: "C05N001",
        material: "Cuir PU",
        lining: "Polyester",
        dimensions: "25 x 18 x 12 cm",
        weight: 0.7,
        shape: "Rectangle",
        styles: ["Mode", "Luxe", "Élégant"],
        pattern: "Solide",
        decoration: "Anneau doré",
        closure: "Fermeture éclair",
        handles: "Double poignée",
        season: "Toutes saisons",
        occasion: "Soirée",
        features: ["Résistant", "Élégant"],
        colors: ["Noir", "Rouge", "Beige"],
        gender: "Femme",
        ageGroup: "Adulte"
      },
      {
        name: "Sac imprimé géométrique vintage léger tendance",
        price: 8000000, // 80,000 FCFA en centimes
        categoryId: "vintage-cat-002",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
        description: "Sac tendance avec motifs géométriques vintage, léger et pratique pour un look moderne",
        stock: 8,
        status: "active",
        sku: "C05N002",
        material: "Toile enduite",
        lining: "Coton",
        dimensions: "30 x 25 x 8 cm",
        weight: 0.4,
        shape: "Rectangle",
        styles: ["Vintage", "Décontracté", "Tendance"],
        pattern: "Géométrique",
        decoration: "Motifs imprimés",
        closure: "Fermeture éclair",
        handles: "Bandoulière réglable",
        season: "Printemps-Été",
        occasion: "Quotidien",
        features: ["Léger", "Pratique"],
        colors: ["Multicolore", "Beige", "Marron"],
        gender: "Femme",
        ageGroup: "Jeune Adulte"
      },
      {
        name: "Sac à dos d'ordinateur résistant à l'eau antivol",
        price: 12000000, // 120,000 FCFA en centimes
        categoryId: "business-cat-003",
        image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop&crop=center",
        description: "Sac à dos professionnel antivol avec protection contre l'eau pour ordinateur portable",
        stock: 15,
        status: "active",
        sku: "C05N003",
        material: "Nylon renforcé",
        lining: "Polyester",
        dimensions: "45 x 30 x 15 cm",
        weight: 1.2,
        shape: "Ergonomique",
        styles: ["Business", "Moderne", "Fonctionnel"],
        pattern: "Solide",
        decoration: "Logo discret",
        closure: "Fermeture éclair",
        handles: "Bretelles rembourrées",
        season: "Toutes saisons",
        occasion: "Travail",
        features: ["Imperméable", "Antivol", "Port USB", "Compartiment ordinateur"],
        colors: ["Noir", "Gris", "Bleu marine"],
        gender: "Unisexe",
        ageGroup: "Adulte"
      },
      {
        name: "Sac bandoulière compact quotidien",
        price: 6000000, // 60,000 FCFA en centimes
        categoryId: "casual-cat-005",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
        description: "Sac bandoulière compact et pratique pour le quotidien, design moderne et fonctionnel",
        stock: 20,
        status: "active",
        sku: "C05N006",
        material: "Coton canvas",
        lining: "Polyester",
        dimensions: "20 x 15 x 8 cm",
        weight: 0.3,
        shape: "Compact",
        styles: ["Décontracté", "Moderne", "Pratique"],
        pattern: "Solide",
        decoration: "Logo brodé",
        closure: "Fermeture éclair",
        handles: "Bandoulière ajustable",
        season: "Toutes saisons",
        occasion: "Quotidien",
        features: ["Compact", "Léger", "Pratique"],
        colors: ["Beige", "Kaki", "Noir"],
        gender: "Unisexe",
        ageGroup: "Jeune Adulte"
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = await db.product.create({ data: productData });
      createdProducts.push(product);
    }
    console.log('✅ Produits créés:', createdProducts.length);

    // 5. Créer l'inventaire pour chaque produit
    console.log('📊 Création de l\'inventaire...');
    for (const product of createdProducts) {
      await db.inventory.create({
        data: {
          productId: product.id,
          quantity: product.stock,
          reserved: 0,
          available: product.stock,
          lowStockThreshold: 10
        }
      });
    }
    console.log('✅ Inventaire créé pour tous les produits');

    // 6. Créer des clients de test
    console.log('👥 Création des clients de test...');
    const customers = await Promise.all([
      db.customer.create({
        data: {
          email: 'marie.dupont@email.com',
          firstName: 'Marie',
          lastName: 'Dupont',
          phone: '+225 07 12 34 56 78',
          totalSpent: 18000000, // 180,000 FCFA en centimes
          loyaltyPoints: 140,
          status: 'active'
        }
      }),
      db.customer.create({
        data: {
          email: 'jean.kouassi@email.com',
          firstName: 'Jean',
          lastName: 'Kouassi',
          phone: '+225 05 98 76 54 32',
          totalSpent: 10000000, // 100,000 FCFA en centimes
          loyaltyPoints: 75,
          status: 'active'
        }
      })
    ]);

    // 7. Créer des adresses pour les clients
    console.log('🏠 Création des adresses...');
    await Promise.all([
      db.address.create({
        data: {
          customerId: customers[0].id,
          street: '15 Rue des Palmiers',
          city: 'Abidjan',
          postalCode: '08 BP 1234',
          country: 'Côte d\'Ivoire',
          isDefault: true
        }
      }),
      db.address.create({
        data: {
          customerId: customers[1].id,
          street: '22 Avenue de la République',
          city: 'Bouaké',
          postalCode: '01 BP 5678',
          country: 'Côte d\'Ivoire',
          isDefault: true
        }
      })
    ]);

    // 8. Créer des promotions de test
    console.log('🎉 Création des promotions...');
    const promotions = await Promise.all([
      db.promotion.create({
        data: {
          code: 'WELCOME20',
          name: 'Bienvenue - 20% de réduction',
          description: 'Offre de bienvenue pour les nouveaux clients',
          type: 'PERCENTAGE',
          value: 20, // 20%
          minAmount: 6500000, // 65,000 FCFA minimum
          maxUses: 100,
          usedCount: 15,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true
        }
      }),
      db.promotion.create({
        data: {
          code: 'FREESHIP',
          name: 'Livraison gratuite',
          description: 'Livraison gratuite pour toute commande',
          type: 'FREE_SHIPPING',
          value: 0,
          minAmount: 3300000, // 33,000 FCFA minimum
          maxUses: null, // illimité
          usedCount: 42,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
          isActive: true
        }
      })
    ]);

    // 9. Créer des commandes de test
    console.log('🛒 Création des commandes de test...');
    const orders = [];

    // Commande 1
    const order1 = await db.order.create({
      data: {
        customerId: customers[0].id,
        userId: admin.id,
        status: 'CONFIRMED',
        totalAmount: 10000000, // 100,000 FCFA
        taxAmount: 0,
        shippingCost: 0,
        discountAmount: 0,
        promotionCode: 'FREESHIP'
      }
    });
    orders.push(order1);

    // Items pour la commande 1
    await db.orderItem.create({
      data: {
        orderId: order1.id,
        productId: createdProducts[0].id,
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000
      }
    });

    // Commande 2
    const order2 = await db.order.create({
      data: {
        customerId: customers[1].id,
        userId: admin.id,
        status: 'PENDING',
        totalAmount: 130000, // 130.00€
        taxAmount: 0,
        shippingCost: 0,
        discountAmount: 20000, // 20.00€ de réduction
        promotionCode: 'WELCOME20'
      }
    });
    orders.push(order2);

    // Items pour la commande 2
    await db.orderItem.create({
      data: {
        orderId: order2.id,
        productId: createdProducts[1].id,
        quantity: 1,
        unitPrice: 125000,
        totalPrice: 125000
      }
    });

    // 10. Créer les paiements
    console.log('💳 Création des paiements...');
    await Promise.all([
      db.payment.create({
        data: {
          orderId: order1.id,
          amount: 150000,
          method: 'CARD',
          status: 'COMPLETED',
          transactionId: 'txn_1234567890',
          gateway: 'stripe'
        }
      }),
      db.payment.create({
        data: {
          orderId: order2.id,
          amount: 130000,
          method: 'BANK_TRANSFER',
          status: 'PENDING',
          transactionId: 'txn_0987654321',
          gateway: 'bank'
        }
      })
    ]);

    // 11. Créer les informations de livraison
    console.log('📦 Création des livraisons...');
    await Promise.all([
      db.shipping.create({
        data: {
          orderId: order1.id,
          method: 'STANDARD',
          status: 'DELIVERED',
          trackingCode: 'LOG123456789',
          carrier: 'DHL',
          estimatedDelivery: new Date('2024-02-15'),
          actualDelivery: new Date('2024-02-14')
        }
      }),
      db.shipping.create({
        data: {
          orderId: order2.id,
          method: 'EXPRESS',
          status: 'PROCESSING',
          trackingCode: 'LOG987654321',
          carrier: 'UPS',
          estimatedDelivery: new Date('2024-03-10')
        }
      })
    ]);

    // 12. Créer des notifications
    console.log('🔔 Création des notifications...');
    await Promise.all([
      db.notification.create({
        data: {
          type: 'STOCK_ALERT',
          title: 'Stock faible',
          message: 'Le produit "Sac imprimé géométrique vintage" a un stock faible (8 unités)',
          isRead: false,
          userId: admin.id,
          metadata: { productId: createdProducts[1].id }
        }
      }),
      db.notification.create({
        data: {
          type: 'ORDER_STATUS',
          title: 'Nouvelle commande',
          message: 'Une nouvelle commande a été passée par Jean Kouassi',
          isRead: false,
          userId: admin.id,
          metadata: { orderId: order2.id }
        }
      })
    ]);

    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n📊 Résumé des données créées :');
    console.log(`   👤 Utilisateurs: 1 admin`);
    console.log(`   🏷️ Catégories: ${categories.length}`);
    console.log(`   📦 Produits: ${createdProducts.length}`);
    console.log(`   👥 Clients: ${customers.length}`);
    console.log(`   🛒 Commandes: ${orders.length}`);
    console.log(`   🎉 Promotions: ${promotions.length}`);
    console.log(`   🔔 Notifications: 2`);
    
    console.log('\n🔑 Compte admin créé :');
    console.log(`   Email: admin@logodouman.com`);
    console.log(`   Mot de passe: admin123`);
    
    console.log('\n🚀 Vous pouvez maintenant :');
    console.log(`   • Vous connecter sur: http://localhost:3000/admin/login`);
    console.log(`   • Voir le site: http://localhost:3000`);
    console.log(`   • Tester l'API: http://localhost:4002`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  });
