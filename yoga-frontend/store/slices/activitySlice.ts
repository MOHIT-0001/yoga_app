// store/slices/activitySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActivityState {
  activityData: any | null;
}

const initialState: ActivityState = {
  activityData: null,
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivityData: (state, action: PayloadAction<any>) => {
      console.log('Setting activity data:', action.payload);
      state.activityData = action.payload;
    },
  },
});

export const { setActivityData } = activitySlice.actions;
export default activitySlice.reducer;
