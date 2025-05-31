import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import YoutubePlayer from "@/components/YoutubePlayer";
import { useAppSelector } from "@/store/hooks";

const screenWidth = Dimensions.get("window").width;
const contentWidth = screenWidth * 0.9;

const YogaDescription = () => {
  const { yogaDescription } = useLocalSearchParams();
  const savedYogaTypes = useAppSelector((state: any) => state.yogaTypes.yogaTypes);

  if (!savedYogaTypes || savedYogaTypes.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Find the yoga pose by title across all categories
  let yogaDescriptionData = null;
  let foundCategoryName = null;

  for (const category of savedYogaTypes) {
    const match = category.poses.find(
      (p: any) => p.title === decodeURIComponent(yogaDescription)
    );
    if (match) {
      yogaDescriptionData = match;
      foundCategoryName = category.category;
      break;
    }
  }

  if (!yogaDescriptionData) {
    return (
      <Text style={{ padding: 20 }}>
        No yoga description found for "{decodeURIComponent(yogaDescription)}".
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "green",
        }}
      >
        {yogaDescriptionData.title}
      </Text>

      <YoutubePlayer youtubeUrl={yogaDescriptionData.videoUrl} />

      <Text style={{ fontSize: 24, fontWeight: "500", marginBottom: 5 }}>
        Benefits:
      </Text>
      {yogaDescriptionData.benefits.map((benefit: string, bIndex: number) => (
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
      {yogaDescriptionData.steps.map((step: string, sIndex: number) => (
        <Text key={sIndex} style={{ fontSize: 20, marginBottom: 2 }}>
          {sIndex + 1}. {step}
        </Text>
      ))}
    </ScrollView>
  );
};

export default YogaDescription;
