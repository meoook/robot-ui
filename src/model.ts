export interface ListResponse<T> {
  total: number
  data: T[]
}

export interface IApiUser {
  address: string
  email: string
  telegram_id: string
  alert_methods: string
  company_name: string
}

export interface IApiAgreement {
  id: number
  contract: number
  company: string
  employee: string
  name: string
  status: string
  payment_amount: string
  payment_period: string
  period_passed: number
  period_percents: string[]
  time_end: string
  time_finished: string | null
  time_start: string
  tx_id: string
}

export interface IApiInvoice {
  id: number
  agreement: number
  amount: string
  status: string
  penalty: string
  pay_until: string
  created: string
}

export interface IApiTransaction {
  id: number
  agreement: number
  amount: string
  time_payed: string
  tx_id: string
}
