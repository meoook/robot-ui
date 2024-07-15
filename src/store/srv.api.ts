import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store'
import {
  ListResponse,
  ITimeFrame,
  IPair,
  IApiUser,
  IAccount,
  IBot,
  IBotChange,
  IBotStats,
  IBotTrades,
  IAccountCreate,
} from '../model'
import { setLoading, setToken, destroyToken } from './profile.slice'

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

  tagTypes: ['User', 'Account', 'Bot'],

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
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(destroyToken())
        }
      },
    }),
    getPairs: build.query<IPair[], void>({
      query: () => ({
        url: 'pair',
      }),
    }),
    getTimeframes: build.query<ITimeFrame[], void>({
      query: () => ({
        url: 'timeframe',
      }),
    }),
    getAccounts: build.query<IAccount[], void>({
      query: () => ({
        url: 'account',
      }),
      providesTags: ['Account'],
    }),
    createAccount: build.mutation<IAccount, IAccountCreate>({
      query: (account) => ({
        url: 'account',
        method: 'POST',
        body: account,
      }),
      invalidatesTags: ['Account'],
    }),
    deleteAccount: build.mutation<void, number>({
      query: (accountID: number) => ({
        url: `account/${accountID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
    getBots: build.query<IBot[], void>({
      query: () => ({
        url: 'bot',
      }),
      providesTags: ['Bot'],
    }),
    createBot: build.mutation<IBot, { account: number; name: string; pair: string; timeframe: string }>({
      query: ({ account, name, pair, timeframe }) => ({
        url: 'bot',
        method: 'POST',
        data: { account, name, pair, timeframe },
      }),
      invalidatesTags: ['Bot'],
    }),
    updateBot: build.mutation<IBot, { botID: number; changes: IBotChange }>({
      query: ({ botID, changes }) => ({
        url: `bot/${botID}`,
        method: 'PUT',
        data: changes,
      }),
      invalidatesTags: ['Bot'],
    }),
    deleteBot: build.mutation<IBot, number>({
      query: (botID) => ({
        url: `bot/${botID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bot'],
    }),
    getStats: build.query<ListResponse<IBotStats>, number>({
      query: (bot_id: number) => ({
        url: 'stats',
        params: { bot_id, limit: 10 },
      }),
      // providesTags: ['Bot'],
    }),
    getTrades: build.query<ListResponse<IBotTrades>, number>({
      query: (bot_id: number) => ({
        url: 'bot',
        params: { bot_id, limit: 10 },
      }),
      // providesTags: ['Bot'],
    }),
  }),
})

export const {
  useSignInMutation,
  useSingOutMutation,
  useGetUserQuery,
  useGetPairsQuery,
  useGetTimeframesQuery,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useGetBotsQuery,
  useCreateBotMutation,
  useUpdateBotMutation,
  useDeleteBotMutation,
  useGetStatsQuery,
  useGetTradesQuery,
} = srvApi
