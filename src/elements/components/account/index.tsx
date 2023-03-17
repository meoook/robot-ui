import { Link } from 'react-router-dom'
import { IAccount } from '../../../context/objects'
import Icon from '../ico-get'
import Loader from '../loader'
import style from './account.module.scss'

interface AccountProps {
  children?: React.ReactNode
  account: IAccount
}

export default function Account({ account }: AccountProps) {
  const loading: boolean = !account.margin && !account.error
  return (
    <Link to={`/accounts/${account.id}`} className={`${style.account} ${(loading || account.error) && 'disabled'}`}>
      <div>
        <div className='row justify'>
          <div>
            {loading ? (
              <span>
                <Loader />
              </span>
            ) : account.error ? (
              <span className={style.err}>
                <Icon name='warning' />
              </span>
            ) : (
              <span className={style.ok}>
                <Icon name='check' />
              </span>
            )}
            <span>&nbsp;</span>
            <span>ID: {account.id}</span>
          </div>
          {account.error ?? <div>{account.error}</div>}
        </div>
        <div></div>
        <div>spot: {account.spot ? 'enabled' : 'disabled'}</div>
        <div>margin: {account.margin ? 'enabled' : 'disabled'}</div>
        <div>fututres: {account.futures ? 'enabled' : 'disabled'}</div>
      </div>
    </Link>
  )
}
