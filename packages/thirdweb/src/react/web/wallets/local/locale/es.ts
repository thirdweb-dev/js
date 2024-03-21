import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleEs: LocalWalletLocale = {
  passwordLabel: "Contraseña",
  confirmPasswordLabel: "Confirmar contraseña",
  enterYourPassword: "Ingresa tu contraseña",
  warningScreen: {
    title: "Advertencia",
    warning:
      "Tu cartera actual se eliminará si creas una nueva. Haz una copia de seguridad de la cartera en tu dispositivo antes de crear una nueva",
    backupWallet: "Copia de seguridad de la cartera",
    // TODO: translate
    skip: "Skip",
  },
  reconnectScreen: {
    title: "Conectar a cartera guardada",
    savedWallet: "Cartera guardada",
    continue: "Continuar",
    createNewWallet: "Crear una nueva cartera",
  },
  createScreen: {
    instruction:
      "Elige una contraseña para tu cartera. Podrás acceder y exportar esta cartera con la misma contraseña",
    importWallet: "Importar cartera",
    createNewWallet: "Crear nueva cartera",
    connecting: "Conectando",
  },
  exportScreen: {
    // TODO: translate
    downloadMessage:
      "This will download a text file containing the wallet private key onto your device",
    decryptMessage:
      "Enter the password of this wallet to decrypt the private key",
    walletAddress: "Dirección de la cartera",
    download: "Descargar",
    title: "Respaldar cartera",
  },
  importScreen: {
    title: "Importar cartera",
    description1:
      "La aplicación puede autorizar cualquier transacción en nombre de la cartera sin ninguna aprobación",
    description2: "Recomendamos conectar solo con aplicaciones de confianza",
    // TODO: translate
    passwordDescription:
      "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
    import: "Importar",
    uploadJSON: "Por favor sube un archivo JSON",
    uploadedSuccessfully: "Subido con éxito",
    // TODO
    invalidPrivateKey: "Invalid Private Key",
  },
};

export default localWalletLocaleEs;
