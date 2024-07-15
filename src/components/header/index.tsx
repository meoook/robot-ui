import style from './header.module.scss'
import { Link, NavLink } from 'react-router-dom'
import { useGetUserQuery, useSingOutMutation } from '../../store/srv.api'
import { useAppSelector } from '../../store/hooks'
import LoaderCar from '../loader-car'
import iconArray from '../ico-get/icons'

export default function Header() {
  const { token, loading } = useAppSelector((state) => state.profile)
  const [signOut, { isLoading }] = useSingOutMutation()
  const { data } = useGetUserQuery(null, { skip: !Boolean(token) || isLoading })

  return (
    <>
      {loading && <LoaderCar />}
      <header className={style.header}>
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
                <NavLink to='/profile' className={style.link}>
                  Profile
                </NavLink>
                <NavLink to='/accounts' className={style.link}>
                  Accounts
                </NavLink>
                <NavLink to='/bots' className={style.link}>
                  Bots
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
    </>
  )
}
