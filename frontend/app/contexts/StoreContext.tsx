'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types étendus basés sur l'analyse de logodouman.com
export interface Product {
  // Attributs de base (existants)
  id: number;
  name: string;
  price: number;
  category: string;
  icon: string;
  image?: string;
  description: string;
  stock?: number;
  status?: 'active' | 'inactive';
  
  // Nouveaux attributs essentiels de logodouman.com
  sku?: string;                    // Référence produit (ex: "C05N036")
  
  // Matériaux
  material?: string;               // Matériau principal (ex: "Cuir PU", "Cuir synthétique")
  lining?: string;                 // Matériau doublure (ex: "Polyester")
  coating?: string;                // Matériau revêtement
  
  // Caractéristiques physiques
  dimensions?: string;             // Taille (ex: "22 x 16 x 11 cm")
  weight?: number;                 // Poids en kg (ex: 0.6)
  shape?: string;                  // Forme (ex: "Rectangle", "Carré", "Rond")
  
  // Design et style
  styles?: string[];               // Styles multiples (ex: ["Mode", "Dame", "Vintage"])
  pattern?: string;                // Type de motif (ex: "Géométrique", "Solide", "Imprimé")
  decoration?: string;             // Éléments décoratifs (ex: "Verrouillage", "Logo métal")
  
  // Caractéristiques techniques
  closure?: string;                // Type de fermeture (ex: "Fermeture éclair", "Bouton-pression")
  handles?: string;                // Poignées/sangles (ex: "Simple", "Double", "Bandoulière")
  
  // Usage et saisonnalité
  season?: string;                 // Saison (ex: "Toutes saisons", "Été", "Hiver")
  occasion?: string;               // Occasion (ex: "Quotidien", "Soirée", "Travail")
  features?: string[];             // Fonctionnalités (ex: ["Imperméable", "Port USB", "Antivol"])
  
  // Couleurs disponibles
  colors?: string[];               // Couleurs disponibles (ex: ["Noir", "Rouge", "Personnalisable"])
  
  // Informations commerciales
  gender?: string;                 // Genre (ex: "Femme", "Homme", "Unisexe")
  ageGroup?: string;               // Groupe d'âge (ex: "Adulte", "Jeune")
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  description: string;
  productCount?: number;
  status?: 'active' | 'inactive';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  isHydrated: boolean;
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

// Données initiales enrichies avec les nouveaux attributs
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Sac à main verni brillant avec anneau de levage",
    price: 15000,
    category: "luxury",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
    description: "Sac à main élégant avec finition vernie brillante et anneau de levage doré pour femme",
    stock: 12,
    status: 'active',
    // Nouveaux attributs
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
    id: 2,
    name: "Sac imprimé géométrique vintage léger tendance",
    price: 12500,
    category: "vintage",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    description: "Sac tendance avec motifs géométriques vintage, léger et pratique pour un look moderne",
    stock: 8,
    status: 'active',
    // Nouveaux attributs
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
    id: 3,
    name: "Sac à dos d'ordinateur résistant à l'eau antivol",
    price: 18000,
    category: "business",
    icon: "🎒",
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop&crop=center",
    description: "Sac à dos professionnel antivol avec protection contre l'eau pour ordinateur portable",
    stock: 15,
    status: 'active',
    // Nouveaux attributs
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
    id: 4,
    name: "Sac à main imprimé rétro pour femmes",
    price: 13500,
    category: "retro",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    description: "Design rétro avec imprimés tendance pour un look vintage moderne et sophistiqué",
    stock: 10,
    status: 'active',
    // Nouveaux attributs
    sku: "C05N004",
    material: "Cuir synthétique",
    lining: "Satin",
    dimensions: "28 x 20 x 10 cm",
    weight: 0.6,
    shape: "Trapèze",
    styles: ["Rétro", "Vintage", "Sophistiqué"],
    pattern: "Imprimé fleuri",
    decoration: "Fermoir vintage",
    closure: "Fermoir clip",
    handles: "Poignée courte",
    season: "Automne-Hiver",
    occasion: "Sortie",
    features: ["Style unique", "Vintage"],
    colors: ["Bordeaux", "Vert olive", "Bleu canard"],
    gender: "Femme",
    ageGroup: "Adulte"
  },
  {
    id: 5,
    name: "Sac à main de luxe cuir premium",
    price: 25000,
    category: "luxury",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
    description: "Sac en cuir véritable premium, design exclusif et finitions haut de gamme artisanales",
    stock: 5,
    status: 'active',
    // Nouveaux attributs
    sku: "C05N005",
    material: "Cuir véritable",
    lining: "Cuir doublé",
    dimensions: "32 x 24 x 14 cm",
    weight: 0.9,
    shape: "Classique",
    styles: ["Luxe", "Premium", "Classique"],
    pattern: "Grainé",
    decoration: "Finitions dorées",
    closure: "Fermeture éclair premium",
    handles: "Double poignée cuir",
    season: "Toutes saisons",
    occasion: "Prestige",
    features: ["Cuir premium", "Artisanal", "Exclusif"],
    colors: ["Noir", "Cognac", "Bordeaux"],
    gender: "Femme",
    ageGroup: "Adulte"
  },
  {
    id: 6,
    name: "Sac bandoulière compact quotidien",
    price: 9500,
    category: "casual",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
    description: "Sac bandoulière compact et pratique pour le quotidien, design moderne et fonctionnel",
    stock: 20,
    status: 'active',
    // Nouveaux attributs
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
  },
  {
    id: 7,
    name: "Sac cabas élégant grand format",
    price: 16500,
    category: "casual",
    icon: "👜",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
    description: "Grand sac cabas élégant parfait pour le travail et les sorties, spacieux et stylé",
    stock: 14,
    status: 'active',
    // Nouveaux attributs
    sku: "C05N007",
    material: "Cuir PU",
    lining: "Tissu doublé",
    dimensions: "40 x 35 x 15 cm",
    weight: 0.8,
    shape: "Cabas",
    styles: ["Élégant", "Spacieux", "Professionnel"],
    pattern: "Solide",
    decoration: "Rivets métalliques",
    closure: "Ouvert avec bouton-pression",
    handles: "Double poignée longue",
    season: "Toutes saisons",
    occasion: "Travail",
    features: ["Grande capacité", "Élégant", "Résistant"],
    colors: ["Camel", "Noir", "Gris"],
    gender: "Femme",
    ageGroup: "Adulte"
  },
  {
    id: 8,
    name: "Pochette soirée élégante",
    price: 8500,
    category: "luxury",
    icon: "👛",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
    description: "Pochette raffinée pour les occasions spéciales, finitions dorées et design sophistiqué",
    stock: 18,
    status: 'active',
    // Nouveaux attributs
    sku: "C05N008",
    material: "Satin",
    lining: "Soie",
    dimensions: "25 x 15 x 3 cm",
    weight: 0.2,
    shape: "Pochette",
    styles: ["Élégant", "Soirée", "Raffiné"],
    pattern: "Solide",
    decoration: "Chaîne dorée",
    closure: "Fermoir clip",
    handles: "Chaîne amovible",
    season: "Toutes saisons",
    occasion: "Soirée",
    features: ["Élégant", "Léger", "Chaîne dorée"],
    colors: ["Or", "Argent", "Noir", "Rouge"],
    gender: "Femme",
    ageGroup: "Adulte"
  }
];

