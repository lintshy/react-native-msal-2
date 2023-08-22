import { Platform } from 'react-native';

import RNMSAL from './nativeModule';
import type {
  MSALConfiguration,
  MSALInteractiveParams,
  MSALSilentParams,
  MSALAccount,
  MSALSignoutParams,
  IPublicClientApplication,
  ISharedPublicClientApplication
} from './types';

export class PublicClientApplication implements IPublicClientApplication {
  private isInitialized: boolean = false;

  constructor(private readonly config: MSALConfiguration) { }

  public async init() {
    if (!this.isInitialized) {
      await RNMSAL.createPublicClientApplication(this.config);
      this.isInitialized = true;
    }
    return this;
  }

  public async acquireToken(params: MSALInteractiveParams) {
    this.validateIsInitialized();
    return await RNMSAL.acquireToken(params);
  }

  public async acquireTokenSilent(params: MSALSilentParams) {
    this.validateIsInitialized();
    return await RNMSAL.acquireTokenSilent(params);
  }

  public async getAccounts() {
    this.validateIsInitialized();
    return await RNMSAL.getAccounts();
  }

  public async getAccount(accountIdentifier: string) {
    this.validateIsInitialized();
    return await RNMSAL.getAccount(accountIdentifier);
  }

  public async removeAccount(account: MSALAccount) {
    this.validateIsInitialized();
    return await RNMSAL.removeAccount(account);
  }

  public async signOut(params: MSALSignoutParams) {
    this.validateIsInitialized();
    return await Platform.select({
      ios: async () => await RNMSAL.signout(params),
      default: async () => await RNMSAL.removeAccount(params.account),
    })();
  }

  private validateIsInitialized() {
    if (!this.isInitialized) {
      throw new Error(
        'PublicClientApplication is not initialized. You must call the `init` method before any other method.'
      );
    }
  }
}

export class SharedPublicClientApplication implements ISharedPublicClientApplication {
  private isInitialized: boolean = false;

  constructor(private readonly config: MSALConfiguration) { }
  private validateIsInitialized() {
    if (!this.isInitialized) {
      throw new Error(
        'SharedPublicClientApplication is not initialized. You must call the `init` method before any other method.'
      );
    }
  }
  public async init() {
    if (!this.isInitialized) {
      await RNMSAL.createSharedPublicClientApplication(this.config);
      this.isInitialized = true;
    }
    return this;
  }

  public async acquireSharedToken(params: MSALInteractiveParams) {
    this.validateIsInitialized();
    return await RNMSAL.acquireSharedToken(params);
  }

  public async acquireSharedTokenSilent(params: MSALSilentParams) {
    this.validateIsInitialized();
    return await RNMSAL.acquireSharedTokenSilent(params);
  }

  public async getCurrentAccount() {
    this.validateIsInitialized();
    return await RNMSAL.getCurrentAccount();
  }

  public async signOutSharedAccount() {
    this.validateIsInitialized()
    return await RNMSAL.signOutSharedAccount()
  }
}
