import style from './stats.module.scss'
import { IBotStats } from '../../../context/objects'

interface BotMonthProps {
  stats?: IBotStats[]
}

export default function BotMonthStats({ stats }: BotMonthProps) {
  return (
    <div className={style.stats}>
      <h1>{stats ? 'Bot statistic' : "Bot don't trade yet"} </h1>
      {stats && (
        <table className={style.table}>
          <tr>
            <th>month</th>
            <th>buy</th>
            <th>sell</th>
            <th>fee</th>
            <th>total</th>
          </tr>
          {stats?.map((st) => (
            <tr key={`${st.bot}${st.month}`}>
              <td>{st.month.substring(0, 7)}</td>
              <td>{st.buy}</td>
              <td>{st.sell}</td>
              <td>{st.fee}</td>
              <td>{Math.round((st.sell || 0) - (st.buy || 0))}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  )
}
