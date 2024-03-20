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
      paperWallet: {
        signIn: "Sign in",
        signInWithGoogle: "Sign in with Google",
        emailPlaceholder: "Enter your email address",
        submitEmail: "Continue",
        invalidEmail: "Invalid email address",
        emailRequired: "Email address is required",
        googleLoginScreen: {
          title: "Sign in",
          instruction: "Select your Google account in the pop-up",
          failed: "Failed to sign in",
          retry: "Retry",
        },
        emailLoginScreen: {
          title: "Sign in",
          enterCodeSendTo: "Enter the verification code sent to", // Enter the verification code sent to + <email>
          newDeviceDetected: "New device detected",
          enterRecoveryCode:
            "Enter the recovery code emailed to you when you first signed up",
          invalidCode: "Invalid verification code",
          invalidCodeOrRecoveryCode:
            "Invalid verification code or Recovery code",
          verify: "Verify",
          failedToSendCode: "Failed to send verification code",
          sendingCode: "Sending verification code",
          resendCode: "Resend verification code",
        },
      },

      magicLink: {
        signIn: "Sign in",
        loginWith: "Login with",
        submitEmail: "Continue",
        loginWithEmailOrPhone: "Login with email or phone number",
        emailOrPhoneRequired: "email or phone number is required",
        loginWithPhone: "Login with phone number",
        phoneRequired: "phone number is required",
        invalidEmail: "Invalid email address",
        invalidPhone: "Invalid phone number",
        invalidEmailOrPhone: "Invalid email address or phone number",
        countryCodeMissing: "Phone number must start with a country code",
        emailPlaceholder: "Enter your email address",
        emailRequired: "Email address is required",
      },
      localWallet: {
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        enterYourPassword: "Enter your password",
        warningScreen: {
          title: "Warning",
          warning:
            "Your current wallet will be deleted if you create a new wallet. Backup wallet to your device before creating a new wallet",
          backupWallet: "Backup Wallet",
          skip: "Skip",
        },
        reconnectScreen: {
          title: "Connect to saved wallet",
          savedWallet: "Saved Wallet",
          continue: "Continue",
          createNewWallet: "Create a new wallet",
        },
        createScreen: {
          instruction:
            "Choose a password for your wallet. You'll be able to access and export this wallet with the same password",
          importWallet: "Import Wallet",
          createNewWallet: "Create new wallet",
          connecting: "Connecting",
        },
        exportScreen: {
          downloadMessage:
            "This will download a text file containing the wallet private key onto your device",
          decryptMessage:
            "Enter the password of this wallet to decrypt the private key",
          walletAddress: "Wallet Address",
          download: "Download",
          title: "Backup Wallet",
        },
        importScreen: {
          title: "Import Wallet",
          description1:
            "The application can authorize any transactions on behalf of the wallet without any approvals",
          description2: "We recommend only connecting to trusted applications",
          passwordDescription:
            "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
          import: "Import",
          uploadJSON: "Please upload a JSON file",
          uploadedSuccessfully: "Uploaded successfully",
          invalidPrivateKey: "Invalid Private Key",
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
