export interface IGlobalStore {
    iterator: number
    walletReady: boolean
    location: {
        path: string
        context: any
    }
}