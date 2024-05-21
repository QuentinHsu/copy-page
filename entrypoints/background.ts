import type { Tabs } from 'wxt/browser'

export default defineBackground(() => {
// Listen for connection from popup
  browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
      // Listen for disconnect event from popup
      port.onDisconnect.addListener(async () => {
        // Send message to content script to stop observing
        const tabs: Tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true })
        browser.tabs.sendMessage(tabs[0].id || 0, { action: 'stopListeningIframe' })
      })
    }
  })
})
