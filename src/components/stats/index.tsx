import style from './stats.module.scss'
import { IBotStats } from '../../model'
import { useGetStatsQuery } from '../../store/srv.api'
import Loader from '../loader'

interface BotMonthProps {
  pair: string
}

export default function BotMonthStats({ pair }: BotMonthProps) {
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
              <th>result</th>
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
                <td>{st.fee ? st.fee : '-'}</td>
                <td>{st.result ? st.result : '-'}</td>
                <td>{st.profit ? st.profit : '-'}</td>
                <td>{st.bot_fee ? st.bot_fee : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
