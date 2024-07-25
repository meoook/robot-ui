import style from './email.module.scss'
import { useState, useEffect } from 'react'
import { useSetEmailMutation } from '../../store/srv.api'
import InputTextField from '../input-field'

interface EmailProps {
  children?: React.ReactNode
  email?: string
}

export default function Email({ email }: EmailProps) {
  const [setEmail, { isSuccess, isError, error }] = useSetEmailMutation()
  const [editable, setEditable] = useState(!email)
  const [field, setField] = useState(email || '')

  useEffect(() => {
    if (isSuccess) setEditable(!isSuccess)
  }, [isSuccess])

  const handleChange = (name: string, value: string) => setField(value.trim())

  const changeMail = () => {
    setEmail(field.trim())
  }

  return (
    <>
      <h1>Email</h1>
      <div className={style.email}>
        <InputTextField
          name='email'
          onChange={handleChange}
          value={field}
          icon='user'
          title='Ваша почта'
          ph='Укажите почту'
          outColor='brand'
          errorText={isError && (error as any)}
          disabled={!editable}
        />
        {editable ? (
          <button className='btn green' onClick={changeMail} disabled={!field.trim()}>
            Set email
          </button>
        ) : (
          <button
            className='btn orange'
            onClick={() => {
              setEditable(true)
            }}>
            Edit
          </button>
        )}
      </div>
    </>
  )
}
