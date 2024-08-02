import { useGetAccountQuery, useGetUserQuery } from '../store/srv.api'
import Email from '../components/email'
import TelegramNonce from '../components/telegram'
import Password from '../components/password'
import Card from '../components/card'
import Account from '../components/account'

interface PageUserProps {
  children?: React.ReactNode
}
export default function PageUser(props: PageUserProps) {
  const { data: user } = useGetUserQuery()
  const { data: account } = useGetAccountQuery(user?.account.id, { skip: !user?.account.id })

  return (
    <Card border={true}>
      {account && <Account account={account} />}
      <TelegramNonce telegram={user?.telegram_id} />
      <Email email={user?.email} />
      {user?.email && <Password />}
    </Card>
  )
}