const defaultCategories: Category[] = [
  {
    id: 'luxury',
    name: 'Sacs de Luxe',
    icon: '👜',
    image: '/images/categories/luxury.svg',
    description: 'Sacs haut de gamme en cuir premium et finitions dorées',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'vintage',
    name: 'Collection Vintage',
    icon: '🎨',
    image: '/images/categories/vintage.svg',
    description: 'Designs rétro et motifs géométriques tendance',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'business',
    name: 'Business & Travail',
    icon: '💼',
    image: '/images/categories/business.svg',
    description: 'Sacs professionnels et fonctionnels pour le travail',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'retro',
    name: 'Style Rétro',
    icon: '🕶️',
    image: '/images/categories/retro.svg',
    description: 'Imprimés vintage et designs classiques intemporels',
    productCount: 0,
    status: 'active'
  },
  {
    id: 'casual',
    name: 'Casual & Quotidien',
    icon: '👜',
    image: '/images/categories/casual.svg',
    description: 'Sacs pratiques et confortables pour tous les jours',
    productCount: 0,
    status: 'active'
  }
];

// Constantes pour les nouveaux filtres
export const MATERIALS = [
  'Cuir PU',
  'Cuir synthétique', 
  'Cuir véritable',
  'Toile enduite',
  'Nylon renforcé',
  'Coton canvas',
  'Satin'
];

export const SHAPES = [
  'Rectangle',
  'Carré', 
  'Rond',
  'Trapèze',
  'Ergonomique',
  'Classique',
  'Compact',
  'Cabas',
  'Pochette'
];

export const STYLES = [
  'Mode',
  'Luxe',
  'Vintage',
  'Décontracté',
  'Business',
  'Moderne',
  'Élégant',
  'Rétro',
  'Sophistiqué',
  'Fonctionnel',
  'Premium',
  'Classique',
  'Pratique',
  'Tendance'
];

export const OCCASIONS = [
  'Quotidien',
  'Travail',
  'Soirée',
  'Sortie',
  'Prestige'
];

export const CLOSURES = [
  'Fermeture éclair',
  'Bouton-pression',
  'Fermoir clip',
  'Ouvert avec bouton-pression'
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
  // État pour gérer l'hydratation
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Initialisation sans localStorage pour éviter l'hydratation error
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Charger les données du localStorage après l'hydratation
  useEffect(() => {
    const storedProducts = loadFromStorage('logodouman_products', defaultProducts);
    const storedCategories = loadFromStorage('logodouman_categories', defaultCategories);
    
    setProducts(storedProducts);
    setCategories(storedCategories);
    setIsHydrated(true);
  }, []);

  // Sauvegarder automatiquement quand les données changent (seulement après hydratation)
  useEffect(() => {
    if (isHydrated) {
      saveToStorage('logodouman_products', products);
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      saveToStorage('logodouman_categories', categories);
    }
  }, [categories, isHydrated]);

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

  // Mettre à jour les compteurs après hydratation
  useEffect(() => {
    if (isHydrated) {
      updateCategoryProductCounts(products);
    }
  }, [isHydrated, products]);

  const value: StoreContextType = {
    products,
    categories,
    isHydrated,
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