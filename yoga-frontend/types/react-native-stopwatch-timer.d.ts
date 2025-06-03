declare module 'react-native-stopwatch-timer' {
  import * as React from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface TimerStopwatchProps {
    start?: boolean;
    reset?: boolean;
    msecs?: boolean;
    laps?: boolean;
    getTime?: (time: string) => void;
    options?: {
      container?: ViewStyle;
      text?: TextStyle;
    };
    totalDuration?: number;
    handleFinish?: () => void;
  }

  export class Stopwatch extends React.Component<TimerStopwatchProps> {}
  export class Timer extends React.Component<TimerStopwatchProps> {}
}
