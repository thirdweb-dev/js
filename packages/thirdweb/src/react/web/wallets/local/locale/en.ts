import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleEn: LocalWalletLocale = {
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
};

export default localWalletLocaleEn;
