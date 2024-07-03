import ReactDOM from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ModalState } from './context/ModalContext'
import NavRouter from './NavRouter'
import Header from './elements/components/header/index'
import PopupMsgs from './elements/components/pop-msg'
import store from './store/store'

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
