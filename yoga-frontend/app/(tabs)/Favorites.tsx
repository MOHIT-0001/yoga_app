import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

const Favorites = () => {
    const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
            <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#83f53d',
    fontWeight: 'bold',
  },
});