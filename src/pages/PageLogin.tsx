import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { useSignInMutation, useW3nonceMutation, useW3authMutation } from '../store/srv.api'
import { getAddress, handleSignMessage } from '../store/w3.slice'
import { addMessage } from '../store/profile.slice'
import InputTextField from '../components/input-field'

export default function PageLogin() {
  const [auth, setAuth] = useState({ email: '', password: '' })
  const [disabled, setDisabled] = useState(false)
  const dispatch = useAppDispatch()
  const [fetchSignIn, { isLoading, isError, error }] = useSignInMutation()
  const [getNonce] = useW3nonceMutation()
  const [authW3] = useW3authMutation()

  const signMessageAndAuthenticate = async () => {
    setDisabled(true)
    try {
      const { address, chain } = await dispatch(getAddress()).unwrap()
      if (!address || !chain) return
      const msg = await getNonce({ chain, address })
      if (!msg.data) return
      const { message, signature } = await dispatch(handleSignMessage(msg.data)).unwrap()
      await authW3({ message, signature })
    } catch (err: any) {
      console.log('THIS IS ERR', err)
      const text = err.message ? err.message : err
      dispatch(addMessage({ type: 'error', text, title: 'Web3 Error', nofade: false }))
    }
    setDisabled(false)
  }

  const handleChange = (name: string, value: string) => setAuth({ ...auth, [name]: value })

  return (
    <div className='column center middle max-h'>
      <div className='shadow-box column'>
        <h1 className='mb-2'>Авторизация</h1>
        <button className='btn green' onClick={signMessageAndAuthenticate} disabled={disabled || isLoading}>
          Login with web3
        </button>
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
          helpText='some text'
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
          <button className='btn green' onClick={() => fetchSignIn(auth)} disabled={disabled || isLoading}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
