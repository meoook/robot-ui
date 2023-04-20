import { useContext } from 'react'
import Container from '../components/container'
import { AppContext } from '../../context/AppContext'

interface Page404Props {
  children?: React.ReactNode
}
export default function Page404(props: Page404Props) {
  const { addMsg } = useContext(AppContext)
  const grades: string[] = ['default', 'info', 'success', 'warning', 'error']

  const doJob = () => {
    grades.forEach((grade, idx) => {
      setTimeout(() => {
        addMsg(grade, 'Fugiat tempore voluptas nobis, aperiam mollitia, ullam odio, ipsa animi!', 'Test', false)
      }, idx * 1000)
    })
  }

  return (
    <Container>
      <h1 onClick={doJob}>404 URL NOT FOUND</h1>
    </Container>
  )
}
