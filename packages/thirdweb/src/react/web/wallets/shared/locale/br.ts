import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Google",
  signInWithFacebook: "Facebook",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  emailPlaceholder: "Endereço de e-mail",
  submitEmail: "Continuar",
  signIn: "Entrar",
  or: "ou",
  emailRequired: "Endereço de e-mail é obrigatório",
  invalidEmail: "Endereço de e-mail inválido",
  maxAccountsExceeded:
    "Número máximo de contas excedido. Por favor, notifique o desenvolvedor do aplicativo.",
  socialLoginScreen: {
    title: "Entrar",
    instruction: "Faça login na sua conta no pop-up",
    failed: "Falha ao entrar",
    retry: "Tentar novamente",
  },
  emailLoginScreen: {
    title: "Entrar",
    enterCodeSendTo: "Digite o código de verificação enviado para",
    newDeviceDetected: "Novo dispositivo detectado",
    enterRecoveryCode:
      "Digite o código de recuperação enviado por e-mail quando você se cadastrou",
    invalidCode: "Código de verificação inválido",
    invalidCodeOrRecoveryCode:
      "Código de verificação ou código de recuperação inválido",
    verify: "Verificar",
    failedToSendCode: "Falha ao enviar código de verificação",
    sendingCode: "Enviando código de verificação",
    resendCode: "Reenviar código de verificação",
  },
  createPassword: {
    title: "Criar senha",
    instruction:
      "Defina uma senha para sua conta. Você precisará dessa senha ao conectar-se de um novo dispositivo.",
    saveInstruction: "Certifique-se de salvá-la",
    inputPlaceholder: "Digite sua senha",
    confirmation: "Eu salvei minha senha",
    submitButton: "Definir senha",
    failedToSetPassword: "Falha ao definir senha",
  },
  enterPassword: {
    title: "Digite a senha",
    instruction: "Digite a senha da sua conta",
    inputPlaceholder: "Digite sua senha",
    submitButton: "Verificar",
    wrongPassword: "Senha incorreta",
  },
  signInWithEmail: "Entrar com e-mail",
  invalidPhone: "Número de telefone inválido",
  phonePlaceholder: "Número de telefone",
  signInWithPhone: "Entrar com número de telefone",
  phoneRequired: "Número de telefone é obrigatório",
  passkey: "Chave de acesso",
  signInWithWallet: "Entrar com carteira",
  linkWallet: "Vincular uma carteira",
  loginAsGuest: "Continuar como convidado",
} satisfies InAppWalletLocale;
