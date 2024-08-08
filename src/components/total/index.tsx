import style from './total.module.scss'
import { ITotal } from '../../model'

interface TotalStatsProps {
  total: ITotal
}

export default function TotalStats({ total }: TotalStatsProps) {
  return (
    <>
      <h1 className={style.title}>
        <span>All time&nbsp;</span>
        <span className='brand'>Figures</span>
      </h1>
      <div className={style.total}>
        <div>
          <div>Active bots</div>
          <h1>{total.bots}</h1>
        </div>
        <div>
          <div>Buy assets</div>
          <h1>${total.buy.toFixed(2)}</h1>
        </div>
        <div>
          <div>Sell assets</div>
          <h1>${total.sell.toFixed(2)}</h1>
        </div>
        <div>
          <div>Profit earned</div>
          <h1>${total.profit.toFixed(2)}</h1>
        </div>
        <div>
          <div>PnL</div>
          <h1>${total.result.toFixed(2)}</h1>
        </div>
      </div>
    </>
  )
}
