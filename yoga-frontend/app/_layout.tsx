import { ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useThemeContext, ThemeProviderCustom } from './contexts/ThemeContext';
import { CustomDarkTheme, CustomLightTheme } from './contexts/theme';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setMusicList } from '@/store/slices/musicSlice';
import { useGetMusicQuery } from '@/store/api/yogaApi';


import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from '../store/api/yogaApi';
import dayjs from 'dayjs';

// Singleton to manage token refresh globally
const TokenRefreshManager = (() => {
  let refreshTimeout: NodeJS.Timeout | null = null;
  let isRefreshing = false;

  const scheduleTokenRefresh = async (
    triggerRefresh: () => Promise<void>,
    onFail: () => void
  ) => {
    if (isRefreshing) return; // Prevent concurrent refreshes
    isRefreshing = true;

    try {
      const exp = await SecureStore.getItemAsync('accessTokenExp');
      if (!exp) {
        isRefreshing = false;
        return;
      }

      const parsedExp = Number(exp);
      const expirationTime = dayjs(parsedExp).valueOf();
      const now = Date.now();
      const refreshIn = expirationTime - now - 20000; // 20-second buffer

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }

      if (refreshIn <= 0) {
        await triggerRefresh();
        await scheduleTokenRefresh(triggerRefresh, onFail); // Recursive call after refresh
        isRefreshing = false;
        return;
      }

      console.log(`Scheduling token refresh in ${refreshIn}ms`); // Debug log
      refreshTimeout = setTimeout(async () => {
        try {
          await triggerRefresh();
          await scheduleTokenRefresh(triggerRefresh, onFail); // Recursive call
        } catch {
          onFail();
        } finally {
          isRefreshing = false;
        }
      }, refreshIn);
    } catch (err) {
      console.error('Error in scheduleTokenRefresh:', err);
      isRefreshing = false;
      onFail();
    }
  };

  const stopRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }
    isRefreshing = false;
  };

  return { scheduleTokenRefresh, stopRefresh };
})();



const InnerLayout = () => {
  const dispatch = useDispatch();
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const router = useRouter();
  const [refresh] = useRefreshMutation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const authChecked = useRef(false);
  const alreadyRedirected = useRef(false);
  const { data, error, isLoading } = useGetMusicQuery();
  useEffect(() => {
    if (data) {
      dispatch(setMusicList(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsAuthenticated(false);
      TokenRefreshManager.stopRefresh(); // Stop refresh for public routes
      return;
    }

    if (authChecked.current || alreadyRedirected.current) return;
    authChecked.current = true;

    const initAuth = async () => {
      const triggerRefresh = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        console.log('Triggering token refresh'); // Debug log
        const res = await refresh({ token: refreshToken }).unwrap();
        console.log('Token refresh in 15min', res); // Debug log
        await SecureStore.setItemAsync('accessToken', res.accessToken);
        await SecureStore.setItemAsync('accessTokenExp', String(res.exp * 1000));
        setIsAuthenticated(true);
      };

      const handleFailure = () => {
        if (!alreadyRedirected.current) {
          alreadyRedirected.current = true;
          setIsAuthenticated(false);
          router.replace('/(auth)/login');
          TokenRefreshManager.stopRefresh();
        }
      };

      try {
        await triggerRefresh();
        await TokenRefreshManager.scheduleTokenRefresh(triggerRefresh, handleFailure);
      } catch (err) {
        console.error('Initial token refresh failed:', err);
        handleFailure();
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      if (PUBLIC_ROUTES.includes(pathname)) {
        TokenRefreshManager.stopRefresh();
      }
    };
  }, [pathname, refresh]);

  if (isAuthenticated === null && !PUBLIC_ROUTES.includes(pathname)) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider value={theme === 'dark' ? CustomDarkTheme  : CustomLightTheme}>
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

const PUBLIC_ROUTES = ['/login', '/signup', '/(auth)/login', '/(auth)/signup'];

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <InnerLayout />
      </ThemeProviderCustom>
    </Provider>
  );
}  