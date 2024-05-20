import { create } from 'zustand'

interface StoreInfoDefault {
  data: InfoDefault // Assign the correct type to the data property
  setData: (data: InfoDefault) => void
  getData: () => InfoDefault
}

export const useStoreInfoDefault = create<StoreInfoDefault>((set, get) => ({
  data: {
    title: '',
    urlFull: '',
    urlNoQuery: '',
    urlMainSite: '',
    urlMainSiteTitle: '',
  },
  setData: (data: InfoDefault) => {
    set(() => ({ data }))
  },

  getData: () => get().data,
}))
