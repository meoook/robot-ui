import { useState, useContext } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const PageLogin = () => {
  let navigate = useNavigate()
  let location = useLocation()
  let from = location.state?.from?.pathname || '/'

  const { signin } = useContext(AppContext)
  const [auth, setAuth] = useState({ username: '', password: '' })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAuth({ ...auth, [event.target.name]: event.target.value })
  const handleKeyBoard = (event: React.KeyboardEvent) => event.key === 'Enter' && handleSubmit()

  const handleSubmit = () => {
    signin(auth.username, auth.password, () => {
      navigate(from, { replace: true })
    })
  }

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box col col-3'>
        <h1>Авторизация</h1>
        <label>Ваш логин</label>
        <input className='m-1' name='username' type='text' onChange={onChange} onKeyDown={handleKeyBoard} />
        <label>Ваш пароль</label>
        <input className='m-1' name='password' type='password' onChange={onChange} onKeyDown={handleKeyBoard} />
        <div className='row center justify'>
          <NavLink to={'/reg'} className='underline'>
            Регистрация
          </NavLink>
          <button className='btn green' onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageLogin
