import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  emailPlaceholder: "E-mail",
  submitEmail: "Continuer",
  signIn: "Se connecter",
  or: "Ou",
  emailRequired: "L'adresse e-mail est requise",
  invalidEmail: "Adresse e-mail invalide",
  maxAccountsExceeded:
    "Nombre maximum de comptes dépassé. Veuillez en informer le développeur de l'application.",
  socialLoginScreen: {
    title: "Se connecter",
    instruction: "Connectez-vous à votre compte dans la fenêtre pop-up",
    failed: "Échec de la connexion",
    retry: "Réessayer",
  },
  emailLoginScreen: {
    title: "Se connecter",
    enterCodeSendTo: "Entrez le code de vérification envoyé à",
    newDeviceDetected: "Nouvel appareil détecté",
    enterRecoveryCode:
      "Entrez le code de récupération qui vous a été envoyé par e-mail lors de votre inscription",
    invalidCode: "Code de vérification invalide",
    invalidCodeOrRecoveryCode:
      "Code de vérification ou code de récupération invalide",
    verify: "Vérifier",
    failedToSendCode: "Échec de l'envoi du code de vérification",
    sendingCode: "Envoi du code de vérification",
    resendCode: "Renvoyer le code de vérification",
  },
  createPassword: {
    title: "Créer un mot de passe",
    instruction:
      "Définissez un mot de passe pour votre compte. Vous aurez besoin de ce mot de passe lorsque vous vous connecterez depuis un nouvel appareil.",
    saveInstruction: "Assurez-vous de le sauvegarder",
    inputPlaceholder: "Entrez votre mot de passe",
    confirmation: "J'ai sauvegardé mon mot de passe",
    submitButton: "Définir le mot de passe",
    failedToSetPassword: "Échec de la définition du mot de passe",
  },
  enterPassword: {
    title: "Entrer le mot de passe",
    instruction: "Entrez le mot de passe de votre compte",
    inputPlaceholder: "Entrez votre mot de passe",
    submitButton: "Vérifier",
    wrongPassword: "Mot de passe incorrect",
  },
  signInWithEmail: "Se connecter avec e-mail",
  invalidPhone: "Numéro de téléphone invalide",
  phonePlaceholder: "Téléphone",
  signInWithPhone: "Se connecter avec le numéro de téléphone",
  phoneRequired: "Le numéro de téléphone est requis",
  passkey: "Passkey",
  linkWallet: "Lier un portefeuille",
  loginAsGuest: "Connectez-vous en tant qu'invité",
  signInWithWallet: "Se connecter avec portefeuille",
} satisfies InAppWalletLocale;
