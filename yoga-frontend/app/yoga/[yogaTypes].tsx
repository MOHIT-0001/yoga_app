import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useGetYogaTypesQuery } from '../../store/api/yogaApi';
import {  useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';


const YogaTypes = () => {
  const { yogaTypes } = useLocalSearchParams(); 
  const { data, error, isLoading } = useGetYogaTypesQuery();
  const router = useRouter();
  
const params = useLocalSearchParams();
console.log('par', params.yogaTypes);
  const screenWidth = Dimensions.get('window').width;
console.log('yogatypes',yogaTypes)
  // Decode in case the category param is URL encoded
const decodedCategory = decodeURIComponent(
  Array.isArray(yogaTypes) ? yogaTypes[0] : (yogaTypes || '')
);

  // Find the yoga category data matching the decoded category name
  const selectedYoga = data?.find((item:any) => item.category === decodedCategory);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error || !selectedYoga) {
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
    <Card style={[styles.card, { width: screenWidth / 2 - 20 }]}>
      <Card.Cover source={{ uri: pose.imageUrl }} />
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
    color:'green'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    margin: 5,
  },
});

export default YogaTypes;
