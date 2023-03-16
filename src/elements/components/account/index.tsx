import { Link } from 'react-router-dom'
import { IAccount } from '../../../context/objects'
import style from './account.module.scss'

interface AccountProps {
  children?: React.ReactNode
  account: IAccount
}

export default function Account({ account }: AccountProps) {
  return (
    <Link to={`/accounts/${account.id}`}>
      <div className={style.account}>
        <div>ID: {account.id}</div>
        {account.error && <div>{account.error}</div>}
        <div>spot: {account.spot ? 'enabled' : 'disabled'}</div>
        <div>margin: {account.margin ? 'enabled' : 'disabled'}</div>
        <div>fututres: {account.futures ? 'enabled' : 'disabled'}</div>
      </div>
    </Link>
  )
}
