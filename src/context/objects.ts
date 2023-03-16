export interface IPopup {
  id: number
  type: string
  text: string
  title: string
  nofade?: boolean
}

export interface IUser {
  username: string
  email: string
  admin: boolean
}

export interface IAccount {
  id: number
  error: string
  spot: boolean
  margin: boolean
  futures: boolean
  apiKey?: string
  apiSecret?: string
}

export interface IBot {
  id: number
  account: number
  pair: string
  timeframe: string
  name: string
  active: boolean
  error: string
  balance_limit: number
  circles_limit: number
  orders_limit: number
  peak_delta: number
}

export interface IPair {
  coin_base: string
  coin_quote: string
  symbol: string
  leverage: number
}

export interface IState {
  loading: boolean
  msgs: IPopup[]
  timeframes: string[]
  user?: IUser
  token?: string
  pairs: IPair[]
  accounts: IAccount[]
  bots: IBot[]
}

export interface IAppContext extends IState {
  addMsg: (type: string, text: string, title: string) => void
  delMsg: (id: number) => void
  signin: (username: string, password: string, callback: VoidFunction) => void
  signout: VoidFunction
  // register: VoidFunction
  accountAdd: VoidFunction
  accountRemove: VoidFunction
  botAdd: VoidFunction
  botRemove: VoidFunction
  botUpdate: VoidFunction
}
