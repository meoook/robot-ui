import React, { useContext, useState } from 'react'
import Select from 'react-select'
import { selectStyle } from '../utils'
import { IBotCreate } from '../model'
import { ModalContext } from '../store/ModalContext'
import {
  useCreateBotMutation,
  useGetAccountQuery,
  useGetBotsQuery,
  useGetPairsQuery,
  useGetTimeframesQuery,
  useGetUserQuery,
} from '../store/srv.api'
import Notify from '../components/notify'
import Topbar from '../components/topbar'
import Modal from '../components/modal'
import Bot from '../components/bot'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBots(props: PageBotsProps) {
  const { data: bots } = useGetBotsQuery()
  const { data: user } = useGetUserQuery()
  const { data: account } = useGetAccountQuery(user?.account.id, { skip: !user?.account.id })

  const { modal, open } = useContext(ModalContext)

  const usedPairs = bots?.map((b) => b.pair.replace(':', '')) || []
  return (
    <>
      {modal && account && (
        <Modal title='Create bot'>
          <ModalAddBot accountID={account.id} usedPairs={usedPairs} />
        </Modal>
      )}
      <Topbar>
        <div>
          <button className='btn green' onClick={open} disabled={!account?.trade}>
            Add bot
          </button>
        </div>
      </Topbar>
      {bots?.map((bot) => (
        <Bot key={bot.id} bot={bot} />
      ))}
      {!account?.trade && <Notify type='warning'>Enable exchange account to add Bots</Notify>}
      {account?.trade && bots?.length === 0 && <div>Add bot to continue</div>}
    </>
  )
}

function ModalAddBot({ accountID, usedPairs }: { accountID: number; usedPairs: string[] }) {
  const [botAdd] = useCreateBotMutation()
  const { data: pairs } = useGetPairsQuery()
  const { data: timeframes } = useGetTimeframesQuery()
  const { close } = useContext(ModalContext)
  const [params, setParams] = useState<IBotCreate>({ name: '', pair: '', timeframe: '', account: accountID })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value.trim() })
    if (error) setError('')
  }
  const onSelect = (newValue: any, actionMeta: any) => {
    setParams({ ...params, [actionMeta.name]: newValue?.value })
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (!params.name.trim()) {
      setError('Enter bot name')
      return
    }
    if (!params.pair) {
      setError('Select pair')
      return
    }
    if (!params.timeframe) {
      setError('Select timeframe')
      return
    }
    const timeframe = timeframes?.find((e) => e.timeframe === params.timeframe)?.timeframe
    if (!timeframe) {
      setError(`Invalid timeframe ${params.timeframe}`)
      return
    }
    botAdd(params)
    close()
    // TODO: callback redirect to bot page
  }

  const optionsPairs = pairs
    ?.filter((p) => !usedPairs.includes(p.symbol))
    .map((pair) => ({
      value: pair.symbol,
      label: `${pair.coin_base}:${pair.coin_quote} x${pair.leverage}`,
    }))

  const optionsTf = timeframes?.map((tf) => ({ value: tf.timeframe, label: tf.name })) || []

  return (
    <>
      <label>Bot title</label>
      <input type='text' name='name' onChange={onChange} placeholder='Enter bot title...' />
      <label>Pair</label>
      <Select name='pair' options={optionsPairs} onChange={onSelect} styles={selectStyle} />
      <label>Timeframe</label>
      <Select name='timeframe' options={optionsTf} onChange={onSelect} styles={selectStyle} />
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
