import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useEffect } from 'react';
import { setActivityData } from '../../store/slices/activitySlice';
import { useGetActivityQuery, useAddActivityMutation } from '../../store/api/yogaApi';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';



const YogaTypes = () => {
  const { yogaTypes } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const screenWidth = Dimensions.get('window').width;
  const { colors } = useTheme();
  

  // API hooks
    const [addActivity, { isLoading: isAdding }] = useAddActivityMutation();
  const { data: activityData, refetch, isLoading: activityLoading } = useGetActivityQuery();

  // Redux store yoga types
  const savedYogaTypes = useAppSelector((state: any) => state.yogaTypes.yogaTypes);

  // Decode the category from the URL
  const decodedCategory = decodeURIComponent(
    Array.isArray(yogaTypes) ? yogaTypes[0] : (yogaTypes || '')
  );

  // Match the category from Redux store
  const selectedYoga = savedYogaTypes?.find(
    (item: any) => item.category === decodedCategory
  );

  // Update redux with activity data whenever it changes
  useEffect(() => {
    if (activityData) {
      dispatch(setActivityData(activityData));
    }
  }, [activityData, dispatch]);

  if (!selectedYoga) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data found for "{decodedCategory}"</Text>
      </View>
    );
  }

  if (activityLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Get array of favorite yoga IDs from activity data
  const favoriteYogaIds = activityData?.favouriteYoga || [];

  // Filter poses to show only those NOT favorited yet
  const posesToShow = selectedYoga.poses.filter(
    (pose: any) => !favoriteYogaIds.includes(pose._id)
  );

  // Handle adding yoga to favorites
  const handleAddFavorite = async (id: string) => {
console.log('Adding favorite yoga with ID:', id);
    try {
      const res = await addActivity({ favouriteYoga: id }).unwrap();
      console.log('Added favorite yoga:', res);
      await refetch(); // Refetch to update favorites after successful add
        Toast.show({
      type: 'success',
      text1: 'Yoga added to favorites',
      
    });
    } catch (error) {
      console.error('Error adding favorite yoga:', error);
       Toast.show({
      type: 'error',
      text1: 'Failed to add yoga',
      text2: error?.data?.message || 'Please try again',
    });
    }
  };

  useEffect(() => {
    // console.log(posesToShow) 
  }  , [posesToShow]);

  useEffect(() => {
    navigation.setOptions({
      title: yogaTypes,
          headerStyle: {
      backgroundColor: colors.background, 
    },
       headerTitleStyle: {
      color: colors.primary, 
      fontWeight: 'bold', 
    },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{decodedCategory}</Text> */}
      <View style={styles.cardsContainer}>
        {posesToShow.length === 0 ? (
          <Text style={styles.noMoreText}>All poses are favorited!</Text>
        ) : (
          posesToShow.map((pose: any, index: number) => (
            <TouchableOpacity
              key={pose._id}
              onPress={() =>
                router.push(
                  `/yoga/${encodeURIComponent(selectedYoga.category)}/${encodeURIComponent(pose.title)}`
                )
              }
            >
              <Card
                style={[
                  styles.card,
                  { width: screenWidth / 2 - 20, position: 'relative' },
                ]}
              >
                <Card.Cover source={{ uri: pose.imageUrl }} />
                <TouchableOpacity
                  style={styles.starIcon}
                  onPress={() => handleAddFavorite(pose._id)}
                  disabled={isAdding}
                >
                  <MaterialIcons name="star-border" size={24} color="#f1c40f" />
                </TouchableOpacity>
                <Card.Title title={pose.title} />
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 8,
    // alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
    textAlign: 'center',  
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    margin: 5,
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
  noMoreText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default YogaTypes;

