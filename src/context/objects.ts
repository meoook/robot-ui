export interface IPopupOptions {
  type: string
  text: string
  title?: string
  nofade?: boolean
}

export interface IPopup extends IPopupOptions {
  id: number
}

export interface Web3Message {
  address: string
  nonce: string
  domain: string
  statement: string
  uri: string
  chainId: number
  timeout: number
}

export interface IUser {
  address: string
  email: string
  admin: boolean
}

export interface IAccount {
  id: number
  error: string
  trade: boolean
  loan: boolean
  futures: boolean
  apiKey?: string
  apiSecret?: string
}

export interface IBotCfg {
  name: string
  active: boolean
  next_month: boolean
  balance_limit: number
  circles_limit: number
  orders_limit: number
  delta: number
}

export interface IBot extends IBotCfg {
  id: number
  account: number
  pair: string
  timeframe: string
  error: string
}

export type BotList = { [key: number]: IBot }

export interface IPair {
  coin_base: string
  coin_quote: string
  symbol: string
  leverage: number
}

export interface ITimeFrame {
  timeframe: string
  name: string
}

export interface IBotStats {
  bot: number
  month: string
  quantity: number
  buy: number
  sell: number
  fee: number
  profit: number
  bot_fee: number
}

export interface IState {
  loading: boolean
  msgs: IPopup[]
  timeframes: ITimeFrame[]
  user?: IUser
  token?: string
  // pairs: IPair[]
  pairs: string[]
  accounts: IAccount[]
  bots: IBot[]
  stats: IBotStats[]
}

export interface IAppContext extends IState {
  addMsg: (type: string, text: string, title?: string, nofade?: boolean) => void
  delMsg: (id: number) => void
  signin: (username: string, password: string, callback: VoidFunction) => void
  signout: VoidFunction
  web3login: VoidFunction
  register: ({ email, password }: { email: string; password: string }) => void
  accountAdd: (apiKey: string, apiSecret: string) => void
  accountRemove: (accountID: number) => void
  botAdd: (account: number, name: string, pair: string, timeframe: string) => void
  botRemove: (botID: number) => void
  botUpdate: (botID: number, botCfg: IBotCfg) => void
}
