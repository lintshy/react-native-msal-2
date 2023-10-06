import type { B2CConfiguration } from '../Api'

export * from './env.config'

export const tenantId = 'x'
export const clientId = 'x'
export const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}/`,
    },
}

export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
}

export const b2cConfig: B2CConfiguration = {
    auth: {
        clientId: clientId,
        authorityBase: `https://login.microsoftonline.com/${tenantId}/`,
        policies: {
            signInSignUp: 'B2C_1_SignInUp',
            passwordReset: 'B2C_1_PasswordReset',
        },
        redirectUri: 'msauth://com.rn.msal.example.dev/x',
    },
    androidConfigOptions: {
        shared_device_mode_supported: true,
    },
}

export const userRoles: string[] = ['Audit.user']

export const b2cScopes = ['api://x/access']
export const graphScopes = ['User.Read']
