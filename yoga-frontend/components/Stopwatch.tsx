import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

const formatTimeDisplay = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const formatReadableDuration = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const parts = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} sec`);

  return parts.join(' ');
};

const Stopwatch = ({ onSave }: { onSave: (formattedDuration: string) => void }) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedMs((prev) => prev + 1000);
      }, 1000);
    }
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    pause();
    setElapsedMs(0);
  };

  const save = () => {
    const humanReadable = formatReadableDuration(elapsedMs).replace(/\s/g, '');
    console.log('Saving readable duration:', humanReadable);
    onSave(humanReadable); // send formatted string like "1hr4min3sec" with no spaces
    reset();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTimeDisplay(elapsedMs)}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={start} />
        <Button title="Pause" onPress={pause} />
        <Button title="Reset" onPress={reset} />
      </View>

      <View style={styles.saveButtonContainer}>
        <Button title="Save" color="red" onPress={save} />
      </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: 250,
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
