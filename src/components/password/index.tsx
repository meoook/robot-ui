import style from './password.module.scss'
import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { useSetPasswordMutation } from '../../store/srv.api'
import { addMessage } from '../../store/profile.slice'
import { IPopupOptions } from '../../model'
import InputTextField from '../input-field'

interface PasswordProps {
  children?: React.ReactNode
}

export default function Password(props: PasswordProps) {
  const dispatch = useAppDispatch()
  const [setPassword, { isSuccess, isLoading }] = useSetPasswordMutation()
  const [pwd, setPwd] = useState({ password: '', password2: '' })
  const [error, setError] = useState('')
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (isSuccess) {
      const msg: IPopupOptions = { type: 'success', text: 'Password changed', title: 'Test', nofade: false }
      dispatch(addMessage(msg))
      setPwd({ password: '', password2: '' })
    }
  }, [isSuccess, dispatch])

  const handleChange = (name: string, value: string) => {
    setPwd({ ...pwd, [name]: value })
    setError('')
  }

  const changeHidden = () => {
    setHidden((prev) => !prev)
  }

  const changePassword = () => {
    if (pwd.password !== pwd.password2) setError('Password does not match')
    else if (!pwd.password || !pwd.password2) setError(`Can't set empty password`)
    else setPassword(pwd.password)
  }

  const hiddenSyle = hidden ? `${style.password} ${style.password_hidden}` : style.password
  return (
    <>
      <div className={style.title}>
        <h1>Change password</h1>
        <button className='btn orange' onClick={changeHidden}>
          {hidden ? 'Show' : 'Hide'}
        </button>
      </div>
      <div className={hiddenSyle}>
        <InputTextField
          name='password'
          type='password'
          onChange={handleChange}
          value={pwd.password}
          icon='key'
          title='Ваш пароль'
          ph='укажите пароль'
          outColor='brand'
          disabled={isLoading}
        />
        <InputTextField
          name='password2'
          type='password'
          onChange={handleChange}
          value={pwd.password2}
          icon='key'
          errorText={error}
          title='Повторите пароль'
          ph='Повторите пароль'
          outColor='brand'
          disabled={isLoading}
        />
        <button className='btn green' disabled={!pwd.password || !pwd.password2 || isLoading} onClick={changePassword}>
          Update password
        </button>
      </div>
    </>
  )
}
