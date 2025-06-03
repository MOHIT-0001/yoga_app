import { configureStore } from '@reduxjs/toolkit'
import { yogaApi } from './api/yogaApi'
import activityReducer from './slices/activitySlice';
import yogaTypesReducer from './slices/yogaTypesSlice';
import musicReducer from './slices/musicSlice';




export const store = configureStore({
  reducer: {
    [yogaApi.reducerPath]: yogaApi.reducer,
     activity: activityReducer,
     yogaTypes: yogaTypesReducer,
         music: musicReducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(yogaApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
