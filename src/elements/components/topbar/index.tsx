import BreadCrumbs from '../breadcrumbs'
import style from './topbar.module.scss'

interface TopbarProps {
  children?: React.ReactNode
}

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className={style.topbar}>
      <BreadCrumbs />
      {children}
    </div>
  )
}
