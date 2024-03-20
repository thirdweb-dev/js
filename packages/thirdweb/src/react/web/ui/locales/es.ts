import {
  type DeepPartial,
  immutableOverride,
} from "../../../core/utils/applyOverrides.js";
import type { ThirdwebLocale } from "./types.js";

/**
 * @internal
 */
export function esDefault(): ThirdwebLocale {
  return {
    wallets: {
      walletConnect: {
        scanInstruction:
          "Escanea esto con tu aplicación de cartera para conectar",
      },
      smartWallet: {
        connecting: "Conectando a Smart Wallet",
        failedToConnect: "Error al conectar con Smart Wallet",
        wrongNetworkScreen: {
          title: "Red incorrecta",
          subtitle: "Tu cartera no está conectada a la red requerida",
          failedToSwitch: "Error al cambiar de red",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "Vincular cartera personal",
          subtitle: "Conecta tu cartera personal para usar Safe",
          learnMoreLink: "Saber más",
        },
        accountDetailsScreen: {
          title: "Introduce los detalles de tu safe",
          findSafeAddressIn: "Puedes encontrar tu dirección de safe en",
          dashboardLink: "Tablero de Safe",
          network: "Red de Safe",
          selectNetworkPlaceholder: "Red a la que se ha desplegado tu safe",
          invalidChainConfig:
            "No se puede usar Safe: No hay cadenas compatibles con Safe configuradas en la aplicación",
          failedToConnect:
            "No se pudo conectar con Safe. Asegúrate de que la dirección y red del safe son correctas",
          failedToSwitch: "Error al cambiar de red",
          switchNetwork: "Cambiar de red",
          switchingNetwork: "Cambiando de red",
          connectToSafe: "Conectar a Safe",
          connecting: "Conectando",
          mainnets: "Redes principales",
          testnets: "Redes de prueba",
          safeAddress: "Dirección de Safe",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default Spanish locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 * @param overrides - Locale object to override the default locale object
 * @example
 * ### Use default Locale
 * ```tsx
 * const spanish = es();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const spanish = es({
 *  connectWallet: {
 *    signIn: "Iniciar sesión"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={spanish}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 * @returns ThirdwebLocale object
 * @locale
 */
export function es(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = esDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
