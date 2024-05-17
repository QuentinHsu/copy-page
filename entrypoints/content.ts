export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    /// 定义一个函数来获取所有的iframe元素
    let observer: MutationObserver
    function getAllIframes(): void {
      // 定义一个内部函数，用于在特定时间后获取所有的iframe元素
      function getIframes(): void {
        setTimeout(() => {
          const iframes = document.querySelectorAll('iframe')
          const urls: string[] = []

          // 遍历所有的iframe元素
          iframes.forEach((iframe) => {
            // 获取到 iframe 的 src 属性
            const src = iframe.getAttribute('src')
            if (src)

              urls.push(decodeURIComponent(src))
          })

          // 向浏览器扩展后台发送消息，包含所有iframe的src
          browser.runtime.sendMessage({ type: 'iframes', iframes: urls })
        }, 1000)
      }

      // 立即获取所有的 iframe
      getIframes()

      // 创建一个观察器实例，用于监听DOM变化
      observer = new MutationObserver(() => {
        getIframes()
      })

      // 配置观察器，监听对body元素的直接或间接子节点的增删改
      observer.observe(document.body, { childList: true, subtree: true })
    }

    // 监听名为 getIframeInfo 的消息
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === 'getIframeInfo')
        getAllIframes()

      // 监听名为 stopObserving 的消息
      if (message.action === 'stopObserving')
        observer.disconnect()
    })
  },
})
