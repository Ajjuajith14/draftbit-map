import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { colors } from '@/constants/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          primary: colors.primary,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Detail lives outside tabs so it opens as a stack screen from map markers or cards. */}
        <Stack.Screen
          name="location-details/[id]"
          options={{
            title: 'Location Details',
            headerBackTitle: 'Locations',
            headerTintColor: colors.primary,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
