import axios from 'axios'
import { createContext, useState } from 'react'
import { IUser } from './objects'

interface IAppContext {
  user?: IUser
  singin: (username: string, password: string) => Promise<boolean>
  signout: () => void
}

export const AppContext = createContext<IAppContext>({
  singin: async (username: string, password: string) => false,
  signout: () => {},
})

const URL = process.env.REACT_APP_API_URL

export const AppContextState = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState<IUser>()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${state.user.token || token}`,
    },
  }

  const singin = async (username: string, password: string): Promise<boolean> => {
    loading()
    let status = false
    await axios
      .post(`${URL}/auth/auth`, { username, pa }) // {key: <value>}
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        dispatch({ type: USER_ACC_VALID, payload: res.data })
        status = true
      })
      .catch((err) => {
        addMsg(connectErrMsg(err, 'Неверное сочетание логина и пароля'))
      })
    setUser(true)
    return status
  }
  const signout = () => setUser(false)
  return <AppContext.Provider value={{ user, singin, signout }}>{children}</AppContext.Provider>
}
