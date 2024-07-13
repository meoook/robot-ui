import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { ModalContext } from '../store/ModalContext'
import Container from '../components/container'
import Topbar from '../components/topbar'
import Modal from '../components/modal'
import Account from '../components/account'

interface PageAccountsProps {
  children?: React.ReactNode
}
export default function PageAccounts(props: PageAccountsProps) {
  const { accounts } = useContext(AppContext)
  const { modal, open } = useContext(ModalContext)

  return (
    <Container>
      {modal && (
        <Modal title='Create trading account'>
          <ModalAddAccount />
        </Modal>
      )}
      <Topbar>
        <button className='btn green' onClick={open}>
          Add account
        </button>
      </Topbar>
      {accounts?.map((account) => (
        <Account key={account.id} account={account} />
      ))}
      {accounts.length === 0 && <div>Add account to continue</div>}
    </Container>
  )
}

function ModalAddAccount() {
  const { accountAdd } = useContext(AppContext)
  const { close } = useContext(ModalContext)
  const [credentials, setCredentials] = useState({ apiKey: '', apiSecret: '' })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value })
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (!credentials.apiKey.trim()) {
      setError('Enter api key')
      return
    }
    if (!credentials.apiSecret.trim()) {
      setError('Enter api secret')
      return
    }
    close()
    accountAdd(credentials.apiKey.trim(), credentials.apiSecret.trim())
  }

  return (
    <>
      <label>api key</label>
      <input type='text' name='apiKey' onChange={onChange} />
      <label>api secret</label>
      <input type='text' name='apiSecret' onChange={onChange} />
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
