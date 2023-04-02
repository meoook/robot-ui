import { Link } from 'react-router-dom'
import { IBot } from '../../../context/objects'
import style from './bot.module.scss'

interface BotProps {
  children?: React.ReactNode
  account?: string
  bot: IBot
}

export default function Bot({ bot }: BotProps) {
  return (
    <Link to={`/accounts/${bot.account}/${bot.id}`}>
      <div className={style.bot}>
        <div>
          <div className={style.head}>
            <div className='row'>
              <span>{bot.active ? '✔️' : '❌'}</span>
              <span className='pr-2'>{bot.pair}</span>
              <span>{bot.timeframe}</span>
            </div>
            <span>ID: {bot.id}</span>
          </div>
          <hr />
          <small className='gray'>{bot.name}</small>
        </div>
        <div className='row justify'>
          <div className='col-2'>balance limit: {bot.balance_limit}</div>
          <div className='col-2'>circles limit: {bot.circles_limit}</div>
          <div className='col-2'>peak delta: {bot.peak_delta}</div>
        </div>
        <div className='row justify'>
          <div className='col-2'>{bot.error && <small className='red'>{bot.error}</small>}</div>
          <div className='col-2'>orders limit: {bot.orders_limit}</div>
          <div className='col-2'></div>
        </div>
      </div>
    </Link>
  )
}
