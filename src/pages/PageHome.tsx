import Banner from '../components/banner'
import Icon from '../components/ico-get'
import IcoLang from '../components/ico-lang'
import { SvgFallingStars } from '../svg/star'
import imgRobo from '../svg/robo.png'

interface PageHomeProps {
  children?: React.ReactNode
}
export default function PageHome(props: PageHomeProps) {
  return (
    <>
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
        <Icon name='logout2' />
        <Icon name='menu' />
        <Icon name='metamask' />
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
        <Icon name='wallet' />
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
      <Banner title={`Everyone's Favorite BOT`} subtitle='Trade, earn, and own crypto on the all-in-one multichain DEX'>
        <img src={imgRobo} alt='Favorit BOT' />
      </Banner>
      <Banner title='Your Funds Protected' subtitle='No direct access to your funds'>
        <div />
      </Banner>
      <Banner title='Fee Only For Profit' subtitle='We take comission only from your profit'>
        <SvgFallingStars />
      </Banner>
    </>
  )
}
