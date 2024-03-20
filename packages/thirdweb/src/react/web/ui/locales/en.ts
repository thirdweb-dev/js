import {
  type DeepPartial,
  immutableOverride,
} from "../../../core/utils/applyOverrides.js";
import type { ThirdwebLocale } from "./types.js";

/**
 * @internal
 */
export function enDefault(): ThirdwebLocale {
  return {
    wallets: {
      walletConnect: {
        scanInstruction: "Scan this with your wallet app to connect",
      },
      smartWallet: {
        connecting: "Connecting to Smart Wallet",
        failedToConnect: "Failed to connect to Smart Wallet",
        wrongNetworkScreen: {
          title: "Wrong Network",
          subtitle: "Your wallet is not connected to the required network",
          failedToSwitch: "Failed to switch network",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "Link personal wallet",
          subtitle: "Connect your personal wallet to use Safe.",
          learnMoreLink: "Learn more",
        },
        accountDetailsScreen: {
          title: "Enter your safe details",
          findSafeAddressIn: "You can find your safe address in", // You can find your safe address in + <dashboardLink>
          dashboardLink: "Safe Dashboard", // <dashboardLink>
          network: "Safe Network",
          selectNetworkPlaceholder: "Network your safe is deployed to",
          invalidChainConfig:
            "Can not use Safe: No Safe supported chains are configured in App",
          failedToConnect:
            "Could not connect to Safe. Make sure safe address and network are correct.",
          failedToSwitch: "Failed to switch network",
          switchNetwork: "Switch Network",
          switchingNetwork: "Switching Network",
          connectToSafe: "Connect to Safe",
          connecting: "Connecting",
          mainnets: "Mainnets",
          testnets: "Testnets",
          safeAddress: "Safe Address",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default English locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 * @param overrides - An object with the same structure as the default locale object to override parts of it.
 * @example
 * ### Use default Locale
 * ```tsx
 * const english = en();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const english = en({
 *  connectWallet: {
 *    signIn: "Sign in!"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={english}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 * @returns An object representing the English locale.
 * @locale
 */
export function en(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = enDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
