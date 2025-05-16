import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Videos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Videos</Text>
    </View>
  );
};

export default Videos;

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