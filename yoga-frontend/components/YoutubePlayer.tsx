import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text } from 'react-native';

interface YoutubePlayerProps {
  youtubeUrl: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ youtubeUrl }) => {
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(youtubeUrl);

  if (!videoId) {
    return (
      <View>
        <Text>Invalid YouTube URL</Text>
      </View>
    );
  }

  const youtubeIframe = `
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        originWhitelist={['*']}
        source={{ html: youtubeIframe }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 300, // Adjust as needed
  },
  webView: {
    flex: 1,
  },
});

export default YoutubePlayer;