import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { SupportedSmsCountry } from "../../../../react/web/wallets/in-app/supported-sms-countries.js";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type { SmartWalletOptions } from "../../../smart/types.js";
import type {
  AuthOption,
  OAuthOption,
  SocialAuthOption,
} from "../../../types.js";
import type { EcosystemWalletId } from "../../../wallet-types.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/types.js";
import type { UserStatus } from "./enclave-wallet.js";

export type Ecosystem = {
  id: EcosystemWalletId;
  partnerId?: string;
};

export type InAppWalletConnectionOptions = Prettify<
  (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
    client: ThirdwebClient;
    chain?: Chain;
  }
>;

export type InAppWalletAutoConnectOptions = {
  client: ThirdwebClient;
  authResult?: AuthStoredTokenWithCookieReturnType;
  chain?: Chain;
};

export type WalletUser = UserStatus;

export type InAppWalletSocialAuth = SocialAuthOption;
export type InAppWalletOAuth = OAuthOption;
export type InAppWalletAuth = AuthOption;

export type ExecutionModeOptions =
  | {
      mode: "EIP4337";
      /**
       * The 4337 smart account options to convert the wallet to a smart account
       **/
      smartAccount?: SmartWalletOptions;
    }
  | {
      mode: "EIP7702";
      /**
       * Whether to sponsor the gas cost of the wallet
       */
      sponsorGas?: boolean;
    }
  | {
      mode: "EOA";
    };

export type InAppWalletCreationOptions =
  | {
      auth?: {
        /**
         * List of authentication options to display in the Connect Modal
         */
        options: InAppWalletAuth[];
        /**
         * Whether to display the social auth prompt in a popup or redirect
         */
        mode?: "popup" | "redirect" | "window";
        /**
         * Optional url to redirect to after authentication
         */
        redirectUrl?: string;
        /**
         * The domain of the passkey to use for authentication
         */
        passkeyDomain?: string;
        /**
         * The default country code to use for SMS authentication
         */
        defaultSmsCountryCode?: SupportedSmsCountry;

        /**
         * The list of allowed country codes to display in the country selector
         */
        allowedSmsCountryCodes?: SupportedSmsCountry[];
      };
      /**
       * Metadata to display in the Connect Modal
       */
      metadata?: {
        name?: string;
        icon?: string;
        image?: {
          src: string;
          width?: number;
          height?: number;
          alt?: string;
        };
      };
      /**
       * The partnerId of the ecosystem wallet to connect to
       */
      partnerId?: string;
      /**
       * The smart account options to convert the wallet to a smart account
       * @deprecated Use `executionMode` instead
       **/
      smartAccount?: SmartWalletOptions;
      /**
       * Whether to hide the private key export button in the Connect Modal
       */
      hidePrivateKeyExport?: boolean;
      /**
       * The storage to use for storing wallet state
       */
      storage?: AsyncStorage;

      /**
       * Defines the execution behavior of the wallet, 3 different modes are supported:
       * - "EOA": The wallet will execute transactions as a regular EOA
       * - "EIP4337": The wallet will execute transactions as a 4337 smart account
       * - "EIP7702": The wallet will execute transactions as a 7702 smart account
       */
      executionMode?: ExecutionModeOptions;
    }
  | undefined;
