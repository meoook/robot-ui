import { useContext } from 'react'
import CreateBot from '../components/CreateBot'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import Pair from '../components/Pair'
import { ModalContext } from '../../context/ModalContext'
import { usePairs } from '../../hooks/pair'
import { IBot } from '../../objects/md_pair'

interface PageLandingProps {
  children?: React.ReactNode
}

export default function PageLanding(props: PageLandingProps) {
  const { pairs, loading, error, addBot } = usePairs()
  const { modal, open, close } = useContext(ModalContext)

  const createHandler = (boot: IBot) => {
    close()
  }
  return (
    <div className='container mx-auto max-w-2xl pt-5'>
      {loading && <Loader />}
      {error && <ErrorMessage error={error} />}
      {pairs.map((pair) => (
        <Pair key={pair.id} pair={pair} />
      ))}
      {modal && (
        <Modal title='Create new bot' onClose={close}>
          <CreateBot onCreate={createHandler} />
        </Modal>
      )}

      <button className='fixed bottom-5 right-5 rounded-full bg-red-700 text-white text-2xl px-4 py-2' onClick={open}>
        +
      </button>
    </div>
  )
}
