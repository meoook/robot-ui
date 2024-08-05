import Banner, { BannerSm } from '../components/banner'
import TotalStats from '../components/total'
import { useGetTotalQuery } from '../store/srv.api'
import imgRobo from '../svg/robo.png'

interface PageHomeProps {
  children?: React.ReactNode
}
export default function PageHome(props: PageHomeProps) {
  const { data: total } = useGetTotalQuery()

  return (
    <>
      <Banner title={`Everyone's Favorite BOT`} subtitle='Earn maximum buy/sell delta with minimum amount of orders'>
        <img src={imgRobo} alt='Favorit BOT' width={448} height={448} />
      </Banner>
      {total && <TotalStats total={total} />}
      <BannerSm />
    </>
  )
}

/*-- 
Real time statistic
 - Get actual information about trades
 - Powerfull statistic
 - Info about balance indicators and earn status
Notification system
--*/
