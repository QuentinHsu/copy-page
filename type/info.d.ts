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
  data: IIframe[] | []
}
interface IIframe {
  title: string
  url: string
  urlMainSite: string
  urlMainSiteTitle: string
  isLocal?: boolean
}
