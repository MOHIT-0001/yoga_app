import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useThemeContext } from './contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, setTheme } = useThemeContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Theme</Text>

      <TouchableOpacity
        style={styles.radio}
        onPress={() => setTheme('light')}
      >
        <Text style={{ fontWeight: theme === 'light' ? 'bold' : 'normal' }}>
          ◉ Light
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.radio}
        onPress={() => setTheme('dark')}
      >
        <Text style={{ fontWeight: theme === 'dark' ? 'bold' : 'normal' }}>
          ◉ Dark
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radio: {
    paddingVertical: 10,
  },
});
