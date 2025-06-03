import { Theme } from '@react-navigation/native';

export const CustomDarkTheme: Theme = {
  dark: true,
  colors: {
    background: '#1e1e1e', 
    text: '#ffffff',
    primary: '#ffffff',
    card: '#2a2a2a',
    border: '#444',
    notification: '#83f53d',
  },
    fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '600',
    },
  },
};

export const CustomLightTheme: Theme = {
  dark: false,
  colors: {
    background: '#fff', 
    text: 'black',
    primary: 'green',
    card: '#2a2a2a',
    border: '#444',
    notification: '#83f53d',
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '600',
    },
  },
};