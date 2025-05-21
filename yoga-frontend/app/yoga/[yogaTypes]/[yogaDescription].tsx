import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetYogaTypesQuery } from "@/store/api/yogaApi";
import YoutubePlayer from "@/components/YoutubePlayer";

const screenWidth = Dimensions.get("window").width;
const contentWidth = screenWidth * 0.9;

const YogaDescription = () => {
  const { yogaDescription } = useLocalSearchParams();
  const { data, error, isLoading } = useGetYogaTypesQuery();

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading yoga data.</Text>;

  // Find the yoga description data across all categories
  let yogaDescriptionData = null;
  let foundCategoryName = null;

  for (const category of data) {
    const match = category.poses.find(
      (p) => p.title === decodeURIComponent(yogaDescription)
    );
    if (match) {
      yogaDescriptionData = match;
      foundCategoryName = category.category;
      break;
    }
  }

  if (!yogaDescriptionData) {
    return (
      <Text>
        No yoga description found for "{decodeURIComponent(yogaDescription)}".
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign:'center', color:'green' }}>
        {yogaDescriptionData.title}
      </Text>

      {/* <Image
        source={{ uri: yogaDescriptionData.imageUrl }}
        style={{
          width: contentWidth,
          height: 200,
          borderRadius: 10,
          marginBottom: 15,
          resizeMode: "cover",
        }}
      /> */}

      <YoutubePlayer youtubeUrl={yogaDescriptionData.videoUrl} />

      <Text style={{ fontSize: 24, fontWeight: "500", marginBottom: 5 }}>
        Benefits:
      </Text>
      {yogaDescriptionData.benefits.map((benefit, bIndex) => (
        <Text key={bIndex} style={{ fontSize: 20, marginBottom: 2 }}>
          • {benefit}
        </Text>
      ))}

      <Text
        style={{
          fontSize: 24,
          fontWeight: "500",
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        Steps:
      </Text>
      {yogaDescriptionData.steps.map((step, sIndex) => (
        <Text key={sIndex} style={{ fontSize: 20, marginBottom: 2 }}>
          {sIndex + 1}. {step}
        </Text>
      ))}
    </ScrollView>
  );
};

export default YogaDescription;
