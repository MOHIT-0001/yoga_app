import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer from '@/components/YoutubePlayer';

const Videos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Videos</Text>
      {/* <YoutubePlayer youtubeUrl="https://www.youtube.com/watch?v=ohI01CX0xrI" /> */}
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