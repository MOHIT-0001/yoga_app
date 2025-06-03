// Your frontend file where yogaApi is defined
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';


export const yogaApi = createApi({
  reducerPath: 'yogaApi',
  baseQuery: fetchBaseQuery({
    baseUrl:  Constants.expoConfig?.extra?.API_BASE_URL, prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync('accessToken');
      console.log('Token from SecureStore:', token); // Log the token for debugging
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }), // Base URL now points to /api/yoga
  endpoints: (builder) => ({
    getYogaTypes: builder.query<any, void>({
      query: () => '/yogatypes',
    }),
    getMusic: builder.query<any, void>({
      query: () => '/music',
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: '/signup',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    refresh: builder.mutation({
      query: (data) => ({
        url: '/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    getActivity: builder.query<any, void>({
      query: () => '/activity',
    }),
    addActivity: builder.mutation({
      query: (data) => ({
        url: '/update_activity',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteActivity: builder.mutation({
      query: (data: { deleteFavouriteYoga?: string; deleteFavouriteMusic?: string }) => ({
        url: '/activity_delete',
        method: 'DELETE',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetYogaTypesQuery,
  useGetMusicQuery,
  useSignupMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetActivityQuery,
  useAddActivityMutation,
useDeleteActivityMutation } = yogaApi;