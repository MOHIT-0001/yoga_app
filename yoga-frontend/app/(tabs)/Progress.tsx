import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Stopwatch from '@/components/Stopwatch';
import { useRouter } from 'expo-router';

const Progress = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Progress</Text>

      <Stopwatch />

      <View style={styles.buttonContainer}>
        <Button
          title="View Past Sessions"
          onPress={() => router.push('/previousYogaSessions/previousYogaSessions')}
        />
      </View>
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: '#83f53d',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
