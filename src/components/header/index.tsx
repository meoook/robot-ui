import style from './header.module.scss'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useGetUserQuery, useSingOutMutation } from '../../store/srv.api'
import { useAppSelector } from '../../store/hooks'
import LoaderCar from '../loader-car'
import iconArray from '../ico-get/icons'
import Icon from '../ico-get'

export default function Header() {
  const { token, loading } = useAppSelector((state) => state.profile)
  const [signOut, { isLoading }] = useSingOutMutation()
  const { data: user } = useGetUserQuery(null, { skip: !Boolean(token) || isLoading })
  const navigate = useNavigate()

  const logOut = () => {
    navigate('/', { replace: true })
    signOut()
  }

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
                <NavLink to='/balance' className={style.link}>
                  Balance
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
        {Boolean(token) ? (
          <UserAddress address={user?.address || ''} logOut={logOut} />
        ) : (
          <div className={style.item}>
            <Link to='/login' className={style.link}>
              Login
            </Link>
          </div>
        )}
      </header>
    </>
  )
}

function UserAddress({ address, logOut }: { address: string; logOut: () => void }) {
  const formatAddress = (addr: string): string => {
    const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2)
    return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(38)}`
  }

  return (
    <>
      {/* <Icon name='wallet' /> */}
      <div className={style.address}>
        {iconArray.wallet}
        <div title={address}>{formatAddress(address)}</div>
        {iconArray.arr_down}
        <div className={style.dropdown}>
          <button className='btn gray' onClick={logOut}>
            <span>Disconnect</span>
            <Icon name='logout2' />
          </button>
        </div>
      </div>
    </>
  )
}
