import style from './balance.module.scss'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { checkNetwork, addToken, getAddress, getBalance, addAllowence, addToLocked } from '../../store/w3.slice'
import { useGetBotsQuery } from '../../store/srv.api'

interface BalanceProps {
  userAddress: string
}

const VALID_CHAIN_ID: number = 97
const ALLOWENCE_MIN: number = 10_000
const ALLOWENCE_MAX: number = 24_000_000

export default function Balance({ userAddress }: BalanceProps) {
  const dispatch = useAppDispatch()
  const { data: bots } = useGetBotsQuery()
  const { address, balance, allowence, locked, free, symbol, perBot, chain } = useAppSelector((state) => state.w3)
  const [eq, setEq] = useState(false)
  const [validChain, setValidChain] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    dispatch(getBalance(userAddress))
  }, [userAddress, dispatch])

  useEffect(() => {
    if (!address) dispatch(getAddress())
    else setEq(userAddress === address.toLowerCase())
  }, [address, userAddress, dispatch])

  useEffect(() => {
    if (chain) {
      checkNetwork(VALID_CHAIN_ID)
      setValidChain(chain === VALID_CHAIN_ID)
    }
  }, [chain])

  const allow = async () => {
    setBusy(true)
    await addAllowence(userAddress, ALLOWENCE_MAX)
    setBusy(false)
  }

  const addLocked = async () => {
    setBusy(true)
    await addToLocked(userAddress, balance)
    setBusy(false)
    setTimeout(() => {
      dispatch(getBalance(userAddress))
    }, 3000)
  }

  // TODO: MB take from user.locked ? or no
  const botsUsed: number = bots?.reduce((prev, curr) => prev + curr.locked, 0) || 0
  const enabled: boolean = Boolean(allowence) && allowence > ALLOWENCE_MIN

  return (
    <>
      <h1>Web3 address:</h1>
      {address && !eq && <div>You connected by other wallet (contract functions disabled)</div>}
      {!validChain && <div>Connect to Binance Smart Network (Testnet)</div>}
      <div className='row'>
        <div className='col-8'>{userAddress}</div>
        <div className='col-2'>
          allowence {allowence} {symbol}
        </div>
      </div>
      <div className='row'>
        <div className='col-2'>Balance</div>
        <div className='col-2'>
          {balance} {symbol}
        </div>
        {eq && (
          <div className='col-2'>
            {enabled ? (
              <button className='btn green' disabled={busy || balance <= 0} onClick={addLocked}>
                Add to locked
              </button>
            ) : (
              <button className='btn green' disabled={busy} onClick={allow}>
                Enable
              </button>
            )}
          </div>
        )}
      </div>
      <div className='row'>
        <div className='col-3'>used for bots / locked</div>
        <div className='col-3'>
          {botsUsed} / {locked} {symbol}
        </div>
        {perBot > 0 && (
          <div className='col-2'>
            {perBot} {symbol} to enable one bot
          </div>
        )}
      </div>
      <div className='row'>
        <div className='col-2'>unlocked</div>
        <div className='col-2'>
          {free} {symbol}
        </div>
        {eq && (
          <div className='col-2'>
            <button className='btn green' disabled={free <= 0}>
              Lock for bots
            </button>
          </div>
        )}
        {eq && (
          <div className='col-2'>
            <button className='btn green' disabled={free <= 0}>
              Widthraw
            </button>
          </div>
        )}
      </div>
    </>
  )
}
