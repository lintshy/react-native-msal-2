import { create } from 'zustand'

import {
    MSALHDResult,
    B2CClient,
    SharedB2CClient,
} from '../../Api'
import {
    b2cConfig,
    b2cScopes,
    graphScopes,
} from '../../Config'

interface UserStore {
    user: any
    getUser: (res: MSALHDResult) => Promise<any>
    setUser: (user: any) => void

    setAccessToken: (value: string) => void
    setB2CClient: (value: B2CClient) => void
    accessToken: string
    getApiToken: () => Promise<string>
    getGraphToken: () => Promise<string>
    b2cClient: B2CClient
    sharedB2CClient: SharedB2CClient
    setSharedB2CClient: (value: SharedB2CClient) => void
    logoutUser: () => Promise<void>
    offline: boolean
    setOffline: (value: boolean) => void
    initB2CClient: () => Promise<void>
    initSharedB2CClient: () => Promise<void>
    logoutSharedUser: () => Promise<void>
    getSharedApiToken: () => Promise<string>
}

const client = new B2CClient(b2cConfig)
const sharedClient = new SharedB2CClient(b2cConfig)
export const useUserStore = create<UserStore>(
    (set, get) => ({
        user: {} as any,

        accessToken: '',
        b2cClient: client,
        sharedB2CClient: sharedClient,
        offline: false,
        setOffline: (offline: boolean) =>
            set((state) => ({ offline })),
        setAccessToken: (accessToken: string) =>
            set((state) => ({ accessToken })),
        setB2CClient: (b2cClient: B2CClient) =>
            set((state) => ({ b2cClient })),
        initB2CClient: async () => {
            const initializedB2CClient =
                await get().b2cClient.init()
            set(() => ({ b2cClient: initializedB2CClient }))
        },

        setSharedB2CClient: (
            sharedClient: SharedB2CClient,
        ) =>
            set((state) => ({
                sharedB2CClient: sharedClient,
            })),
        initSharedB2CClient: async () => {
            const initializedB2CClient =
                await get().sharedB2CClient.init()
            set(() => ({
                sharedB2CClient: initializedB2CClient,
            }))
        },
        getApiToken: async (): Promise<string> => {
            console.log(
                `[AuthProvider] Using new token via silent sign in for API call.`,
            )
            const res =
                await get().b2cClient.acquireTokenSilent({
                    scopes: b2cScopes,
                })
            return res?.accessToken
        },
        getSharedApiToken: async (): Promise<string> => {
            console.log(
                `[AuthProvider] Using new token via silent sign shared in for API call.`,
            )
            const res =
                await get().sharedB2CClient.acquireTokenSilent(
                    { scopes: b2cScopes },
                )
            return res?.accessToken
        },
        getGraphToken: async (): Promise<string> => {
            const res =
                await get().b2cClient.acquireTokenSilent({
                    scopes: graphScopes,
                })
            return res?.accessToken
        },
        logoutUser: async (): Promise<void> => {
            await get().b2cClient.signOut()
        },
        logoutSharedUser: async (): Promise<void> => {
            await get().sharedB2CClient.signOut()
        },

        setUser: (user: any) => set((state) => ({ user })),
        getUser: async (
            res: MSALHDResult,
        ): Promise<any> => {
            const name: string = res?.account?.claims
                ?.name as string
            const email: string =
                res?.account?.username?.toLowerCase()
            const [lastName, firstName] = name?.split(', ')

            // TODO check after adding user to group

            return { firstName, lastName, email }
        },
    }),
)
