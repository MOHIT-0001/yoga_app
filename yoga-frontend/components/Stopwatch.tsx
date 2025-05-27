import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text, TextStyle } from 'react-native';

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
};

const Stopwatch = () => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState('');

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedMs((prev) => prev + 100);
      }, 100);
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
    const formatted = formatTime(elapsedMs);
    console.log('Saved Time:', formatted);
    setLastSavedTime(formatted);
    reset();
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(elapsedMs)}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={start} />
        <Button title="Pause" onPress={pause} />
        <Button title="Reset" onPress={reset} />
      </View>

      <View style={styles.saveButtonContainer}>
        <Button title="Save" color="red" onPress={save} />
        {lastSavedTime ? (
          <Text style={styles.savedText}>Saved Time: {lastSavedTime}</Text>
        ) : null}
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
  } as TextStyle,
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
  savedText: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
  },
});
