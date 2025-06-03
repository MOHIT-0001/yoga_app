import { View, TextInput, Button, TouchableOpacity, StyleSheet, Text  } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.box}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />
        <Button title="Login" onPress={handleLogin} color="green" />

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertically center
    alignItems: 'center',     // horizontally center
    backgroundColor: '#f9f9f9',
  },
  box: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  signupText: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

