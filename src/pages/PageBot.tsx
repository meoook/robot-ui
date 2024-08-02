import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDeleteBotMutation, useGetBotsQuery, useUpdateBotMutation } from '../store/srv.api'
import { IBot, IBotChange } from '../model'
import Topbar from '../components/topbar'
import InputNumber from '../components/input-number'
import InputSwitch from '../components/input-switch'
import BotMonthStats from '../components/stats'
import BotMonthTrades from '../components/trades'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBot(props: PageBotsProps) {
  const { id } = useParams()
  const { data: bots, isLoading } = useGetBotsQuery()
  const [botRemove] = useDeleteBotMutation()
  const [botUpdate] = useUpdateBotMutation()

  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [bot, setBot] = useState<IBot>()
  const [botCfg, setBotCfg] = useState<IBotChange>({
    timeframe: '',
    name: '',
    active: false,
    next_month: false,
    balance_limit: 0,
    circles_limit: 0,
    orders_limit: 0,
    delta: 0,
  })

  const mutateCfg = (full: IBot): IBotChange => {
    return {
      timeframe: full.timeframe,
      name: full.name,
      active: full.active,
      next_month: full.next_month,
      balance_limit: full.balance_limit,
      circles_limit: full.circles_limit,
      orders_limit: full.orders_limit,
      delta: full.delta,
    }
  }

  useEffect(() => {
    if (!isLoading) {
      const lookup = bots?.find((b) => b.id === Number(id))
      if (!lookup) navigate('/bots', { replace: true })
      else {
        setBot(lookup)
        setBotCfg(mutateCfg(lookup))
      }
    }
  }, [bots, id, isLoading, navigate])

  const handleDelete = () => {
    botRemove(Number(bot?.id))
    navigate('/bots', { replace: true })
  }

  const handleSave = () => {
    setEdit(false)
    if (bot) botUpdate({ botID: bot.id, changes: botCfg })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBotCfg({ ...botCfg, [event.target.name]: event.target.value })
  }

  const onChange = (name: string, value: any) => setBotCfg({ ...botCfg, [name]: value })

  return (
    <>
      <Topbar>
        <div>
          <button className='btn red' onClick={handleDelete}>
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
      {bot ? (
        <div>
          <div>
            <h1 className='row justify'>
              <div className='row'>
                <span className='pr-2'>{bot.pair}</span>
                <span>{bot.timeframe} 🚑</span>
              </div>
              <div>ID: {bot.id}</div>
            </h1>
          </div>
          <hr />
          {bot.error && <small className='red'>{bot.error}</small>}
          <div className='row justify'>
            <div className='column'>
              <small>bot name</small>
              <input disabled={!edit} value={botCfg.name} onChange={handleChange} name='name' />
            </div>
            <InputSwitch
              title='active'
              name='active'
              value={botCfg.active}
              disabled={!edit}
              type='toggle'
              size='big'
              onChange={onChange}
            />
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
            <InputSwitch
              title='next month'
              name='next_month'
              value={botCfg.next_month}
              disabled={!edit}
              type='check'
              size='big'
              onChange={onChange}
            />
          </div>
          <BotMonthStats pair={bot.pair.replace(':', '')} />
          <BotMonthTrades pair={bot.pair.replace(':', '')} />
        </div>
      ) : (
        <div>Bot with ID: {id} not found</div>
      )}
    </>
  )
}
