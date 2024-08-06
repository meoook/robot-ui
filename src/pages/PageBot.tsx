import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IBot } from '../model'
import { useGetBotsQuery } from '../store/srv.api'
import Topbar from '../components/topbar'
import BotChange from '../components/bot-change'

interface PageBotsProps {
  children?: React.ReactNode
}
export default function PageBot(props: PageBotsProps) {
  const { id } = useParams()
  const { data: bots, isLoading } = useGetBotsQuery()

  const navigate = useNavigate()
  const [bot, setBot] = useState<IBot>()

  useEffect(() => {
    if (!isLoading) {
      const lookup = bots?.find((b) => b.id === Number(id))
      if (!lookup) navigate('/bots', { replace: true })
      else {
        setBot(lookup)
      }
    }
  }, [bots, id, isLoading, navigate])

  if (bot) return <BotChange bot={bot} />
  return (
    <Topbar>
      <div>Bot with ID: {id} not found</div>
    </Topbar>
  )
}
