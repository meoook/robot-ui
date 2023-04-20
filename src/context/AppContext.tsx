import { createContext } from 'react'
import { IAppContext } from './objects'

export const AppContext = createContext<IAppContext>({
  loading: false,
  msgs: [],
  timeframes: [],
  pairs: [],
  accounts: [],
  bots: [],
  stats: [],
  addMsg: () => {},
  delMsg: () => {},
  signin: () => {},
  signout: () => {},
  web3login: () => {},
  register: () => {},
  accountAdd: () => {},
  accountRemove: () => {},
  botAdd: () => {},
  botRemove: () => {},
  botUpdate: () => {},
})
