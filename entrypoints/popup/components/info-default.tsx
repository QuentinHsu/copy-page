import { browser } from 'wxt/browser'
import { useCopyToClipboard } from 'usehooks-ts'
import { useEffect, useState } from 'react'
import URLIcon from './url-icon'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

interface InfoPage {
  title: string
  urlFull: string
  urlMain: string
}
function InfoDefault() {
  const [infoPage, setInfoPage] = useState<InfoPage>({ title: '', urlFull: '', urlMain: '' })
  const [_copiedText, copy] = useCopyToClipboard()
  const [_copiedStatus, setCopiedStatus] = useState(false)
  async function init() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    setInfoPage({ title: tabs[0].title || '', urlFull: tabs[0].url || '', urlMain: tabs[0].url?.split('?')[0] || '' })
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
            {infoPage.title}
          </span>
        </CardHeader>
        <CardContent>

          <div className="text-nowrap flex justify-between items-center py-0.5">
            {infoPage.title}
            <Button className="ml-2.5 war" variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.title}`)}>
              copy
            </Button>
          </div>
          <div className="text-nowrap flex justify-between items-center py-0.5">
            {infoPage.urlMain}
            <Button className="ml-2.5" variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.urlFull}`)}>
              copy
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={() => copyUrl(`${infoPage.title}\n${infoPage.urlFull}`)}>
            copy full
          </Button>
        </CardContent>
      </Card>

    </>
  )
}

export default InfoDefault
