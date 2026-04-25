'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category } from '../../types/index';
import { ProductService, CategoryService } from '../config/api';

interface StoreContextType {
  // État
  products: Product[];
  categories: Category[];
  isHydrated: boolean;
  loading: boolean;
  error: string | null;

  // Actions produits
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleProductStatus: (id: number) => Promise<void>;

  // Actions catégories
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;

  // Utilitaires
  getActiveProducts: () => Product[];
  getActiveCategories: () => Category[];
  refreshData: () => Promise<void>;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function flattenCategories(cats: Array<{ id: string; subcategories?: unknown[] } & Record<string, unknown>>): Category[] {
  const result: Category[] = [];
  for (const c of cats || []) {
    result.push({ ...c, parentId: null, subcategories: c.subcategories } as Category);
    if (c.subcategories?.length) {
      for (const sub of c.subcategories as Array<Record<string, unknown>>) {
        result.push({ ...sub, parentId: c.id } as Category);
      }
    }
  }
  return result;
}

// Données par défaut pour le fallback offline (produits diversifiés)
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Sac à main verni brillant",
    price: 9500000,
    categoryId: "sacs-cat-001",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
    description: "Sac à main élégant avec finition vernie brillante",
    stock: 12,
    status: 'active' as const,
    sku: "SAC001",
    productType: "sac",
    unit: "piece",
    material: "Cuir PU",
    colors: ["Noir", "Rouge", "Beige"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Chocolat ivoirien premium - 200g",
    price: 350000,
    categoryId: "alimentation-cat-002",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
    description: "Chocolat noir premium avec cacao ivoirien",
    stock: 50,
    status: 'active' as const,
    sku: "ALI001",
    productType: "alimentation",
    unit: "boite",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Chargeur USB-C rapide 65W",
    price: 850000,
    categoryId: "electronique-cat-003",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    description: "Chargeur universel USB-C 65W",
    stock: 25,
    status: 'active' as const,
    sku: "ELEC001",
    productType: "electronique",
    unit: "piece",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const defaultCategories: Category[] = [
  { id: "dept-sacs", name: "Sacs & Accessoires", slug: "sacs-accessoires", description: 'Sacs et accessoires', status: 'active' as const, displayOrder: 0, productCount: 0, createdAt: new Date(), updatedAt: new Date(), parentId: null },
  { id: "dept-alimentation", name: "Alimentation", slug: "alimentation", description: 'Produits alimentaires', status: 'active' as const, displayOrder: 1, productCount: 0, createdAt: new Date(), updatedAt: new Date(), parentId: null },
  { id: "dept-electronique", name: "Électronique", slug: "electronique", description: 'Tech et électronique', status: 'active' as const, displayOrder: 2, productCount: 0, createdAt: new Date(), updatedAt: new Date(), parentId: null },
  { id: "dept-mode", name: "Mode & Vêtements", slug: "mode", description: 'Vêtements et chaussures', status: 'active' as const, displayOrder: 3, productCount: 0, createdAt: new Date(), updatedAt: new Date(), parentId: null }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis l'API
  const loadDataFromAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll({ hierarchy: true })
      ]);

      setProducts(productsData);
      // Aplatir la hiérarchie pour compatibilité (départements + sous-catégories)
      const flat = flattenCategories(categoriesData);
      setCategories(flat);
    } catch (err) {
      console.error('Erreur lors du chargement depuis l\'API:', err);
      setError('Impossible de charger les données depuis le serveur');
      
      // Fallback vers les données locales
      const localProducts = localStorage.getItem('logodouman_products');
      const localCategories = localStorage.getItem('logodouman_categories');
      
      if (localProducts && localCategories) {
        setProducts(JSON.parse(localProducts));
        setCategories(JSON.parse(localCategories));
      } else {
        setProducts(defaultProducts);
        setCategories(defaultCategories);
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const initializeData = async () => {
      await loadDataFromAPI();
      setIsHydrated(true);
    };

    initializeData();
  }, []);

  // Sauvegarder en local quand les données changent
  useEffect(() => {
    if (isHydrated && products.length > 0) {
      localStorage.setItem('logodouman_products', JSON.stringify(products));
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (isHydrated && categories.length > 0) {
      localStorage.setItem('logodouman_categories', JSON.stringify(categories));
    }
  }, [categories, isHydrated]);

  // Actions produits
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newProduct = await ProductService.create(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du produit:', err);
      setError('Impossible d\'ajouter le produit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      setLoading(true);
      const updatedProduct = await ProductService.update(id.toString(), productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit:', err);
      setError('Impossible de mettre à jour le produit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      await ProductService.delete(id.toString());
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err);
      setError('Impossible de supprimer le produit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await updateProduct(id, { status: newStatus });
    }
  };

  // Actions catégories
  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => {
    try {
      setLoading(true);
      const newCategory = await CategoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la catégorie:', err);
      setError('Impossible d\'ajouter la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      const updatedCategory = await CategoryService.update(id, categoryData);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la catégorie:', err);
      setError('Impossible de mettre à jour la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    // Vérifier s'il y a des produits dans cette catégorie
    const categoryProducts = products.filter(p => p.categoryId === id);
    if (categoryProducts.length > 0) {
      throw new Error('Impossible de supprimer cette catégorie car elle contient des produits.');
    }

    try {
      setLoading(true);
      await CategoryService.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      setError('Impossible de supprimer la catégorie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      await updateCategory(id, { status: newStatus });
    }
  };

  // Utilitaires
  const getActiveProducts = () => products.filter(p => p.status === 'active');
  const getActiveCategories = () => categories.filter(c => c.status === 'active');

  const refreshData = async () => {
    await loadDataFromAPI();
  };

  const resetToDefaults = () => {
    setProducts(defaultProducts);
    setCategories(defaultCategories);
    localStorage.setItem('logodouman_products', JSON.stringify(defaultProducts));
    localStorage.setItem('logodouman_categories', JSON.stringify(defaultCategories));
  };

  const value: StoreContextType = {
    // État
    products,
    categories,
    isHydrated,
    loading,
    error,

    // Actions produits
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,

    // Actions catégories
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,

    // Utilitaires
    getActiveProducts,
    getActiveCategories,
    refreshData,
    resetToDefaults
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
    // Retourner un contexte par défaut au lieu de throw une erreur
    // Cela évite l'erreur React #130 pendant l'hydratation
    return {
      products: defaultProducts,
      categories: defaultCategories,
      isHydrated: false,
      loading: true,
      error: null,
      addProduct: async () => {},
      updateProduct: async () => {},
      deleteProduct: async () => {},
      toggleProductStatus: async () => {},
      addCategory: async () => {},
      updateCategory: async () => {},
      deleteCategory: async () => {},
      toggleCategoryStatus: async () => {},
      getActiveProducts: () => defaultProducts.filter(p => p.status === 'active'),
      getActiveCategories: () => defaultCategories.filter(c => c.status === 'active'),
      refreshData: async () => {},
      resetToDefaults: () => {},
    };
  }
  return context;
}

// Hook pour les erreurs
export function useStoreError() {
  const { error } = useStore();
  
  const clearError = () => {
    // Logique pour nettoyer l'erreur si nécessaire
  };

  return { error, clearError };
}

// Export des données par défaut pour les tests
export { defaultProducts, defaultCategories };
