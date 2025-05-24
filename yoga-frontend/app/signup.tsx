import { useRouter } from 'expo-router';
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useSignupMutation } from '../store/api/yogaApi';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signup] = useSignupMutation();
  const router = useRouter();

  const handleSignup = async () => {
    await signup({ name, email, password }).unwrap();
    router.replace('/login');
  };

  return (
    <View>
      <TextInput placeholder="Name" onChangeText={setName} value={name} />
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}
