import { configureStore } from '@reduxjs/toolkit'
import { yogaApi } from './api/yogaApi'

export const store = configureStore({
  reducer: {
    [yogaApi.reducerPath]: yogaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(yogaApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
