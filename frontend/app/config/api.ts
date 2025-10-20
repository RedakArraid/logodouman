// Configuration API centralisée pour LogoDouman
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    verify: '/api/auth/verify',
    logout: '/api/auth/logout',
  },
  products: '/api/products',
  categories: '/api/categories',
  orders: '/api/orders',
  customers: '/api/customers',
  dashboard: '/api/dashboard',
};

// Service API avec gestion d'erreur robuste
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = this.getAuthToken();
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ API Error ${response.status}:`, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      console.error('🚨 API Network Error:', error);
      
      // Fallback pour certaines opérations
      if (endpoint === '/api/products' && options.method === 'GET') {
        console.log('📦 Fallback: Utilisation des données locales');
        return this.getFallbackProducts();
      }
      
      throw error;
    }
  }

  // Méthodes HTTP
  async get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string, options?: RequestInit) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
      method: 'DELETE',
    };

    // Ajouter le token d'authentification si disponible
    const token = this.getAuthToken();
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      console.log(`🔄 API Request: DELETE ${url}`);
      
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ API Error ${response.status}:`, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      // Si status 204 (No Content), retourner null
      if (response.status === 204) {
        console.log(`✅ API Success: DELETE ${url} (No Content)`);
        return null;
      }
      
      // Sinon retourner les données JSON
      const data = await response.json();
      console.log(`✅ API Success: DELETE ${url}`, data);
      return data;
    } catch (error) {
      console.error('🚨 API Network Error:', error);
      throw error;
    }
  }

  // Gestion du token d'authentification
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  // Données de fallback
  getFallbackProducts() {
    return {
      products: [
        {
          id: 1,
          name: "Sac à main verni brillant avec anneau de levage",
          price: 150000,
          category: "Luxe",
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
          description: "Sac à main élégant avec finition vernie brillante",
          stock: 12,
          status: "active"
        },
        {
          id: 2,
          name: "Sac imprimé géométrique vintage léger tendance",
          price: 125000,
          category: "Vintage",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
          description: "Sac tendance avec motifs géométriques vintage",
          stock: 8,
          status: "active"
        }
      ]
    };
  }

  // Test de connectivité
  async testConnection(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

// Services spécialisés avec fallback automatique
export class ProductService {
  static async getAll() {
    try {
      const response = await apiService.get('/api/products');
      return response.products || response || [];
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      return apiService.getFallbackProducts().products || [];
    }
  }

  static async getById(id: string) {
    try {
      const response = await apiService.get(`/api/products/${id}`);
      return response.product || response;
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      // Fallback: chercher dans les données locales
      const fallbackProducts = apiService.getFallbackProducts().products || [];
      return fallbackProducts.find(p => p.id.toString() === id) || null;
    }
  }

  static async create(productData: any) {
    try {
      const response = await apiService.post('/api/products', productData);
      return response.product || response;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  static async update(id: string, productData: any) {
    try {
      const response = await apiService.put(`/api/products/${id}`, productData);
      return response.product || response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      return await apiService.delete(`/api/products/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  static async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = apiService.getAuthToken();
      const url = `${apiService['baseURL']}/api/products/upload`;

      console.log('📤 Uploading image to Cloudinary...');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      console.log('✅ Image uploaded to Cloudinary:', data.url);

      return {
        url: data.url,
        publicId: data.publicId
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }
}

export class CategoryService {
  static async getAll() {
    try {
      const response = await apiService.get('/api/categories');
      return response.categories || response || [];
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      return [
        {
          id: "cat-001-luxury",
          name: "Luxury",
          description: "Sacs de luxe et accessoires premium",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
        },
        {
          id: "cat-002-vintage",
          name: "Vintage",
          description: "Sacs vintage et rétro authentiques",
          image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=300&fit=crop"
        },
        {
          id: "cat-003-business",
          name: "Business",
          description: "Sacs professionnels et élégants",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop"
        },
        {
          id: "cat-004-casual",
          name: "Casual",
          description: "Sacs décontractés et quotidiens",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
        }
      ];
    }
  }

  static async getById(id: string) {
    try {
      const response = await apiService.get(`/api/categories/${id}`);
      return response.category || response;
    } catch (error) {
      console.error('Erreur lors du chargement de la catégorie:', error);
      return null;
    }
  }

  static async create(categoryData: any) {
    try {
      const response = await apiService.post('/api/categories', categoryData);
      return response.category || response;
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  }

  static async update(id: string, categoryData: any) {
    try {
      const response = await apiService.put(`/api/categories/${id}`, categoryData);
      return response.category || response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      return await apiService.delete(`/api/categories/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }
}

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await apiService.post('/api/auth/login', { email, password });
      if (response.token) {
        apiService.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  static async verify() {
    try {
      const response = await apiService.get('/api/auth/verify');
      return response;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      apiService.removeAuthToken();
      throw error;
    }
  }

  static async logout() {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      apiService.removeAuthToken();
    }
  }

  static isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  }

  static getToken(): string | null {
    return apiService.getAuthToken();
  }
}

export default apiService;
