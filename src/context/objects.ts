export interface IPopup {
  id: number
  type: string
  text: string
  title?: string
}

export interface IUser {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export interface IAccount {
  id: number
  name: string
  apiKey?: string
  apiSecret?: string
}

export interface IBot {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export interface IPair {
  id: number,
  coin_base: string,
  coin_quote: string,
  symbol: string,
  enabled: boolean,
  spot: boolean,
  margin: boolean,
  futures: boolean,
  leverage: number,
  qty_min: number,
  qty_max: number,
  qty_step: number,
  price_min: number,
  price_max: number,
  price_step: number
}

export interface IState {
  loading: boolean
  msgs: IPopup[]
  timeframes: string[]
  user: IUser
  pairs: IPair[]
  accounts: IAccount[]
  bots: IBot[]
}
