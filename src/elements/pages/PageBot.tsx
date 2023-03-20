import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Container from '../components/container'
import Topbar from '../components/topbar'
import { IBot, IBotCfg } from '../../context/objects'
import InputNumber from '../components/input-number'
import InputSwitch from '../components/input-switch'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBot(props: PageBotsProps) {
  const { id } = useParams()
  const { botid } = useParams()
  const { bots, botRemove, botUpdate } = useContext(AppContext)
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [bot, setBot] = useState<IBot>()
  const [botCfg, setBotCfg] = useState<IBotCfg>({
    name: '',
    active: false,
    balance_limit: 0,
    circles_limit: 0,
    orders_limit: 0,
    peak_delta: 0,
  })

  useEffect(() => {
    const lookup = bots.find((b) => b.id === Number(botid) && b.account === Number(id))
    setBot(lookup)
    if (lookup) setBotCfg(lookup)
  }, [bots, botid, id])

  const handleDelete = () => {
    botRemove(Number(botid))
    navigate(`/accounts/${id}`, { replace: true })
  }

  const handleSave = () => {
    setEdit(false)
    if (bot) botUpdate(bot.id, botCfg)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setBotCfg({ ...botCfg, [event.target.name]: event.target.value })

  const onChange = (name: string, value: any) => setBotCfg({ ...botCfg, [name]: value })

  return (
    <Container>
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
                <span>{bot.timeframe}</span>
              </div>
              <div>ID: {bot.id} ❌</div>
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
              max={20}
              disabled={!edit}
              onChange={onChange}
            />
            <InputNumber
              title='orders limit'
              name='orders_limit'
              value={botCfg.orders_limit}
              min={1}
              max={20}
              disabled={!edit}
              onChange={onChange}
            />
            <InputNumber
              title='peak delta'
              name='peak_delta'
              value={botCfg.peak_delta}
              min={20}
              max={80}
              disabled={!edit}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div>
          Bot with ID: {botid} for Account ID: {id} not found
        </div>
      )}
    </Container>
  )
}
