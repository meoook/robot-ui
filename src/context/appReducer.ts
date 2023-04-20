import * as actions from './actionTypes'
import { IState, IPopup, IUser, ITimeFrame, IAccount, IBot, IBotStats, IPopupOptions } from './objects'

type ActionHandlersMap = Record<string, (state: IState, action: IAction<any>) => IState>

interface IAction<T> {
  type: string
  payload: T
}

interface IActionUser {
  user: IUser
  token: string
}

const getNextId = (messageList: IPopup[]) => {
  if (messageList.length === 0) return 0
  else return messageList[messageList.length - 1].id + 1
}

const handlers: ActionHandlersMap = {
  [actions.INIT_LOADER]: (state, { payload }: IAction<boolean>) => ({ ...state, loading: payload }),
  [actions.POPUP_ADD]: (state, { payload }: IAction<IPopupOptions>) => ({
    ...state,
    msgs: [...state.msgs, { id: getNextId(state.msgs), ...payload }],
  }),
  [actions.POPUP_REMOVE]: (state, { payload }) => ({ ...state, msgs: state.msgs.filter((msg) => msg.id !== payload) }),
  [actions.PAIRS_REFRESH]: (state, { payload }: IAction<string[]>) => ({ ...state, pairs: payload }),
  [actions.TIMEFRAMES_REFRESH]: (state, { payload }: IAction<ITimeFrame[]>) => ({ ...state, timeframes: payload }),
  [actions.USER_VALID]: (state, { payload }: IAction<IActionUser>) => ({
    ...state,
    user: payload.user,
    token: payload.token,
  }),
  [actions.USER_LOGOUT]: (state) => ({ ...state, user: undefined, token: undefined }),
  [actions.USER_REGISTER]: (state) => ({ ...state, user: undefined }),
  [actions.ACCOUNT_LIST]: (state, { payload }: IAction<IAccount[]>) => ({
    ...state,
    accounts: payload.sort((a, b) => a.id - b.id),
  }),
  [actions.ACCOUNT_REFRESH]: (state, { payload }: IAction<IAccount>) => ({
    ...state,
    accounts: state.accounts
      .map((accounts) => (accounts.id === payload.id ? payload : accounts))
      .sort((a, b) => a.id - b.id),
  }),
  [actions.ACCOUNT_ADD]: (state, { payload }: IAction<IAccount>) => ({
    ...state,
    accounts: state.accounts ? [...state.accounts, payload].sort((a, b) => a.id - b.id) : [payload],
  }),
  [actions.ACCOUNT_REMOVE]: (state, { payload }: IAction<number>) => ({
    ...state,
    accounts: state.accounts?.filter((acc) => acc.id !== payload),
  }),
  [actions.BOT_LIST]: (state, { payload }: IAction<IBot[]>) => ({
    ...state,
    bots: payload.sort((a, b) => a.id - b.id),
  }),
  [actions.BOT_REFRESH]: (state, { payload }: IAction<IBot>) => ({
    ...state,
    bots: state.bots.map((bot) => (bot.id === payload.id ? payload : bot)).sort((a, b) => a.id - b.id),
  }),
  [actions.BOT_ADD]: (state, { payload }: IAction<IBot>) => ({
    ...state,
    bots: state.bots ? [...state.bots, payload].sort((a, b) => a.id - b.id) : [payload],
  }),
  [actions.BOT_REMOVE]: (state, { payload }: IAction<number>) => ({
    ...state,
    bots: state.bots?.filter((bot) => bot.id !== payload),
  }),
  [actions.BOT_STATS]: (state, { payload }: IAction<IBotStats[]>) => ({ ...state, stats: payload }),
  DEFAULT: (state) => state,
}

export const appReducer = (state: IState, action: IAction<any>): IState => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}
