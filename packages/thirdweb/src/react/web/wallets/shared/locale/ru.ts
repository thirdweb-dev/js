import type { InAppWalletLocale } from "./types.js";

export default {
  createPassword: {
    confirmation: "Я сохранил свой пароль",
    failedToSetPassword: "Не удалось установить пароль",
    inputPlaceholder: "Введите ваш пароль",
    instruction:
      "Установите пароль для вашего аккаунта. Этот пароль понадобится при подключении с нового устройства.",
    saveInstruction: "Обязательно сохраните его",
    submitButton: "Установить пароль",
    title: "Создать пароль",
  },
  emailLoginScreen: {
    enterCodeSendTo: "Введите код подтверждения, отправленный на",
    enterRecoveryCode:
      "Введите код восстановления, отправленный вам по электронной почте при первой регистрации",
    failedToSendCode: "Не удалось отправить код подтверждения",
    invalidCode: "Неверный код подтверждения",
    invalidCodeOrRecoveryCode:
      "Неверный код подтверждения или код восстановления",
    newDeviceDetected: "Обнаружено новое устройство",
    resendCode: "Повторно отправить код подтверждения",
    sendingCode: "Отправка кода подтверждения",
    title: "Войти",
    verify: "Подтвердить",
  },
  emailPlaceholder: "Адрес электронной почты",
  emailRequired: "Требуется адрес электронной почты",
  enterPassword: {
    inputPlaceholder: "Введите ваш пароль",
    instruction: "Введите пароль для вашего аккаунта",
    submitButton: "Подтвердить",
    title: "Введите пароль",
    wrongPassword: "Неверный пароль",
  },
  invalidEmail: "Неверный адрес электронной почты",
  invalidPhone: "Недействительный номер телефона",
  linkWallet: "Привязать кошелек",
  loginAsGuest: "Продолжить как гость",
  maxAccountsExceeded:
    "Превышено максимальное количество аккаунтов. Пожалуйста, сообщите разработчику приложения.",
  or: "или",
  passkey: "Ключ доступа",
  phonePlaceholder: "Номер телефона",
  phoneRequired: "Требуется номер телефона",
  signIn: "Войти",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  signInWithEmail: "Войти с помощью электронной почты",
  signInWithFacebook: "Facebook",
  signInWithGoogle: "Google",
  signInWithPhone: "Войти с помощью номера телефона",
  signInWithWallet: "Войти с помощью кошелька",
  socialLoginScreen: {
    failed: "Не удалось войти",
    instruction: "Войдите в свой аккаунт во всплывающем окне",
    retry: "Повторить попытку",
    title: "Войти",
  },
  submitEmail: "Продолжить",
} satisfies InAppWalletLocale;
