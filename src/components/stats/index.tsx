import style from './stats.module.scss'
import { IBotIndicator, IBotStats } from '../../model'
import { useGetStatsQuery } from '../../store/srv.api'
import Loader from '../../elements/loader'

interface BotMonthProps {
  pair: string
  totals?: IBotIndicator
}

export default function BotMonthStats({ pair, totals }: BotMonthProps) {
  const { data: stats, isFetching } = useGetStatsQuery(pair)
  const haveStats: boolean = Boolean(stats?.data.length)
  return (
    <div className={style.stats}>
      <h1>{haveStats ? 'Statistic' : "Bot don't trade yet"} </h1>
      {isFetching && <Loader />}
      {haveStats && (
        <table className={style.table}>
          <thead>
            <tr>
              <th>month</th>
              <th>buy qty</th>
              <th>buy avg</th>
              <th>sell qty</th>
              <th>sell avg</th>
              <th>fee</th>
              <th>pnl</th>
              <th>profit</th>
              <th>bot fee</th>
            </tr>
          </thead>
          <tbody>
            {stats?.data.map((st: IBotStats) => (
              <tr key={`${st.bot}${st.month}`}>
                <td>{st.month.substring(0, 7)}</td>
                <td>{st.buy_qty ? st.buy_qty : '-'}</td>
                <td>{st.buy_avg ? st.buy_avg : '-'}</td>
                <td>{st.sell_qty ? st.sell_qty : '-'}</td>
                <td>{st.sell_avg ? st.sell_avg : '-'}</td>
                <td>{st.fee ? st.fee.toFixed(2) : '-'}</td>
                <td>{st.result ? st.result.toFixed(2) : '-'}</td>
                <td>{st.profit ? st.profit.toFixed(2) : '-'}</td>
                <td>{st.bot_fee ? st.bot_fee.toFixed(2) : '-'}</td>
              </tr>
            ))}
            <tr className={style.result}>
              <td>All time</td>
              <td>{totals?.buy_qty ? totals.buy_qty : '-'}</td>
              <td>{totals?.buy_avg ? totals.buy_avg : '-'}</td>
              <td>{totals?.sell_qty ? totals.sell_qty : '-'}</td>
              <td>{totals?.sell_avg ? totals.sell_avg : '-'}</td>
              <td>{totals?.fee ? totals.fee.toFixed(2) : '-'}</td>
              <td>{totals?.result ? totals.result.toFixed(2) : '-'}</td>
              <td>{totals?.result ? (totals.result > 0 ? totals.result.toFixed(2) : '-') : '-'}</td>
              <td>{totals?.bot_fee ? totals.bot_fee.toFixed(2) : '-'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
