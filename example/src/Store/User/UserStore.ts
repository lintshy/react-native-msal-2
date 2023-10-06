import { create } from 'zustand'

import { DCLocation, User } from '../../Models'
import { MSALHDResult, getProfilePicture, getUserFromApi, updatePreferredLocationToServer, B2CClient, SharedB2CClient } from '../../Api'
import { b2cConfig, b2cScopes, graphScopes } from '../../Config'

interface UserStore {
    user: User
    getUser: (res: MSALHDResult) => Promise<User>,
    setUser: (user: User) => void,
    selectedDC: DCLocation,
    setSelectedDC: (value: DCLocation) => void,
    updatePreferredLocation: (dcLocation: DCLocation) => Promise<void>,
    setAccessToken: (value: string) => void
    setB2CClient: (value: B2CClient) => void,
    accessToken: string,
    getApiToken: () => Promise<string>
    getGraphToken: () => Promise<string>,
    b2cClient: B2CClient,
    sharedB2CClient: SharedB2CClient,
    setSharedB2CClient: (value: SharedB2CClient) => void,
    logoutUser: () => Promise<void>,
    offline: boolean,
    setOffline: (value: boolean) => void
    initB2CClient: () => Promise<void>
    initSharedB2CClient: () => Promise<void>
    logoutSharedUser: () => Promise<void>,
    getSharedApiToken: () => Promise<string>

}

const client = new B2CClient(b2cConfig);
const sharedClient = new SharedB2CClient(b2cConfig)
export const useUserStore = create<UserStore>((set, get) => ({
    user: {} as User,
    selectedDC: {} as DCLocation,
    accessToken: '',
    b2cClient: client,
    sharedB2CClient: sharedClient,
    offline: false,
    setOffline: (offline: boolean) => set((state) => ({ offline })),
    setAccessToken: (accessToken: string) => set((state) => ({ accessToken })),
    setB2CClient: (b2cClient: B2CClient) => set((state) => ({ b2cClient })),
    initB2CClient: async () => {
        const initializedB2CClient = await get().b2cClient.init()
        set(() => ({ b2cClient: initializedB2CClient }))
    },

    setSharedB2CClient: (sharedClient: SharedB2CClient) => set((state) => ({ sharedB2CClient: sharedClient })),
    initSharedB2CClient: async () => {
        const initializedB2CClient = await get().sharedB2CClient.init()
        set(() => ({ sharedB2CClient: initializedB2CClient }))
    },
    getApiToken: async (): Promise<string> => {
        console.log(`[AuthProvider] Using new token via silent sign in for API call.`)
        const res = await get().b2cClient.acquireTokenSilent({ scopes: b2cScopes })
        return res?.accessToken
    },
    getSharedApiToken: async (): Promise<string> => {
        console.log(`[AuthProvider] Using new token via silent sign shared in for API call.`)
        const res = await get().sharedB2CClient.acquireTokenSilent({ scopes: b2cScopes })
        return res?.accessToken
    },
    getGraphToken: async (): Promise<string> => {
        const res = await get().b2cClient.acquireTokenSilent({ scopes: graphScopes })
        return res?.accessToken
    },
    logoutUser: async (): Promise<void> => {
        await get().b2cClient.signOut()
    },
    logoutSharedUser: async (): Promise<void> => {
        await get().sharedB2CClient.signOut()
    },
    setSelectedDC: (selectedDC: DCLocation) => set((state) => ({ selectedDC })),
    setUser: (user: User) => set((state) => ({ user })),
    getUser: async (res: MSALHDResult): Promise<User> => {
        const { data: users, offline } = await getUserFromApi(res)

        const name: string = res?.account?.claims?.name as string
        const email: string = res?.account?.username?.toLowerCase()
        const [lastName, firstName] = name?.split(', ')
        const loggedInUser = users[0]
        get().setOffline(offline)
        // TODO check after adding user to group
        try {
            const graphToken = await get().getGraphToken()
            const imageUrl = await getProfilePicture(graphToken)

            return { ...loggedInUser, imageUrl, firstName, lastName, email }
        }
        catch (error) {

            console.warn('[User Image error] - unable to fetch profile picture from graph. Using default picture.')
            return { ...loggedInUser, firstName, lastName, email }
        }

    },
    updatePreferredLocation: async (dcLocation: DCLocation) => {
        try {
            const token = await get().getSharedApiToken()
            const { data, offline } = await updatePreferredLocationToServer({ preferredLocation: dcLocation?.shortName }, token)
            get().setOffline(offline)
        }
        finally {
            get().setSelectedDC(dcLocation)
            get().setUser({ ...get().user, preferredLocation: dcLocation.shortName })
        }

    }
}))