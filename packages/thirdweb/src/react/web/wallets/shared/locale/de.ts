import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  emailPlaceholder: "E-Mail Adresse",
  submitEmail: "Weiter",
  signIn: "Anmelden",
  or: "Oder",
  emailRequired: "E-Mail Adresse ist erforderlich",
  invalidEmail: "Ungültige E-Mail Adresse",
  maxAccountsExceeded:
    "Maximale Anzahl von Konten überschritten. Bitte informiere den App-Entwickler.",
  socialLoginScreen: {
    title: "Anmelden",
    instruction: "Melde dich im Popup Fenster an",
    failed: "Anmeldung fehlgeschlagen",
    retry: "Erneut versuchen",
  },
  emailLoginScreen: {
    title: "Anmelden",
    enterCodeSendTo: "Gib den Bestätigungscode ein. Gesendet an",
    newDeviceDetected: "Neues Gerät erkannt",
    enterRecoveryCode:
      "Gib den Wiederherstellungscode ein, der dir per E-Mail zugesandt wurde, als du dich zum ersten Mal angemeldet hast",
    invalidCode: "Ungültiger Bestätigungscode",
    invalidCodeOrRecoveryCode:
      "Ungültiger Bestätigungscode oder Wiederherstellungscode",
    verify: "Bestätigen",
    failedToSendCode: "Bestätigungscode konnte nicht gesendet werden",
    sendingCode: "Bestätigungscode wird gesendet",
    resendCode: "Bestätigungscode erneut senden",
  },
  createPassword: {
    title: "Passwort erstellen",
    instruction:
      "Lege ein Passwort für dein Konto fest. Du benötigst dieses Passwort, um dich von einem neuen Gerät aus anzumelden.",
    saveInstruction: "Stelle sicher, dass du es gespeichert hast",
    inputPlaceholder: "Gib dein Passwort ein",
    confirmation: "Ich habe mein Passwort gespeichert",
    submitButton: "Passwort festlegen",
    failedToSetPassword: "Passwort festlegen fehlgeschlagen",
  },
  enterPassword: {
    title: "Passwort eingeben",
    instruction: "Gib das Passwort für dein Konto ein",
    inputPlaceholder: "Gib dein Passwort ein",
    submitButton: "Überprüfen",
    wrongPassword: "Falsches Passwort",
  },
  signInWithEmail: "Mit E-Mail Adresse anmelden",
  invalidPhone: "Ungültige Telefonnummer",
  phonePlaceholder: "Telefonnummer",
  signInWithPhone: "Mit Telefonnummer anmelden",
  phoneRequired: "Telefonnummer ist erforderlich",
  passkey: "Passkey",
  linkWallet: "Verknüpfen Sie eine Brieftasche",
  loginAsGuest: "Melden Sie sich als Gast an",
  signInWithWallet: "Mit Wallet anmelden",
} satisfies InAppWalletLocale;
