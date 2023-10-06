import React, { useState, createContext, useEffect, useRef } from 'react'
import { AppState } from 'react-native'


import { getCompletedAudits, ApiOrchestratorInstance } from '../../Api';

import { useUserStore } from '../../Store';


export type ApiContext = {
    triggerPendingSync: () => Promise<void>,
    checkForPendingAudits: () => Promise<void>,
    pendingItemsToSync: Number,
    isSyncing: boolean
}
type ContainerProps = {
    children: React.ReactNode
}

export const ApiContext = createContext<ApiContext | undefined>(undefined)

export const ApiContextProvider = ({ children }: ContainerProps) => {

    const [pendingItemsToSync, setPendingItemsToSync] = useState<Number>(0)
    const { logoutUser, offline, setOffline, b2cClient, sharedB2CClient, user } = useUserStore()
    const appState = useRef(AppState.currentState);
    const [isSyncing, setIsSyncing] = useState<boolean>(false)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                const res = await sharedB2CClient.initAccountSignIn()
            }

            appState.current = nextAppState;
            console.log('AppState', appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        async function init() {
            console.log(user)
            await checkForPendingAudits()

        }
        init()
    }, [user?.email])

    const checkForPendingAudits = async () => {
        const pendingAudits = await getCompletedAudits(user, 'Pending')
        const havePendingAudits = pendingAudits.length
        console.log(`[pendingAuditsToSync] ${havePendingAudits}`)
        setPendingItemsToSync(havePendingAudits)
    }

    const triggerPendingSync = async () => {
        setIsSyncing(true)
        return ApiOrchestratorInstance.syncPendingAudits(user, sharedB2CClient).then(pendingAudits => {
            console.log(`[ApiProvider triggerPendingSync] - Sync succesful. Pending audits - ${pendingAudits}`)
            setPendingItemsToSync(pendingAudits.length)
        }).catch(error => {
            const out = {
                message: `[ApiProvider triggerPendingSync] - Sync failed.`,
                error
            }
            console.log(JSON.stringify(out))

        }).finally(() => setIsSyncing(false))

    }

    const context = {
        offline,
        checkForPendingAudits,
        pendingItemsToSync,
        setOffline,
        triggerPendingSync,
        isSyncing

    }
    return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>
}