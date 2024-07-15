import style from './email.module.scss'
import { useState } from 'react'
import InputTextField from '../input-field'

interface EmailProps {
  children?: React.ReactNode
  email?: string
}

export default function Email({ email }: EmailProps) {
  const [active, setActive] = useState(!email)
  const [field, setField] = useState(email || '')

  const onChange = (name: string, value: string) => setField(value)
  const emailSet = () => {
    const x = { email: field, password: '' }
  }

  return (
    <>
      <h1>Email</h1>
      {Boolean(email) && (
        <div className='row'>
          <span>{email}</span>
          <button
            className='btn'
            onClick={() => {
              setActive((prev: boolean) => !prev)
            }}>
            {active ? '/\\' : '\\/'}
          </button>
        </div>
      )}
      <div className={`${style.dropdown}${active ? '' : ` ${style.hidden}`}`}>
        <InputTextField
          name='email'
          onChange={onChange}
          value={field}
          icon='user'
          title='Ваша почта'
          ph='Укажите почту'
          outColor='brand'
        />
        <button className='btn green' onClick={emailSet}>
          Set email
        </button>
      </div>
    </>
  )
}
