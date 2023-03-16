import { useContext } from 'react'
import { ModalContext } from '../../../context/ModalContext'
import style from './container.module.scss'

interface ContainerProps {
  children?: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <>
      <div className={style.container}>{children}</div>
    </>
  )
}
