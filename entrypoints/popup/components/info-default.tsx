import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { browser } from 'wxt/browser'
import { useCopyToClipboard } from 'usehooks-ts'
import { useEffect, useState } from 'react';
interface InfoPage {
  title: string
  url: string
}
function InfoDefault () {

  const [infoPage, setInfoPage] = useState<InfoPage>({ title: '', url: '' })
  const [copiedText, copy] = useCopyToClipboard()
  const [copiedStatus, setCopiedStatus] = useState(false)
  async function init() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    setInfoPage({ title: tabs[0].title || '', url: tabs[0].url || ''  })
  }
  async function copyUrl(content: string) {
    try {
      copy(content)
      setCopiedStatus(true)
    } catch (error) {
      console.error(error)
      setCopiedStatus(false)
    }
  }
  useEffect(() => {
    init()
  })
  return (
    <>
      <div>
        {infoPage.title}
      <Button className='ml-2.5' variant={"ghost"} size={"sm"} onClick={() => copyUrl(`${infoPage.title}`)}>copy</Button>
      </div>
      <div>
        {infoPage.url}
      <Button className='ml-2.5' variant={"ghost"} size={"sm"} onClick={() => copyUrl(`${infoPage.url}`)}>copy</Button>
      </div>
      <Button variant={"ghost"} size={"sm"} onClick={() => copyUrl(`${infoPage.title}\n${infoPage.url}`)}>copy</Button>

    </>
  )
}

export default InfoDefault;