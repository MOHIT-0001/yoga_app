import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useLoginMutation, useRefreshMutation } from '../../store/api/yogaApi';
import { saveTokens, scheduleTokenRefresh, clearTokens } from '../../lib/auth/tokenManager';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const [refresh] = useRefreshMutation();
  const router = useRouter();

  const triggerRefresh = async () => {
    console.log("it is running as 20sec are left")
    const storedToken = await SecureStore.getItemAsync('refreshToken');
        const accessToken = await SecureStore.getItemAsync('accessToken');
    console.log("Stored refresh token:", storedToken); 
    console.log("Stored access token:", accessToken);
    console.log(!storedToken)
    if (!storedToken) return;
    try {
      console.log("it is running refresh")
      const res = await refresh({ token: storedToken }).unwrap();
            console.log("response from refresh:", res);
      await saveTokens({
        accessToken: res.accessToken,
        refreshToken: storedToken,
        accessTokenExp: res.accessTokenExp,
      });
      console.log("response from refresh:", res);
    } catch (err) {
      console.log('Error refreshing token:', err);
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please login again.',
        position: 'bottom',
      });
      // await clearTokens()
      router.replace('/login');
    }
  };

  const handleLogin = async () => {
    console.log('Login button pressed');
    try {
      const res = await login({ email, password }).unwrap();
      console.log('Login response:', res);

      try {
        await saveTokens({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          accessTokenExp: res.accessTokenExp,
        });
        console.log('Tokens saved successfully');
        
        await scheduleTokenRefresh(triggerRefresh);

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          position: 'bottom',
        });

        router.replace('/(tabs)/Home'); // no need for setTimeout

      } catch (saveError) {
        console.error('Error saving tokens:', saveError);
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Could not save login session.',
          position: 'bottom',
        });
      }

    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err?.data?.error || 'Invalid email or password',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={{marginTop: 50}}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Signup" onPress={() => router.push('/signup')} />
    </View>
  );
}
