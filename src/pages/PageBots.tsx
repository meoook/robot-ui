import React, { useContext, useState } from 'react'
import { ModalContext } from '../store/ModalContext'
import Topbar from '../components/topbar'
import Modal from '../components/modal'
import Bot from '../components/bot'
import {
  useCreateBotMutation,
  useGetAccountsQuery,
  useGetBotsQuery,
  useGetPairsQuery,
  useGetTimeframesQuery,
} from '../store/srv.api'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBots(props: PageBotsProps) {
  const { data: bots } = useGetBotsQuery()
  const { data: accounts } = useGetAccountsQuery()
  const canAdd = accounts?.filter((acc) => acc.trade)

  const { modal, open } = useContext(ModalContext)

  return (
    <>
      {modal && (
        <Modal title='Create bot'>
          <ModalAddBot />
        </Modal>
      )}
      <Topbar>
        <div>
          <button className='btn green' onClick={open} disabled={!Boolean(canAdd)}>
            Add bot
          </button>
        </div>
      </Topbar>
      {bots?.map((bot) => (
        <Bot key={bot.id} bot={bot} />
      ))}
      {bots?.length === 0 && <div>Add bot to continue</div>}
    </>
  )
}

function ModalAddBot() {
  const { data: pairs } = useGetPairsQuery()
  const { data: timeframes } = useGetTimeframesQuery()
  const { data: accounts } = useGetAccountsQuery()
  const [botAdd] = useCreateBotMutation()
  const { close } = useContext(ModalContext)
  const [params, setParams] = useState({
    name: '',
    pair: '',
    timeframe: '',
    account: accounts?.filter((acc) => acc.trade)[0].id || 0,
  })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value.trim() })
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (!params.name.trim()) {
      setError('Enter bot name')
      return
    }
    if (!params.pair.trim()) {
      setError('Enter pair')
      return
    }
    if (!params.timeframe.trim()) {
      setError('Enter timeframe')
      return
    }
    const timeframe = timeframes?.find((e) => e.name === params.timeframe)?.timeframe
    if (timeframe) botAdd(params)
    else {
      setError(`Invalid timeframe ${params.timeframe}`)
      return
    }
    close()
    // TODO: callback redirect
  }

  return (
    <>
      <label>bot name</label>
      <input type='text' name='name' onChange={onChange} />
      <label>Account</label>
      <Dropdown
        name='account'
        choices={accounts?.map((e) => e.name) || []}
        selected={`${params.account}`}
        onChange={onChange}
      />
      <label>pair</label>
      <Dropdown name='pair' choices={pairs?.map((e) => e.symbol) || []} selected={params.pair} onChange={onChange} />
      <label>timeframe</label>
      <Dropdown
        name='timeframe'
        choices={timeframes?.map((e) => e.name) || []} // FIXME
        selected={params.timeframe}
        onChange={onChange}
      />
      <small className='red'>{error}&nbsp;</small>

      <div className='row justify'>
        <div />
        <button className='btn green' onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  )
}

interface DropdownProps {
  children?: React.ReactNode
  name: string
  choices: string[]
  selected: string
  onChange: (event: React.ChangeEvent<any>) => void
}

function Dropdown(props: DropdownProps) {
  return (
    <div>
      <select name={props.name} value={props.selected} onChange={props.onChange}>
        <option value=''>Select {props.name}</option>
        {props.choices.map((e) => (
          <option value={e} key={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  )
}
