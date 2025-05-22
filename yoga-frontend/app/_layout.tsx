// app/_layout.tsx
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useThemeContext, ThemeProviderCustom } from './contexts/ThemeContext';

const InnerLayout = () => {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <InnerLayout />
      </ThemeProviderCustom>
    </Provider>
  );
}
