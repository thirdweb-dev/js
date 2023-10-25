import { DeepPartial, immutableOverride } from "../utils/applyOverrides";

// wallets that connect via extension and QR scan
function extensionAndQRScan(walletName: string) {
  return {
    connecting: {
      inProgress: "Awaiting Confirmation",
      failed: "Connection failed",
      instruction: {
        desktop: `Login and connect your wallet through the ${walletName} extension`,
        mobile: `Login and connect your wallet through the ${walletName} app`,
      },
      tryAgain: "Try again",
    },
    getStarted: {
      subtitle: `Get started with ${walletName} wallet`,
      scanToDownload: `Scan with your phone to download ${walletName} app`,
    },
    scan: {
      instruction: `Scan with ${walletName} app to connect wallet`,
    },
    getStartedLink: `Don't have ${walletName} wallet?`,
  };
}

export function enDefault() {
  return {
    connectWallet: {
      signIn: "Sign in",
      defaultBtnTitle: "Connect Wallet",
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
      switchAccount: "Switch account",
      requestTestnetFunds: "Request Testnet Funds",
      transactionHistory: "Transaction History",
      backupWallet: "Backup Wallet",
      guestWalletWarning:
        "This is a temporary guest wallet. Backup if you don't want to lose access to it",
      switchTo: "Switch to",
      connectedToSmartWallet: "Connected to smart wallet",
      confirmInWallet: "Confirm in Wallet",
      download: {
        chrome: "Download Chrome Extension",
        android: "Download on Google Play",
        iOS: "Download on App Store",
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
      receiveFunds: {
        title: "Receive Funds",
        instruction: "Copy the wallet address to send funds to this wallet",
      },
      sendFunds: {
        title: "Send Funds",
        submitButton: "Send",
        token: "Token",
        sendTo: "Send to",
        amount: "Amount",
        successMessage: "Transaction Successful",
        invalidAddress: "Invalid Address",
        noTokensFound: "No tokens found",
        searchToken: "Search or paste token address",
        transactionFailed: "Transaction Failed",
        transactionRejected: "Transaction Rejected",
        insufficientFunds: "Insufficient Funds",
      },
      signatureScreen: {
        initialScreen: {
          title: "Sign in",
          instruction:
            "Please sign the message request in your wallet to continue",
          signInButton: "Sign in",
        },
        signingScreen: {
          title: "Signing In",
          prompt: "Sign the signature request in your wallet",
          promptForSafe:
            "Sign signature request in your wallet & approve transaction in Safe",
          approveTransactionInSafe: "Approve transaction in Safe",
          tryAgain: "Try Again",
          failedToSignIn: "Failed to Sign in",
        },
      },
    },
    web3Button: {},
    wallets: {
      walletConnect: {
        scanInstruction: "Scan this with your wallet or camera app to connect",
      },
      smartWallet: {
        failedToConnect: "Failed to connect to Smart Wallet",
        wrongNetwork: {
          title: "Wrong Network",
          subtitle: "Your wallet is not connected to the required network",
          failedToSwitch: "Failed to switch network",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "Link personal wallet",
          subtitle: "Connect your personal wallet to use Safe.",
          learnMore: "Learn more",
        },
        accountDetailsScreen: {
          title: "Enter your safe details",
          findSafeAddressIn: "You can find your safe address in",
          dashboardLink: "Safe Dashboard",
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
        },
      },
      coinbaseWallet: extensionAndQRScan("Coinbase"),
      metamaskWallet: extensionAndQRScan("MetaMask"),
      okxWallet: extensionAndQRScan("OKX"),
      phantomWallet: extensionAndQRScan("Phantom"),
      rainbowWallet: extensionAndQRScan("Rainbow"),
      trustWallet: extensionAndQRScan("Trust"),
      zerionWallet: extensionAndQRScan("Zerion"),
      paperWallet: {
        signInWithGoogle: "Sign in with Google",
        submitEmail: "Continue",
        googleLogin: {
          title: "Sign in",
          instruction: "Select your Google account in the pop-up",
          failed: "Failed to sign in",
          retry: "Retry",
        },
        emailLogin: {
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
      },
      embeddedWallet: {
        signInWithGoogle: "Sign in with Google",
        submitEmail: "Continue",
        googleLogin: {
          title: "Sign in",
          instruction: "Select your Google account in the pop-up",
          failed: "Failed to sign in",
          retry: "Retry",
        },
        emailLogin: {
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
      },
      magicLink: {
        loginWith: "Login with",
        submitEmail: "Continue",
      },
      localWallet: {
        overrideConfirmation: {
          warning:
            "Your current wallet will be deleted if you create a new wallet. Backup wallet to your device before creating a new wallet",
          backupWallet: "Backup Wallet",
        },
        connectToSavedWallet: {
          title: "Connect to saved wallet",
          savedWallet: "Saved Wallet",
          continue: "Continue",
          createNewWallet: "Create a new wallet",
        },
        createWallet: {
          createPassword:
            "Choose a password for your wallet.  You'll be able to access and export this wallet with the same password",
          importWallet: "Import Wallet",
        },
        exportWallet: {
          description1:
            "This will download a JSON file containing the wallet information onto your device encrypted with the password",
          description2:
            "You can use this JSON file to import the account in MetaMask using the same password",
          walletAddress: "Wallet Address",
          download: "Download",
        },
        importWallet: {
          description1:
            "The application can authorize any transactions on behalf of the wallet without any approvals",
          description2: "We recommend only connecting to trusted applications",
          import: "Import",
          uploadJSON: "Please upload a JSON file",
          uploadedSuccessfully: "Uploaded successfully",
        },
      },
      frameWallet: {
        getStartedLink: "Don't have Frame wallet?",
        getStarted: {
          subtitle: "Get started with Frame wallet",
          scanToDownload: "Scan with your phone to download Frame wallet app",
        },
        connecting: {
          inProgress: "Awaiting Confirmation",
          failed: "Connection failed",
          instruction: {
            desktop:
              "Login and connect your wallet through the MetaMask extension",
            mobile: "Login and connect your wallet through the MetaMask app",
          },
          tryAgain: "Try again",
        },
        failedToConnect: {
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

export type ThirdwebLocale = ReturnType<typeof enDefault>;

export function en(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = enDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
