import type { SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { Activity, CirclePause } from 'lucide-react'
import type { Tabs } from 'wxt/browser'
import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Skeleton } from '@/components/Skeleton'
import { Toggle } from '@/components/Toggle'

function InfoIframe() {
  const [iframes, setIframes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  // 解析 iframe 信息的监听状态
  const [listening, setListening] = useState(false)

  // 取消或激活监听
  /**
   *
   * @param action - 操作类型
   */
  async function stopObserving(action: IInfoIframe['listeningAction']) {
    try {
      const tabs: Tabs.Tab[ ] = await browser.tabs.query({ active: true, currentWindow: true })
      browser.tabs.sendMessage(tabs[0].id || 0, { action })
    }
    catch (error) {
      console.error('获取 iframe 信息时出错：', error)
    }
  }
  // 一个点击事件 发送消息给 content-script, 通知 content-script 获取当前页面的信息
  function onClickAnalysis() {
    try {
      setShowContent(true)
      setLoading(true)
      stopObserving('startListeningIframe')
    }
    catch (error) {
      console.error('获取 iframe 信息时出错：', error)
    }
  }
  function onChangeToggle(value: boolean) {
    setListening(value)
    if (value)
      stopObserving('startListeningIframe')

    else
      stopObserving('stopListeningIframe')
  }
  // 监听来自 content-script 的消息，获取到 iframe 信息
  browser.runtime.onMessage.addListener((message: IContent['message']) => {
    if (message.action === 'startListeningIframe') {
      setIframes(Array.isArray(message.data) ? message.data : []) // Provide an empty array as the default value
      setListening(true)
    }
    else if (message.action === 'stopListeningIframe') {
      setListening(false)
    }
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
          <div className="flex items-center">
            <Toggle size="icon" onPressedChange={onChangeToggle} className="mr-1" pressed={listening}>
              {!listening ? <CirclePause className="h-4" /> : <Activity className="animate-ping h-2" />}

            </Toggle>
            <Button size="sm" variant="secondary" onClick={onClickAnalysis} disabled={loading}>
              Analysis
            </Button>
          </div>
        </CardHeader>
        {
          showContent
            ? (
              <>
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
              </>
              )
            : null
        }
      </Card>
    </>
  )
}
export default InfoIframe
