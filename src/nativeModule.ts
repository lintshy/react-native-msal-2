import { NativeModules } from 'react-native';

import type {
  MSALResult,
  MSALInteractiveParams,
  MSALSilentParams,
  MSALSignoutParams,
  MSALAccount,
  MSALConfiguration,
} from './types';

type RNMSALNativeModule = {
  createPublicClientApplication(config: MSALConfiguration): Promise<void>;
  acquireToken(params: MSALInteractiveParams): Promise<MSALResult | undefined>;
  acquireTokenSilent(params: MSALSilentParams): Promise<MSALResult | undefined>;
  getAccounts(): Promise<MSALAccount[]>;
  getAccount(accountIdentifier: string): Promise<MSALAccount | undefined>;
  removeAccount(account: MSALAccount): Promise<boolean>;
  signout(params: MSALSignoutParams): Promise<boolean>;

  createSharedPublicClientApplication(config: MSALConfiguration): Promise<void>;
  acquireSharedToken(params: MSALInteractiveParams): Promise<MSALResult | undefined>;
  acquireSharedTokenSilent(params: MSALSilentParams): Promise<MSALResult | undefined>;
  signOutSharedAccount(): Promise<boolean>;
  getCurrentAccount(): Promise<MSALAccount>
};

const RNMSAL: RNMSALNativeModule = NativeModules.RNMSAL;

export default RNMSAL;
