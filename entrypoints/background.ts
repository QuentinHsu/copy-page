export default defineBackground(() => {
// Listen for connection from popup
  browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
      // Listen for disconnect event from popup
      port.onDisconnect.addListener(() => {
        // Send message to content script to stop observing
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: { id: any }[]) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'stopObserving' })
        })
      })
    }
  })
})
