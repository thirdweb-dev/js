export type LocalWalletLocale = {
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
