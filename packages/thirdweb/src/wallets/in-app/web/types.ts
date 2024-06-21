// Class constructor types
// types for class constructors still a little messy right now.

import type { ThirdwebClient } from "../../../client/client.js";
import type { EcosystemWalletId } from "../../wallet-types.js";
import type { AuthAndWalletRpcReturnType } from "../core/authentication/type.js";
import type { InAppWalletIframeCommunicator } from "./utils/iFrameCommunication/InAppWalletIframeCommunicator.js";

export type Ecosystem = {
  id: EcosystemWalletId;
  partnerId?: string;
};

export type EcosystemPermssions = {
  allowlistedBundleIds: string[];
  allowlistedDomains: string[];
  createdAt: string;
  id: string;
  name: string;
  permissions: ("PROMPT_USER_V1" | "FULL_CONTROL_V1")[];
  updatedAt: string;
};

// Open to PRs from whoever sees this and knows of a cleaner way to handle things
export type ClientIdConstructorType = {
  /**
   * the clientId found on the dashboard settings {@link https://thirdweb.com/dashboard/settings}
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
