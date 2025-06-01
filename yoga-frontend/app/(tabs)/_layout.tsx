import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext, ThemeProviderCustom } from '../contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: isDark ? '#83f53d' : '#2c7a00',
        tabBarInactiveTintColor: isDark ? '#aaa' : 'gray',
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderTopColor: isDark ? '#222' : '#ccc',
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'body-outline';
          } else if (route.name === 'Listen') {
            iconName = 'musical-notes-outline';
          } else if (route.name === 'Favorites') {
            iconName = 'heart-outline';
          } else if (route.name === 'Progress') {
            iconName = 'bar-chart-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Listen" />
      <Tabs.Screen name="Favorites" />
      <Tabs.Screen name="Progress" />
    </Tabs>
  );
}
