/**
 * @locale
 */
export type ExtensionAndQRScreensLocale = {
  connectionScreen: {
    failed: string;
    inProgress: string;
    instruction: string;
    retry: string;
  };
  getStartedLink: string;
  getStartedScreen: { instruction: string };
  scanScreen: { instruction: string };
};

/**
 * @locale
 */
export type ThirdwebLocale = {
  connectWallet: {
    agreement: {
      and: string;
      prefix: string;
      privacyPolicy: string;
      termsOfService: string;
    };
    goBackButton: string;
    backupWallet: string;
    confirmInWallet: string;
    connectAWallet: string;
    connectedToSmartWallet: string;
    connecting: string;
    continueAsGuest: string;
    copyAddress: string;
    currentNetwork: string;
    defaultButtonTitle: string;
    defaultModalTitle: string;
    disconnectWallet: string;
    download: { android: string; chrome: string; iOS: string };
    getStarted: string;
    guest: string;
    guestWalletWarning: string;
    installed: string;
    networkSelector: {
      addCustomNetwork: string;
      allNetworks: string;
      categoryLabel: {
        others: string;
        popular: string;
        recentlyUsed: string;
      };
      failedToSwitch: string;
      inputPlaceholder: string;
      loading: string;
      mainnets: string;
      testnets: string;
      title: string;
    };
    newToWallets: string;
    or: string;
    personalWallet: string;
    receive: string;
    receiveFundsScreen: { instruction: string; title: string };
    recommended: string;
    requestTestnetFunds: string;
    send: string;
    sendFundsScreen: {
      amount: string;
      insufficientFunds: string;
      invalidAddress: string;
      noTokensFound: string;
      searchToken: string;
      selectTokenTitle: string;
      sendTo: string;
      sending: string;
      submitButton: string;
      successMessage: string;
      title: string;
      token: string;
      transactionFailed: string;
      transactionRejected: string;
    };
    signIn: string;
    signatureScreen: {
      instructionScreen: {
        instruction: string;
        signInButton: string;
        title: string;
        disconnectWallet: string;
      };
      signingScreen: {
        approveTransactionInSafe: string;
        failedToSignIn: string;
        inProgress: string;
        prompt: string;
        promptForSafe: string;
        title: string;
        tryAgain: string;
      };
    };
    smartWallet: string;
    switchAccount: string;
    switchNetwork: string;
    switchTo: string;
    switchingNetwork: string;
    transactionHistory: string;
    welcomeScreen: { defaultSubtitle: string; defaultTitle: string };
  };
  wallets: {
    coin98Wallet: {
      connectionScreen: {
        failed: string;
        inProgress: string;
        instruction: string;
        retry: string;
      };
      getStartedLink: string;
      getStartedScreen: { instruction: string };
      scanScreen: { instruction: string };
    };
    coinbaseWallet: ExtensionAndQRScreensLocale;
    coreWallet: ExtensionAndQRScreensLocale;
    cryptoDefiWallet: ExtensionAndQRScreensLocale;
    embeddedWallet: {
      createPassword: {
        confirmation: string;
        failedToSetPassword: string;
        inputPlaceholder: string;
        instruction: string;
        saveInstruction: string;
        submitButton: string;
        title: string;
      };
      otpLoginScreen: {
        enterCodeSendTo: string;
        enterRecoveryCode: string;
        failedToSendCode: string;
        invalidCode: string;
        invalidCodeOrRecoveryCode: string;
        newDeviceDetected: string;
        resendCode: string;
        sendingCode: string;
        title: string;
        verify: string;
      };
      emailPlaceholder: string;
      emailRequired: string;
      enterPassword: {
        inputPlaceholder: string;
        instruction: string;
        submitButton: string;
        title: string;
        wrongPassword: string;
      };
      invalidEmail: string;
      invalidEmailOrPhone: string;
      invalidPhone: string;
      countryCodeMissing: string;
      loginWithEmailOrPhone: string;
      emailOrPhoneRequired: string;
      loginWithPhone: string;
      phoneRequired: string;
      signIn: string;
      signInWithApple: string;
      signInWithFacebook: string;
      signInWithGoogle: string;
      socialLoginScreen: {
        failed: string;
        instruction: string;
        retry: string;
        title: string;
      };
      submitEmail: string;
      maxAccountsExceeded: string;
    };
    frameWallet: {
      connectionFailedScreen: {
        description: string;
        downloadFrame: string;
        supportLink: string;
        title: string;
      };
      connectionScreen: {
        failed: string;
        inProgress: string;
        instruction: string;
        retry: string;
      };
      getStartedLink: string;
      getStartedScreen: { instruction: string };
      scanScreen: { instruction: string };
    };
    localWallet: {
      confirmPasswordLabel: string;
      createScreen: {
        connecting: string;
        createNewWallet: string;
        importWallet: string;
        instruction: string;
      };
      enterYourPassword: string;
      exportScreen: {
        description1: string;
        description2: string;
        download: string;
        title: string;
        walletAddress: string;
      };
      importScreen: {
        description1: string;
        description2: string;
        import: string;
        title: string;
        uploadJSON: string;
        uploadedSuccessfully: string;
      };
      passwordLabel: string;
      reconnectScreen: {
        continue: string;
        createNewWallet: string;
        savedWallet: string;
        title: string;
      };
      warningScreen: {
        backupWallet: string;
        title: string;
        warning: string;
      };
    };
    magicLink: {
      countryCodeMissing: string;
      emailOrPhoneRequired: string;
      emailPlaceholder: string;
      emailRequired: string;
      invalidEmail: string;
      invalidEmailOrPhone: string;
      invalidPhone: string;
      loginWith: string;
      loginWithEmailOrPhone: string;
      loginWithPhone: string;
      phoneRequired: string;
      signIn: string;
      submitEmail: string;
    };
    metamaskWallet: ExtensionAndQRScreensLocale;
    okxWallet: ExtensionAndQRScreensLocale;
    oneKeyWallet: ExtensionAndQRScreensLocale;
    paperWallet: {
      emailLoginScreen: {
        enterCodeSendTo: string;
        enterRecoveryCode: string;
        failedToSendCode: string;
        invalidCode: string;
        invalidCodeOrRecoveryCode: string;
        newDeviceDetected: string;
        resendCode: string;
        sendingCode: string;
        title: string;
        verify: string;
      };
      emailPlaceholder: string;
      emailRequired: string;
      googleLoginScreen: {
        failed: string;
        instruction: string;
        retry: string;
        title: string;
      };
      invalidEmail: string;
      signIn: string;
      signInWithGoogle: string;
      submitEmail: string;
    };
    phantomWallet: ExtensionAndQRScreensLocale;
    xdefiWallet: ExtensionAndQRScreensLocale;
    rabbyWallet: ExtensionAndQRScreensLocale;
    rainbowWallet: ExtensionAndQRScreensLocale;
    safeWallet: {
      accountDetailsScreen: {
        connectToSafe: string;
        connecting: string;
        dashboardLink: string;
        failedToConnect: string;
        failedToSwitch: string;
        findSafeAddressIn: string;
        invalidChainConfig: string;
        mainnets: string;
        network: string;
        safeAddress: string;
        selectNetworkPlaceholder: string;
        switchNetwork: string;
        switchingNetwork: string;
        testnets: string;
        title: string;
      };
      connectWalletScreen: {
        learnMoreLink: string;
        subtitle: string;
        title: string;
      };
    };
    smartWallet: {
      connecting: string;
      failedToConnect: string;
      wrongNetworkScreen: {
        failedToSwitch: string;
        subtitle: string;
        title: string;
      };
    };
    trustWallet: ExtensionAndQRScreensLocale;
    walletConnect: { scanInstruction: string };
    zerionWallet: ExtensionAndQRScreensLocale;
  };
};
