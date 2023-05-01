import { Navigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Container from '../components/container'
import InputTextField from '../components/input-fields'
import Email from '../components/email'

interface PageUserProps {
  children?: React.ReactNode
}
export default function PageUser(props: PageUserProps) {
  const { user, register } = useContext(AppContext)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const onChange = (name: string, value: string) => setCredentials({ ...credentials, [name]: value })

  const onRegister = () => register(credentials)

  if (!user) return <Navigate to='/' replace />
  return (
    <Container>
      {user.admin && <div>Admin User</div>}
      <div>Address: {user.address}</div>
      <Email email={user.email} />
      <div>Change password</div>
    </Container>
  )
}
