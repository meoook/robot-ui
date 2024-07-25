// import { Navigate } from 'react-router-dom'
import { useGetUserQuery } from '../store/srv.api'
import Email from '../components/email'
import TelegramNonce from '../components/telegram'
import Password from '../components/password'
import Card from '../components/card'

interface PageUserProps {
  children?: React.ReactNode
}
export default function PageUser(props: PageUserProps) {
  const { data: user } = useGetUserQuery(null)

  // if (!user) return <Navigate to='/' replace />
  return (
    <Card border={true}>
      <TelegramNonce telegram={user?.telegram_id} />
      <Email email={user?.email} />
      {user?.email && <Password />}
    </Card>
  )
}
