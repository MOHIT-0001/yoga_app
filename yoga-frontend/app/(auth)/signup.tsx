import { useRouter } from 'expo-router';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
      <View style={styles.box}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />
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
        <Button title="Signup" onPress={handleSignup} color="green" />

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.signupText}>Go To Login</Text>
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
