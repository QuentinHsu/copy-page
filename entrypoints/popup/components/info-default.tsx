import { browser } from 'wxt/browser'
import { useCopyToClipboard } from 'usehooks-ts'
import { useEffect, useState } from 'react'
import URLIcon from './url-icon'
import InfoIframe from './info-iframe'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

interface InfoPage {
  title: string
  urlFull: string
  urlNoQuery: string
  urlMainSite: string
  urlMainSiteTitle: string
}
function InfoDefault() {
  const [infoPage, setInfoPage] = useState<InfoPage>({ title: '', urlFull: '', urlNoQuery: '', urlMainSite: '', urlMainSiteTitle: '' })
  const [_copiedText, copy] = useCopyToClipboard()
  const [_copiedStatus, setCopiedStatus] = useState(false)

  async function fetchTitle(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      return doc.title
    }
    catch (error) {
      console.error('获取网页内容时出错:', error)
      return ''
    }
  }
  async function init() {
    const activeTab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]
    const urlFull = decodeURIComponent(activeTab.url || '')
    const urlNoQuery = urlFull.split('?')[0]
    const urlMainSite = `${urlFull.split('//')[0]}//${urlFull.split('//')[1].split('/')[0]}`

    const urlMainSiteTitle = await fetchTitle(urlMainSite)
    setInfoPage({
      title: activeTab.title || '',
      urlFull,
      urlNoQuery,
      urlMainSite,
      urlMainSiteTitle,
    })
  }
  async function copyUrl(content: string) {
    try {
      await copy(content)
      setCopiedStatus(true)
    }
    catch (error) {
      console.error(error)
      setCopiedStatus(false)
    }
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="flex justify-start flex-row items-center">
          <URLIcon className="w-4 h-4 rounded" url={infoPage.urlFull} />
          <span className="ml-1.5">
            {infoPage.urlMainSiteTitle}
            {' '}
            |
            {' '}
            {infoPage.urlMainSite}
          </span>
        </CardHeader>
        <CardContent>

          <div className="text-nowrap flex justify-between items-center py-0.5">
            {infoPage.title || 'No title'}
            <Button className="ml-2.5 war" variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.title}`)}>
              Copy
            </Button>
          </div>
          <div className="text-nowrap flex justify-between items-center py-0.5">
            {infoPage.urlNoQuery || 'No url'}
            <Button className="ml-2.5" variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.urlFull}`)}>
              Copy
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.title}\n${infoPage.urlFull}`)}>
            Copy full
          </Button>
          <InfoIframe />
        </CardContent>
      </Card>

    </>
  )
}

export default InfoDefault
