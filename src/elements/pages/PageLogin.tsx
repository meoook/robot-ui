import { useState, useContext } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import InputTextField from '../components/input-fields'

export default function PageLogin() {
  let navigate = useNavigate()
  let location = useLocation()
  let from = location.state?.from?.pathname || '/'

  const { signin } = useContext(AppContext)
  const [auth, setAuth] = useState({ email: '', password: '' })

  const signIn = () => {
    signin(auth.email, auth.password, () => {
      navigate(from, { replace: true })
    })
  }

  const handleChange = (name: string, value: string) => setAuth({ ...auth, [name]: value })

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box column'>
        <h1 className='mb-2'>Авторизация</h1>
        <InputTextField
          name='email'
          onChange={handleChange}
          value={auth.email}
          icon='user'
          title='Ваша почта'
          ph='укажите почту'
          outColor='brand'
        />
        <InputTextField
          name='password'
          type='password'
          onChange={handleChange}
          value={auth.password}
          icon='key'
          title='Ваш пароль'
          ph='укажите пароль'
          outColor='brand'
        />
        <div className='row center justify mt-2'>
          <NavLink to={'/reg'} className='underline'>
            Регистрация
          </NavLink>
          <button className='btn green' onClick={signIn}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
