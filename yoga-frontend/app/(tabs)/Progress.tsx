import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import Stopwatch from '@/components/Stopwatch';
import { useRouter } from 'expo-router';
import { useAddActivityMutation } from '@/store/api/yogaApi';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';



const Progress = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [addActivity] = useAddActivityMutation();

  const handleSave = async (duration: string) => {
    console.log(duration)
    try {
      const result = await addActivity({ previousYogaSession: duration }).unwrap();
      console.log('Activity saved:', result);
      Toast.show({
        type: 'success',
        text1: 'Saved!',
        text2: 'Your yoga session was recorded.',
                position: 'bottom',

      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not save session.',
                position: 'bottom',

      }); console.error(error);
    }
  };

  const styles = React.useMemo(() => getStyles(colors), [colors]);

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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
