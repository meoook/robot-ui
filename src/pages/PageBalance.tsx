import { useGetUserQuery } from '../store/srv.api'
import Balance from '../components/balance'

interface PageBalanceProps {
  children?: React.ReactNode
}
export default function PageBalance(props: PageBalanceProps) {
  const { data: user } = useGetUserQuery()

  return <Balance user={user} />
}
