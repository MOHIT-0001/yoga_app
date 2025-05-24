import React from 'react';
import { Card } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useGetYogaTypesQuery } from '../../store/api/yogaApi';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';


const Home = () => {
  const { data, error, isLoading } = useGetYogaTypesQuery();
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
      const { colors } = useTheme();

  const styles = React.useMemo(() => getStyles(colors), [colors]);


  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error fetching yoga data</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Yoga Types</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {data?.map((yoga, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(`/yoga/${encodeURIComponent(yoga.category)}`)}
        >
          <Card style={{ margin: 10, width: screenWidth * 0.9, alignSelf: 'center' }}>
            <Card.Cover source={{ uri: yoga.imageUrl }} />
            <Card.Title title={yoga.category} />
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Home;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
      alignItems: 'center',
      backgroundColor: colors.background,  // only this changed from static to dynamic
    },
    header: {
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-between', // keeps icon right side
      alignItems: 'center',
      marginBottom: 10,
    },
    text: {
      fontSize: 24,
      color: colors.text,  // text color dynamic
      fontWeight: 'bold',
    },
  });
