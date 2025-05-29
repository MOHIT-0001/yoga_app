import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';

const YogaTypes = () => {
  const { yogaTypes } = useLocalSearchParams();
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  const savedYogaTypes = useAppSelector((state: any) => state.yogaTypes.yogaTypes);

  // Decode the category from the URL
  const decodedCategory = decodeURIComponent(
    Array.isArray(yogaTypes) ? yogaTypes[0] : (yogaTypes || '')
  );

  // Match the category from Redux store
  const selectedYoga = savedYogaTypes?.find(
    (item: any) => item.category === decodedCategory
  );

  if (!selectedYoga) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data found for "{decodedCategory}"</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{decodedCategory}</Text>
      <View style={styles.cardsContainer}>
        {selectedYoga.poses.map((pose: any, index: number) => (
          <TouchableOpacity
            key={index}
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
                onPress={() => {
                  // Favorite logic can go here
                }}
              >
                <MaterialIcons name="star-border" size={24} color="#f1c40f" />
              </TouchableOpacity>
              <Card.Title title={pose.title} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    margin: 5,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    zIndex: 1,
  },
});

export default YogaTypes;
