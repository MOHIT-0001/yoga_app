import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGetYogaQuery } from '../../store/api/yogaApi'

  

const YogaTypes = () => {
  const { data, error, isLoading,isSuccess } = useGetYogaQuery()

 
  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />
 
  if (error) {
      console.log("Error object: ", JSON.stringify(error, null, 2));
    return <Text>Error fetching yoga data</Text>}
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Yoga Types</Text>
            {data?.map((yoga, index) => (
        <Text key={index}>{JSON.stringify(yoga)}</Text>
      ))}
    </View>
  );
};

export default YogaTypes;

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
