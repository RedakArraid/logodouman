// Configuration API corrigée pour Docker Compose

// Pour le navigateur, toujours utiliser localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },

  // Dashboard et statistiques
  DASHBOARD: {
    OVERVIEW: `${API_BASE_URL}/api/dashboard/overview`,
    ALERTS: `${API_BASE_URL}/api/dashboard/alerts`,
    STATS: `${API_BASE_URL}/api/dashboard/stats/detailed`,
  },

  // Produits
  PRODUCTS: {
    BASE: `${API_BASE_URL}/api/products`,
    BY_ID: (id: number) => `${API_BASE_URL}/api/products/${id}`,
    BY_CATEGORY: (categoryId: string) => `${API_BASE_URL}/api/products?categoryId=${categoryId}`,
    SEARCH: (query: string) => `${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}`,
  },

  // Catégories
  CATEGORIES: {
    BASE: `${API_BASE_URL}/api/categories`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  },

  // Commandes
  ORDERS: {
    BASE: `${API_BASE_URL}/api/orders`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
    BY_STATUS: (status: string) => `${API_BASE_URL}/api/orders?status=${status}`,
    STATS: `${API_BASE_URL}/api/orders/stats/overview`,
  },

  // Clients
  CUSTOMERS: {
    BASE: `${API_BASE_URL}/api/customers`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/customers/${id}`,
    ANALYTICS: (id: string) => `${API_BASE_URL}/api/customers/${id}/analytics`,
    SEGMENTATION: `${API_BASE_URL}/api/customers/analytics/segmentation`,
  },

  // Promotions
  PROMOTIONS: {
    BASE: `${API_BASE_URL}/api/promotions`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/promotions/${id}`,
    VALIDATE: `${API_BASE_URL}/api/promotions/validate`,
    ANALYTICS: `${API_BASE_URL}/api/promotions/analytics/overview`,
    EXPIRING: `${API_BASE_URL}/api/promotions/analytics/expiring`,
  },
};

// Client API simplifié pour Docker
export class ApiClient {
  private static getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Erreur ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }
    return response.json();
  }

  // GET request
  static async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
        ...this.getAuthHeaders(),
      },
    });
    return this.handleResponse<T>(response);
  }

  // POST request
  static async post<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        ...this.getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  // PUT request
  static async put<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.HEADERS,
        ...this.getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  // DELETE request
  static async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.HEADERS,
        ...this.getAuthHeaders(),
      },
    });
    return this.handleResponse<T>(response);
  }

  // PATCH request
  static async patch<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...API_CONFIG.HEADERS,
        ...this.getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }
}

// Services avec URLs fixes
export const AuthService = {
  login: (credentials: { email: string; password: string }) =>
    ApiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  register: (userData: { email: string; password: string; name?: string }) =>
    ApiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  
  verify: () => ApiClient.get(API_ENDPOINTS.AUTH.VERIFY),
  
  logout: () => ApiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  getProfile: () => ApiClient.get(API_ENDPOINTS.AUTH.PROFILE),
};

export const ProductService = {
  getAll: () => ApiClient.get(API_ENDPOINTS.PRODUCTS.BASE),
  getById: (id: number) => ApiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
  getByCategory: (categoryId: string) => ApiClient.get(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId)),
  search: (query: string) => ApiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH(query)),
  create: (productData: any) => ApiClient.post(API_ENDPOINTS.PRODUCTS.BASE, productData),
  update: (id: number, productData: any) => ApiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), productData),
  delete: (id: number) => ApiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
};

export const CategoryService = {
  getAll: () => ApiClient.get(API_ENDPOINTS.CATEGORIES.BASE),
  getById: (id: string) => ApiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
  create: (categoryData: any) => ApiClient.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData),
  update: (id: string, categoryData: any) => ApiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData),
  delete: (id: string) => ApiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
};

export const DashboardService = {
  getOverview: () => ApiClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW),
  getAlerts: () => ApiClient.get(API_ENDPOINTS.DASHBOARD.ALERTS),
  getDetailedStats: () => ApiClient.get(API_ENDPOINTS.DASHBOARD.STATS),
};

// Export par défaut
export default {
  API_CONFIG,
  API_ENDPOINTS,
  ApiClient,
  AuthService,
  ProductService,
  CategoryService,
  DashboardService,
};
