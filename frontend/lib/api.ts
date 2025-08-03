// lib/api.ts
// Frontend API service to communicate with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface SubscriptionData {
  email: string;
  phone: string;
  location: {
    city: string;
    country?: string;
  };
  alertTypes: ('rain' | 'heat' | 'storm' | 'snow' | 'wind')[];
  notificationMethods: ('email' | 'sms')[];
  frequency: 'once' | 'daily' | 'weekly';
  thresholds?: {
    temperature?: {
      min?: number;
      max?: number;
    };
    windSpeed?: number;
    precipitation?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
          errors: data.errors,
        };
      }

      return {
        success: true,
        data: data.subscription || data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Create a new subscription
  async createSubscription(subscriptionData: SubscriptionData): Promise<ApiResponse> {
    return this.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  // Get server status
  async getServerStatus(): Promise<ApiResponse> {
    return this.request('/status');
  }

  // Test weather API
  async testWeatherAPI(): Promise<ApiResponse> {
    return this.request('/api/weather/test');
  }

  // Get weather by city
  async getWeatherByCity(city: string): Promise<ApiResponse> {
    return this.request(`/api/weather/city/${encodeURIComponent(city)}`);
  }

  // Delete subscription
  async deleteSubscription(id: string): Promise<ApiResponse> {
    return this.request(`/api/subscription/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();