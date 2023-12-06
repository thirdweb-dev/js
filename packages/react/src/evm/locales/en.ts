import { ThirdwebLocale } from "./types";
import { DeepPartial, immutableOverride } from "../utils/applyOverrides";

// wallets that connect via extension and QR scan
function extensionAndQRScanScreens(walletName: string) {
  return {
    connectionScreen: {
      inProgress: "Awaiting Confirmation",
      failed: "Connection failed",
      instruction: `Accept the connection request in ${walletName} wallet`,
      retry: "Try Again",
    },
    getStartedScreen: {
      instruction: `Scan the QR code to download ${walletName} app`,
    },
    scanScreen: {
      instruction: `Scan the QR code with ${walletName} wallet app to connect`,
    },
    getStartedLink: `Don't have ${walletName} wallet?`,
  };
}

export function enDefault() {
  return {
    connectWallet: {
      signIn: "Sign in",
      defaultButtonTitle: "Connect Wallet",
      connecting: "Connecting",
      switchNetwork: "Switch Network",
      switchingNetwork: "Switching Network",
      defaultModalTitle: "Connect",
      recommended: "Recommended",
      installed: "Installed",
      continueAsGuest: "Continue as guest",
      connectAWallet: "Connect a wallet",
      newToWallets: "New to wallets?",
      getStarted: "Get started",
      guest: "Guest",
      send: "Send",
      receive: "Receive",
      currentNetwork: "Current network",
      switchAccount: "Switch Account",
      requestTestnetFunds: "Request Testnet Funds",
      transactionHistory: "Transaction History",
      backupWallet: "Backup Wallet",
      guestWalletWarning:
        "This is a temporary guest wallet. Backup if you don't want to lose access to it",
      switchTo: "Switch to", // Used in "Switch to <Wallet-Name>"
      connectedToSmartWallet: "Connected To Smart Wallet",
      confirmInWallet: "Confirm in wallet",
      disconnectWallet: "Disconnect Wallet",
      copyAddress: "Copy Address",
      personalWallet: "Personal Wallet",
      smartWallet: "Smart Wallet",
      or: "OR",
      goBackButton: "Back",
      download: {
        chrome: "Download Chrome Extension",
        android: "Download on Google Play",
        iOS: "Download on App Store",
      },
      welcomeScreen: {
        defaultTitle: "Your gateway to the decentralized world",
        defaultSubtitle: "Connect a wallet to get started",
      },
      agreement: {
        prefix: "By connecting, you agree to the",
        termsOfService: "Terms of Service",
        and: "&",
        privacyPolicy: "Privacy Policy",
      },
      networkSelector: {
        title: "Select Network",
        mainnets: "Mainnets",
        testnets: "Testnets",
        allNetworks: "All",
        addCustomNetwork: "Add Custom Network",
        inputPlaceholder: "Search Network or Chain ID",
        categoryLabel: {
          recentlyUsed: "Recently Used",
          popular: "Popular",
          others: "All Networks",
        },
        loading: "Loading",
        failedToSwitch: "Failed to switch network",
      },
      receiveFundsScreen: {
        title: "Receive Funds",
        instruction: "Copy the wallet address to send funds to this wallet",
      },
      sendFundsScreen: {
        title: "Send Funds",
        submitButton: "Send",
        token: "Token",
        sendTo: "Send to",
        amount: "Amount",
        successMessage: "Transaction Successful",
        invalidAddress: "Invalid Address",
        noTokensFound: "No Tokens Found",
        searchToken: "Search or Paste token address",
        transactionFailed: "Transaction Failed",
        transactionRejected: "Transaction Rejected",
        insufficientFunds: "Insufficient Funds",
        selectTokenTitle: "Select a Token",
        sending: "Sending",
      },
      signatureScreen: {
        instructionScreen: {
          title: "Sign in",
          instruction:
            "Please sign the message request in your wallet to continue",
          signInButton: "Sign in",
          disconnectWallet: "Disconnect Wallet",
        },
        signingScreen: {
          title: "Signing In",
          prompt: "Sign the signature request in your wallet",
          promptForSafe:
            "Sign signature request in your wallet & approve transaction in Safe",
          approveTransactionInSafe: "Approve transaction in Safe",
          tryAgain: "Try Again",
          failedToSignIn: "Failed to Sign in",
          inProgress: "Awaiting Confirmation",
        },
      },
    },
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
      coinbaseWallet: extensionAndQRScanScreens("Coinbase"),
      metamaskWallet: extensionAndQRScanScreens("MetaMask"),
      okxWallet: extensionAndQRScanScreens("OKX"),
      phantomWallet: extensionAndQRScanScreens("Phantom"),
      rainbowWallet: extensionAndQRScanScreens("Rainbow"),
      trustWallet: extensionAndQRScanScreens("Trust"),
      zerionWallet: extensionAndQRScanScreens("Zerion"),
      coreWallet: extensionAndQRScanScreens("Core"),
      oneKeyWallet: extensionAndQRScanScreens("OneKey"),
      cryptoDefiWallet: extensionAndQRScanScreens("Crypto Defi"),
      rabbyWallet: extensionAndQRScanScreens("Rabby"),
      coin98Wallet: extensionAndQRScanScreens("Coin98"),
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
      embeddedWallet: {
        signInWithGoogle: "Sign in with Google",
        signInWithFacebook: "Sign in with Facebook",
        signInWithApple: "Sign in with Apple",
        emailPlaceholder: "Enter your email address",
        submitEmail: "Continue",
        signIn: "Sign in",
        emailRequired: "Email address is required",
        invalidEmail: "Invalid email address",
        socialLoginScreen: {
          title: "Sign in",
          instruction: "Sign into your account in the pop-up",
          failed: "Failed to sign in",
          retry: "Retry",
        },
        emailLoginScreen: {
          title: "Sign in",
          enterCodeSendTo: "Enter the verification code sent to",
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
        createPassword: {
          title: "Create Password",
          instruction:
            "Set a password for your account. You will need this password when connecting from a new device.",
          saveInstruction: "Make sure to save it",
          inputPlaceholder: "Enter your password",
          confirmation: "I have saved my password",
          submitButton: "Set Password",
          failedToSetPassword: "Failed to set password",
        },
        enterPassword: {
          title: "Enter Password",
          instruction: "Enter the password for your account",
          inputPlaceholder: "Enter your password",
          submitButton: "Verify",
          wrongPassword: "Wrong password",
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
          description1:
            "This will download a JSON file containing the wallet information onto your device encrypted with the password",
          description2:
            "You can use this JSON file to import the account in MetaMask using the same password",
          walletAddress: "Wallet Address",
          download: "Download",
          title: "Backup Wallet",
        },
        importScreen: {
          title: "Import Wallet",
          description1:
            "The application can authorize any transactions on behalf of the wallet without any approvals",
          description2: "We recommend only connecting to trusted applications",
          import: "Import",
          uploadJSON: "Please upload a JSON file",
          uploadedSuccessfully: "Uploaded successfully",
        },
      },
      frameWallet: {
        ...extensionAndQRScanScreens("Frame"),
        connectionFailedScreen: {
          title: "Failed to connect to Frame",
          description:
            "Make sure the desktop app is installed and running. You can download Frame from the link below. Make sure to refresh this page once Frame is running.",
          downloadFrame: "Download Frame",
          supportLink: "Still having troubles connecting?",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default English locale object to be set on `ThirdwebProvider` to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 *
 * @example
 *
 * ### Use default English Locale
 * ```tsx
 * const english = en(); // default English locale object
 *
 * <ThirdwebProvider locale={english}> <App /> </ThirdwebProvider>
 * ```
 *
 * ### Override English Locale
 * ```tsx
 * const english = en({
 *  connectWallet: {
 *    signIn: "Sign in!"
 *  }
 * })
 *
 * <ThirdwebProvider locale={english}>
 *  <App />
 * </ThirdwebProvider>
 * ```
 */
export function en(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = enDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
