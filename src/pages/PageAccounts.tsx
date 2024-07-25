import { useContext, useState } from 'react'
import { ModalContext } from '../store/ModalContext'
import { useCreateAccountMutation, useGetAccountsQuery } from '../store/srv.api'
import { IAccountCreate } from '../model'
import Container from '../components/container'
import Topbar from '../components/topbar'
import Modal from '../components/modal'
import Account from '../components/account'

interface PageAccountsProps {
  children?: React.ReactNode
}
export default function PageAccounts(props: PageAccountsProps) {
  const { data } = useGetAccountsQuery()
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
      {data?.map((account) => (
        <Account key={account.id} account={account} />
      ))}
      {data?.length === 0 && <div>Add account to continue</div>}
    </Container>
  )
}

function ModalAddAccount() {
  const [addAccount] = useCreateAccountMutation()
  const { close } = useContext(ModalContext)
  const [credentials, setCredentials] = useState<IAccountCreate>({ name: '', api_key: '', api_secret: '' })
  const [error, setError] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value.trim() })
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (!credentials.name.trim()) {
      setError('Invalid name')
      return
    }
    if (!credentials.api_key.trim()) {
      setError('Enter api key')
      return
    }
    if (!credentials.api_secret.trim()) {
      setError('Enter api secret')
      return
    }
    close()
    addAccount(credentials)
  }

  return (
    <>
      <label>name</label>
      <input type='text' name='name' onChange={onChange} />
      <label>api key</label>
      <input type='text' name='api_key' onChange={onChange} />
      <label>api secret</label>
      <input type='text' name='api_secret' onChange={onChange} />
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
