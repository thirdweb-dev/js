import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  emailPlaceholder: "Адрес электронной почты",
  submitEmail: "Продолжить",
  signIn: "Войти",
  or: "или",
  emailRequired: "Требуется адрес электронной почты",
  invalidEmail: "Неверный адрес электронной почты",
  maxAccountsExceeded:
    "Превышено максимальное количество аккаунтов. Пожалуйста, сообщите разработчику приложения.",
  socialLoginScreen: {
    title: "Войти",
    instruction: "Войдите в свой аккаунт во всплывающем окне",
    failed: "Не удалось войти",
    retry: "Повторить попытку",
  },
  emailLoginScreen: {
    title: "Войти",
    enterCodeSendTo: "Введите код подтверждения, отправленный на",
    newDeviceDetected: "Обнаружено новое устройство",
    enterRecoveryCode:
      "Введите код восстановления, отправленный вам по электронной почте при первой регистрации",
    invalidCode: "Неверный код подтверждения",
    invalidCodeOrRecoveryCode:
      "Неверный код подтверждения или код восстановления",
    verify: "Подтвердить",
    failedToSendCode: "Не удалось отправить код подтверждения",
    sendingCode: "Отправка кода подтверждения",
    resendCode: "Повторно отправить код подтверждения",
  },
  createPassword: {
    title: "Создать пароль",
    instruction:
      "Установите пароль для вашего аккаунта. Этот пароль понадобится при подключении с нового устройства.",
    saveInstruction: "Обязательно сохраните его",
    inputPlaceholder: "Введите ваш пароль",
    confirmation: "Я сохранил свой пароль",
    submitButton: "Установить пароль",
    failedToSetPassword: "Не удалось установить пароль",
  },
  enterPassword: {
    title: "Введите пароль",
    instruction: "Введите пароль для вашего аккаунта",
    inputPlaceholder: "Введите ваш пароль",
    submitButton: "Подтвердить",
    wrongPassword: "Неверный пароль",
  },
  signInWithEmail: "Войти с помощью электронной почты",
  invalidPhone: "Недействительный номер телефона",
  phonePlaceholder: "Номер телефона",
  signInWithPhone: "Войти с помощью номера телефона",
  phoneRequired: "Требуется номер телефона",
  passkey: "Ключ доступа",
  signInWithWallet: "Войти с помощью кошелька",
  linkWallet: "Привязать кошелек",
  loginAsGuest: "Продолжить как гость",
} satisfies InAppWalletLocale;
