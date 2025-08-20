// lib/api.ts
// Frontend API service to communicate with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export interface SubscriptionData {
  email: string;
  phone?: string;  // Made optional since it's optional in the form
  location: string;  // Changed to string for form compatibility
  alertType: 'rain' | 'heat' | 'storm' | 'snow' | 'wind';  // Changed from array to single value
}

export interface ApiResponse<T = unknown> {
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
    // Transform the data to match backend expectations
    const transformedData = {
      location: {
        city: subscriptionData.location
      },
      alertType: subscriptionData.alertType,
      email: subscriptionData.email,
      phone: subscriptionData.phone || ''  // backend expects 'phone' field
    };

    return this.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  // Get server status
  async getServerStatus(): Promise<ApiResponse> {
    return this.request('/status');
  }

  // Get all subscribers
  async getSubscribers(): Promise<ApiResponse> {
    return this.request('/subscribers');
  }

  // Test weather API
  async testWeatherAPI(): Promise<ApiResponse> {
    return this.request('/api/weather/test');
  }

  // Get weather by city
  async getWeatherByCity(city: string): Promise<ApiResponse> {
    return this.request(`/api/weather/city/${encodeURIComponent(city)}`);
  }

  // Detect weather events by city
  async detectEventsByCity(city: string): Promise<ApiResponse> {
    return this.request(`/api/events/detect/${encodeURIComponent(city)}`);
  }

  // Delete subscription
  async deleteSubscription(id: string): Promise<ApiResponse> {
    return this.request(`/api/subscription/${id}`, {
      method: 'DELETE',
    });
  }

  // Unsubscribe using ID
  async unsubscribe(id: string): Promise<ApiResponse> {
    return this.request(`/unsubscribe/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();