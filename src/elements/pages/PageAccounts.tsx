import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Account from '../components/account'
import Container from '../components/container'
import Topbar from '../components/topbar'

interface PageAccountsProps {
  children?: React.ReactNode
}
export default function PageAccounts(props: PageAccountsProps) {
  const { accounts } = useContext(AppContext)

  return (
    <Container>
      <Topbar>
        <button className='btn green'>Create</button>
      </Topbar>
      <div>create account</div>
      {accounts?.map((account) => (
        <Account account={account} />
      ))}
    </Container>
  )
}
