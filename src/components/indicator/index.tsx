import style from './indicator.module.scss'
import { IBotIndicator } from '../../model'

interface BotMonthProps {
  values: IBotIndicator
}

export default function BotIndicator({ values }: BotMonthProps) {
  return (
    <div className={style.indicator}>
      <h1>Indicators</h1>
      <div className='row justify center'>
        <div className='col-2'>
          <div>
            <h1>Balance</h1>
            <h1>{values.balance}</h1>
          </div>
        </div>
        <div className='col-2'>
          <div className='row justify'>
            <span>work</span>
            <span>{values.work}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>liquidation</span>
            <span>{values.liquidation}</span>
          </div>
        </div>
        <div className='col-2'>
          <div className='row justify'>
            <span>circles</span>
            <span>{values.circles}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>circle</span>
            <span>{values.circle}</span>
          </div>
        </div>
        <div className='col-2'>
          <div className='row justify'>
            <span>base</span>
            <span>{values.base}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>borrowed</span>
            <span>{values.base_borrowed}</span>
          </div>
        </div>
        <div className='col-2'>
          <div className='row justify'>
            <span>quote</span>
            <span>{values.quote}</span>
          </div>
          <hr />
          <div className='row justify'>
            <span>borrowed</span>
            <span>{values.quote_borrowed}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
