import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable
} from 'react-native';
import { useThemeContext } from './contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { RadioButton } from 'react-native-paper';



export default function SettingsScreen() {
  const [isClicked, setIsClicked] = React.useState(false);
      const { colors } = useTheme();
  const navigation = useNavigation();
  const { theme, setTheme } = useThemeContext();
  const router = useRouter();

  const handleSignout = async () => {
    setIsClicked(true);
    try {
      await SecureStore.deleteItemAsync('accessToken');      
      await SecureStore.deleteItemAsync('userefreshTokenr');
      await SecureStore.deleteItemAsync('accessTokenExp');      
    } catch (err) {
      console.error('Error clearing SecureStore:', err);
    }
    setTimeout(() => {
      router.replace('/login');
    }, 100); // slight delay to show the style change
  };

      const styles = React.useMemo(() => getStyles(colors), [colors]);
  

  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerStyle: {
      backgroundColor: colors.background, 
    },
      headerTitleStyle: {
        color: colors.primary, // or any color like '#ff6347'
        fontWeight: 'bold', // optional
      },
    });
  }, [navigation, theme]);

  return (
   <View style={styles.container}>
      <Text style={styles.title}>Choose Theme</Text>

      <View style={styles.radioRow}>
        <Text style={styles.label}>Light</Text>
        <RadioButton
          value="light"
          status={theme === 'light' ? 'checked' : 'unchecked'}
          onPress={() => setTheme('light')}
          color={colors.primary}
        />
      </View>

      <View style={styles.radioRow}>
        <Text style={styles.label}>Dark</Text>
        <RadioButton
          value="dark"
          status={theme === 'dark' ? 'checked' : 'unchecked'}
          onPress={() => setTheme('dark')}
          color={colors.primary}
        />
      </View>

      <Pressable onPress={handleSignout}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 24,
            color: isClicked ? '#8B0000' : 'red',
          }}
        >
          Signout
        </Text>
      </Pressable>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      color: colors.text,
    },
    radioRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    label: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
    },
  });

