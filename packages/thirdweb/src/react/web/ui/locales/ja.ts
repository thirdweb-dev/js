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
      paperWallet: {
        signIn: "サインイン",
        signInWithGoogle: "Googleでサインイン",
        emailPlaceholder: "メールアドレスを入力してください",
        submitEmail: "続ける",
        invalidEmail: "無効なメールアドレス",
        emailRequired: "メールアドレスが必要です",
        googleLoginScreen: {
          title: "サインイン",
          instruction: "ポップアップ内でGoogleアカウントを選択してください",
          failed: "サインインに失敗しました",
          retry: "再試行",
        },
        emailLoginScreen: {
          title: "サインイン",
          enterCodeSendTo: "送信された確認コードを入力してください", // Enter the verification code sent to + <email>
          newDeviceDetected: "新しいデバイスが検出されました",
          enterRecoveryCode:
            "初回サインアップ時にメールで送信されたリカバリーコードを入力してください",
          invalidCode: "無効な確認コード",
          invalidCodeOrRecoveryCode: "無効な確認コードまたはリカバリーコード",
          verify: "確認",
          failedToSendCode: "確認コードの送信に失敗しました",
          sendingCode: "確認コードを送信中",
          resendCode: "確認コードを再送",
        },
      },

      magicLink: {
        signIn: "サインイン",
        loginWith: "次でログイン：",
        submitEmail: "続ける",
        loginWithEmailOrPhone: "メールアドレスまたは電話番号でログイン",
        emailOrPhoneRequired: "メールアドレスまたは電話番号が必要です",
        loginWithPhone: "電話番号でログイン",
        phoneRequired: "電話番号が必要です",
        invalidEmail: "無効なメールアドレス",
        invalidPhone: "無効な電話番号",
        invalidEmailOrPhone: "無効なメールアドレスまたは電話番号",
        countryCodeMissing: "電話番号は国コードから始める必要があります",
        emailPlaceholder: "メールアドレスを入力してください",
        emailRequired: "メールアドレスが必要です",
      },
      localWallet: {
        passwordLabel: "パスワード",
        confirmPasswordLabel: "パスワードを確認",
        enterYourPassword: "パスワードを入力してください",
        warningScreen: {
          title: "警告",
          warning:
            "新しいウォレットを作成すると、現在のウォレットは削除されます。新しいウォレットを作成する前に、ウォレットのバックアップをデバイスに保存してください",
          backupWallet: "ウォレットのバックアップ",
          // TODO: translate
          skip: "Skip",
        },
        reconnectScreen: {
          title: "保存されたウォレットへの接続",
          savedWallet: "保存されたウォレット",
          continue: "続ける",
          createNewWallet: "新しいウォレットを作成",
        },
        createScreen: {
          instruction:
            "ウォレットのパスワードを選択してください。このパスワードで、このウォレットにアクセスしたり、同じパスワードでエクスポートすることができます",
          importWallet: "ウォレットをインポート",
          createNewWallet: "新しいウォレットを作成",
          connecting: "接続中",
        },
        exportScreen: {
          // TODO: translate
          downloadMessage:
            "This will download a text file containing the wallet private key onto your device",
          decryptMessage:
            "Enter the password of this wallet to decrypt the private key",
          walletAddress: "ウォレットアドレス",
          download: "ダウンロード",
          title: "ウォレットのバックアップ",
        },
        importScreen: {
          title: "ウォレットをインポート",
          description1:
            "アプリケーションは、ウォレットの代わりに任意の取引を承認なしで認証することができます",
          description2:
            "信頼できるアプリケーションにのみ接続することをお勧めします",
          // TODO: translate
          passwordDescription:
            "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
          import: "インポート",
          uploadJSON: "JSONファイルをアップロードしてください",
          uploadedSuccessfully: "正常にアップロードされました",
          // TODO
          invalidPrivateKey: "Invalid Private Key",
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
