import { createContext } from 'react'
import { IAppContext } from './objects'

export const AppContext = createContext<IAppContext>({
  loading: false,
  msgs: [],
  timeframes: [],
  pairs: [],
  accounts: [],
  bots: [],
  addMsg: () => {},
  delMsg: () => {},
  signin: () => {},
  signout: () => {},
  accountAdd: () => {},
  accountRemove: () => {},
  botAdd: () => {},
  botRemove: () => {},
  botUpdate: () => {},
})
