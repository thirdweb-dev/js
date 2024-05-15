import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Mag-sign in gamit ang Google",
  signInWithFacebook: "Mag-sign in gamit ang Facebook",
  signInWithApple: "Mag-sign in gamit ang Apple",
  emailPlaceholder: "Ilagay ang iyong email address",
  submitEmail: "Magpatuloy",
  signIn: "Mag-sign in",
  emailRequired: "Kinakailangan ang email address",
  invalidEmail: "Hindi wastong email address",
  maxAccountsExceeded: "Naabot mo na ang maximum na bilang ng accounts",
  or: "O",
  socialLoginScreen: {
    title: "Mag-sign in",
    instruction: "Mag-sign in sa iyong account sa pop-up",
    failed: "Hindi nagawa ang pag-sign in",
    retry: "Subukan muli",
  },
  emailLoginScreen: {
    title: "Mag-sign in",
    enterCodeSendTo: "Ilagay ang verification code na ipinadala sa",
    newDeviceDetected: "Natuklasan ang bagong device",
    enterRecoveryCode:
      "Ilagay ang recovery code na ipinadala sa iyo noong unang pag-sign up",
    invalidCode: "Hindi wastong verification code",
    invalidCodeOrRecoveryCode:
      "Hindi wastong verification code o recovery code",
    verify: "Patunayan",
    failedToSendCode: "Hindi nagawa ang pagpapadala ng verification code",
    sendingCode: "Nagpapadala ng verification code",
    resendCode: "Ipadala muli ang verification code",
  },
  createPassword: {
    title: "Lumikha ng Password",
    instruction:
      "Itakda ang isang password para sa iyong account. Kakailanganin mo ang password na ito kapag kumokonekta mula sa isang bagong device.",
    saveInstruction: "Siguraduhing ito ay na-save",
    inputPlaceholder: "Ilagay ang iyong password",
    confirmation: "Na-save ko na ang aking password",
    submitButton: "Itakda ang Password",
    failedToSetPassword: "Hindi nagawa ang pagtakda ng password",
  },
  enterPassword: {
    title: "Ilagay ang Password",
    instruction: "Ilagay ang password para sa iyong account",
    inputPlaceholder: "Ilagay ang iyong password",
    submitButton: "Patunayan",
    wrongPassword: "Maling password",
  },
  signInWithEmail: "Mag-sign in gamit ang email",
  invalidPhone: "Hindi wastong numero ng telepono",
  phonePlaceholder: "Ilagay ang iyong numero ng telepono",
  signInWithPhone: "Mag-login gamit ang numero ng telepono",
  phoneRequired: "Kinakailangan ang numero ng telepono",
} satisfies InAppWalletLocale;
