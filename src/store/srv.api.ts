import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store'
import { IApiAgreement, IApiInvoice, IApiTransaction, IApiUser, ListResponse } from '../model'
import { destroyToken, setLoading, setToken } from './profile.slice'

export const srvApi = createApi({
  reducerPath: 'server/api',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL,
    prepareHeaders: (headers, api) => {
      const token = (api.getState() as RootState).profile.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),

  tagTypes: ['User'],

  endpoints: (build) => ({
    signIn: build.mutation<string, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: 'auth/login/',
        method: 'POST',
        body: { username: email, password },
      }),
      transformResponse: (response: any) => response.token,
      transformErrorResponse: (response: any) => {
        if (response.status === 'FETCH_ERROR') return 'server unreacheble'
        return 'invalid credentials'
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true))
        try {
          const { data: token } = await queryFulfilled
          dispatch(setToken(token))
        } catch (error) {}
        dispatch(setLoading(false))
      },
    }),
    singOut: build.mutation<void, void>({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(destroyToken())
        } catch (error) {}
      },
    }),
    getUser: build.query<IApiUser, null>({
      query: () => ({
        url: 'auth/user',
      }),
      providesTags: ['User'],
    }),
    getAggreements: build.query<ListResponse<IApiAgreement>, number | void>({
      query: (offset: number = 0) => ({
        url: 'agreement',
        params: { offset },
      }),
    }),
    updateAggreement: build.query({
      query: () => ({
        url: 'agreement',
        method: 'PUT',
      }),
    }),
    getMyAggreements: build.query({
      query: () => ({
        url: 'my/agreement',
      }),
    }),
    updateMyAggreement: build.query({
      query: () => ({
        url: 'my/agreement',
        method: 'PUT',
      }),
    }),
    getInvoces: build.query<ListResponse<IApiInvoice>, number | void>({
      query: (offset: number = 0) => ({
        url: 'invoice',
        params: { offset },
      }),
    }),
    getMyInvoces: build.query({
      query: () => ({
        url: 'my/invoice',
      }),
    }),
    getTransactions: build.query<ListResponse<IApiTransaction>, number | void>({
      query: (offset: number = 0) => ({
        url: 'transaction',
        params: { offset },
      }),
    }),
    getMyTransactions: build.query({
      query: () => ({
        url: 'my/transaction',
      }),
    }),
  }),
})

export const {
  useSignInMutation,
  useSingOutMutation,
  useGetUserQuery,
  useGetAggreementsQuery,
  useGetInvocesQuery,
  useGetTransactionsQuery,
} = srvApi
