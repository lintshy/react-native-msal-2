
import React, { useState, createContext, useEffect } from 'react'
import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from 'react-query';
import DataWedgeIntents from 'react-native-datawedge-intents'

import { getAuditBucket, getDCBucket, getRouteQuestions, submitAuditToServer, purgeLocalStorage } from '../../Api/ApiCore';
import { DCLocation, AuditType, FinalAudit, DataWedgeIntent, ZebraEnabled, ApiStatus, AnsweredQuestion, AuditFormQuestion, SubmitKind, User } from '../../Models';
import { DataWedge } from '../../Constants';

import { useApiContext } from '../../Contexts/ApiContext';
import { useUserStore } from '../../Store';





export type AuditDataContext = {
    auditBucket: AuditType[],
    pickAuditType: (id: string) => AuditType,
    isAuditBucketLoading: boolean,
    dcLocations: DCLocation[],
    setDcLocations: React.Dispatch<React.SetStateAction<DCLocation[]>>,
    getDCLocations: () => Promise<DCLocation[]>,
    submitAudit: (audit: FinalAudit) => Promise<ApiStatus<FinalAudit>>,
    scannerResult: string,
    sendCommandToZebra: (extraName: string, extraValue: string) => void,
    zebraEnabled: ZebraEnabled
    auditSubmitted: number,
    selectedTab: AuditType,
    setSelectedTab: React.Dispatch<React.SetStateAction<AuditType>>,
    route: AnsweredQuestion[],
    setRoute: React.Dispatch<React.SetStateAction<AnsweredQuestion[]>>,
    routeData: UseQueryResult<AnsweredQuestion[], unknown>,
    purgeMutation: UseMutationResult<void, unknown, User, unknown>


};
type ContainerProps = {
    children: React.ReactNode
}

export const AuditDataContext = createContext<AuditDataContext | undefined>(undefined)

export const AuditDataContextProvider = ({ children }: ContainerProps) => {
    const [auditBucket, setAuditBucket] = useState<AuditType[]>([] as AuditType[])
    const [dcLocations, setDcLocations] = useState<DCLocation[]>([] as DCLocation[])
    const [zebraEnabled, setZebraEnabled] = useState<ZebraEnabled>({} as ZebraEnabled)
    const [route, setRoute] = useState<AnsweredQuestion[]>([])
    const [auditSubmitted, setAuditSubmitted] = useState<number>(0)
    const [datawedgeSubscription, setDatawedgeSubscription] = useState<EmitterSubscription>()
    const [selectedTab, setSelectedTab] = useState<AuditType>({} as AuditType)
    const [scannerResult, setScannerResult] = useState<string>('')
    const { data: auditTypes, error: auditBucketError, isLoading: isAuditBucketLoading } = useQuery('auditBucket', getAuditBucket)

    const routeData = useQuery('routeQuestions', getRouteQuestions)

    const { setOffline, getApiToken, getSharedApiToken } = useUserStore()
    const { checkForPendingAudits } = useApiContext()
    useEffect(() => {
        setDatawedgeSubscription(DeviceEventEmitter.addListener(DataWedge.ListenerEvent, (intent: DataWedgeIntent) => { broadcastReceiver(intent) }))
        registerBroadcastReceiver()
        determineVersion()
        return () => {
            datawedgeSubscription?.remove()
        };
    }, [])
    const registerBroadcastReceiver = () => {
        DataWedgeIntents.registerBroadcastReceiver({
            filterActions: [
                DataWedge.RecieverAction,
                DataWedge.SenderAction
            ],
            filterCategories: [
                DataWedge.DefaultCategory
            ]
        });
    }

    const broadcastReceiver = (intent: DataWedgeIntent) => {

        if (intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO']) {
            console.log(`[AuditProvider] Datawedge Init  version - ${intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO']?.DATAWEDGE}`)
            setZebraEnabled({
                version: intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO']?.DATAWEDGE,
                enabled: true
            })
            return
        }
        console.log(`[AuditProvider] Datawedge Scanner  result - ${intent['com.symbol.datawedge.data_string']}`)
        setScannerResult(intent['com.symbol.datawedge.data_string'] as string)
    }
    const sendCommandToZebra = (extraName: string, extraValue: string) => {
        console.log(`[Audit provider] - sending command to zebra scanner - ${extraName}`);
        const broadcastExtras = {
            [extraName]: extraValue,
            [DataWedge.ExtraSendResult]: null
        }
        DataWedgeIntents.sendBroadcastWithExtras({
            action: DataWedge.SendCommandAction,
            extras: broadcastExtras
        });
    }
    const determineVersion = () => {
        sendCommandToZebra(DataWedge.GetVersionAction, "");
    }
    useEffect(() => {
        setAuditBucket(auditTypes as AuditType[])
    }, [auditTypes])

    const submitAudit = async (audit: FinalAudit) => {
        const token = await getSharedApiToken()

        const response = await submitAuditToServer(audit, token)
        console.log(`[AuditDataContext SubmitAudit] audit submitted. offline status ${response.offline}`)
        if (response.offline) {
            await checkForPendingAudits()
        }
        setAuditSubmitted(auditSubmitted + 1)
        setOffline(response?.offline)
        return response
    }


    const pickAuditType = (id: string): AuditType => {
        const response = auditBucket.find(auditType => auditType.auditKind === id) || { questions: [], auditKind: '', optional: false, name: '', scanRequired: false }
        return response
    }
    const purgeMutation = useMutation((user: User) => {
        return purgeLocalStorage(user).then(d => {
            setAuditSubmitted(0)
        })
    })

    const getDCLocations = async (): Promise<DCLocation[]> => {
        const token = await getSharedApiToken()

        const dcLocations = await getDCBucket(token)
        return dcLocations
    }

    const context = {
        auditTypes,
        pickAuditType,
        auditBucket,
        isAuditBucketLoading,
        dcLocations,
        setDcLocations,
        getDCLocations,
        submitAudit,
        scannerResult,
        sendCommandToZebra,
        zebraEnabled,
        auditSubmitted,
        selectedTab,
        setSelectedTab,
        route,
        setRoute,
        routeData,
        purgeMutation
    }


    return (
        <AuditDataContext.Provider value={context}>{children}</AuditDataContext.Provider>
    );
}