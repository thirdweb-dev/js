import type { ConnectLocale } from "./types.js";

const connectWalletLocalTl: ConnectLocale = {
  signIn: "Mag-sign in",
  defaultButtonTitle: "Ikonekta ang Wallet",
  connecting: "Kumokonekta",
  switchNetwork: "Palitan ang Network",
  switchingNetwork: "Papalitan ang Network",
  defaultModalTitle: "Kumonekta",
  recommended: "Inirerekomenda",
  installed: "Naka-install",
  continueAsGuest: "Magpatuloy bilang guest",
  connectAWallet: "Kumonekta ng wallet",
  newToWallets: "Bago sa mga wallet?",
  getStarted: "Simulan",
  guest: "Guest",
  buy: "Buy", // TODO
  transactions: "Transactions", // TODO
  viewAllTransactions: "View All Transactions", // TODO
  send: "Ipadala",
  receive: "Matanggap",
  currentNetwork: "Kasalukuyang network",
  switchAccount: "Palitan ang Account",
  requestTestnetFunds: "Humingi ng Testnet Funds",
  backupWallet: "I-backup ang Wallet",
  guestWalletWarning:
    "Ito ay isang pansamantalang guest wallet. I-download mo ang backup para hindi ka mawalan ng access dito.",
  switchTo: "Palitan ang", // Used in "Switch to <Wallet-Name>"
  connectedToSmartWallet: "Smart Account",
  confirmInWallet: "Kumpirmahin sa wallet",
  disconnectWallet: "I-disconnect ang Wallet",
  copyAddress: "Kopyahin ang Address",
  personalWallet: "Personal na Wallet",
  smartWallet: "Smart Wallet",
  or: "O",
  goBackButton: "Bumalik",

  welcomeScreen: {
    defaultTitle: "Ang iyong daan patungo sa decentralized na mundo",
    defaultSubtitle: "Kumonekta ng wallet para magsimula",
  },
  agreement: {
    prefix: "Sa pamamagitan ng pagkonekta, sumasang-ayon ka sa",
    termsOfService: "Mga Tuntunin ng Serbisyo",
    and: "&",
    privacyPolicy: "Patakaran sa Privacy",
  },
  networkSelector: {
    title: "Pumili ng Network",
    mainnets: "Mainnets",
    testnets: "Testnets",
    allNetworks: "Lahat",
    addCustomNetwork: "Magdagdag ng Custom Network",
    inputPlaceholder: "Maghanap ng Network o Chain ID",
    categoryLabel: {
      recentlyUsed: "Kamakailang Ginamit",
      popular: "Sikat",
      others: "Lahat ng Networks",
    },
    loading: "Loading",
    failedToSwitch: "Hindi nagawa ang pagpapalit ng network",
  },
  receiveFundsScreen: {
    title: "Matanggap ang Pondo",
    instruction: "Kopyahin ang address ng wallet para ipadala ang pondo dito",
  },
  sendFundsScreen: {
    title: "Ipadala ang Pondo",
    submitButton: "Ipadala",
    token: "Token",
    sendTo: "Ipadala sa",
    amount: "Halaga",
    successMessage: "Tagumpay ang Transaksyon",
    invalidAddress: "Hindi wastong Address",
    noTokensFound: "Walang Nakitang Tokens",
    searchToken: "Maghanap o I-paste ang token address",
    transactionFailed: "Nabigo ang Transaksyon",
    transactionRejected: "Tinanggihan ang Transaksyon",
    insufficientFunds: "Kulang ang Pondo",
    selectTokenTitle: "Pumili ng Token",
    sending: "Ipinapadala",
  },
  signatureScreen: {
    instructionScreen: {
      title: "Mag-sign in",
      instruction:
        "Mangyaring pirmahan ang kahilingan ng mensahe sa iyong wallet para magpatuloy",
      signInButton: "Mag-sign in",
      disconnectWallet: "I-disconnect ang Wallet",
    },
    signingScreen: {
      title: "Pagsisign-in",
      prompt: "Pirmahan ang kahilingan ng signature sa iyong wallet",
      promptForSafe:
        "Pirmahan ang kahilingan ng signature sa iyong wallet at aprubahan ang transaksyon sa Safe",
      approveTransactionInSafe: "Aprubahan ang transaksyon sa Safe",
      tryAgain: "Subukan muli",
      failedToSignIn: "Hindi nagawa ang pagsisign-in",
      inProgress: "Naghihintay ng Kumpirmasyon",
    },
  },
};

export default connectWalletLocalTl;
