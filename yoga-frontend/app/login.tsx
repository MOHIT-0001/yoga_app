import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useLoginMutation } from '../store/api/yogaApi';
import { useRouter } from 'expo-router';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const router = useRouter();

  const handleLogin = async () => {
    const res = await login({ email, password }).unwrap();
    console.log(res);
    // Save tokens to secure store here
    router.replace('/(tabs)/Favorites');
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Signup" onPress={() => router.push('/signup')} />
    </View>
  );
}