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
import { MaterialIcons } from '@expo/vector-icons';
import MusicPlayer from '@/components/MusicPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { setMusicList } from '@/store/slices/musicSlice';
import { RootState } from '@/store';
import { useGetMusicQuery, useAddActivityMutation, useGetActivityQuery } from '@/store/api/yogaApi';
import { setActivityData } from '@/store/slices/activitySlice';
import { useTheme } from '@react-navigation/native';


const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth * 0.9 - 10) / 2;

const Listen = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { data: musicApiData, error, isLoading: musicLoading } = useGetMusicQuery();
  const musicData = useSelector((state: RootState) => state.music.musicList);

  const { data: activityData, refetch, isLoading: activityLoading } = useGetActivityQuery();
  const [addActivity, { isLoading: isAdding }] = useAddActivityMutation();

  const [showPlayer, setShowPlayer] = React.useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = React.useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = React.useState<string | null>(null);

  useEffect(() => {
    if (musicApiData) {
      dispatch(setMusicList(musicApiData));
    }
  }, [musicApiData, dispatch]);

  useEffect(() => {
    if (activityData) {
      dispatch(setActivityData(activityData));
    }
  }, [activityData, dispatch]);

  const handleMusicPress = (audioUrl: string, title: string) => {
    setCurrentAudioUrl(audioUrl);
    setCurrentTitle(title);
    setShowPlayer(true);
  };

  const handleAddFavorite = async (id: string) => {
    try {
      const res = await addActivity({ favouriteMusic: id }).unwrap();
      console.log('Added favorite music:', res);
      await refetch(); // Refetch to update favorite list
    } catch (error) {
      console.error('Error adding favorite music:', error);
    }
  };
    const styles = React.useMemo(() => getStyles(colors), [colors]);
  

  if (musicLoading || activityLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error fetching music data</Text>;
  }

  // Get favorite music IDs from activity data
  const favoriteMusicIds = activityData?.favouriteMusic || [];

  // Filter music that are NOT already favorited
  const musicToShow = musicData.filter(
    (music: any) => !favoriteMusicIds.includes(music._id)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Music List</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {musicToShow.length === 0 ? (
          <Text style={styles.noMoreText}>All tracks are favorited!</Text>
        ) : (
          musicToShow.map((music: any) => (
            <TouchableOpacity
              key={music._id}
              onPress={() => handleMusicPress(music.audioUrl, music.title)}
              style={{ width: cardWidth }}
            >
              <Card style={styles.card}>
                {music.imageUrl && (
                  <Card.Cover source={{ uri: music.imageUrl }} />
                )}

                <TouchableOpacity
                  style={styles.starIcon}
                  onPress={() => handleAddFavorite(music._id)}
                  disabled={isAdding}
                >
                  <MaterialIcons name="star-border" size={24} color="#f1c40f" />
                </TouchableOpacity>

                <View style={{ padding: 8 }}>
                  <Title style={{ fontSize: 14, textAlign: 'center' }}>{music.title}</Title>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.primary,
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
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  noMoreText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
