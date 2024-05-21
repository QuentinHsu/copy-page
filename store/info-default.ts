import { create } from 'zustand'

interface StoreInfoDefault {
  data: IInfoDefault // Assign the correct type to the data property
  setData: (data: IInfoDefault) => void
  getData: () => IInfoDefault
}

export const useStoreInfoDefault = create<StoreInfoDefault>((set, get) => ({
  data: {
    title: '',
    urlFull: '',
    urlNoQuery: '',
    urlMainSite: '',
    urlMainSiteTitle: '',
  },
  setData: (data: IInfoDefault) => {
    set(() => ({ data }))
  },

  getData: () => get().data,
}))
