import style from './balance.module.scss'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useGetBotsQuery } from '../../store/srv.api'
import {
  getAddress,
  getBalance,
  addAllowence,
  w3AddLocked,
  VALID_CHAIN_ID,
  setNetwork,
  w3LockFree,
} from '../../store/w3.slice'
import Card from '../card'
import Notify from '../notify'
import CoinInput from '../coin'
import Loader from '../loader'

interface BalanceProps {
  userAddress?: string
}

const ALLOWENCE_MIN: number = 10_000
const ALLOWENCE_MAX: number = 24_000_000

export default function Balance({ userAddress }: BalanceProps) {
  return (
    <Card border={true} nopadding={true}>
      {!userAddress && <Loader />}
      {userAddress && <BalanceHead />}
      {userAddress && <AddBlock userAddress={userAddress} />}
    </Card>
  )
}

function BalanceHead() {
  const { allowence, locked, symbol, perBot } = useAppSelector((state) => state.w3)
  const { data: bots } = useGetBotsQuery()
  const botsUsed: number = bots?.reduce((prev, curr) => prev + curr.locked, 0) || 0

  return (
    <div className={style.head}>
      <h1>Lock for bots</h1>
      <div className='row'>
        <div className='col-4'>used for bots</div>
        <div className='col-3'>
          {botsUsed.toFixed(2)} {symbol}
        </div>
      </div>
      <div className='row'>
        <div className='col-4'>locked</div>
        <div className='col-3'>
          {locked.toFixed(2)} {symbol}
        </div>
      </div>
      {perBot > 0 && (
        <div className='row'>
          <div className='col-4'>to enable one bot</div>
          <div className='col-3'>
            {perBot.toFixed(2)} {symbol}
          </div>
        </div>
      )}
      <div className='row'>
        <div className='col-4'>allowence (debug)</div>
        <div className='col-3'>
          {allowence.toFixed(2)} {symbol}
        </div>
      </div>
    </div>
  )
}

function AddBlock({ userAddress }: { userAddress: string }) {
  const dispatch = useAppDispatch()
  const { address, allowence, chain, connected } = useAppSelector((state) => state.w3)
  const [balanceOn, setBalanceOn] = useState(true)

  useEffect(() => {
    if (chain === VALID_CHAIN_ID) dispatch(getBalance(userAddress))
  }, [userAddress, chain, dispatch])

  useEffect(() => {
    if (!address) dispatch(getAddress())
  }, [address, userAddress, dispatch])

  let err = undefined
  if (!connected) err = <Notify type='info'>Not connected</Notify>
  else if (chain !== VALID_CHAIN_ID) err = <InvalidNetwork />
  else if (!address) err = <Notify type='info'>No active provider</Notify>
  else if (userAddress !== address.toLowerCase())
    err = <Notify type='error'>You connected with other wallet (contract functions disabled)</Notify>
  else if (!allowence || allowence < ALLOWENCE_MIN) err = <AllowToken userAddress={userAddress} />
  if (err) return <div className={style.item}>{err}</div>

  return (
    <>
      <div className={style.switch}>
        <div>
          <button className={balanceOn ? style.active : undefined} onClick={() => setBalanceOn(true)}>
            From balance
          </button>
          <button className={!balanceOn ? style.active : undefined} onClick={() => setBalanceOn(false)}>
            From unlocked
          </button>
        </div>
      </div>
      {balanceOn ? <AddFromBalance userAddress={userAddress} /> : <AddFromFree userAddress={userAddress} />}
    </>
  )
}

function InvalidNetwork() {
  const dispatch = useAppDispatch()
  const [busy, setBusy] = useState(false)
  const switchNetwok = () => {
    setBusy(true)
    dispatch(setNetwork())
    setBusy(false)
  }

  return (
    <>
      <Notify type='warning'>Not connected to Binance Smart Network (Testnet)</Notify>
      <button className='btn green' onClick={switchNetwok} disabled={busy}>
        Switch network
      </button>
    </>
  )
}

function AllowToken({ userAddress }: { userAddress: string }) {
  const dispatch = useAppDispatch()
  const [busy, setBusy] = useState(false)
  const allow = async () => {
    setBusy(true)
    await addAllowence(userAddress, ALLOWENCE_MAX)
    setBusy(false)
    setTimeout(() => {
      dispatch(getBalance(userAddress))
    }, 3000)
  }

  return (
    <button className='btn green' disabled={busy} onClick={allow}>
      Enable
    </button>
  )
}

function AddFromBalance({ userAddress }: { userAddress: string }) {
  const dispatch = useAppDispatch()
  const { balance, symbol } = useAppSelector((state) => state.w3)
  const [busy, setBusy] = useState(false)
  const [amount, setAmount] = useState('0')

  const addLocked = async () => {
    setBusy(true)
    await w3AddLocked(userAddress, Number(amount))
    setBusy(false)
    setTimeout(() => {
      dispatch(getBalance(userAddress))
    }, 3000)
  }
  const disabled = busy || balance <= 0 || Number(amount) <= 0

  return (
    <>
      <div className={style.item}>
        <div className='row justify'>
          <div>Balance</div>
          <div>
            {balance.toFixed(2)} {symbol}
          </div>
        </div>
        <CoinInput balance={balance} value={amount} onChange={setAmount} />
      </div>
      <div className={style.item}>
        <button className='btn green' disabled={disabled} onClick={addLocked}>
          Add to locked
        </button>
      </div>
    </>
  )
}

function AddFromFree({ userAddress }: { userAddress: string }) {
  const dispatch = useAppDispatch()
  const { free, symbol } = useAppSelector((state) => state.w3)
  const [busy, setBusy] = useState(false)
  const [amount, setAmount] = useState('0')

  const addLocked = async () => {
    setBusy(true)
    await w3LockFree(userAddress, Number(amount))
    setBusy(false)
    setTimeout(() => {
      dispatch(getBalance(userAddress))
    }, 3000)
  }

  const disabled = busy || free <= 0 || Number(amount) <= 0

  return (
    <>
      <div className={style.item}>
        <div className='row justify'>
          <div>Unlocked</div>
          <div>
            {free.toFixed(2)} {symbol}
          </div>
        </div>
        <CoinInput balance={free} value={amount} onChange={setAmount} />
      </div>
      <div className={style.item}>
        <button className='btn green' disabled={disabled} onClick={addLocked}>
          Add to locked
        </button>
      </div>
    </>
  )
}
