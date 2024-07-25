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
import { Web3Message } from './w3'

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
    w3nonce: build.mutation<Web3Message, { chain: number; address: string }>({
      query: ({ chain, address }) => ({
        url: 'auth/web3',
        params: { chain, address },
      }),
    }),
    w3auth: build.mutation<string, { message: string; signature: string }>({
      // invalidatesTags: ['User'],
      query: ({ message, signature }) => ({
        url: 'auth/web3',
        method: 'POST',
        body: { message, signature },
      }),
      transformResponse: (response: any) => response.token,
      transformErrorResponse: (response: any) => {
        if (response.status === 'FETCH_ERROR') return 'server unreacheble'
        return 'invalid signature'
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true))
        try {
          const { data: token } = await queryFulfilled
          dispatch(setToken(token))
        } catch (error) {
          dispatch(setLoading(false))
        }
      },
    }),
    signIn: build.mutation<string, { email: string; password: string }>({
      // invalidatesTags: ['User'],
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
        } catch (error) {
          dispatch(setLoading(false))
        }
      },
    }),
    singOut: build.mutation<void, void>({
      invalidatesTags: ['User', 'Account', 'Bot'],
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(destroyToken())
        } catch {}
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
          dispatch(setLoading(false))
        } catch (error) {
          dispatch(destroyToken())
        }
      },
    }),
    telegramNonce: build.mutation<{ nonce: number; expire: number }, void>({
      query: () => ({
        url: 'auth/user/telegram',
      }),
    }),
    setPassword: build.mutation<void, string>({
      query: (password) => ({
        url: 'auth/user/password',
        method: 'POST',
        body: { password },
      }),
    }),
    setEmail: build.mutation<void, string>({
      // invalidatesTags: ['User'],
      query: (email) => ({
        url: 'auth/user/email',
        method: 'POST',
        body: { email },
      }),
      transformErrorResponse: (response: any) => {
        if (response.status === 'FETCH_ERROR') return 'server unreacheble'
        if (response.data.email) return response.data.email[0]
        return 'invalid email'
      },
      async onQueryStarted(email, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            srvApi.util.updateQueryData('getUser', null, (draft) => {
              draft.email = email
            })
          )
        } catch {}
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
      transformResponse: (response: Array<string[]>) => response.map((e) => ({ timeframe: e[0], name: e[1] })),
    }),
    getAccounts: build.query<IAccount[], void>({
      providesTags: ['Account'],
      query: () => ({
        url: 'account',
      }),
    }),
    createAccount: build.mutation<IAccount, IAccountCreate>({
      invalidatesTags: ['Account'],
      query: (account) => ({
        url: 'account',
        method: 'POST',
        body: account,
      }),
    }),
    deleteAccount: build.mutation<void, number>({
      invalidatesTags: ['Account'],
      query: (accountID: number) => ({
        url: `account/${accountID}`,
        method: 'DELETE',
      }),
    }),
    getBots: build.query<IBot[], void>({
      providesTags: ['Bot'],
      query: () => ({
        url: 'bot',
      }),
    }),
    createBot: build.mutation<IBot, { account: number; name: string; pair: string; timeframe: string }>({
      invalidatesTags: ['Bot'],
      query: ({ account, name, pair, timeframe }) => ({
        url: 'bot',
        method: 'POST',
        body: { account, name, pair, timeframe },
      }),
    }),
    updateBot: build.mutation<IBot, { botID: number; changes: IBotChange }>({
      invalidatesTags: ['Bot'],
      query: ({ botID, changes }) => ({
        url: `bot/${botID}/`,
        method: 'PUT',
        body: changes,
      }),
    }),
    deleteBot: build.mutation<IBot, number>({
      invalidatesTags: ['Bot'],
      query: (botID) => ({
        url: `bot/${botID}`,
        method: 'DELETE',
      }),
    }),
    getStats: build.query<ListResponse<IBotStats>, number>({
      query: (bot_id: number) => ({
        url: 'stats',
        params: { bot_id, limit: 10 },
      }),
    }),
    getTrades: build.query<ListResponse<IBotTrades>, number>({
      query: (bot_id: number) => ({
        url: 'bot',
        params: { bot_id, limit: 10 },
      }),
    }),
  }),
})

export const {
  useW3nonceMutation,
  useW3authMutation,
  useSignInMutation,
  useSingOutMutation,
  useGetUserQuery,
  useTelegramNonceMutation,
  useSetPasswordMutation,
  useSetEmailMutation,
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
