import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Page404 from './pages/Page404'
import PageAccounts from './pages/PageAccounts'
import PageBot from './pages/PageBot'
import PageBots from './pages/PageBots'
import PageHome from './pages/PageHome'
import PageLogin from './pages/PageLogin'
import PageUser from './pages/PageUser'
import { useAppSelector } from './store/hooks'

export default function NavRouter() {
  return (
    <Routes>
      <Route element={<LayoutProtected />}>
        <Route path='/user' element={<PageUser />} />
        <Route path='/accounts' element={<PageAccounts />} />
        <Route path='/accounts/:id' element={<PageBots />} />
        <Route path='/accounts/:id/:botid' element={<PageBot />} />
      </Route>
      <Route element={<LayoutNotAuthed />}>
        <Route path='/login' element={<PageLogin />} />
      </Route>
      <Route path='/' element={<PageHome />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

function LayoutProtected() {
  const { token } = useAppSelector((state) => state.profile)

  if (!token) return <Navigate to='/login' replace />
  return <Outlet />
}

function LayoutNotAuthed() {
  const { token } = useAppSelector((state) => state.profile)

  if (token) return <Navigate to='/' replace />
  return <Outlet />
}
