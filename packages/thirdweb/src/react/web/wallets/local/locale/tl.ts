import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleTl: LocalWalletLocale = {
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
};

export default localWalletLocaleTl;
