import style from './pop.module.scss'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../../context/AppContext'
import { IPopup } from '../../../context/objects'
import Icon from '../ico-get'

export default function PopupMsgs() {
  const { msgs, delMsg } = useContext(AppContext)
  return (
    <div className={style.msgframe}>
      {msgs.map((msg) => (
        <Message msg={msg} delMsg={delMsg} key={msg.id} />
      ))}
    </div>
  )
}

const Message = ({ msg, delMsg }: { msg: IPopup; delMsg: Function }) => {
  const msgStyle = `${style.msgitem} ${style[msg.type]}${msg.nofade ? '' : ` ${style.fade}`}`

  useEffect(() => {
    if (!msg.nofade) {
      setTimeout(() => {
        delMsg(msg.id)
      }, 6500)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={msgStyle}>
      <div className='row center'>
        <Icon name={msg.type} />
        <div className={style.context}>
          {msg.title && <h3>{msg.title} </h3>}
          {msg.text && <div>{msg.text}</div>}
        </div>
        <button className='btn-close' onClick={delMsg.bind(this, msg.id)}>
          &times;
        </button>
      </div>
      <div className={style.msgprogress} />
    </div>
  )
}
