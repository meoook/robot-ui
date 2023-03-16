import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { IPopup } from '../../context/objects'
import Icon from '../components/ico-get/index'

export default function PopupMsgs() {
  const { msgs, delMsg } = useContext(AppContext)
  return (
    <div className='msg-frame'>
      {msgs.map((msg) => (
        <Message msg={msg} delMsg={delMsg} key={msg.id} />
      ))}
    </div>
  )
}

const Message = ({ msg, delMsg }: { msg: IPopup; delMsg: Function }) => {
  const msgStyle = `${msg.type}${msg.nofade ? '' : ' fade'}`

  useEffect(() => {
    if (!msg.nofade) {
      setTimeout(() => {
        delMsg(msg.id)
      }, 4500)
    }
    // eslint-disable-next-line
  }, [])
  return (
    <div className={`msg-item ${msgStyle} row center`}>
      <div className='row center'>
        <i>
          <Icon name={msg.type} />
        </i>
        <div>
          {msg.title && <h3>{msg.title}</h3>}
          {msg.text && <div>{msg.text}</div>}
        </div>
        <button className='btn-close' onClick={delMsg.bind(this, msg.id)}>
          &times;
        </button>
      </div>
      <div className='msg-progress' />
    </div>
  )
}
