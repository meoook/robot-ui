import * as actions from './actionTypes'
import { IPopup } from './objects'

const getNextId = (messageList: IPopup[]) => {
  if (messageList.length === 0) return 0
  else return messageList[messageList.length - 1].id + 1
}


interface Action {
   type: string
   payload: number 
  }
  
type ActionHandlersMap = Record<string, (state: State, ...args: any[]) => State>;

const handlers: ActionHandlersMap = {
  [actions.INIT_LOADER]: (state: State, { payload = true }) => ({ ...state, loading: payload }),
  [actions.POPUP_MESSAGE_ADD]: (state, { payload }) => ({
    ...state,
    msgs: [...state.msgs, { id: getNextId(state.msgs), ...payload }],
  }),
  [actions.POPUP_MESSAGE_REMOVE]: (state, { payload }) => ({
    ...state,
    msgs: state.msgs.filter((msg) => msg.id !== payload),
  }),
  [actions.LANGUAGES_REFRESH]: (state, { payload }) => ({ ...state, languages: payload }),
  [actions.USER_VALID]: (state, { payload }) => ({ ...state, user: payload }),
  [actions.USER_LOGOUT]: (state) => ({ ...nullState }),
  [actions.USER_REGISTER]: (state) => ({ ...nullState }),
  [actions.USER_PROJECT_REFRESH]: (state, { payload }) => ({ ...state, projects: payload, loading: false }),
  [actions.USER_PROJECT_ADD]: (state, { payload }) => ({ ...state, projects: [...state.projects, payload], loading: false }),
  [actions.USER_PROJECT_REMOVE]: (state, { payload }) => ({
    ...state,
    projects: state.projects.filter((prj) => prj.save_id !== payload),
  }),
  [actions.PRJ_FOLDER_REFRESH]: (state, { payload }) => ({ ...state, folders: payload }),
  [actions.PRJ_FOLDER_ADD]: (state, { payload }) => ({ ...state, folders: [...state.folders, payload] }),
  [actions.PRJ_FOLDER_REMOVE]: (state, { payload }) => ({
    ...state,
    folders: state.folders.filter((fldr) => fldr.id !== payload),
  }),
  DEFAULT: (state) => state,
}

export const appReducer = (state: State, action: Action): State => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}
