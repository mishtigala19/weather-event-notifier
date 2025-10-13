// lib/api.ts
// Frontend API service to communicate with the backend

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://weather-event-notifier.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Render free tier cold starts can take several seconds
  timeout: 45000
});

type BackendEnvelope<T> = {
  success?: boolean;
  data?: T;
  subscription?: T;
  message?: string;
  error?: string;
  errors?: string[],
  [key: string]: unknown;
};

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
    const method = (options.method || "GET").toLowerCase() as "get" | "post" | "put" | "delete";
    const data = options.body ? JSON.parse(options.body as string) : undefined;
    try {
      // eslint-disable-next-line no-console
      console.log("[api] request", method.toUpperCase(), `${API_BASE_URL}${endpoint}`, data ?? null);

      const res = await axiosInstance.request<T>({
        url: endpoint,
        method,
        data,
        headers: options.headers as Record<string, string> | undefined
      });

      const payload = res.data as unknown as BackendEnvelope<T>;

      // eslint-disable-next-line no-console
      console.log("[api] response", `${API_BASE_URL}${endpoint}`, { ok: !(payload.error || payload.success === false) });

      if (payload.error || (payload.success === false)) {
        return { success: false, error: payload.error ?? payload.message ?? "Request failed", errors: payload.errors };
      }

      return {
        success: true,
        data: (payload.subscription ?? payload.data ?? (res.data as unknown as T)),
        message: payload.message
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[api] error", `${API_BASE_URL}${endpoint}`, err);
      const message = (err as { message?: string })?.message || "Network error";
      return { success: false, error: message };
    }
  }

  // Create a new subscription
  async createSubscription(subscriptionData: SubscriptionData): Promise<ApiResponse> {
    // Transform the data to match backend expectations
    const transformedData = {
      location: {
        city: subscriptionData.location
      },
      alertTypes: [subscriptionData.alertType],
      email: subscriptionData.email,
      phone: subscriptionData.phone || ""  // backend expects 'phone' field
    };

    // Base URL already contains /api
    return this.request('/subscription', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  // Get server status
  async getServerStatus(): Promise<ApiResponse> {
    return this.request('/status'); // backend now mirrors /api/status
  }

  // Get all subscribers
  async getSubscribers(): Promise<ApiResponse> {
    return this.request('/subscribers');
  }

  // Test weather API
  async testWeatherAPI(): Promise<ApiResponse> {
    return this.request('/weather/test');
  }

  // Get weather by city
  async getWeatherByCity(city: string): Promise<ApiResponse> {
    return this.request(`/weather/city/${encodeURIComponent(city)}`);
  }

  // Detect weather events by city
  async detectEventsByCity(city: string): Promise<ApiResponse> {
    return this.request(`/events/city/${encodeURIComponent(city)}`);
  }

  // Delete subscription
  async deleteSubscription(id: string): Promise<ApiResponse> {
    return this.request(`/subscription/${id}`, {
      method: 'DELETE',
    });
  }

  // Unsubscribe using ID
  async unsubscribe(id: string): Promise<ApiResponse> {
    return this.request(`/subscription/${id}/unsubscribe`);
  }
}

export const api = new ApiService();