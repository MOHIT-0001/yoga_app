// MusicPlayer.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface MusicPlayerProps {
  audioUrl: string;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl, title, onClose }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [durationMillis, setDurationMillis] = useState<number>(0);
  const [positionMillis, setPositionMillis] = useState<number>(0);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const handlePlayPause = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      setLoading(true);
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setDurationMillis(status.durationMillis ?? 0);
      setPositionMillis(status.positionMillis ?? 0);
      setLoading(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPositionMillis(status.positionMillis ?? 0);
        if (status.durationMillis) setDurationMillis(status.durationMillis);
        if (status.didJustFinish) setIsPlaying(false);
      });
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSliderChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPositionMillis(value);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" color="#555" />
        ) : (
          <>
          <Text style={{fontSize:22, textAlign:'center'}}>{title}</Text>
            <View style={styles.controls}>
              
              <Pressable onPress={handlePlayPause}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#000"
                />
              </Pressable>
              <Text style={styles.timeText}>
                {formatTime(positionMillis)} / {formatTime(durationMillis)}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={durationMillis}
              value={positionMillis}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#000"
            />
          </>
        )}
      </View>
    </View>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
    marginTop: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slider: {
    marginTop: 15,
    width: '100%',
    height: 40,
  },
});
