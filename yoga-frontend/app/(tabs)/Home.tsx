import React, { useEffect } from 'react';
import { Card } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useGetYogaTypesQuery, useGetActivityQuery } from '../../store/api/yogaApi';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActivityData } from '../../store/slices/activitySlice';
import { setYogaTypes } from '../../store/slices/yogaTypesSlice';

const Home = () => {
  const { data: yogaData, error, isLoading } = useGetYogaTypesQuery();
  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useGetActivityQuery();

  const dispatch = useAppDispatch();

  const savedYogaTypes = useAppSelector((state) => state.yogaTypes.yogaTypes);

  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  

  useEffect(() => {
    if (yogaData) {
      dispatch(setYogaTypes(yogaData));
    }
  }, [yogaData, dispatch]);

  if (isLoading || activityLoading)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error || activityError) return <Text>Error loading data</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Yoga Types</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {savedYogaTypes.map((yoga, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(`/yoga/${encodeURIComponent(yoga.category)}`)}
        >
          <Card style={{ margin: 10, width: screenWidth * 0.9, alignSelf: 'center' }}>
            <Card.Cover source={{ uri: yoga.imageUrl }} />
            <Card.Title title={yoga.category} />
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Home;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    header: {
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    text: {
      fontSize: 24,
      color: colors.text,
      fontWeight: 'bold',
    },
  });
