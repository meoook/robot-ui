import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Container from '../components/container'
import Topbar from '../components/topbar'
import Bot from '../components/bot'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBots(props: PageBotsProps) {
  const { id } = useParams()
  const { accounts, bots } = useContext(AppContext)
  const accountBots = bots?.filter((bot) => bot.account === Number(id))

  const account = accounts.find((a) => a.id === Number(id))
  return (
    <Container>
      <Topbar />
      <div>create bot</div>
      {account ? accountBots.map((bot) => <Bot key={bot.id} bot={bot} />) : <div>Account with ID: {id} not found</div>}
    </Container>
  )
}
