/**
 * @locale
 */
export type ThirdwebLocale = {
  wallets: {
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
        downloadMessage: string;
        decryptMessage: string;
        download: string;
        title: string;
        walletAddress: string;
      };
      importScreen: {
        description1: string;
        description2: string;
        passwordDescription: string;
        import: string;
        title: string;
        uploadJSON: string;
        uploadedSuccessfully: string;
        invalidPrivateKey: string;
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
        skip: string;
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
    walletConnect: { scanInstruction: string };
  };
};
