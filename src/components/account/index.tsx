import style from './account.module.scss'
import { Link } from 'react-router-dom'
import { IAccount } from '../../model'
import Valid from '../valid'

interface AccountProps {
  children?: React.ReactNode
  account: IAccount
}

export default function Account({ account }: AccountProps) {
  const loading: boolean = !account.loan && !account.error
  return (
    <Link to={`/accounts/${account.id}`} className={style.account}>
      <div className='row justify'>
        <div>
          <Valid valid={loading ? undefined : !account.error} />
          <span>&nbsp;</span>
          <span>ID: {account.id}</span>
        </div>
        {account.error ?? <div>{account.error}</div>}
      </div>
      <div className='row'>
        <div className='col-1'>Name:</div>
        <div className='col-1'>{account.name}</div>
      </div>
      <div className='row'>
        <div className='col-1'>trade:</div>
        <div className='col-1'>
          <Valid valid={account.trade} />
        </div>
      </div>
      <div className='row'>
        <div className='col-1'>loan:</div>
        <div className='col-1'>
          <Valid valid={account.loan} />
        </div>
      </div>
    </Link>
  )
}
