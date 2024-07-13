import Web3 from 'web3'
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { useState, useEffect, useReducer } from 'react'
import * as actions from './actionTypes'
import { AppContext } from './AppContext'
import { appReducer } from './appReducer'
import { IBotCfg, Web3Message } from './objects'

const URL = process.env.REACT_APP_BACKEND_URL

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
    stats: [],
  }
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [web3, setWeb3] = useState<Web3>()

  useEffect(() => {
    if ((window as any).ethereum) {
      const web3Instance = new Web3((window as any).ethereum)
      setWeb3(web3Instance)
    } else {
      addMsg('warning', 'No Ethereum provider detected') // TODO: download provider page
    }
  }, [])

  useEffect(() => {
    init()
    // eslint-disable-next-line
  }, [])

  const config = (token?: string): AxiosRequestConfig => {
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
  const addMsg = async (type: string, text: string, title?: string, nofade?: boolean) =>
    dispatch({ type: actions.POPUP_ADD, payload: { text, title, type, nofade } })
  const delMsg = (id: number) => dispatch({ type: actions.POPUP_REMOVE, payload: +id })

  const init = async () => {
    if (!state.user && state.token) {
      await sign(state.token)
    } else if (state.user && !state.token) {
      dispatch({ type: actions.USER_LOGOUT, payload: undefined }) // TODO: not correct
    }
  }

  // Web3
  const handleSignMessage = async ({ address, nonce, domain, statement, uri, chainId, timeout }: Web3Message) => {
    try {
      const message: string = `${domain} wants you to sign in with your\nEthereum account: ${address}\n\n${statement}\n\nURI: ${uri}\nChain ID: ${chainId}\nNonce: ${nonce}\nTimeout: ${timeout}`
      const signature: string = await web3!.eth.personal.sign(message, address, '')
      return { message, signature }
    } catch (err) {
      addMsg('error', 'You need to sign the message to be able to log in', 'Web3')
    }
  }

  const handleAuthenticate = async ({ message, signature }: { message: string; signature: string }) =>
    await axios.post(`${URL}/auth/web3`, { message, signature }).then(async (res: AxiosResponse) => {
      localStorage.setItem('token', res.data.token)
      await sign(res.data.token)
    })

  const web3login = async () => {
    try {
      await (window as any).ethereum.enable()
    } catch (err: any) {
      addMsg('warning', err.message, 'Web3')
      return
    }
    if (!web3) {
      addMsg('error', 'Blockchain provider not found', 'Web3')
      return
    }
    let chainId: bigint | null = null
    try {
      chainId = await web3.eth.getChainId()
    } catch (error: any) {
      addMsg('warning', error.message, 'Web3')
      return
    }
    if (!chainId) {
      addMsg('error', 'Failed to get ChainID', 'Web3')
      return
    }
    const coinbase = await web3.eth.getCoinbase()
    if (!coinbase) {
      addMsg('warning', 'Please activate MetaMask first', 'Web3')
      return
    }
    const address = coinbase.toLowerCase()
    await axios
      .get(`${URL}/auth/web3`, { params: { chain: chainId, address } })
      .then(async (res: AxiosResponse) => {
        const signed: { message: string; signature: string } | undefined = await handleSignMessage(res.data)
        if (signed) await handleAuthenticate(signed)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Web3 sign in error')
      })
  }

  // Auth
  const sign = async (token: string) => {
    if (!token) return
    loading(true)
    await axios
      .get(`${URL}/auth/user`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.USER_VALID, payload: { user: res.data, token: token } })
      })
      .then(async () => {
        await loadPairs(token)
        await loadTimeframs(token)
        await accountList(token)
        await botList(token)
        await loadStats(token)
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
      .then(async (res: AxiosResponse) => {
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
  const register = async ({ email, password }: { email: string; password: string }) => {
    await axios
      .post(`${URL}/auth/register/`, { email, password })
      .then(async (res: AxiosResponse) => {
        localStorage.setItem('token', res.data.token)
        await sign(res.data.token)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to register')
      })
  }
  // Options
  const loadPairs = async (token: string) => {
    await axios
      .get(`${URL}/pair`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.PAIRS_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load pairs')
      })
  }
  const loadTimeframs = async (token: string) => {
    await axios
      .get(`${URL}/timeframe`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({
          type: actions.TIMEFRAMES_REFRESH,
          payload: res.data.map((e: string[]) => ({ timeframe: e[0], name: e[1] })),
        })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load timeframes')
      })
  }
  const loadStats = async (token?: string) => {
    await axios
      .get(`${URL}/stats`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.BOT_STATS, payload: res.data.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load stats')
      })
  }
  // Accounts
  const accountList = async (token?: string) => {
    await axios
      .get(`${URL}/account`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.ACCOUNT_LIST, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load accounts')
      })
  }
  const accountGet = async (accountID: string) => {
    await axios
      .get(`${URL}/account/${accountID}`, config())
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.ACCOUNT_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load account')
      })
  }
  const accountAdd = async (apiKey: string, apiSecret: string) => {
    await axios
      .post(`${URL}/account/`, { api_key: apiKey, api_secret: apiSecret }, config())
      .then(async (res: AxiosResponse) => {
        dispatch({ type: actions.ACCOUNT_ADD, payload: res.data })
        setTimeout(async () => {
          await accountGet(res.data.id)
        }, 4500)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to create account')
      })
  }
  const accountRemove = async (accountID: number) => {
    await axios
      .delete(`${URL}/account/${accountID}/`, config())
      .then(async (res: AxiosResponse) => {
        dispatch({ type: actions.ACCOUNT_REMOVE, payload: accountID })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to delete account')
      })
  }
  // Bots
  const botList = async (token?: string) => {
    await axios
      .get(`${URL}/bot`, config(token))
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.BOT_LIST, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load bots')
      })
  }
  const botGet = async (botID: string) => {
    await axios
      .get(`${URL}/bot/${botID}`, config())
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.BOT_REFRESH, payload: res.data })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to load bot')
      })
  }
  const botUpdate = async (botID: number, botCfg: IBotCfg) => {
    await axios
      .put(`${URL}/bot/${botID}/`, botCfg, config())
      .then((res: AxiosResponse) => {
        dispatch({ type: actions.BOT_REFRESH, payload: res.data })
        setTimeout(async () => {
          await botGet(res.data.id)
          await accountGet(res.data.account)
        }, 4500)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to update bot')
      })
  }
  const botAdd = async (account: number, name: string, pair: string, timeframe: string) => {
    await axios
      .post(`${URL}/bot/`, { account, name, pair, timeframe }, config())
      .then(async (res: AxiosResponse) => {
        dispatch({ type: actions.BOT_ADD, payload: res.data })
        setTimeout(async () => {
          await botGet(res.data.id)
          await loadStats()
        }, 4500)
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to create bot')
      })
  }
  const botRemove = async (botID: number) => {
    await axios
      .delete(`${URL}/bot/${botID}/`, config())
      .then(async (res: AxiosResponse) => {
        dispatch({ type: actions.BOT_REMOVE, payload: botID })
      })
      .catch((err: AxiosError) => {
        handleError(err, 'Failed to delete bot')
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
        web3login,
        register,
        accountAdd,
        accountRemove,
        botAdd,
        botRemove,
        botUpdate,
      }}>
      {children}
    </AppContext.Provider>
  )
}
