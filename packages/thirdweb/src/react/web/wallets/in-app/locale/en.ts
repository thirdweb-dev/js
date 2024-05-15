import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  emailPlaceholder: "Email address",
  submitEmail: "Continue",
  signIn: "Sign in",
  or: "Or",
  emailRequired: "Email address is required",
  invalidEmail: "Invalid email address",
  maxAccountsExceeded:
    "Maximum number of accounts exceeded. Please notify the app developer.",
  socialLoginScreen: {
    title: "Sign in",
    instruction: "Sign into your account in the pop-up",
    failed: "Failed to sign in",
    retry: "Retry",
  },
  emailLoginScreen: {
    title: "Sign in",
    enterCodeSendTo: "Enter the verification code sent to",
    newDeviceDetected: "New device detected",
    enterRecoveryCode:
      "Enter the recovery code emailed to you when you first signed up",
    invalidCode: "Invalid verification code",
    invalidCodeOrRecoveryCode: "Invalid verification code or Recovery code",
    verify: "Verify",
    failedToSendCode: "Failed to send verification code",
    sendingCode: "Sending verification code",
    resendCode: "Resend verification code",
  },
  createPassword: {
    title: "Create Password",
    instruction:
      "Set a password for your account. You will need this password when connecting from a new device.",
    saveInstruction: "Make sure to save it",
    inputPlaceholder: "Enter your password",
    confirmation: "I have saved my password",
    submitButton: "Set Password",
    failedToSetPassword: "Failed to set password",
  },
  enterPassword: {
    title: "Enter Password",
    instruction: "Enter the password for your account",
    inputPlaceholder: "Enter your password",
    submitButton: "Verify",
    wrongPassword: "Wrong password",
  },
  signInWithEmail: "Sign in with Email",
  invalidPhone: "Invalid phone number",
  phonePlaceholder: "Phone number",
  signInWithPhone: "Sign in with phone number",
  phoneRequired: "phone number is required",
} satisfies InAppWalletLocale;
