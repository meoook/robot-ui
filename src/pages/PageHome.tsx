import Container from '../components/container'
import Icon from '../components/ico-get'
import IcoLang from '../components/ico-lang'

interface PageHomeProps {
  children?: React.ReactNode
}
export default function PageHome(props: PageHomeProps) {
  return (
    <Container>
      <div>Page home 🎼🦴🐾🚧🛰🚀💛</div>
      <div className='row justify'>
        <Icon name='add_o' />
        <Icon name='arrows' />
        <Icon name='arr_down' />
        <Icon name='apartment' />
        <Icon name='backup' />
        <Icon name='close' />
        <Icon name='check' />
        <Icon name='description' />
        <Icon name='document' />
        <Icon name='error' />
        <Icon name='folder_o' />
        <Icon name='key' />
        <Icon name='languages' />
        <Icon name='logout' />
        <Icon name='menu' />
        <Icon name='more' />
        <Icon name='info' />
        <Icon name='search' />
        <Icon name='settings' />
        <Icon name='settings_mob' />
        <Icon name='sorting' />
        <Icon name='splash' />
        <Icon name='storage' />
        <Icon name='statistic' />
        <Icon name='subject' />
        <Icon name='success' />
        <Icon name='tultip' />
        <Icon name='user' />
        <Icon name='warning' />
        <Icon name='work' />
        <Icon name='work_out' />
      </div>
      <div className='row justify'>
        <IcoLang name='chinese' />
        <IcoLang name='english' />
        <IcoLang name='german' />
        <IcoLang name='italian' />
        <IcoLang name='russian' />
        <IcoLang name='spanish' />
        <IcoLang name='world' />
        <IcoLang name='test' />
      </div>
    </Container>
  )
}
