import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IProfileState {
  token: string | null
  loading: boolean
  error: string | null
}

const LOCAL_STORAGE_TOKEN_KEY: string = 'token'

const initialState: IProfileState = {
  token: localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  loading: false,
  error: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, action.payload)
    },
    destroyToken: (state, action: PayloadAction<void>) => {
      state.token = null
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
    },
  },
})

export const profileReducer = profileSlice.reducer
export const { setLoading, setToken, destroyToken } = profileSlice.actions
