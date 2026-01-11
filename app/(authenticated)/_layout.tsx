import { Stack } from 'expo-router';

export default function AuthenticatedLayout() {

  return (
    <Stack screenOptions={{
      headerShown: false,
      gestureEnabled: false, // Disable swipe back gesture
    }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe back
        }}
      />
    </Stack>
  );
}

