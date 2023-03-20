import style from './valid.module.scss'
import Icon from '../ico-get'
import Loader from '../loader'

interface ValidProps {
  children?: React.ReactNode
  valid?: boolean
}

export default function Valid({ valid }: ValidProps) {
  return (
    <>
      {valid === undefined ? (
        <span>
          <Loader />
        </span>
      ) : valid ? (
        <span className={style.ok}>
          <Icon name='check' />
        </span>
      ) : (
        <span className={style.err}>
          <Icon name='warning' />
        </span>
      )}
    </>
  )
}
