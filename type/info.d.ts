interface IInfoDefault {
  title: string
  urlFull: string
  urlNoQuery: string
  urlMainSite: string
  urlMainSiteTitle: string
  isLocal?: boolean
}

interface IInfoIframe {
  listening: boolean
  listeningAction: 'startListeningIframe' | 'stopListeningIframe' | ''
}
