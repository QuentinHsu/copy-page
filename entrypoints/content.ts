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
          const urls: string[] = []

          // 遍历所有的 iframe 元素
          iframes.forEach((iframe) => {
            // 获取到 iframe 的 src 属性
            const src = iframe.getAttribute('src')
            if (src)
              urls.push(decodeURIComponentRecursive(src))
          })

          // 向浏览器扩展后台发送消息，包含所有 iframe 的 src
          const postMessageData = <IContent['message']>{ action: postMessage.action, data: urls }
          browser.runtime.sendMessage(postMessageData)
        }, 1000)
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
    })
  },
})
