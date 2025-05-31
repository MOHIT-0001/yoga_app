// store/slices/musicSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicItem {
  _id: string;
  title: string;
  audioUrl: string;
  imageUrl?: string;
}

interface MusicState {
  musicList: MusicItem[];
}

const initialState: MusicState = {
  musicList: [],
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setMusicList: (state, action: PayloadAction<MusicItem[]>) => {
      state.musicList = action.payload;
    },
  },
});

export const { setMusicList } = musicSlice.actions;
export default musicSlice.reducer;
