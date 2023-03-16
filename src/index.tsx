import ReactDOM from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { ModalState } from './context/ModalContext'
import { AppState } from './context/AppState'
import NavRouter from './NavRouter'
import PopupMsgs from './elements/components/PopupMessage'
import Header from './elements/components/header/index'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <AppState>
      <Header />
      <PopupMsgs />
      <ModalState>
        <NavRouter />
      </ModalState>
    </AppState>
  </BrowserRouter>
)
