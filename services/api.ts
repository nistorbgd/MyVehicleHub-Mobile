/**
 * API Service Layer
 * All API calls go through this file
 */

import { getToken, getRefreshToken, saveTokens, deleteAllTokens } from './tokenStorage';
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Callback function to handle logout navigation
 * This should be set by the app to navigate to auth screen
 */
let onLogoutCallback: (() => void) | null = null;

/**
 * Set the callback function to handle logout
 * Call this in your app's root layout
 */
export function setLogoutCallback(callback: () => void) {
  onLogoutCallback = callback;
}

/**
 * Execute logout: delete local tokens and navigate to auth
 * This is used when token refresh fails (automatic logout)
 * Does NOT call backend logout endpoint (to avoid circular dependency)
 */
async function performLogout() {
  // Delete local tokens
  await deleteAllTokens();

  // Navigate to auth screen
  if (onLogoutCallback) {
    onLogoutCallback();
  }
}

/**
 * Type definitions for API responses
 */
interface LoginResponse {
  jwtToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  userId: string;
}

interface RefreshTokenResponse {
  jwtToken: string;
  refreshToken: string;
}

interface GetProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  age: string
}

interface AddVehicleRequest {
  make: string;
  model: string;
  year: number;
  plateNumber?: string;
  vin?: string;
}

interface AddVehicleResponse {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber?: string;
  vin?: string;
}

interface VehicleResponse {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber?: string;
  vin?: string;
}

interface AllVehiclesResponse {
  vehicles: VehicleResponse[];
}

/**
 * Generic API request helper function
 * @param endpoint - The API endpoint (e.g., '/auth/login')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise with the response data
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Combine base URL with endpoint
  const url = `${API_BASE_URL}${endpoint}`;

  try {

    // Get JWT token from storage
    const token = await getToken();

    // Make the HTTP request
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add token if it exists
        ...options?.headers,
      },
    });

    // Handle 401 Unauthorized - Token expired
    // Don't attempt refresh for auth endpoints (login, register, logout, refreshToken)
    if (response.status === 401 &&
        !endpoint.includes('/auth/refreshToken') &&
        !endpoint.includes('/auth/logout') &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/register')) {

      const refreshSuccessful = await refreshAccessToken();

      if (refreshSuccessful) {
        // Retry the original request with new token
        return apiRequest<T>(endpoint, options);
      } else {
        // Refresh failed, logout user
        await performLogout();
        throw new Error('Session expired. Please login again.');
      }
    }

    // Check if request was successful first
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parse fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse response based on content type
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Response is JSON
      const data = await response.json();
      return data;
    } else {
      // Response is plain text or empty (for logout, delete, etc.)
      const text = await response.text();
      // For void endpoints, return undefined
      return (text ? { message: text } : undefined) as T;
    }

  } catch (error) {
    // Network error or other issue
    console.error('💥 Request Failed:', error);
    throw error;
  }
}

/**
 * Refresh the access token using refresh token
 * @returns true if refresh was successful, false otherwise
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      console.error('❌ No refresh token found in storage');
      return false;
    }

    // Call refresh endpoint (don't use apiRequest to avoid recursion)
    const url = `${API_BASE_URL}/auth/refreshToken`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    // Check status first
    if (!response.ok) {
      // Parse error response as JSON if possible
      try {
        const errorData = await response.json();
        console.error('❌ Refresh token request failed with status:', response.status);
        console.error('❌ Error response:', errorData);
      } catch {
        // If JSON parse fails, try as text
        const errorText = await response.text();
        console.error('❌ Refresh token request failed with status:', response.status);
        console.error('❌ Error response (text):', errorText);
      }
      return false;
    }

    // Parse successful response
    const data: RefreshTokenResponse = await response.json();

    // Validate tokens before saving
    if (!data || !data.jwtToken || !data.refreshToken) {
      console.error('❌ Invalid token refresh response - missing tokens');
      console.error('❌ Response data:', data);
      return false;
    }

    // Save new tokens
    await saveTokens(data.jwtToken, data.refreshToken);

    return true;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    return false;
  }
}

/**
 * Authentication API
 * Functions for login and registration
 */
export const authApi = {
  /**
   * Login user
   * @param credentials - Email and password
   * @returns Response from server (usually JWTtoken and refreshToken)
   */
  login: (credentials: { email: string; password: string }): Promise<LoginResponse> =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Response from server (user-id)
   */
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: string;
  }): Promise<RegisterResponse> =>
    apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /**
   * Refresh JWT token using refresh token
   * @param refreshToken - The refresh token
   * @returns New JWT and refresh tokens
   */
  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    apiRequest<RefreshTokenResponse>('/auth/refreshToken', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  /**
   * Logout user - revoke refresh token on backend
   * @returns Promise that resolves when logout is complete
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        // Call backend to revoke the refresh token
        await apiRequest<void>('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      // Even if backend logout fails, we still want to clear local tokens
      console.error('⚠️ Backend logout failed:', error);
    }
  },

  /**
   * Get user profile information
   * @returns User profile data (firstName, lastName, email, age)
   */
  getProfile: (): Promise<GetProfileResponse> =>
    apiRequest<GetProfileResponse>('/users/profile', {
      method: 'GET',
    }),

  /**
   * Test endpoint - makes a simple authenticated request to test token refresh
   * @returns Profile data (reuses getProfile for testing)
   */
  testRefresh: (): Promise<GetProfileResponse> =>
    apiRequest<GetProfileResponse>('/users/profile', {
      method: 'GET',
    }),
};

/**
 * Vehicle API
 * Functions for vehicle management
 */
export const vehicleApi = {
  /**
   * Add a new vehicle
   * @param vehicleData - Vehicle information (make, model, year, plateNumber, vin)
   * @returns Response from server with created vehicle data
   */
  addVehicle: (vehicleData: AddVehicleRequest): Promise<AddVehicleResponse> =>
    apiRequest<AddVehicleResponse>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    }),

  /**
   * Get all vehicles for the current user
   * @returns Response containing list of vehicles
   */
  getVehicles: (): Promise<AllVehiclesResponse> =>
    apiRequest<AllVehiclesResponse>('/vehicles', {
      method: 'GET',
    }),
};

