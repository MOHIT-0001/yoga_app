import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { setActivityData } from "@/store/slices/activitySlice";
import {  useGetActivityQuery,   useAddActivityMutation } from '../../store/api/yogaApi';
import { Card, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import MusicPlayer from "@/components/MusicPlayer";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20;

const Favorites = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, error, isLoading } = useGetActivityQuery();

  const activityData = useAppSelector((state: RootState) => state.activity.activityData);
  const savedYogaTypes = useAppSelector((state: any) => state.yogaTypes.yogaTypes);
  const musicData = useSelector((state: RootState) => state.music.musicList);

  const [showPlayer, setShowPlayer] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  useEffect(() => {
      dispatch(setActivityData(data));
  }, [data, dispatch]);

  const favoriteYogaIds = activityData?.favouriteYoga || [];
  const favoriteMusicIds = activityData?.favouriteMusic || [];

  const favoriteYogaItems: any[] = [];

  // Extract matching poses by ID from all yoga categories
  for (const category of savedYogaTypes) {
  for (const pose of category.poses) {
    const poseId = pose._id; // This is now a plain string
    if (favoriteYogaIds.includes(poseId)) {
      favoriteYogaItems.push({
        ...pose,
        category: category.category,
        poseId,
      });
    }
  }
}

  const favoriteMusicItems = musicData.filter((music: any) =>
    favoriteMusicIds.includes(music._id)
  );

  const handleMusicPress = (url: string, title: string) => {
    setCurrentAudioUrl(url);
    setCurrentTitle(title);
    setShowPlayer(true);
  };

 useEffect(() => {
    console.log(favoriteYogaItems, favoriteMusicItems, savedYogaTypes, musicData)
  }, [favoriteYogaItems, favoriteMusicItems, router,  activityData]);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Favorite Yoga</Text>
      <View style={styles.cardsContainer}>
        {favoriteYogaItems.map((pose: any) => (
          <TouchableOpacity
            key={pose.poseId}
            onPress={() =>
              router.push(
                `/yoga/${encodeURIComponent(pose.category)}/${encodeURIComponent(pose.title)}`
              )
            }
          >
            <Card style={[styles.card, { width: cardWidth }]}>
              <Card.Cover source={{ uri: pose.imageUrl }} />
              <TouchableOpacity style={styles.starIcon}>
                <MaterialIcons name="star" size={24} color="#f1c40f" />
              </TouchableOpacity>
              <Card.Title title={pose.title} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.header}>Favorite Music</Text>
      <View style={styles.cardsContainer}>
        {favoriteMusicItems.map((music: any) => (
          <TouchableOpacity
            key={music._id}
            onPress={() => handleMusicPress(music.audioUrl, music.title)}
            style={{ width: cardWidth }}
          >
            <Card style={styles.card}>
              {music.imageUrl && <Card.Cover source={{ uri: music.imageUrl }} />}
              <TouchableOpacity style={styles.starIcon}>
                <MaterialIcons name="star" size={24} color="#f1c40f" />
              </TouchableOpacity>
              <View style={{ padding: 8 }}>
                <Title style={{ fontSize: 14, textAlign: "center" }}>{music.title}</Title>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {showPlayer && currentAudioUrl && currentTitle && (
        <MusicPlayer
          audioUrl={currentAudioUrl}
          title={currentTitle}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </ScrollView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#83f53d",
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    position: "relative",
  },
  starIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
