import type { LocalWalletLocale } from "./types.js";

const localWalletLocaleEn: LocalWalletLocale = {
  passwordLabel: "Mot de passe",
  confirmPasswordLabel: "Confirmer le mot de passe",
  enterYourPassword: "Entrez votre mot de passe",
  warningScreen: {
    title: "Avertissement",
    warning:
      "Votre portefeuille actuel sera supprimé si vous créez un nouveau portefeuille. Sauvegardez le portefeuille sur votre appareil avant de créer un nouveau portefeuille",
    backupWallet: "Sauvegarder le portefeuille",
    skip: "Passer",
  },
  reconnectScreen: {
    title: "Connecter au portefeuille enregistré",
    savedWallet: "Portefeuille enregistré",
    continue: "Continuer",
    createNewWallet: "Créer un nouveau portefeuille",
  },
  createScreen: {
    instruction:
      "Choisissez un mot de passe pour votre portefeuille. Vous pourrez accéder et exporter ce portefeuille avec le même mot de passe",
    importWallet: "Importer le portefeuille",
    createNewWallet: "Créer un nouveau portefeuille",
    connecting: "Connexion",
  },
  exportScreen: {
    downloadMessage:
      "Cela téléchargera un fichier texte contenant la clé privée du portefeuille sur votre appareil",
    decryptMessage:
      "Entrez le mot de passe de ce portefeuille pour déchiffrer la clé privée",
    walletAddress: "Adresse du portefeuille",
    download: "Télécharger",
    title: "Sauvegarder le portefeuille",
  },
  importScreen: {
    title: "Importer le portefeuille",
    description1:
      "L'application peut autoriser toute transaction au nom du portefeuille sans aucune approbation",
    description2:
      "Nous recommandons de ne se connecter qu'à des applications de confiance",
    passwordDescription:
      "Choisissez un mot de passe pour chiffrer la clé privée. La clé privée chiffrée sera stockée dans le navigateur",
    import: "Importer",
    uploadJSON: "Veuillez télécharger un fichier JSON",
    uploadedSuccessfully: "Téléchargé avec succès",
    invalidPrivateKey: "Clé privée invalide",
  },
};

export default localWalletLocaleEn;
