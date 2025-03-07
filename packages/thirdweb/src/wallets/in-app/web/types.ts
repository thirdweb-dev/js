// Class constructor types
// types for class constructors still a little messy right now.

import type { ThirdwebClient } from "../../../client/client.js";
import type { AsyncStorage } from "../../../utils/storage/AsyncStorage.js";
import type { AuthAndWalletRpcReturnType } from "../core/authentication/types.js";
import type { Ecosystem } from "../core/wallet/types.js";
import type { InAppWalletIframeCommunicator } from "./utils/iFrameCommunication/InAppWalletIframeCommunicator.js";

type ClientIdConstructorType = {
  /**
   * the clientId of your API Key. You can create an API key by creating a project on thirdweb dashboard.
   */
  client: ThirdwebClient;
};
export type InAppWalletConstructorType = ClientIdConstructorType & {
  /**
   * @param authResult - The authResult returned from the InAppWalletSdk auth method
   * @returns
   */
  onAuthSuccess?: (authResult: AuthAndWalletRpcReturnType) => void;

  /**
   * @param ecosystem - An optional set of options to connect to an ecosystem wallet.
   */
  ecosystem?: Ecosystem;

  /**
   * The domain of the passkey to use for authentication
   */
  passkeyDomain?: string;

  /**
   * The storage to use for storing wallet state
   */
  storage?: AsyncStorage;
};

export type ClientIdWithQuerierType = ClientIdConstructorType & {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  querier: InAppWalletIframeCommunicator<any>;
};

/**
 * @internal
 */
export type GetAddressReturnType = { address: string };
export type SignMessageReturnType = { signedMessage: string };
export type SignTransactionReturnType = {
  signedTransaction: string;
};
export type SignedTypedDataReturnType = {
  signedTypedData: string;
};
