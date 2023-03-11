import { useState, useContext } from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const PageLogin = () => {
  const { singin } = useContext(AppContext)
  const [auth, setAuth] = useState({ username: '', password: '' })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAuth({ ...auth, [event.target.name]: event.target.value })
  const handleKeyBoard = (event: React.KeyboardEvent) => event.key === 'Enter' && singin(auth)

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box col col-3'>
        <h1>Авторизация</h1>
        <label>Ваш логин</label>
        <input className='m-1' name='username' type='text' onChange={onChange} onKeyPress={handleKeyBoard} />
        <label>Ваш пароль</label>
        <input className='m-1' name='password' type='password' onChange={onChange} onKeyPress={handleKeyBoard} />
        <div className='row center justify'>
          <NavLink to={'/reg'} className='underline'>
            Регистрация
          </NavLink>
          <button className='btn green' onClick={singin.bind(this, auth)}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageLogin
