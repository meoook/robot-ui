import style from './stats.module.scss'
import { IBotStats } from '../../model'
import { useGetStatsQuery } from '../../store/srv.api'

interface BotMonthProps {
  bot: number
}

export default function BotMonthStats({ bot }: BotMonthProps) {
  const { data: stats } = useGetStatsQuery(bot)
  // setStat(
  //   botStats.sort((a, b) =>
  //     Math.round(
  //       Number(b.month.substring(0, 7).replace('-', '')) - Number(a.month.substring(0, 7).replace('-', ''))
  //     )
  //   )
  // )
  const haveStats: boolean = stats?.data.length !== 0
  return (
    <div className={style.stats}>
      <h1>{haveStats ? 'Statistic' : "Bot don't trade yet"} </h1>
      {haveStats && (
        <table className={style.table}>
          <thead>
            <tr>
              <th>month</th>
              <th>buy</th>
              <th>sell</th>
              {/* <th>delta</th> */}
              <th>quantity</th>
              <th>fee</th>
              <th>profit</th>
              <th>bot fee</th>
            </tr>
          </thead>
          <tbody>
            {stats?.data.map((st) => (
              <tr key={`${st.bot}${st.month}`}>
                <td>{st.month.substring(0, 7)}</td>
                <td>{st.buy ? st.buy : '-'}</td>
                <td>{st.sell ? st.sell : '-'}</td>
                {/* <td>{((st.sell || 0) - (st.buy || 0)).toFixed(2)}</td> */}
                <td>{st.quantity ? st.quantity : '-'}</td>
                <td>{st.fee ? st.fee : '-'}</td>
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
