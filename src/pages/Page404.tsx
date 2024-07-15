import Container from '../components/container'
import { useAppDispatch } from '../store/hooks'
import { addMessage } from '../store/profile.slice'
import { IPopupOptions } from '../model'

interface Page404Props {
  children?: React.ReactNode
}
export default function Page404(props: Page404Props) {
  const dispatch = useAppDispatch()

  const addMsg = (msg: IPopupOptions) => {
    dispatch(addMessage(msg))
  }
  const grades: string[] = ['default', 'info', 'success', 'warning', 'error']

  const doJob = () => {
    grades.forEach((grade, idx) => {
      setTimeout(() => {
        addMsg({
          type: grade,
          text: 'Fugiat tempore voluptas nobis, aperiam mollitia, ullam odio, ipsa animi!',
          title: 'Test',
          nofade: false,
        })
      }, idx * 1000)
    })
  }

  return (
    <Container>
      <h1 onClick={doJob}>404 URL NOT FOUND</h1>
    </Container>
  )
}
