import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';



const CalendarComponent = () => {

  return (
    
   <Calendar
  // Customize the appearance of the calendar
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350,
  width: 350 }}
  // Specify the current date
  current={'2025-05-26'}
  // Callback that gets called when the user selects a day
  onDayPress={day => {
    console.log('selected day', day);
  }}
  // Mark specific dates as marked
  markedDates={{
    '2025-05-04': {selected: true, marked: true, selectedColor: 'blue'},
    '2025-05-06': {marked: true},
    '2025-05-18': {selected: true, marked: true, selectedColor: 'blue'}
  }}
/>
  );
};

export default CalendarComponent;