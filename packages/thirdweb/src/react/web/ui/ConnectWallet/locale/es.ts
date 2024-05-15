import type { ConnectLocale } from "./types.js";

const connectWalletLocalEs: ConnectLocale = {
  signIn: "Iniciar sesión",
  defaultButtonTitle: "Conectar cartera",
  connecting: "Conectando",
  switchNetwork: "Cambiar red",
  switchingNetwork: "Cambiando de red",
  defaultModalTitle: "Conectar",
  recommended: "Recomendado",
  installed: "Instalado",
  continueAsGuest: "Continuar como invitado",
  connectAWallet: "Conectar una cartera",
  newToWallets: "¿Nuevo en carteras?",
  getStarted: "Comenzar",
  guest: "Invitado",
  send: "Enviar",
  receive: "Recibir",
  buy: "Buy", // TODO
  transactions: "Transactions", // TODO
  viewAllTransactions: "View All Transactions", // TODO
  currentNetwork: "Red actual",
  switchAccount: "Cambiar cuenta",
  requestTestnetFunds: "Solicitar fondos de Testnet",
  backupWallet: "Respaldar cartera",
  guestWalletWarning:
    "Esta es una cartera de invitado temporal. Haz una copia de seguridad si no quieres perder el acceso a ella",
  switchTo: "Cambiar a",
  connectedToSmartWallet: "cartera inteligente",
  confirmInWallet: "Confirmar en cartera",
  disconnectWallet: "Desconectar cartera",
  copyAddress: "Copiar dirección",
  personalWallet: "Cartera personal",
  smartWallet: "Cartera inteligente",
  or: "O",
  goBackButton: "Atras",
  welcomeScreen: {
    defaultTitle: "Tu puerta de entrada al mundo descentralizado",
    defaultSubtitle: "Conecta una cartera para empezar",
  },
  agreement: {
    prefix: "Al conectar, aceptas los",
    termsOfService: "Términos de servicio",
    and: "y",
    privacyPolicy: "Política de privacidad",
  },
  networkSelector: {
    title: "Seleccionar red",
    mainnets: "Redes principales",
    testnets: "Redes de prueba",
    allNetworks: "Todas",
    addCustomNetwork: "Agregar red personalizada",
    inputPlaceholder: "Buscar red o ID de cadena",
    categoryLabel: {
      recentlyUsed: "Usadas recientemente",
      popular: "Populares",
      others: "Todas las redes",
    },
    loading: "Cargando",
    failedToSwitch: "Error al cambiar de red",
  },
  receiveFundsScreen: {
    title: "Recibir fondos",
    instruction:
      "Copia la dirección de la cartera para enviar fondos a esta cartera",
  },
  sendFundsScreen: {
    title: "Enviar fondos",
    submitButton: "Enviar",
    token: "Token",
    sendTo: "Enviar a",
    amount: "Cantidad",
    successMessage: "Transacción exitosa",
    invalidAddress: "Dirección inválida",
    noTokensFound: "No se encontraron tokens",
    searchToken: "Buscar o pegar la dirección del token",
    transactionFailed: "Transacción fallida",
    transactionRejected: "Transacción rechazada",
    insufficientFunds: "Fondos insuficientes",
    selectTokenTitle: "Seleccione un Token",
    sending: "Enviando",
  },
  signatureScreen: {
    instructionScreen: {
      title: "Iniciar sesión",
      instruction:
        "Por favor, firma la solicitud de mensaje en tu cartera para continuar",
      signInButton: "Iniciar sesión",
      disconnectWallet: "Desconectar cartera",
    },
    signingScreen: {
      title: "Iniciando sesión",
      prompt: "Firma la solicitud de firma en tu cartera",
      promptForSafe:
        "Firma la solicitud de firma en tu cartera y aprueba la transacción en Safe",
      approveTransactionInSafe: "Aprobar transacción en Safe",
      tryAgain: "Intentar de nuevo",
      failedToSignIn: "Error al iniciar sesión",
      inProgress: "Esperando confirmación",
    },
  },
};

export default connectWalletLocalEs;
