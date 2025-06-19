'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  icon: string;
  description: string;
  stock?: number;
  status?: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount?: number;
  status?: 'active' | 'inactive';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleProductStatus: (id: number) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  getActiveProducts: () => Product[];
  getActiveCategories: () => Category[];
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Données initiales par défaut
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Sac à main de luxe carré classique",
    price: 9500,
    category: "bags",
    icon: "👜",
    description: "Sac élégant en cuir de qualité",
    stock: 15,
    status: 'active'
  },
  {
    id: 2,
    name: "Robe d'été élégante",
    price: 12000,
    category: "fashion",
    icon: "👗",
    description: "Robe légère et tendance",
    stock: 8,
    status: 'active'
  },
  {
    id: 3,
    name: "Écouteurs sans fil",
    price: 8500,
    category: "electronics",
    icon: "🎧",
    description: "Son de haute qualité",
    stock: 25,
    status: 'active'
  },
  {
    id: 4,
    name: "Coussin décoratif",
    price: 3500,
    category: "home",
    icon: "🛋️",
    description: "Confort et style pour votre salon",
    stock: 12,
    status: 'active'
  },
  {
    id: 5,
    name: "Montre connectée",
    price: 15000,
    category: "electronics",
    icon: "⌚",
    description: "Technologie et élégance",
    stock: 20,
    status: 'active'
  },
  {
    id: 6,
    name: "Écharpe en soie",
    price: 6500,
    category: "fashion",
    icon: "🧣",
    description: "Accessoire raffiné",
    stock: 10,
    status: 'active'
  },
  {
    id: 7,
    name: "Lampe design",
    price: 7800,
    category: "home",
    icon: "💡",
    description: "Éclairage moderne",
    stock: 6,
    status: 'active'
  },
  {
    id: 8,
    name: "Portefeuille cuir",
    price: 4200,
    category: "bags",
    icon: "💳",
    description: "Cuir véritable, design élégant",
    stock: 18,
    status: 'active'
  }
];

const defaultCategories: Category[] = [
  {
    id: 'fashion',
    name: 'Mode & Style',
    icon: '👗',
    description: 'Vêtements tendance et accessoires',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'bags',
    name: 'Sacs & Maroquinerie',
    icon: '👜',
    description: 'Sacs à main, portefeuilles et plus',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'electronics',
    name: 'Électronique',
    icon: '📱',
    description: 'Gadgets et accessoires tech',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'home',
    name: 'Maison & Déco',
    icon: '🏠',
    description: 'Décoration et mobilier',
    productCount: 0,
    status: 'active'
  }
];

// Fonctions utilitaires pour le localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  // Initialisation avec localStorage
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromStorage('logodouman_products', defaultProducts)
  );

  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromStorage('logodouman_categories', defaultCategories)
  );

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    saveToStorage('logodouman_products', products);
  }, [products]);

  useEffect(() => {
    saveToStorage('logodouman_categories', categories);
  }, [categories]);

  // Mettre à jour les compteurs de produits par catégorie
  const updateCategoryProductCounts = (updatedProducts: Product[]) => {
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        productCount: updatedProducts.filter(p => p.category === category.id && p.status === 'active').length
      }))
    );
  };

  // Fonctions de gestion des produits
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1,
      status: 'active',
      stock: productData.stock || 0
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    updateCategoryProductCounts(updatedProducts);
  };

  const updateProduct = (id: number, productData: Partial<Product>) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...productData } : p
    );
    setProducts(updatedProducts);
    updateCategoryProductCounts(updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    updateCategoryProductCounts(updatedProducts);
  };

  const toggleProductStatus = (id: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    );
    setProducts(updatedProducts);
    updateCategoryProductCounts(updatedProducts);
  };

  // Fonctions de gestion des catégories
  const addCategory = (categoryData: Category) => {
    const newCategory: Category = {
      ...categoryData,
      productCount: 0,
      status: 'active'
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, ...categoryData } : c
    ));
  };

  const deleteCategory = (id: string) => {
    // Vérifier s'il y a des produits dans cette catégorie
    const categoryProducts = products.filter(p => p.category === id);
    if (categoryProducts.length > 0) {
      throw new Error('Impossible de supprimer cette catégorie car elle contient des produits.');
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  // Fonctions utilitaires
  const getActiveProducts = () => products.filter(p => p.status === 'active');
  const getActiveCategories = () => categories.filter(c => c.status === 'active');

  // Fonction pour réinitialiser les données
  const resetData = () => {
    setProducts(defaultProducts);
    setCategories(defaultCategories);
    saveToStorage('logodouman_products', defaultProducts);
    saveToStorage('logodouman_categories', defaultCategories);
  };

  // Initialiser les compteurs de produits par catégorie
  useState(() => {
    updateCategoryProductCounts(products);
  });

  const value: StoreContextType = {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    getActiveProducts,
    getActiveCategories,
    resetData
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}