import type { SupportedSmsCountry } from "../../react/web/wallets/in-app/supported-sms-countries.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
} from "../in-app/core/wallet/types.js";

export type EcosystemWalletCreationOptions = {
  auth?: {
    /**
     * Whether to display the social auth prompt in a popup or redirect
     */
    mode?: "popup" | "redirect" | "window";
    /**
     * Optional url to redirect to after authentication
     */
    redirectUrl?: string;
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
   * The partnerId of the ecosystem wallet to connect to
   */
  partnerId?: string;
  /**
   * The storage to use for storing wallet state
   */
  storage?: AsyncStorage;
};

export type EcosystemWalletConnectionOptions = InAppWalletConnectionOptions;
export type EcosystemWalletAutoConnectOptions = InAppWalletAutoConnectOptions;
