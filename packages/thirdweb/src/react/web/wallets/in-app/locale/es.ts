import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Iniciar sesión con Google",
  signInWithFacebook: "Iniciar sesión con Facebook",
  signInWithApple: "Iniciar sesión con Apple",
  emailPlaceholder: "Ingresa tu dirección de correo electrónico",
  submitEmail: "Continuar",
  signIn: "Iniciar sesión",
  emailRequired: "Se requiere dirección de correo electrónico",
  invalidEmail: "Dirección de correo electrónico inválida",
  maxAccountsExceeded: "Número máximo de cuentas alcanzado",
  or: "O",
  socialLoginScreen: {
    title: "Iniciar sesión",
    instruction: "Inicie sesión en su cuenta en la ventana abierta",
    failed: "Error al iniciar sesión",
    retry: "Reintentar",
  },
  emailLoginScreen: {
    title: "Iniciar sesión",
    enterCodeSendTo: "Ingresa el código de verificación enviado a",
    newDeviceDetected: "Nuevo dispositivo detectado",
    enterRecoveryCode:
      "Ingresa el código de recuperación que se te envió por correo electrónico cuando te registraste por primera vez",
    invalidCode: "Código de verificación inválido",
    invalidCodeOrRecoveryCode:
      "Código de verificación o de recuperación inválido",
    verify: "Verificar",
    failedToSendCode: "Error al enviar el código de verificación",
    sendingCode: "Enviando código de verificación",
    resendCode: "Reenviar código de verificación",
  },
  createPassword: {
    title: "Crear contraseña",
    instruction:
      "Establezca una contraseña para su cuenta. Necesitará esta contraseña cuando se conecte desde un nuevo dispositivo.",
    saveInstruction: "Asegúrese de guardarla",
    inputPlaceholder: "Ingrese su contraseña",
    confirmation: "He guardado mi contraseña",
    submitButton: "Establecer contraseña",
    failedToSetPassword: "Error al establecer la contraseña",
  },
  enterPassword: {
    title: "Ingrese la contraseña",
    instruction: "Ingrese la contraseña de su cuenta",
    inputPlaceholder: "Ingrese su contraseña",
    submitButton: "Verificar",
    wrongPassword: "Contraseña incorrecta",
  },
  invalidPhone: "Número de teléfono inválido",
  phonePlaceholder: "Ingresa tu número de teléfono",
  signInWithPhone: "Iniciar sesión con número de teléfono",
  phoneRequired: "Se requiere número de teléfono",
  signInWithEmail: "Iniciar sesión con correo electrónico",
} satisfies InAppWalletLocale;
