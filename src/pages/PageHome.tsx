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
      <BannerSm />
      {total && <TotalStats total={total} />}
      {/* <Banner title='Real time statistic' subtitle='Get actual information about trades'>
        <div />
      </Banner> */}
    </>
  )
}
