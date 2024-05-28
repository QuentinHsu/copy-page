import { useEffect, useState } from 'react'
import { Activity, CirclePause } from 'lucide-react'
import type { Tabs } from 'wxt/browser'
import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Skeleton } from '@/components/Skeleton'
import { Toggle } from '@/components/Toggle'

function InfoIframe() {
  const [iframes, setIframes] = useState<IIframe[]>([])
  const [loading, setLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  // 解析 iframe 信息的监听状态
  const [listening, setListening] = useState(false)
  // 是否开启过监听
  const [hasStartListening, setHasStartListening] = useState(false)

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
      setHasStartListening(true)
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
        <CardHeader>
          <div className="flex justify-between flex-row items-center">
            <CardTitle className="text-lg">
              iframe
              {
                iframes.length > 0
                  ? (
                    <>
                      {' '}
                      <span className="text-sm align-text-top">
                        {iframes.length}
                      </span>

                    </>
                    )
                  : null
              }
            </CardTitle>
            <div className="flex items-center">
              {
                hasStartListening
                  ? (
                    <Toggle size="icon" onPressedChange={onChangeToggle} className="mr-1" pressed={listening}>
                      {!listening ? <CirclePause className="h-4" /> : <Activity className="animate-ping h-2" />}
                    </Toggle>
                    )
                  : (
                    <Button size="sm" variant="secondary" onClick={onClickAnalysis} disabled={loading}>
                      Analysis
                    </Button>
                    )
              }

            </div>
          </div>
          <div>
            {
              showContent
                ? (
                  <div className="mt-2 max-h-48 overflow-auto">
                    {
                      loading
                        ? (
                          <div className="space-y-2">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4" />
                          </div>
                          )
                        : (
                          <>
                            {iframes.map((iframe, index) => (
                              <div key={index} className="text-justify  mb-2">
                                <CardIframe {...iframe} index={index} />
                              </div>
                            ))}
                          </>

                          )
                      }
                  </div>
                  )
                : null
            }
          </div>
        </CardHeader>
      </Card>
    </>
  )
}
export default InfoIframe

/**
 *
 * @param info - iframe 信息
 * @returns iframe 卡片
 */
function CardIframe(info: IIframe & { index: number }): JSX.Element {
  return (
    <Card className="w-full h-full bg-grid-white/[0.2] relative">
      <div className="absolute top-2 left-3">
        {info.index + 1}
      </div>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">
            {info.title}
          </CardTitle>
          <CardDescription>
            {info.url}
          </CardDescription>
        </div>
        <div className="flex items-center">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => browser.tabs.create({ url: info.url })}
          >
            Open
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
