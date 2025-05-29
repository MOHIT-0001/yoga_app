import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import MusicPlayer from '@/components/MusicPlayer';
import { useGetMusicQuery } from '@/store/api/yogaApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMusicList } from '@/store/slices/musicSlice';
import { RootState } from '@/store';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth * 0.9 - 10) / 2;

const Listen = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetMusicQuery();
  const musicData = useSelector((state: RootState) => state.music.musicList);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = React.useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = React.useState<string | null>(null);

  useEffect(() => {
    if (data) {
      dispatch(setMusicList(data));
    }
  }, [data, dispatch]);

  const handleMusicPress = (audioUrl: string, title: string) => {
    setCurrentAudioUrl(audioUrl);
    setCurrentTitle(title);
    setShowPlayer(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error fetching music data</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Music List</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {musicData.map((music: any) => (
          <TouchableOpacity
            key={music._id}
            onPress={() => handleMusicPress(music.audioUrl, music.title)}
            style={{ width: cardWidth }}
          >
            <Card style={styles.card}>
              {music.imageUrl && (
                <Card.Cover source={{ uri: music.imageUrl }} />
              )}
              <View style={{ padding: 8 }}>
                <Title style={{ fontSize: 14, textAlign: 'center' }}>{music.title}</Title>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showPlayer && currentAudioUrl && currentTitle && (
        <MusicPlayer
          audioUrl={currentAudioUrl}
          title={currentTitle}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </View>
  );
};

export default Listen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'green',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: cardWidth * 2,
  },
  card: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
