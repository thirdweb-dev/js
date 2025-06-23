import type { InAppWalletLocale } from "./types.js";

export default {
  createPassword: {
    confirmation: "J'ai sauvegardé mon mot de passe",
    failedToSetPassword: "Échec de la définition du mot de passe",
    inputPlaceholder: "Entrez votre mot de passe",
    instruction:
      "Définissez un mot de passe pour votre compte. Vous aurez besoin de ce mot de passe lorsque vous vous connecterez depuis un nouvel appareil.",
    saveInstruction: "Assurez-vous de le sauvegarder",
    submitButton: "Définir le mot de passe",
    title: "Créer un mot de passe",
  },
  emailLoginScreen: {
    enterCodeSendTo: "Entrez le code de vérification envoyé à",
    enterRecoveryCode:
      "Entrez le code de récupération qui vous a été envoyé par e-mail lors de votre inscription",
    failedToSendCode: "Échec de l'envoi du code de vérification",
    invalidCode: "Code de vérification invalide",
    invalidCodeOrRecoveryCode:
      "Code de vérification ou code de récupération invalide",
    newDeviceDetected: "Nouvel appareil détecté",
    resendCode: "Renvoyer le code de vérification",
    sendingCode: "Envoi du code de vérification",
    title: "Se connecter",
    verify: "Vérifier",
  },
  emailPlaceholder: "E-mail",
  emailRequired: "L'adresse e-mail est requise",
  enterPassword: {
    inputPlaceholder: "Entrez votre mot de passe",
    instruction: "Entrez le mot de passe de votre compte",
    submitButton: "Vérifier",
    title: "Entrer le mot de passe",
    wrongPassword: "Mot de passe incorrect",
  },
  invalidEmail: "Adresse e-mail invalide",
  invalidPhone: "Numéro de téléphone invalide",
  linkWallet: "Lier un portefeuille",
  loginAsGuest: "Connectez-vous en tant qu'invité",
  maxAccountsExceeded:
    "Nombre maximum de comptes dépassé. Veuillez en informer le développeur de l'application.",
  or: "Ou",
  passkey: "Passkey",
  phonePlaceholder: "Téléphone",
  phoneRequired: "Le numéro de téléphone est requis",
  signIn: "Se connecter",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  signInWithEmail: "Se connecter avec e-mail",
  signInWithFacebook: "Facebook",
  signInWithGoogle: "Google",
  signInWithPhone: "Se connecter avec le numéro de téléphone",
  signInWithWallet: "Se connecter avec portefeuille",
  socialLoginScreen: {
    failed: "Échec de la connexion",
    instruction: "Connectez-vous à votre compte dans la fenêtre pop-up",
    retry: "Réessayer",
    title: "Se connecter",
  },
  submitEmail: "Continuer",
} satisfies InAppWalletLocale;
