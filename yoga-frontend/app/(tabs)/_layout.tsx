import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#83f53d',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white' },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'YogaTypes') {
            iconName = 'body-outline';
          } else if (route.name === 'Videos') {
            iconName = 'videocam-outline';
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
      <Tabs.Screen name="YogaTypes" />
      <Tabs.Screen name="Videos" />
      <Tabs.Screen name="Favorites" />
      <Tabs.Screen name="Progress" />
    </Tabs>
  );
}
