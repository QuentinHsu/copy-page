import { browser } from 'wxt/browser'
import { useCopyToClipboard } from 'usehooks-ts'
import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import URLIcon from './url-icon'

import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Skeleton } from '@/components/Skeleton'
import { useStoreInfoDefault } from '@/store/info-default'

function InfoDefault() {
  const { setData: setStoreInfoDefault } = useStoreInfoDefault()
  const [infoPage, setInfoPage] = useState<InfoDefault>({ title: '', urlFull: '', urlNoQuery: '', urlMainSite: '', urlMainSiteTitle: '' })
  const [_copiedText, copy] = useCopyToClipboard()
  const [_copiedStatus, setCopiedStatus] = useState(false)
  const [loading, setLoading] = useState(false)

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
    try {
      setLoading(true)
      const activeTab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]
      const urlFull = decodeURIComponent(activeTab.url || '')
      // 是否为本地页面
      const isLocal = /^(?:file|chrome-extension|chrome|about|data|blob|javascript|view-source):/.test(urlFull)
      let newTab: InfoDefault = {
        title: '',
        urlFull: '',
        urlNoQuery: '',
        urlMainSite: '',
        urlMainSiteTitle: '',
        isLocal,
      }
      if (['chrome://newtab/', 'about:blank'].includes(urlFull)) {
        newTab = {
          title: 'New Tab',
          urlFull,
          urlNoQuery: '',
          urlMainSite: '',
          urlMainSiteTitle: '',
          isLocal,

        }
      }
      else {
        const urlNoQuery = urlFull.split('?')[0]
        const urlMainSite = `${urlFull.split('//')[0]}//${urlFull.split('//')[1].split('/')[0]}`

        const urlMainSiteTitle = await fetchTitle(urlMainSite)
        newTab = {
          title: activeTab.title || '',
          urlFull,
          urlNoQuery,
          urlMainSite,
          urlMainSiteTitle,
          isLocal,
        }
      }
      setInfoPage(newTab)
      setStoreInfoDefault(newTab)
    }
    catch (error) {
      console.error('[ error ]-54', error)
    }
    finally {
      setLoading(false)
    }
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
      <Card className="w-full h-full break-all">
        <CardHeader className="flex justify-start flex-row items-center">
          {loading

            ? (
              <>
                <Skeleton className="h-4 w-4 rounded" />

                <Skeleton className="h-4 w-full ml-1.5" />
              </>
              )

            : (
              <>
                { infoPage.isLocal
                  ? (
                    <>
                      This is a local page.
                    </>
                    )
                  : (
                    <>
                      <URLIcon className="w-4 h-4 rounded" url={infoPage.urlFull} />
                      <span className="ml-1.5">
                        {infoPage.urlMainSiteTitle
                          ? (
                            <>
                              {infoPage.urlMainSiteTitle}
                              {' '}
                              |
                              {' '}
                            </>
                            )
                          : null}
                        <Button
                          variant="link"
                          size="link"
                          onClick={() =>
                          // open the main site in a new tab
                            browser.tabs.create({ url: infoPage.urlMainSite })}
                        >
                          {infoPage.urlMainSite}
                        </Button>

                      </span>
                    </>
                    )}
              </>
              )}
        </CardHeader>
        <CardContent>

          <div className="text-nowrap flex justify-between items-center py-0.5">
            <div className="w-full">
              {loading ? <Skeleton className="h-4 " /> : (infoPage.title || 'No title')}
            </div>
            <Button className="ml-2.5 war" variant="ghost" size="icon" onClick={() => copyUrl(`${infoPage.title}`)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-nowrap flex justify-between items-center py-0.5">
            <div className="w-full">
              {loading
                ? <Skeleton className="h-4 " />
                : (
                  <span className="inline-block max-w-sm text-wrap">

                    {infoPage.urlNoQuery || 'No url'}
                  </span>
                  )}
            </div>
            <Button className="ml-2.5" variant="ghost" size="icon" onClick={() => copyUrl(`${infoPage.urlFull}`)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-1.5">
            <Button className="" variant="ghost" size="sm" onClick={() => copyUrl(`${infoPage.title}\n${infoPage.urlFull}`)}>
              <Copy className="w-4 h-4 mr-1" />
              {' '}
              Full
            </Button>
          </div>

        </CardContent>
      </Card>

    </>
  )
}

export default InfoDefault
