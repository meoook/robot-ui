import style from './telegram.module.scss'
import { useState } from 'react'
import { useTelegramNonceMutation } from '../../store/srv.api'

interface TelegramNonceProps {
  children?: React.ReactNode
  telegram?: string
}

export default function TelegramNonce({ telegram }: TelegramNonceProps) {
  const [getNonce] = useTelegramNonceMutation()
  const [nonce, setNonce] = useState('')

  const getCode = async () => {
    const srvData = await getNonce()
    if (srvData.data) setNonce(`${srvData.data.nonce}`)
  }

  return (
    <>
      <h1>Telegram notification</h1>
      <div className={style.tg_block}>
        {nonce ? (
          <div className='row center'>
            <div className={style.nonce}>{nonce}</div>
            <div>
              <span>Send message with this code in telegram channel</span>
              <br />
              <a href='https://t.me/YourFutureFinanceBot' className='underline'>
                @YourFutureFinanceBot
              </a>
              <span> to activate notification</span>
            </div>
          </div>
        ) : (
          <div className='row center'>
            {!telegram ? (
              <button className='btn green' onClick={getCode}>
                Activate
              </button>
            ) : (
              <>
                <div className={style.tgid}>Telegram id: {telegram}</div>
                <button className='btn orange' onClick={getCode}>
                  Change
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
