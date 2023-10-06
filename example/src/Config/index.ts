import type { B2CConfiguration } from '../Api'

export * from './env.config'

export const tenantId =
    'fe99bbb3-bdc3-4260-998e-c28159c895a2'
export const clientId =
    '8be6111f-c94e-4a55-9e56-4aaa9936bdc1'
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
        redirectUri:
            'msauth://com.rn.msal.example.dev/2lwrqqCAKszjWEvpP6zhKNWpMSo%3D',
    },
    androidConfigOptions: {
        shared_device_mode_supported: true,
    },
}

export const userRoles: string[] = ['Audit.user']

export const b2cScopes = [
    'api://8be6111f-c94e-4a55-9e56-4aaa9936bdc1/access',
]
export const graphScopes = ['User.Read']
