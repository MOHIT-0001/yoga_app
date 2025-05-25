import { useRouter } from 'expo-router';
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useSignupMutation } from '../../store/api/yogaApi';
import Toast from 'react-native-toast-message';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signup] = useSignupMutation();
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await signup({ name, email, password }).unwrap();

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        text2: 'You can now log in!',
        position: 'top',
      });

      // Delay before navigating
      setTimeout(() => {
        router.replace('/login');
      }, 1500); // 1.5 second delay to show toast
    } catch (err:any) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err?.data?.error || 'Something went wrong',
        position: 'top',
      });
    }
  };

  return (
    <View style={{marginTop: 50}}>
      <TextInput placeholder="Name" onChangeText={setName} value={name} />
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Signup" onPress={handleSignup} />
            <Button title="Go to Login" onPress={() => router.push('/login')} />
      
    </View>
  );
}


