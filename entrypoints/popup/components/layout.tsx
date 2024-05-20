import InfoDefault from './info-default'
import InfoIframe from './info-iframe'
import { useStoreInfoDefault } from '@/store/info-default'

function Layout() {
  const { data: infoDefault } = useStoreInfoDefault()
  return (
    <>
      <InfoDefault />
      {infoDefault.isLocal ? null : <InfoIframe />}
    </>
  )
}

export default Layout
