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

export interface IBotCfg {
  name: string
  active: boolean
  balance_limit: number
  circles_limit: number
  orders_limit: number
  peak_delta: number
}

export interface IBot extends IBotCfg {
  id: number
  account: number
  pair: string
  timeframe: string
  error: string
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
  accountAdd: (apiKey: string, apiSecret: string) => void
  accountRemove: (accountID: number) => void
  botAdd: (name: string, pair: string, timeframe: string) => void
  botRemove: (botID: number) => void
  botUpdate: (botID: number, botCfg: IBotCfg) => void
}
