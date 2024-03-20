import {
  type DeepPartial,
  immutableOverride,
} from "../../../core/utils/applyOverrides.js";
import type { ThirdwebLocale } from "./types.js";

/**
 * @internal
 */
export function jaDefault(): ThirdwebLocale {
  return {
    wallets: {
      walletConnect: {
        scanInstruction:
          "接続するためにウォレットアプリでこちらをスキャンしてください",
      },
      smartWallet: {
        connecting: "スマートウォレットに接続中",
        failedToConnect: "スマートウォレットに接続できませんでした",
        wrongNetworkScreen: {
          title: "異なるネットワーク",
          subtitle: "ウォレットが必要なネットワークに接続されていません",
          failedToSwitch: "ネットワークの切り替えに失敗しました",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "パーソナルウォレットのリンク",
          subtitle:
            "Safeを使用するためにパーソナルウォレットを接続してください。",
          learnMoreLink: "もっと詳しく",
        },
        accountDetailsScreen: {
          title: "Safeの詳細を入力してください",
          findSafeAddressIn: "Safeのアドレスは以下で見つけることができます", // You can find your safe address in + <dashboardLink>
          dashboardLink: "Safeダッシュボード", // <dashboardLink>
          network: "Safeネットワーク",
          selectNetworkPlaceholder: "Safeがデプロイされているネットワーク",
          invalidChainConfig:
            "アプリにSafeをサポートするチェーンが設定されていないため、Safeを使用できません",
          failedToConnect:
            "Safeに接続できませんでした。Safeアドレスとネットワークが正しいことを確認してください。",
          failedToSwitch: "ネットワークの切り替えに失敗しました",
          switchNetwork: "ネットワークを切り替える",
          switchingNetwork: "ネットワークを切り替え中",
          connectToSafe: "Safeに接続",
          connecting: "接続中",
          mainnets: "メインネット",
          testnets: "テストネット",
          safeAddress: "Safeアドレス",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default Japanese locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 * @param overrides - An object to override parts of the default locale object
 * @example
 * ### Use default Locale
 * ```tsx
 * const japanese = ja();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const japanese = ja({
 *  connectWallet: {
 *    signIn: "サインイン"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={japanese}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 * @returns ThirdwebLocale object
 * @locale
 */
export function ja(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = jaDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
