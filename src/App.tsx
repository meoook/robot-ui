import * as React from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom'
import Navigation from './elements/components/Navigation'

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false
    setTimeout(callback, 100)
  },
}

export { fakeAuthProvider }

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <h1>Auth Example</h1>
      <AuthStatus />

      <Routes>
        <Route element={<LayoutProtected />}>
          <Route path='/accounts' element={<ProtectedPage />} />
          <Route path='/bots' element={<ProtectedPage2 />} />
        </Route>
        <Route element={<LayoutNotAuthed />}>
          <Route path='/login' element={<LoginPage />} />
        </Route>
        <Route path='/' element={<PublicPage />} />
        <Route path='/public' element={<PublicPage2 />} />
      </Routes>
    </AuthProvider>
  )
}

function LayoutProtected() {
  let auth = useAuth()
  let location = useLocation()

  if (!auth.user) return <Navigate to='/login' state={{ from: location }} replace />
  return <Outlet />
}

function LayoutNotAuthed() {
  let auth = useAuth()
  if (auth.user) return <Navigate to='/' replace />
  return <Outlet />
}

interface AuthContextType {
  user: any
  signin: (user: string, callback: VoidFunction) => void
  signout: (callback: VoidFunction) => void
}

let AuthContext = React.createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null)

  let signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser)
      callback()
    })
  }

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null)
      callback()
    })
  }

  let value = { user, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return React.useContext(AuthContext)
}

function AuthStatus() {
  let auth = useAuth()
  let navigate = useNavigate()

  if (!auth.user) return <p>You are not logged in.</p>

  return (
    <p>
      Welcome {auth.user}!
      <button
        onClick={() => {
          auth.signout(() => navigate('/'))
        }}>
        Sign out
      </button>
    </p>
  )
}

function LoginPage() {
  let navigate = useNavigate()
  let location = useLocation()
  let auth = useAuth()

  let from = location.state?.from?.pathname || '/'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    let username = formData.get('username') as string

    auth.signin(username, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true })
    })
  }

  return (
    <div>
      <p>You must log in to view the page at {from}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name='username' type='text' />
        </label>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

function PublicPage() {
  return <h3>Public</h3>
}

function PublicPage2() {
  return <h3>Public2</h3>
}

function ProtectedPage() {
  return <h3>Protected</h3>
}

function ProtectedPage2() {
  return <h3>Protected2</h3>
}
