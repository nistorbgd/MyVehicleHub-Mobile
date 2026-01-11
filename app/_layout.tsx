import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { isLoggedIn } from '@/services/tokenStorage';
import { setLogoutCallback } from '@/services/api';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  // Set up logout callback for API service (for automatic logout on token refresh failure)
  useEffect(() => {
    setLogoutCallback(() => {
      router.replace('/');
    });
  }, [router]);

  // Check authentication on app start
  useEffect(() => {
    async function checkAuth() {
      try {
        const loggedIn = await isLoggedIn();
        const inAuthGroup = segments[0] === '(authenticated)';

        if (loggedIn && !inAuthGroup) {
          // User is logged in -> go to dashboard
          router.replace('/(authenticated)/(tabs)');
        } else if (!loggedIn && inAuthGroup) {
          // User is not logged in -> go to auth home
          router.replace('/');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsReady(true);
      }
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render until auth check is complete
  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ gestureEnabled: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen
          name="(authenticated)"
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back to auth
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


