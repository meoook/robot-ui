import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import Page404 from './pages/Page404'
import PageHome from './pages/PageHome'
import PageLogin from './pages/PageLogin'
import PageUser from './pages/PageUser'
import PageAccounts from './pages/PageAccounts'
import PageBots from './pages/PageBots'
import PageBot from './pages/PageBot'

export default function NavRouter() {
  return (
    <Routes>
      <Route element={<LayoutProtected />}>
        <Route path='/profile' element={<PageUser />} />
        <Route path='/accounts' element={<PageAccounts />} />
        <Route path='/accounts/:id' element={<Page404 />} />
        <Route path='/bots' element={<PageBots />} />
        <Route path='/bots/:id' element={<PageBot />} />
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
