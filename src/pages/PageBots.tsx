import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ModalContext } from '../store/ModalContext'
import Container from '../components/container'
import Topbar from '../components/topbar'
import Modal from '../components/modal'
import Bot from '../components/bot'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBots(props: PageBotsProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accounts, bots, accountRemove } = useContext(AppContext)
  const { modal, open } = useContext(ModalContext)
  const accountBots = bots?.filter((bot) => bot.account === Number(id))
  const account = accounts.find((a) => a.id === Number(id))

  const handleDelete = () => {
    accountRemove(Number(id))
    navigate('/accounts', { replace: true })
  }

  return (
    <Container>
      {modal && (
        <Modal title='Create bot'>
          <ModalAddBot account={Number(id)} />
        </Modal>
      )}
      <Topbar>
        <div>
          <button className='btn red' onClick={handleDelete}>
            Remove account
          </button>
          <button className='btn green' onClick={open} disabled={!account?.loan}>
            Add bot
          </button>
        </div>
      </Topbar>
      {account ? accountBots.map((bot) => <Bot key={bot.id} bot={bot} />) : <div>Account with ID: {id} not found</div>}
      {accountBots.length === 0 && <div>Add bot to continue</div>}
    </Container>
  )
}

function ModalAddBot({ account }: { account: number }) {
  const { botAdd, pairs, timeframes } = useContext(AppContext)
  const { close } = useContext(ModalContext)
  const [params, setParams] = useState({ name: '', pair: '', timeframe: '' })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value })
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
    const timeframe = timeframes.find((e) => e.name === params.timeframe)?.timeframe
    if (timeframe) botAdd(account, params.name.trim(), params.pair.trim(), timeframe)
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
      <label>pair</label>
      <Dropdown name='pair' choices={pairs} selected={params.pair} onChange={onChange} />
      <label>timeframe</label>
      <Dropdown
        name='timeframe'
        choices={timeframes.map((e) => e.name)}
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
