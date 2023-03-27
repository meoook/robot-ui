import Container from '../components/container'

interface Page404Props {
  children?: React.ReactNode
}
export default function Page404(props: Page404Props) {
  return (
    <Container>
      <h1>404 URL NOT FOUND</h1>
    </Container>
  )
}
