import {
    MSALConfiguration,
    MSALInteractiveParams,
    MSALSignoutParams,
    MSALSilentParams,
} from 'react-native-msal-2'

export interface B2CPolicies {
    signInSignUp: string
    passwordReset?: string
}

export type B2CConfiguration = Omit<
    MSALConfiguration,
    'auth'
> & {
    auth: {
        clientId: string
        authorityBase: string
        policies: B2CPolicies
        redirectUri?: string
    }
}
export type B2CSignInParams = Omit<
    MSALInteractiveParams,
    'authority'
>
export type B2CSilentParams = Pick<
    MSALSilentParams,
    'scopes' | 'forceRefresh'
>
export type B2CSignOutParams = Pick<
    MSALSignoutParams,
    'signoutFromBrowser' | 'webviewParameters'
>
