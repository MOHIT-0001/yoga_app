import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import Stopwatch from '@/components/Stopwatch';
import { useRouter } from 'expo-router';
import { useAddActivityMutation } from '@/store/api/yogaApi';

const Progress = () => {
  const router = useRouter();
  const [addActivity] = useAddActivityMutation();

  const handleSave = async (duration: string) => {
     console.log(duration)
    try {
      const result = await addActivity({ previousYogaSession: duration }).unwrap();
      console.log('Activity saved:', result);
      Alert.alert('Saved!', 'Your session was recorded.');
    } catch (error) {
      Alert.alert('Error', 'Could not save session.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Progress</Text>

      <Stopwatch onSave={handleSave} />

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
