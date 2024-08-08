import style from './bot.module.scss'
import { useContext, useState } from 'react'
import { IBot, IBotChange } from '../../model'
import { mutateBotCfg, selectStyle } from '../../utils'
import { ModalContext } from '../../store/ModalContext'
import { useDeleteBotMutation, useGetTimeframesQuery, useUpdateBotMutation } from '../../store/srv.api'
import Select from 'react-select'
import Modal from '../modal'
import Topbar from '../topbar'
import InputSwitch from '../input-switch'
import InputNumber from '../input-number'
import BotMonthStats from '../stats'
import BotMonthTrades from '../trades'
import BotIndicator from '../indicator'

interface BotChangeProps {
  children?: React.ReactNode
  account?: string
  bot: IBot
}

export default function BotChange({ bot }: BotChangeProps) {
  const [botUpdate] = useUpdateBotMutation()
  const { data: timeframes } = useGetTimeframesQuery()
  const { modal, open } = useContext(ModalContext)

  const [botCfg, setBotCfg] = useState<IBotChange>(mutateBotCfg(bot))
  const [edit, setEdit] = useState<boolean>(false)

  const optionsTf = timeframes?.map((tf) => ({ value: tf.timeframe, label: tf.name })) || []

  const handleSave = () => {
    setEdit(false)
    if (bot) botUpdate({ botID: bot.id, changes: botCfg })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBotCfg({ ...botCfg, [event.target.name]: event.target.value })
  }

  const onChange = (name: string, value: any) => setBotCfg({ ...botCfg, [name]: value })

  const onSelect = (newValue: any, actionMeta: any) => {
    setBotCfg({ ...botCfg, [actionMeta.name]: newValue?.value })
  }

  return (
    <>
      {modal && (
        <Modal title='Remove bot'>
          <ModalRemoveBot botID={bot.id} botName={bot.name} />
        </Modal>
      )}
      <Topbar>
        <div>
          <button className='btn red' onClick={open}>
            Remove bot
          </button>
          {!edit && (
            <button className='btn orange' onClick={() => setEdit(true)}>
              Edit
            </button>
          )}
          {edit && (
            <button className='btn green' onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </Topbar>
      <div>
        <div>
          <h1 className='row justify'>
            <div className='row'>
              <span className='pr-2'>{bot.pair}</span>
              <span>{bot.timeframe}</span>
            </div>
            <div>ID: {bot.id}</div>
          </h1>
        </div>
        <hr />
        {bot.error && <small className='red'>{bot.error}</small>}
        <div className={style.fields}>
          <div className='column'>
            <small>bot name</small>
            <input disabled={!edit} value={botCfg.name} onChange={handleChange} name='name' />
          </div>
          <div className='column'>
            <small>timeframe</small>
            <Select
              name='timeframe'
              options={optionsTf}
              onChange={onSelect}
              styles={selectStyle}
              isDisabled={!edit}
              value={optionsTf.find((o) => o.value === botCfg.timeframe)}
            />
          </div>
          <div className={style.switches}>
            <InputSwitch
              title='active'
              name='active'
              value={botCfg.active}
              disabled={!edit}
              type='toggle'
              size='big'
              onChange={onChange}
            />
            <InputSwitch
              title='next month'
              name='next_month'
              value={botCfg.next_month}
              disabled={!edit}
              type='toggle'
              size='big'
              onChange={onChange}
            />
          </div>
        </div>
        <div className={style.inputs}>
          <div className={style.grow}>
            <InputNumber
              title='balance limit'
              name='balance_limit'
              value={botCfg.balance_limit}
              min={20}
              max={80}
              disabled={!edit}
              onChange={onChange}
            />
            <InputNumber
              title='circles limit'
              name='circles_limit'
              value={botCfg.circles_limit}
              min={1}
              max={10}
              disabled={!edit}
              onChange={onChange}
            />
          </div>
          <div className={style.grow}>
            <InputNumber
              title='orders limit'
              name='orders_limit'
              value={botCfg.orders_limit}
              min={1}
              max={9}
              disabled={!edit}
              onChange={onChange}
            />
            <InputNumber
              title='delta'
              name='delta'
              value={botCfg.delta}
              min={10}
              max={70}
              disabled={!edit}
              onChange={onChange}
            />
          </div>
        </div>
        {bot.indicator && <BotIndicator values={bot.indicator} pair={bot.pair} />}
        <BotMonthStats pair={bot.pair.replace(':', '')} totals={bot.indicator} />
        <BotMonthTrades pair={bot.pair.replace(':', '')} />
      </div>
    </>
  )
}

function ModalRemoveBot({ botID, botName }: { botID: number; botName: string }) {
  const { close } = useContext(ModalContext)
  const [botRemove] = useDeleteBotMutation()

  const handleDelete = () => {
    botRemove(botID)
    close()
  }

  return (
    <>
      <label>Are you sure to delete bot {botName}</label>
      <div className='row justify'>
        <button className='btn orange' onClick={close}>
          Cancel
        </button>
        <button className='btn red' onClick={handleDelete}>
          Delete
        </button>
      </div>
    </>
  )
}
