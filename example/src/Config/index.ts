import type { B2CConfiguration } from '../Api'

export const tenantId =
    'c761cb3f-83ef-42d4-811f-6ff69406e602'
export const clientId =
    '73463e3e-25e8-43c9-b65e-2bf8229880b8'
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
        clientId,
        authorityBase: `https://login.microsoftonline.com/${tenantId}/`,
        policies: {
            signInSignUp: 'B2C_1_SignInUp',
            passwordReset: 'B2C_1_PasswordReset',
        },
        redirectUri:
            'msauth://com.rn.msal.example/gYfucgrOlZ3FLWgYctqk1bCxZbo%3D',
    },
    androidConfigOptions: {
        shared_device_mode_supported: true,
    },
}

export const userRoles: string[] = []

export const b2cScopes = [
    'api://73463e3e-25e8-43c9-b65e-2bf8229880b8/User.read',
]
export const graphScopes = ['User.Read']
