import style from './indicator.module.scss'
import { IBotIndicator } from '../../model'

interface BotMonthProps {
  values: IBotIndicator
  pair: string
}

export default function BotIndicator({ values, pair }: BotMonthProps) {
  const [base, quote] = pair.split(':')
  return (
    <div className={style.indicator}>
      <h1>Indicators</h1>
      <div className='row justify center'>
        <div>
          <div>
            <h1>Balance</h1>
            <h1>{values.balance}</h1>
          </div>
        </div>
        <div>
          <div className='row justify'>
            <span>work&nbsp;</span>
            <span>{values.work}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>liquidation&nbsp;</span>
            <span>{values.liquidation}</span>
          </div>
        </div>
        <div>
          <div className='row justify'>
            <span>circles&nbsp;</span>
            <span>{values.circles}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>circle&nbsp;</span>
            <span>{values.circle}</span>
          </div>
        </div>
        <div>
          <div className='row justify'>
            <span>{base}&nbsp;</span>
            <span>{values.base}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>borrowed&nbsp;</span>
            <span>{values.base_borrowed}</span>
          </div>
        </div>
        <div>
          <div className='row justify'>
            <span>{quote}&nbsp;</span>
            <span>{values.quote}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>borrowed&nbsp;</span>
            <span>{values.quote_borrowed}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
