// Your frontend file where yogaApi is defined
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const yogaApi = createApi({
  reducerPath: 'yogaApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:5000/api/yoga' }), // Base URL now points to /api/yoga
  endpoints: (builder) => ({
    getYogaTypes: builder.query<any, void>({
      query: () => '/yogatypes', // Append the specific endpoint
    }),
    getMusic: builder.query<any, void>({
      query: () => '/music', // Append the specific endpoint for music
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
      query: (token) => ({
        url: '/refresh',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetYogaTypesQuery, useGetMusicQuery, useSignupMutation, useLoginMutation, useRefreshMutation } = yogaApi;