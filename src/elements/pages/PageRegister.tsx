import { useState, useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import InputTextField from '../components/input-fields'

// TODO: COMPONENT AND REDUCER NOT DONE

export default function PageRegister() {
  const { register } = useContext(AppContext)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const onRegister = () => {
    register(credentials)
  }
  const onChange = (name: string, value: string) => setCredentials({ ...credentials, [name]: value })

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box column'>
        <h1 className='mb-2'>Регистрация</h1>
        <InputTextField
          name='email'
          onChange={onChange}
          value={credentials.email}
          icon='user'
          title='Ваша почта'
          ph='Укажите почту'
          outColor='brand'
        />
        <InputTextField
          name='password'
          type='password'
          onChange={onChange}
          value={credentials.password}
          icon='key'
          title='Ваш пароль'
          ph='Укажите пароль'
          outColor='brand'
        />
        <div className='row center justify mt-2'>
          <div>&nbsp;</div>
          <button className='btn green' onClick={onRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
