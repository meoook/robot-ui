import style from './header.module.scss'
import { Link, NavLink } from 'react-router-dom'
import iconArray from '../ico-get/icons'
import { useAppSelector } from '../../../store/hooks'
import { useGetUserQuery, useSingOutMutation } from '../../../store/srv.api'
import LoaderCar from '../loader-car'

export default function Header() {
  const { token, loading } = useAppSelector((state) => state.profile)
  const [signOut, { isLoading }] = useSingOutMutation()
  const { data } = useGetUserQuery(null, { skip: !Boolean(token) || isLoading })

  return (
    <header className={style.header}>
      {loading && <LoaderCar />}
      <div className={style.item}>
        <Link to='/'>{iconArray.sun}</Link>
      </div>
      <div className={`${style.item} w-100`}>
        <nav>
          <NavLink to='/' className={style.link}>
            About
          </NavLink>
          {Boolean(token) && (
            <>
              <NavLink to='/agreements' className={style.link}>
                Aggreements
              </NavLink>
              <NavLink to='/invoices' className={style.link}>
                Invoices
              </NavLink>
              <NavLink to='/transactions' className={style.link}>
                Transactions
              </NavLink>
            </>
          )}
        </nav>
      </div>
      <div className={style.item}>
        {Boolean(token) ? (
          <>
            <span className='mh-3'>{data?.address}</span>
            <button className='btn red' onClick={() => signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <Link to='/login' className={style.link}>
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
