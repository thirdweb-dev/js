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
      paperWallet: {
        signIn: "Mag-sign in",
        signInWithGoogle: "Mag-sign in gamit ang Google",
        emailPlaceholder: "Ilagay ang iyong email address",
        submitEmail: "Magpatuloy",
        invalidEmail: "Hindi wastong email address",
        emailRequired: "Kinakailangan ang email address",
        googleLoginScreen: {
          title: "Mag-sign in",
          instruction: "Pumili ng iyong Google account sa pop-up",
          failed: "Hindi nagawa ang pag-sign in",
          retry: "Subukan muli",
        },
        emailLoginScreen: {
          title: "Mag-sign in",
          enterCodeSendTo: "Ilagay ang verification code na ipinadala sa", // Enter the verification code sent to + <email>
          newDeviceDetected: "Natuklasan ang bagong device",
          enterRecoveryCode:
            "Ilagay ang recovery code na ipinadala sa iyo noong unang pag-sign up",
          invalidCode: "Hindi wastong verification code",
          invalidCodeOrRecoveryCode:
            "Hindi wastong verification code o recovery code",
          verify: "Patunayan",
          failedToSendCode: "Hindi nagawa ang pagpapadala ng verification code",
          sendingCode: "Nagpapadala ng verification code",
          resendCode: "Ipadala muli ang verification code",
        },
      },

      magicLink: {
        signIn: "Mag-sign in",
        loginWith: "Mag-login gamit ang",
        submitEmail: "Magpatuloy",
        loginWithEmailOrPhone: "Mag-login gamit ang email o numero ng telepono",
        emailOrPhoneRequired: "Kinakailangan ang email o numero ng telepono",
        loginWithPhone: "Mag-login gamit ang numero ng telepono",
        phoneRequired: "Kinakailangan ang numero ng telepono",
        invalidEmail: "Hindi wastong email address",
        invalidPhone: "Hindi wastong numero ng telepono",
        invalidEmailOrPhone: "Hindi wastong email address o numero ng telepono",
        countryCodeMissing:
          "Ang numero ng telepono ay dapat magsimula sa country code",
        emailPlaceholder: "Ilagay ang iyong email address",
        emailRequired: "Kinakailangan ang email address",
      },
      localWallet: {
        passwordLabel: "Password",
        confirmPasswordLabel: "Kumpirmahin ang Password",
        enterYourPassword: "Ilagay ang iyong password",
        warningScreen: {
          title: "Babala",
          warning:
            "Ang kasalukuyang wallet mo ay mabubura kapag lumikha ka ng bagong wallet. I-backup ang wallet sa iyong device bago lumikha ng bagong wallet",
          backupWallet: "I-backup ang Wallet",
          // TODO: translate
          skip: "Skip",
        },
        reconnectScreen: {
          title: "Kumonekta sa na-save na wallet",
          savedWallet: "Na-save na Wallet",
          continue: "Magpatuloy",
          createNewWallet: "Lumikha ng bagong wallet",
        },
        createScreen: {
          instruction:
            "Pumili ng password para sa iyong wallet. Magagamit mo ang password na ito para ma-access at ma-export ang wallet na ito gamit ang parehong password",
          importWallet: "Mag-import ng Wallet",
          createNewWallet: "Lumikha ng bagong wallet",
          connecting: "Kumokonekta",
        },
        exportScreen: {
          // TODO: translate
          downloadMessage:
            "This will download a text file containing the wallet private key onto your device",
          decryptMessage:
            "Enter the password of this wallet to decrypt the private key",
          walletAddress: "Address ng Wallet",
          download: "I-download",
          title: "Backup Wallet",
        },
        importScreen: {
          title: "Mag-import ng Wallet",
          description1:
            "Ang application ay maaaring mag-authorize ng anumang mga transaksyon sa ngalan ng wallet nang walang anumang mga approval",
          description2:
            "Minumungkahi naming kumonekta lamang sa mga pinagkakatiwalaang application",
          // TODO: translate
          passwordDescription:
            "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
          import: "Mag-import",
          uploadJSON: "Mangyaring mag-upload ng isang JSON file",
          uploadedSuccessfully: "Matagumpay na na-upload",
          // TODO
          invalidPrivateKey: "Invalid Private Key",
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
