import { useContext } from 'react'
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import LoaderCar from './elements/components/loader-car'
import Page404 from './elements/pages/Page404'
import PageAccounts from './elements/pages/PageAccounts'
import PageBot from './elements/pages/PageBot'
import PageBots from './elements/pages/PageBots'
import PageHome from './elements/pages/PageHome'
import PageLogin from './elements/pages/PageLogin'
import PageRegister from './elements/pages/PageRegister'

export default function NavRouter() {
  return (
    <Routes>
      <Route element={<LayoutProtected />}>
        <Route path='/accounts' element={<PageAccounts />} />
        <Route path='/accounts/:id' element={<PageBots />} />
        <Route path='/accounts/:id/:botid' element={<PageBot />} />
      </Route>
      <Route element={<LayoutNotAuthed />}>
        <Route path='/login' element={<PageLogin />} />
        <Route path='/reg' element={<PageRegister />} />
      </Route>
      <Route path='/' element={<PageHome />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

function LayoutProtected() {
  const { token, loading } = useContext(AppContext)
  let location = useLocation()

  if (!token) return <Navigate to='/login' state={{ from: location }} replace />
  if (loading) return <LoaderCar />
  return <Outlet />
}

function LayoutNotAuthed() {
  const { user, loading } = useContext(AppContext)
  if (loading) return <LoaderCar />
  if (user) return <Navigate to='/' replace />
  return <Outlet />
}
