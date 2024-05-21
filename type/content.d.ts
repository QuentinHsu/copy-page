interface IContent {
  // browser.runtime.onMessage.addListener message type
  message: OnMessage
}
interface OnMessage {
  action: IInfoIframe['listeningAction']
  data?: Array<object> | object
}
