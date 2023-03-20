import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Container from '../components/container'
import Topbar from '../components/topbar'
import Bot from '../components/bot'
import { ModalContext } from '../../context/ModalContext'
import Modal from '../components/modal'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBots(props: PageBotsProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accounts, bots, accountRemove } = useContext(AppContext)
  const { modal, open } = useContext(ModalContext)
  const accountBots = bots?.filter((bot) => bot.account === Number(id))
  const account = accounts.find((a) => a.id === Number(id))

  const handleDelete = () => {
    accountRemove(Number(id))
    navigate('/accounts', { replace: true })
  }

  return (
    <Container>
      {modal && (
        <Modal title='Create bot'>
          <ModalAddBot />
        </Modal>
      )}
      <Topbar>
        <div>
          <button className='btn red' onClick={handleDelete}>
            Remove account
          </button>
          <button className='btn green' onClick={open} disabled={!account?.margin}>
            Add bot
          </button>
        </div>
      </Topbar>
      {account ? accountBots.map((bot) => <Bot key={bot.id} bot={bot} />) : <div>Account with ID: {id} not found</div>}
    </Container>
  )
}

function ModalAddBot() {
  const { botAdd } = useContext(AppContext)
  const { close } = useContext(ModalContext)
  const [params, setParams] = useState({ name: '', pair: '', timeframe: '' })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value })
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (!params.name.trim()) {
      setError('Enter bot name')
      return
    }
    if (!params.pair.trim()) {
      setError('Enter pair')
      return
    }
    if (!params.timeframe.trim()) {
      setError('Enter pair')
      return
    }
    close()
    botAdd(params.name.trim(), params.pair.trim(), params.timeframe.trim())
    // TODO: callback redirect
  }

  return (
    <>
      <label>bot name</label>
      <input type='text' name='name' onChange={onChange} />
      <label>pair</label>
      <input type='text' name='pair' onChange={onChange} />
      <label>timeframe</label>
      <input type='text' name='timeframe' onChange={onChange} />
      <small className='red'>{error}&nbsp;</small>

      <div className='row justify'>
        <div />
        <button className='btn green' onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  )
}
