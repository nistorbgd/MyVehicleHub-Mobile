import * as SecureStore from 'expo-secure-store';

const JWT_TOKEN_KEY = 'jwtToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Save JWT token to secure storage
 * @param token - The JWT token to save
 */
export async function saveToken(token: string): Promise<void> {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a non-empty string');
    }
    await SecureStore.setItemAsync(JWT_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

/**
 * Get JWT token from secure storage
 * @returns The JWT token or null if not found
 */
export async function getToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(JWT_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Save refresh token to secure storage
 * @param refreshToken - The refresh token to save
 */
export async function saveRefreshToken(refreshToken: string): Promise<void> {
  try {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('Invalid refresh token: must be a non-empty string');
    }
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
}

/**
 * Get refresh token from secure storage
 * @returns The refresh token or null if not found
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return refreshToken;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
}

/**
 * Save both JWT and refresh tokens at once
 * @param jwtToken - The JWT token
 * @param refreshToken - The refresh token
 */
export async function saveTokens(jwtToken: string, refreshToken: string): Promise<void> {
  await saveToken(jwtToken);
  await saveRefreshToken(refreshToken);
}

/**
 * Delete JWT token from secure storage (logout)
 */
export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(JWT_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
}

/**
 * Delete refresh token from secure storage
 */
export async function deleteRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting refresh token:', error);
    throw error;
  }
}

/**
 * Delete both tokens (complete logout)
 */
export async function deleteAllTokens(): Promise<void> {
  await deleteToken();
  await deleteRefreshToken();
}

/**
 * Check if user is logged in (has a valid token)
 * @returns true if token exists, false otherwise
 */
export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

