import React from 'react';
import { useEffect } from 'react';
import { Card } from 'react-native-paper';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGetYogaTypesQuery } from '../../store/api/yogaApi'
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import {  useRouter } from 'expo-router';


const Home = () => {
  const { data, error, isLoading } = useGetYogaTypesQuery()

  const screenWidth = Dimensions.get('window').width;
const router = useRouter();


  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />

  if (error) {
    console.log("Error object: ", JSON.stringify(error, null, 2));
    return <Text>Error fetching yoga data</Text>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Yoga Types</Text>
      {data?.map((yoga: { imageUrl: string; category: string }, index: number) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    marginTop:50,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#83f53d',
    fontWeight: 'bold',
  },
});
