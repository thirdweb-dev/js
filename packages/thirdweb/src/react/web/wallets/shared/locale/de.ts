import type { InAppWalletLocale } from "./types.js";

export default {
  createPassword: {
    confirmation: "Ich habe mein Passwort gespeichert",
    failedToSetPassword: "Passwort festlegen fehlgeschlagen",
    inputPlaceholder: "Gib dein Passwort ein",
    instruction:
      "Lege ein Passwort für dein Konto fest. Du benötigst dieses Passwort, um dich von einem neuen Gerät aus anzumelden.",
    saveInstruction: "Stelle sicher, dass du es gespeichert hast",
    submitButton: "Passwort festlegen",
    title: "Passwort erstellen",
  },
  emailLoginScreen: {
    enterCodeSendTo: "Gib den Bestätigungscode ein. Gesendet an",
    enterRecoveryCode:
      "Gib den Wiederherstellungscode ein, der dir per E-Mail zugesandt wurde, als du dich zum ersten Mal angemeldet hast",
    failedToSendCode: "Bestätigungscode konnte nicht gesendet werden",
    invalidCode: "Ungültiger Bestätigungscode",
    invalidCodeOrRecoveryCode:
      "Ungültiger Bestätigungscode oder Wiederherstellungscode",
    newDeviceDetected: "Neues Gerät erkannt",
    resendCode: "Bestätigungscode erneut senden",
    sendingCode: "Bestätigungscode wird gesendet",
    title: "Anmelden",
    verify: "Bestätigen",
  },
  emailPlaceholder: "E-Mail Adresse",
  emailRequired: "E-Mail Adresse ist erforderlich",
  enterPassword: {
    inputPlaceholder: "Gib dein Passwort ein",
    instruction: "Gib das Passwort für dein Konto ein",
    submitButton: "Überprüfen",
    title: "Passwort eingeben",
    wrongPassword: "Falsches Passwort",
  },
  invalidEmail: "Ungültige E-Mail Adresse",
  invalidPhone: "Ungültige Telefonnummer",
  linkWallet: "Verknüpfen Sie eine Brieftasche",
  loginAsGuest: "Melden Sie sich als Gast an",
  maxAccountsExceeded:
    "Maximale Anzahl von Konten überschritten. Bitte informiere den App-Entwickler.",
  or: "Oder",
  passkey: "Passkey",
  phonePlaceholder: "Telefonnummer",
  phoneRequired: "Telefonnummer ist erforderlich",
  signIn: "Anmelden",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  signInWithEmail: "Mit E-Mail Adresse anmelden",
  signInWithFacebook: "Facebook",
  signInWithGoogle: "Google",
  signInWithPhone: "Mit Telefonnummer anmelden",
  signInWithWallet: "Mit Wallet anmelden",
  socialLoginScreen: {
    failed: "Anmeldung fehlgeschlagen",
    instruction: "Melde dich im Popup Fenster an",
    retry: "Erneut versuchen",
    title: "Anmelden",
  },
  submitEmail: "Weiter",
} satisfies InAppWalletLocale;
