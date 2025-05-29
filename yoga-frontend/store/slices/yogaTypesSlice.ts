import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface YogaTypesState {
  yogaTypes: any[]; // You can define proper types later
}

const initialState: YogaTypesState = {
  yogaTypes: [],
};

const yogaTypesSlice = createSlice({
  name: 'yogaTypes',
  initialState,
  reducers: {
    setYogaTypes: (state, action: PayloadAction<any[]>) => {
      state.yogaTypes = action.payload;
    },
  },
});

export const { setYogaTypes } = yogaTypesSlice.actions;
export default yogaTypesSlice.reducer;
