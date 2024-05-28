import InfoDefault from './info-default'
import InfoIframe from './info-iframe'
import { useStoreInfoDefault } from '@/store/info-default'

function Layout() {
  const { data: infoDefault } = useStoreInfoDefault()
  return (
    <>
      <div className="bg-grid-white/[0.2]">

        <InfoDefault />
        {infoDefault.urlFull === ''
          ? null
          : infoDefault.isLocal ? null : <InfoIframe />}
      </div>

    </>
  )
}

export default Layout
