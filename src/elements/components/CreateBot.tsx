import axios from 'axios'
import { useState } from 'react'
import { IBot } from '../../objects/md_pair'
import ErrorMessage from './ErrorMessage'

const botCreateData: IBot = {
  name: '',
}

interface CreateBotProps {
  onCreate: (bot: IBot) => void
}

export default function CreateBot({ onCreate }: CreateBotProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault()

    if (value.trim().length === 0) {
      setError('Please enter valid title')
      return
    }

    botCreateData.name = value

    const response = await axios.post<IBot>('http://localhost:8000/api/bot/', botCreateData)

    onCreate(response.data)
  }
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setValue(event.target.value)
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type='text'
        className='border py-2 px-4 mb-2 w-full outline-0'
        placeholder='Enter bot name'
        autoFocus={true}
        value={value}
        onChange={changeHandler}
      />
      {error && <ErrorMessage error={error} />}
      <button type='submit' className='py-2 px-4 border bg-yellow-400 hover:text-white'>
        Create
      </button>
    </form>
  )
}
