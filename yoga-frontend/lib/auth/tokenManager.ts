// lib/auth/tokenManager.ts
import * as SecureStore from 'expo-secure-store';
import { useRefreshMutation } from '../../store/api/yogaApi';
import dayjs from 'dayjs';

let refreshTimeout: number | undefined;

export async function saveTokens({ accessToken, refreshToken, accessTokenExp }: {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: string; // should be ISO string or UNIX timestamp
}) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  await SecureStore.setItemAsync('accessTokenExp', JSON.stringify(accessTokenExp));
}

export async function clearTokens() {
    try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('accessTokenExp');
    console.log('✅ Tokens cleared');
  } catch (error) {
    console.log('❌ Failed to clear tokens:', error);
  }
}

export async function scheduleTokenRefresh(triggerRefresh: () => Promise<void>) {
  const exp = await SecureStore.getItemAsync('accessTokenExp');
  console.log("Stored exp:", exp);

  if (!exp) return;

const parsedExp = Number(exp);
  const expirationTime = dayjs(parsedExp).valueOf();
  const now = Date.now();
  const refreshIn = expirationTime - now - 20000; // refresh 1 min before expiry
console.log("refreshIn", refreshIn)
  if (refreshIn <= 0) {
    console.log("it is running refreshin")
    await triggerRefresh();
    return;
  }

  if (refreshTimeout) clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(async () => {
    await triggerRefresh();
    await scheduleTokenRefresh(triggerRefresh); // reschedule again
  }, refreshIn);
}
