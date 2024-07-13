import ReactDOM from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import NavRouter from './NavRouter'
import store from './store/store'
import { ModalState } from './store/ModalContext'
import PopupMsgs from './components/pop-msg'
import Header from './components/header'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Header />
      <PopupMsgs />
      <ModalState>
        <NavRouter />
      </ModalState>
    </Provider>
  </BrowserRouter>
)
