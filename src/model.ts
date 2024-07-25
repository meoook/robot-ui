export interface IPopupOptions {
  type: string // 'default' | 'success' | 'info' | 'warning' | 'error'
  text: string
  title?: string
  nofade?: boolean
}

export interface IPopup extends IPopupOptions {
  id: number
}

export interface ListResponse<T> {
  total: number
  data: T[]
}

export interface IApiUser {
  address: string
  email: string
  email_validated: boolean
  telegram_id: string
  locked: number
}

export interface ITimeFrame {
  timeframe: string
  name: string
}

export interface IPair {
  coin_base: string
  coin_quote: string
  symbol: string
  leverage: number
}

export interface IAccountCreate {
  name: string
  api_key: string
  api_secret: string
}

export interface IAccount {
  id: number
  name: string
  error: string
  trade: boolean
  loan: boolean
}

export interface IBotIndicator {
  orders: number
  circles: number
  base: number
  quote: number
  base_borrowed: number
  quote_borrowed: number
  liquidation: number
  balance: number
}

export interface IBotChange {
  name: string
  active: boolean
  next_month: boolean
  balance_limit: number
  circles_limit: number
  orders_limit: number
  delta: number
}

export interface IBot extends IBotChange {
  id: number
  account: number
  pair: string
  timeframe: string
  error: string
  locked: number
  indicator: IBotIndicator
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

export interface IBotTrades {
  side: string
  quantity: number
  price: number
  fee: number
  total: number
  time: number
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
