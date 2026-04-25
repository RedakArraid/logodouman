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
    await db.sellerPayout.deleteMany();
    await db.seller.deleteMany();
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

    // 2b. Créer le vendeur de test
    console.log('👤 Création du vendeur vendeur1...');
    const vendeurPassword = await bcrypt.hash('admin123', 12);
    const vendeurUser = await db.user.create({
      data: {
        email: 'vendeur1@logodouman.com',
        password: vendeurPassword,
        name: 'Vendeur Test',
        role: 'seller'
      }
    });
    const vendeur = await db.seller.create({
      data: {
        userId: vendeurUser.id,
        storeName: 'Boutique Vendeur 1',
        slug: 'boutique-vendeur-1',
        description: 'Boutique de démonstration avec produits variés',
        status: 'approved',
        commissionRate: 10
      }
    });
    console.log('✅ Vendeur créé:', vendeurUser.email, '(' + vendeur.storeName + ')');

    // 3. Créer les catégories (structure Amazon : Départements > Catégories > Sous-catégories)
    console.log('🏷️ Création des catégories (structure Amazon)...');

    // 3a. Départements (parents)
    const deptSacs = await db.category.create({
      data: {
        id: 'dept-sacs',
        name: 'Sacs & Accessoires',
        slug: 'sacs-accessoires',
        description: 'Sacs à main, sacs à dos, portefeuilles et accessoires',
        status: 'active',
        displayOrder: 0,
        parentId: null
      }
    });
    const deptAlim = await db.category.create({
      data: {
        id: 'dept-alimentation',
        name: 'Alimentation',
        slug: 'alimentation',
        description: 'Chocolats, épicerie, boissons et produits locaux',
        status: 'active',
        displayOrder: 1,
        parentId: null
      }
    });
    const deptElec = await db.category.create({
      data: {
        id: 'dept-electronique',
        name: 'Électronique',
        slug: 'electronique',
        description: 'Téléphones, chargeurs, écouteurs et accessoires tech',
        status: 'active',
        displayOrder: 2,
        parentId: null
      }
    });
    const deptMode = await db.category.create({
      data: {
        id: 'dept-mode',
        name: 'Mode & Vêtements',
        slug: 'mode',
        description: 'Vêtements, chaussures et accessoires mode',
        status: 'active',
        displayOrder: 3,
        parentId: null
      }
    });

    // 3b. Catégories (enfants des départements)
    const catSacsMain = await db.category.create({
      data: { name: 'Sacs à main', slug: 'sacs-a-main', description: 'Sacs à main et clutch', status: 'active', displayOrder: 0, parentId: deptSacs.id }
    });
    const catSacsDos = await db.category.create({
      data: { name: 'Sacs à dos', slug: 'sacs-a-dos', description: 'Sacs à dos et sacoches', status: 'active', displayOrder: 1, parentId: deptSacs.id }
    });
    const catChocolats = await db.category.create({
      data: { name: 'Chocolats & confiseries', slug: 'chocolats-confiseries', description: 'Chocolat et sucreries', status: 'active', displayOrder: 0, parentId: deptAlim.id }
    });
    const catEpicerie = await db.category.create({
      data: { name: 'Épicerie & produits de base', slug: 'epicerie', description: 'Produits alimentaires de base', status: 'active', displayOrder: 1, parentId: deptAlim.id }
    });
    const catAccessoiresTech = await db.category.create({
      data: { name: 'Accessoires tech', slug: 'accessoires-tech', description: 'Chargeurs, câbles et accessoires', status: 'active', displayOrder: 0, parentId: deptElec.id }
    });
    const catEcouteurs = await db.category.create({
      data: { name: 'Écouteurs & audio', slug: 'ecouteurs-audio', description: 'Écouteurs et casques', status: 'active', displayOrder: 1, parentId: deptElec.id }
    });
    const catVetements = await db.category.create({
      data: { name: 'Vêtements', slug: 'vetements', description: 'Vêtements femme et homme', status: 'active', displayOrder: 0, parentId: deptMode.id }
    });

    const allCategories = [deptSacs, deptAlim, deptElec, deptMode, catSacsMain, catSacsDos, catChocolats, catEpicerie, catAccessoiresTech, catEcouteurs, catVetements];
    console.log('✅ Catégories créées:', allCategories.length, '(4 départements + 7 catégories)');

    // 4. Créer les produits (classés dans les catégories feuilles, avec marques)
    console.log('📦 Création des produits...');
    const productDefaults = {
      images: [],
      styles: [],
      features: [],
      colors: []
    };
    const products = [
      {
        name: "Sac à main verni brillant",
        price: 9500000,
        categoryId: catSacsMain.id,
        productType: "sac",
        unit: "piece",
        brand: "LogoDouman",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
        description: "Sac à main élégant avec finition vernie brillante et anneau de levage doré",
        stock: 12,
        status: "active",
        sku: "SAC001",
        material: "Cuir PU",
        ...productDefaults,
        colors: ["Noir", "Rouge", "Beige"]
      },
      {
        name: "Sac à dos professionnel antivol",
        price: 12000000,
        categoryId: catSacsDos.id,
        productType: "sac",
        unit: "piece",
        brand: "ProBag",
        image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop&crop=center",
        description: "Sac à dos professionnel antivol avec protection contre l'eau pour ordinateur portable",
        stock: 15,
        status: "active",
        sku: "SAC002",
        material: "Nylon renforcé",
        ...productDefaults,
        colors: ["Noir", "Gris"]
      },
      {
        name: "Chocolat ivoirien premium - 200g",
        price: 350000,
        categoryId: catChocolats.id,
        productType: "alimentation",
        unit: "boite",
        brand: "Cacao CI",
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
        description: "Chocolat noir premium fabriqué avec cacao ivoirien, tablette 200g",
        stock: 50,
        status: "active",
        sku: "ALI001",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        ...productDefaults
      },
      {
        name: "Attiéké traditionnel - 1 kg",
        price: 150000,
        categoryId: catEpicerie.id,
        productType: "alimentation",
        unit: "kg",
        brand: "Saveurs du terroir",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        description: "Attiéké traditionnel ivoirien, produit local de qualité, sachet 1 kg",
        stock: 100,
        status: "active",
        sku: "ALI002",
        ...productDefaults
      },
      {
        name: "Chargeur USB-C rapide 65W",
        price: 850000,
        categoryId: catAccessoiresTech.id,
        productType: "electronique",
        unit: "piece",
        brand: "TechCharge",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
        description: "Chargeur universel USB-C 65W compatible ordinateurs et téléphones",
        stock: 25,
        status: "active",
        sku: "ELEC001",
        ...productDefaults
      },
      {
        name: "Écouteurs Bluetooth sans fil",
        price: 450000,
        categoryId: catEcouteurs.id,
        productType: "electronique",
        unit: "piece",
        brand: "SoundMax",
        image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400&h=400&fit=crop",
        description: "Écouteurs Bluetooth 5.0 avec réduction de bruit, autonomie 24h",
        stock: 30,
        status: "active",
        sku: "ELEC002",
        ...productDefaults
      },
      {
        name: "Portefeuille en cuir classique",
        price: 2500000,
        categoryId: catSacsMain.id,
        productType: "sac",
        unit: "piece",
        brand: "LogoDouman",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
        description: "Portefeuille en cuir véritable, style classique et élégant",
        stock: 20,
        status: "active",
        sku: "SAC003",
        material: "Cuir",
        ...productDefaults,
        colors: ["Marron", "Noir"]
      },
      {
        name: "Pâte d'arachide naturelle - 500g",
        price: 200000,
        categoryId: catEpicerie.id,
        productType: "alimentation",
        unit: "sachet",
        brand: "Saveurs du terroir",
        image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
        description: "Pâte d'arachide 100% naturelle, sans additif",
        stock: 80,
        status: "active",
        sku: "ALI003",
        ...productDefaults
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
          message: 'Le produit "Chocolat ivoirien premium" a un stock faible (50 unités)',
          isRead: false,
          userId: admin.id,
          metadata: { productId: createdProducts[2].id }
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
    console.log(`   🏷️ Catégories: ${allCategories.length}`);
    console.log(`   📦 Produits: ${createdProducts.length}`);
    console.log(`   👥 Clients: ${customers.length}`);
    console.log(`   🛒 Commandes: ${orders.length}`);
    console.log(`   🎉 Promotions: ${promotions.length}`);
    console.log(`   🔔 Notifications: 2`);
    
    console.log('\n🔑 Comptes créés :');
    console.log(`   Admin:  admin@logodouman.com / admin123`);
    console.log(`   Vendeur: vendeur1@logodouman.com / admin123`);
    
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
