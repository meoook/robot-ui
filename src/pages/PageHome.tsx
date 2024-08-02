import Banner from '../components/banner'
import imgRobo from '../svg/robo.png'

interface PageHomeProps {
  children?: React.ReactNode
}
export default function PageHome(props: PageHomeProps) {
  return (
    <>
      <Banner title={`Everyone's Favorite BOT`} subtitle='Earn maximum buy/sell delta with minimum amount of orders'>
        <img src={imgRobo} alt='Favorit BOT' width={448} height={448} />
      </Banner>
      <Banner title='Your Funds Protected' subtitle='No direct access to your funds'>
        <div />
      </Banner>
      <Banner title='Fee Only For Profit' subtitle='We take comission only from your profit'>
        <div />
      </Banner>
      <Banner title='Easy to use' subtitle='Start trading with few clicks'>
        <div />
      </Banner>
      <Banner title='Real time statistic' subtitle='Get actual information about trades'>
        <div />
      </Banner>
    </>
  )
}
