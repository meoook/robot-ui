import style from './header.module.scss'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AppContext } from '../../../context/AppContext'
import iconArray from '../ico-get/icons'

export default function Header() {
  const { user, signout } = useContext(AppContext)

  const logOff = () => {
    signout()
  }

  return (
    <header className={style.header}>
      <div className={style.item}>
        <Link to='/'>{iconArray.sun}</Link>
      </div>
      <div className={`${style.item} w-100`}>
        <nav>
          <NavLink to='/' className={style.link}>
            Help
          </NavLink>
          <NavLink to='/accounts' className={style.link}>
            Accounts
          </NavLink>
          <NavLink to='/bots' className={style.link}>
            Auction
          </NavLink>
          <NavLink to='/user' className={style.link}>
            User
          </NavLink>
        </nav>
      </div>
      <div className={style.item}>
        {Boolean(user) ? (
          <>
            <span className='mh-3'>{user?.address}</span>
            <button className='btn red' onClick={logOff}>
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
