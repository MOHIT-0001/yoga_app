import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const yogaApi = createApi({
  reducerPath: 'yogaApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:5000/api/' }),
  endpoints: (builder) => ({
    getYoga: builder.query<any, void>({
      query: () => 'yoga',
    }),
  }),
})

// Export hook for usage in functional components
export const { useGetYogaQuery } = yogaApi
