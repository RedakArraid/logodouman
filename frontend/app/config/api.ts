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
    return this.request(endpoint, { ...options, method: 'DELETE' });
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
export default apiService;
