import type { SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Skeleton } from '@/components/Skeleton'
import { useStoreInfoDefault } from '@/store/info-default'

function InfoIframe() {
  const [iframes, setIframes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { data: infoDefault } = useStoreInfoDefault()

  // 绝不会存在 iframe 的页面

  // 一个点击事件 发送消息给content-script, 通知content-script获取当前页面的信息
  function onClickAnalysis() {
    try {
      setLoading(true)
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: { id: any }[]) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getIframeInfo' })
      })
    }
    catch (error) {
      console.error('获取 iframe 信息时出错:', error)
    }
  }
  // 监听来自content-script的消息，获取到iframe信息
  browser.runtime.onMessage.addListener((message: { type: string, iframes: SetStateAction<string[]> }) => {
    if (message.type === 'iframes')
      setIframes(message.iframes)
    setLoading(false)
  })

  useEffect(() => {
    browser.runtime.connect({ name: 'popup' })
  }, [])
  return (
    <>

      <Card className="w-full h-full mt-2">
        <CardHeader className="flex justify-between flex-row items-center">
          <div>
            <CardTitle className="text-lg">
              iframe
            </CardTitle>
            <CardDescription>
              Get all iframe elements on the current page
            </CardDescription>
          </div>
          <Button size="sm" variant="secondary" onClick={onClickAnalysis} disabled={loading}>
            Analysis
          </Button>
        </CardHeader>
        <CardContent>
          {
            loading
              ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                </>
                )
              : iframes.map((iframe, index) => (
                <div className="text-justify" key={index}>{(iframe)}</div>
              ))
          }
        </CardContent>
      </Card>
    </>
  )
}
export default InfoIframe
