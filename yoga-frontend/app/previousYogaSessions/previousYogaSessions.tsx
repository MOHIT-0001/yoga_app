import React, { useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { useGetActivityQuery } from '@/store/api/yogaApi';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LastYogaSessions = () => {
  const { data, isLoading, isError } = useGetActivityQuery();

  const { markedDates, sessionList } = useMemo(() => {
    const marks: any = {};
    const list: { date: string; duration: string }[] = [];

    if (data?.previousYogaSessions?.length) {
      data.previousYogaSessions.forEach((sessionObj: any) => {
        const { date, duration } = sessionObj;

        if (date) {
          marks[date] = {
            selected: true,
            marked: true,
            selectedColor: 'blue',
          };

          list.push({ date, duration });
        }
      });

      console.log('Marked Dates:', marks);
    }

    return { markedDates: marks, sessionList: list };
  }, [data]);

  if (isLoading || isError) {
    return <Text style={styles.centerText}>Loading or Error...</Text>;
  }

  return (
    <View style={{ alignItems: 'center', paddingTop: 20 }}>
      <Calendar
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          height: 350,
          width: 350,
        }}
        current={'2025-05-26'}
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
        markedDates={markedDates}
      />

      <Text style={{ marginTop: 35, fontSize: 24 }}>Previous Sessions</Text>

      <View style={{ marginTop: 20, width: '90%' }}>
        {sessionList.length === 0 ? (
          <Text style={styles.noSessionText}>No saved previous session</Text>
        ) : (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.sessionList}>
              {sessionList.map((session, index) => (
                <View key={index} style={styles.sessionRow}>
                  <Text style={styles.dateText}>{session.date}</Text>
                  <Text style={styles.durationText}>{session.duration}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 200,
  },
  sessionList: {
    flexDirection: 'column',
    gap: 10,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  noSessionText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    paddingVertical: 20,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LastYogaSessions;
