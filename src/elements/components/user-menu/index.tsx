import style from './user.module.scss'

interface UserMenuProps {
  children?: React.ReactNode
}

export default function UserMenu({ children }: UserMenuProps) {
  return <div className={style.container}>{children}</div>
}
