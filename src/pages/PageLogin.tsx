import { useState } from 'react'
import InputTextField from '../components/input-field'
import { useSignInMutation } from '../store/srv.api'

export default function PageLogin() {
  const [auth, setAuth] = useState({ email: '', password: '' })
  const [fetchSignIn, { isLoading, isError, error }] = useSignInMutation()
  const handleChange = (name: string, value: string) => setAuth({ ...auth, [name]: value })

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box column'>
        <h1 className='mb-2'>Авторизация</h1>
        <button className='btn green'>Login with metamask</button>
        <hr />
        <InputTextField
          name='email'
          onChange={handleChange}
          value={auth.email}
          icon='user'
          title='Ваша почта'
          ph='укажите почту'
          outColor='brand'
          disabled={isLoading}
        />
        <InputTextField
          name='password'
          type='password'
          onChange={handleChange}
          value={auth.password}
          icon='key'
          errorText={isError && (error as any)}
          title='Ваш пароль'
          ph='укажите пароль'
          outColor='brand'
          disabled={isLoading}
        />
        <div className='row center justify mt-2'>
          <button className='btn green' onClick={() => fetchSignIn(auth)} disabled={isLoading}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
