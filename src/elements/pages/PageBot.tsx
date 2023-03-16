import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Container from '../components/container'
import Topbar from '../components/topbar'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBot(props: PageBotsProps) {
  const { id } = useParams()
  const { botid } = useParams()
  const { bots } = useContext(AppContext)
  const bot = bots.find((b) => b.id === Number(botid) && b.account === Number(id))
  return (
    <Container>
      <Topbar />
      <div>Single bot ID: {botid}</div>
      {bot ? (
        <div>
          <div>
            <h1 className='row justify'>
              <div className='row'>
                <span className='pr-2'>{bot.pair}</span>
                <span>{bot.timeframe}</span>
              </div>
              <span>ID: {bot.id}</span>
            </h1>
            <small>{bot.name}</small>
          </div>
          <hr />
          {bot.error && <div>{bot.error}</div>}
          <div className='row justify'>
            <div className='col-2'>balance limit: {bot.balance_limit}</div>
            <div className='col-2'>circles limit: {bot.circles_limit}</div>
            <div className='col-2'>peak delta: {bot.peak_delta}</div>
          </div>
          <div className='row justify'>
            <div className='col-2'></div>
            <div className='col-2'>orders limit: {bot.orders_limit}</div>
            <div className='col-2'></div>
          </div>
        </div>
      ) : (
        <div>
          Bot with ID: {botid} for Account ID: {id} not found
        </div>
      )}
    </Container>
  )
}
