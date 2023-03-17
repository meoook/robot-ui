import axios, { AxiosError } from 'axios'
import { useEffect, useReducer } from 'react'
import * as actions from './actionTypes'
import { AppContext } from './AppContext'
import { appReducer } from './appReducer'
import { IPopup } from './objects'

const getNextId = (messageList: IPopup[]) => {
  if (messageList.length === 0) return 0
  else return messageList[messageList.length - 1].id + 1
}

// const URL = process.env.REACT_APP_API_URL
const URL = 'http://127.0.0.1:8000/api'

export const AppState = ({ children }: { children: React.ReactNode }) => {
  const initialState = {
    loading: false,
    token: localStorage.getItem('token') || undefined,
    msgs: [],
    timeframes: [],
    user: undefined,
    pairs: [],
    accounts: [],
    bots: [],
  }
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    init()
    // eslint-disable-next-line
  }, [])

  const config = (token?: string) => {
    const bearer = token ? token : state.token
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
      },
    }
  }

  const handleError = (err: AxiosError, text: string, title: string = 'API error') => {
    if (!err.response) addMsg('warning', 'Connection error')
    else addMsg('warning', text)
  }

  const loading = (loadState: boolean) => dispatch({ type: actions.INIT_LOADER, payload: loadState })
  const addMsg = (type: string, text: string, title: string = '') =>
    dispatch({ type: actions.POPUP_ADD, payload: { id: getNextId(state.msgs), text, title, type } })
  const delMsg = (id: number) => dispatch({ type: actions.POPUP_REMOVE, payload: +id })

  const init = async () => {
    if (!state.user && state.token) {
      await sign(state.token)
    } else if (state.user && !state.token) {
      dispatch({ type: actions.USER_LOGOUT, payload: undefined }) // TODO: not correct
    }
  }
  // Auth
  const sign = async (token: string) => {
    if (!token) return
    loading(true)
    await axios
      .get(`${URL}/user`, config(token))
      .then((res) => {
        dispatch({ type: actions.USER_VALID, payload: { user: res.data, token: token } })
      })
      .then(async () => {
        await loadPairs(token)
        await loadTimeframs(token)
        await accountList(token)
        await botList(token)
      })
      .catch((err: AxiosError) => {
        if (err.response) {
          dispatch({ type: actions.USER_LOGOUT, payload: undefined }) // go to login page
          localStorage.removeItem('token')
        } else {
          handleError(err, 'Connection error')
        }
      })
    loading(false)
  }
  const signin = async (username: string, password: string, callback: Function) => {
    if (state.token && state.user) return
    await axios
      .post(`${URL}/auth/login/`, { username, password })
      .then(async (res) => {
        localStorage.setItem('token', res.data.token)
        await sign(res.data.token)
        callback()
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Wrong username or password')
      })
  }
  const signout = async () => {
    localStorage.removeItem('token')
    if (!state.token) return
    await axios.post(`${URL}/auth/logout/`, null, config()).catch((err: AxiosError) => {
      handleError(err, 'Logout error')
    })
    dispatch({ type: actions.USER_LOGOUT, payload: undefined })
  }
  // Options
  const loadPairs = async (token: string) => {
    await axios
      .get(`${URL}/pair`, config(token))
      .then((res) => {
        dispatch({ type: actions.PAIRS_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load pairs')
      })
  }
  const loadTimeframs = async (token: string) => {
    await axios
      .get(`${URL}/timeframe`, config(token))
      .then((res) => {
        dispatch({ type: actions.TIMEFRAMES_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load timeframes')
      })
  }
  // Accounts
  const accountList = async (token?: string) => {
    await axios
      .get(`${URL}/account`, config(token))
      .then((res) => {
        dispatch({ type: actions.ACCOUNT_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load accounts')
      })
  }
  const accountAdd = async (apiKey: string, apiSecret: string) => {
    console.log(`Try create account ${apiKey} ${apiSecret}`)
    // TODO: timeout - refresh later
    await axios
      .post(`${URL}/account/`, { api_key: apiKey, api_secret: apiSecret }, config())
      .then(async (res) => {
        console.log('Response', res.data)
        dispatch({ type: actions.ACCOUNT_ADD, payload: res.data })
        setTimeout(() => {
          accountList()
        }, 4500)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to create account')
        console.log(`Error - ${err.message}`)
        console.warn(err)
      })
  }
  // Bots
  const botList = async (token?: string) => {
    await axios
      .get(`${URL}/bot`, config(token))
      .then((res) => {
        dispatch({ type: actions.BOT_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load bots')
      })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        addMsg,
        delMsg,
        signin,
        signout,
        // register,
        accountAdd,
        accountRemove: () => {},
        botAdd: () => {},
        botRemove: () => {},
        botUpdate: () => {},
      }}>
      {children}
    </AppContext.Provider>
  )
}
