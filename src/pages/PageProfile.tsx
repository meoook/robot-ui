import { useGetAccountQuery, useGetUserQuery } from '../store/srv.api'
import Email from '../components/email'
import TelegramNonce from '../components/telegram'
import Password from '../components/password'
import Card from '../elements/card'
import Account from '../components/account'

interface PageProfileProps {
  children?: React.ReactNode
}
export default function PageProfile(props: PageProfileProps) {
  const { data: user } = useGetUserQuery()
  const { data: account } = useGetAccountQuery(user?.account.id, { skip: !user?.account.id })

  return (
    <Card border={true}>
      {account && <Account account={account} />}
      <hr />
      <TelegramNonce telegram={user?.telegram_id} />
      <hr />
      <Email email={user?.email || ''} />
      <hr />
      {user?.email && <Password />}
    </Card>
  )
}
