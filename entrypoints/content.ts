import { decodeURIComponentRecursive } from '@/lib/utils'

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    /// 定义一个函数来获取所有的 iframe 元素
    let postMessage: IContent['message'] = { action: '' }
    let observer: MutationObserver
    function getAllIframes(): void {
      // 定义一个内部函数，用于在特定时间后获取所有的 iframe 元素
      function getIframes(): void {
        setTimeout(() => {
          const iframes = document.querySelectorAll('iframe')

          // 遍历所有的 iframe 元素
          // 暂时停止监听 DOM 变化
          observer.disconnect()
          const newDataIframes: IIframe[] = []
          iframes.forEach((iframe) => {
            setIframeTag(iframe)
            const title = iframe.getAttribute('title') || ''
            const src = decodeURIComponentRecursive(iframe.getAttribute('src') || '')

            if (src)
              newDataIframes.push({ title, url: src, urlMainSite: '', urlMainSiteTitle: '' })
          })

          // 向浏览器扩展后台发送消息，包含所有 iframe 的 src
          const postMessageData = <IContent['message']>{ action: postMessage.action, data: newDataIframes }
          browser.runtime.sendMessage(postMessageData)
          observer.observe(document.body, { childList: true, subtree: true })
        }, 2000)
      }

      // 立即获取所有的 iframe
      if (postMessage.action === 'startListeningIframe')
        getIframes()

      // 创建一个观察器实例，用于监听 DOM 变化
      observer = new MutationObserver(() => {
        getIframes()
      })

      // 配置观察器，监听对 body 元素的直接或间接子节点的增删改
      observer.observe(document.body, { childList: true, subtree: true })
    }

    // 监听名为 getIframeInfo 的消息
    browser.runtime.onMessage.addListener((message: IContent['message']) => {
      postMessage = message
      if (message.action === 'startListeningIframe')
        getAllIframes()

      // 监听名为 stopObserving 的消息
      if (message.action === 'stopListeningIframe')
        observer.disconnect()
      // document.querySelectorAll('#copy-page-iframe-tag').forEach(tag => tag.remove())
    })
  },
})
function setIframeTag(iframe: HTMLIFrameElement) {
  const div = document.createElement('div')
  div.setAttribute('id', 'copy-page-iframe-tag')

  Object.assign(div.style, {
    position: 'absolute',
    top: `${iframe.offsetTop}px`,
    left: `${iframe.offsetLeft}px`,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '5px',
    fontSize: '12px',
    borderRadius: '5px',
  })

  div.textContent = decodeURIComponentRecursive(iframe.getAttribute('src') || '')

  if (iframe.parentNode && !iframe.parentNode.querySelector('#copy-page-iframe-tag'))
    iframe.parentNode.insertBefore(div, iframe)
}
