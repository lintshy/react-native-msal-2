import { Platform } from 'react-native';

import {
    MSALWebviewParams,
    SharedPublicClientApplication
} from 'react-native-msal-2';
import { intersection, isEmpty } from 'lodash'

import { b2cScopes, userRoles } from '../Config'
import { B2CConfiguration, B2CPolicies, B2CSignInParams, B2CSignOutParams, B2CSilentParams } from '../Models';
import { MSALHDResult, MSALHDAccount } from './B2CClient';

const webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: false,
};
export class SharedB2CClient {
    private static readonly B2C_PASSWORD_CHANGE = 'AADB2C90118';
    private static readonly B2C_EXPIRED_GRANT = 'AADB2C90080';
    private readonly policyUrls: B2CPolicies;
    private pca: SharedPublicClientApplication;

    /** Construct a B2CClient object
     * @param b2cConfig The configuration object for the B2CClient
     */
    constructor(b2cConfig: B2CConfiguration) {
        const { authorityBase, policies, ...restOfAuthConfig } = b2cConfig.auth;
        this.policyUrls = makePolicyUrls(authorityBase, policies);

        // Set the sign in sign up policy as the default authority for the PublicClientApplication (PCA).
        const authority = this.policyUrls.signInSignUp;

        // We need to provide all authorities we'll be using up front.
        // The default authority should be included in this list.
        const knownAuthorities = Object.values(this.policyUrls);

        this.pca = new SharedPublicClientApplication({
            ...b2cConfig,
            auth: { authority, knownAuthorities, ...restOfAuthConfig },
        });
    }

    public async init() {
        await this.pca.init();
        return this;
    }

    /** Initiates an interactive sign-in. If the user clicks "Forgot Password", and a reset password policy
     *  was provided to the client, it will initiate the password reset flow
     */
    public async signIn(params: B2CSignInParams): Promise<MSALHDResult> {



        try {
            console.log('[Shared B2CClient signIn] trying to signIn')

            // If we don't provide an authority, the PCA will use the one we passed to it when we created it
            // (the sign in sign up policy)
            const result = await this.pca.signInSharedAccount(params)

            console.log('[Shared B2CClient signIn] acquired token')

            if (!result) {
                throw new Error('Could not sign in: Result was undefined.');
            }
            return result;
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                error.message.includes(SharedB2CClient.B2C_PASSWORD_CHANGE) &&
                this.policyUrls.passwordReset
            ) {
                return await this.resetPassword(params);
            }
            throw error;

        }
    }

    public async getAccount() {
        return this.getAccountForRoles()
    }

    /** Gets a token silently. Will only work if the user is already signed in */
    public async acquireTokenSilent(params: B2CSilentParams): Promise<MSALHDResult> {
        const account = await this.getAccountForRoles();

        if (!account) {
            throw Error('Could not find existing account for sign in sign up policy');
            // We provide the account that we got when we signed in, with the matching sign in sign up authority
            // Which again, we set as the default authority so we don't need to provide it explicitly.

        }
        try {
            const result = await this.pca.acquireSharedTokenSilent({ ...params, account }) as MSALHDResult
            if (!result) {
                throw new Error('Could not acquire token silently: Result was undefined.');
            }
            return result;
        } catch (error: unknown) {
            const out = {
                message: '[Shared B2C Client]- Error while silent sign in, redirecting to log in page.',
                error
            }
            console.log(JSON.stringify(out))
            await this.pca.signOutSharedAccount();
            return this.signIn(params) as Promise<MSALHDResult>
        }
    }

    /** Returns true if a user is signed in, false if not */
    public async hasAccountChanged() {
        return this.pca.getCurrentAccount();

    }

    /** Removes all accounts from the device for this app. User will have to sign in again to get a token */
    public async signOut(params?: B2CSignOutParams) {

        await this.pca.signOutSharedAccount()
        return true;
    }

    private async resetPassword(params: B2CSignInParams) {
        const { webviewParameters: wvp, ...rest } = params;
        const webviewParameters: MSALWebviewParams = {
            ...wvp,
            // We use an ephemeral session because if we're resetting a password it means the user
            // is not using an identity provider, so we don't need a logged-in browser session
            ios_prefersEphemeralWebBrowserSession: true,
        };
        if (this.policyUrls.passwordReset) {
            // Because there is no prompt before starting an iOS ephemeral session, it will be quick to
            // open and begin before the other one has ended, causing an error saying that only one
            // interactive session is allowed at a time. So we have to slow it down a little
            if (Platform.OS === 'ios') {
                await delay(1000);
            }
            // Use the password reset policy in the interactive `acquireToken` call
            const authority = this.policyUrls.passwordReset;
            await this.pca.acquireSharedToken({ ...rest, webviewParameters, authority });
            // Sign in again after resetting the password
            return await this.signIn(params);
        } else {
            throw Error('B2CClient missing password reset policy');
        }
    }


    private getRolesFromUser(account: MSALHDAccount) {
        const foundRoles = account?.claims?.roles
        const overlap = intersection(foundRoles, userRoles)
        return overlap
    }

    private async getAccountForRoles(): Promise<MSALHDAccount | undefined> {
        const { currentAccount } = await this.pca.getCurrentAccount()
        console.log('in getAccountForRoles')
        if (!isEmpty(this.getRolesFromUser(currentAccount))) {
            return currentAccount
        }
        return undefined

    }

    public async isSignedIn(): Promise<boolean> {
        const account = await this.getAccountForRoles()
        return !!account
    }
    public async initAccountSignIn() {
        const { currentAccount, currentEvent, priorAccount } = await this.hasAccountChanged()

        if (currentAccount && currentEvent === 'onAccountLoaded') {
            console.log(currentAccount)
            const res = await this.acquireTokenSilent({ scopes: b2cScopes })
            return res

        }
        console.log(currentEvent)
        console.log(priorAccount)
        return this.signIn({ scopes: b2cScopes, webviewParameters });
    }
}

function makeAuthority(authorityBase: string, policyName: string) {
    return `${authorityBase}/${policyName}`;
}

function makePolicyUrls(authorityBase: string, policyNames: B2CPolicies): B2CPolicies {
    return Object.entries(policyNames).reduce(
        (prev, [key, policyName]) => ({ ...prev, [key]: makeAuthority(authorityBase, policyName) }),
        {} as B2CPolicies
    );
}

async function delay(ms: number) {
    return await new Promise<void>((resolve) => setTimeout(resolve, ms));
}