import { ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useThemeContext, ThemeProviderCustom } from './contexts/ThemeContext';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from '../store/api/yogaApi';
import dayjs from 'dayjs';

const PUBLIC_ROUTES = ['/login', '/signup', '/(auth)/login', '/(auth)/signup'];
let refreshTimeout: number | null = null;

const scheduleTokenRefresh = async (
  triggerRefresh: () => Promise<void>,
  onFail: () => void
) => {
  const exp = await SecureStore.getItemAsync('accessTokenExp');
  if (!exp) return;

  const parsedExp = Number(exp);
  const expirationTime = dayjs(parsedExp).valueOf();
  const now = Date.now();
  const refreshIn = expirationTime - now - 20000;

  if (refreshIn <= 0) {
    try {
      await triggerRefresh();
    } catch {
      onFail();
    }
    return;
  }

  if (refreshTimeout) clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(async () => {
    try {
      await triggerRefresh();
      await scheduleTokenRefresh(triggerRefresh, onFail);
    } catch {
      onFail();
    }
  }, refreshIn);
};

const InnerLayout = () => {
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const router = useRouter();
  const [refresh] = useRefreshMutation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const authChecked = useRef(false);
  const alreadyRedirected = useRef(false);
  const refreshFailedOnce = useRef(false); // ✅ Prevent retry

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsAuthenticated(false);
      return;
    }

    if (authChecked.current || refreshFailedOnce.current) return;
    authChecked.current = true;

    const initAuth = async () => {
      const triggerRefresh = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await refresh({ token: refreshToken }).unwrap();
        await SecureStore.setItemAsync('accessToken', res.accessToken);
        await SecureStore.setItemAsync('accessTokenExp', String(res.exp * 1000));
        setIsAuthenticated(true);
      };

      const handleFailure = () => {
        if (!alreadyRedirected.current) {
          alreadyRedirected.current = true;
          refreshFailedOnce.current = true;
          setIsAuthenticated(false);
          router.replace('/(auth)/login');
        }
      };

      try {
        await triggerRefresh();
        await scheduleTokenRefresh(triggerRefresh, handleFailure);
      } catch (err) {
        console.error('Initial token refresh failed:', err);
        handleFailure();
      }
    };

    initAuth();
  }, [pathname]);

  if (isAuthenticated === null && !PUBLIC_ROUTES.includes(pathname)) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
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
