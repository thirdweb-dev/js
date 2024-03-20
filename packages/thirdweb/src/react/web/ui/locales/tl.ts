import {
  type DeepPartial,
  immutableOverride,
} from "../../../core/utils/applyOverrides.js";
import type { ThirdwebLocale } from "./types.js";

/**
 * @internal
 */
export function tlDefault(): ThirdwebLocale {
  return {
    wallets: {
      walletConnect: {
        scanInstruction:
          "I-scan ito gamit ang iyong wallet app para makakonekta",
      },
      smartWallet: {
        connecting: "Kumokonekta sa Smart Wallet",
        failedToConnect: "Hindi nagawa ang pagkonekta sa Smart Wallet",
        wrongNetworkScreen: {
          title: "Maling Network",
          subtitle:
            "Hindi konektado ang iyong wallet sa kinakailangang network",
          failedToSwitch: "Hindi nagawa ang pagpapalit ng network",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "Kumonekta ng personal na wallet",
          subtitle:
            "Konektahin ang iyong personal na wallet para magamit ang Safe.",
          learnMoreLink: "Alamin pa",
        },
        accountDetailsScreen: {
          title: "Ipasok ang mga detalye ng iyong safe",
          findSafeAddressIn: "Maaari mong mahanap ang iyong safe address sa", // You can find your safe address in + <dashboardLink>
          dashboardLink: "Safe Dashboard", // <dashboardLink>
          network: "Safe Network",
          selectNetworkPlaceholder:
            "Network kung saan inilunsad ang iyong safe",
          invalidChainConfig:
            "Hindi magamit ang Safe: Walang mga suportadong chain ng Safe na nakakonfigure sa App",
          failedToConnect:
            "Hindi makakonekta sa Safe. Siguraduhing tama ang safe address at network.",
          failedToSwitch: "Hindi nagawa ang pagpapalit ng network",
          switchNetwork: "Palitan ang Network",
          switchingNetwork: "Pinapalitan ang Network",
          connectToSafe: "Kumonekta sa Safe",
          connecting: "Kumokonekta",
          mainnets: "Mainnets",
          testnets: "Testnets",
          safeAddress: "Safe Address",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default Tagalog locale object to be set on `ThirdwebProvider` to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 * @param overrides - An object with the same structure as the default locale object to override parts of the default locale object.
 * @example
 * ### Use default Locale
 * ```tsx
 * const tagalog = tl();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const tagalog = en({
 *  connectWallet: {
 *    signIn: "Mag-sign in!"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={tagalog}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 * @locale
 * @returns A Tagalog locale object with the default values.
 */
export function tl(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = tlDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
