import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import Container from '../components/container'
import Email from '../components/email'
import { useGetUserQuery } from '../store/srv.api'

interface PageUserProps {
  children?: React.ReactNode
}
export default function PageUser(props: PageUserProps) {
  const { data: user } = useGetUserQuery(null)

  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const onChange = (name: string, value: string) => setCredentials({ ...credentials, [name]: value })

  if (!user) return <Navigate to='/' replace />
  return (
    <Container>
      <div>Address: {user.address}</div>
      <Email email={user.email} />
      <div>Set telegram</div>
      <div>Change password</div>
    </Container>
  )
}
