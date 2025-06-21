import type { InAppWalletLocale } from "./types.js";

export default {
  createPassword: {
    confirmation: "Eu salvei minha senha",
    failedToSetPassword: "Falha ao definir senha",
    inputPlaceholder: "Digite sua senha",
    instruction:
      "Defina uma senha para sua conta. Você precisará dessa senha ao conectar-se de um novo dispositivo.",
    saveInstruction: "Certifique-se de salvá-la",
    submitButton: "Definir senha",
    title: "Criar senha",
  },
  emailLoginScreen: {
    enterCodeSendTo: "Digite o código de verificação enviado para",
    enterRecoveryCode:
      "Digite o código de recuperação enviado por e-mail quando você se cadastrou",
    failedToSendCode: "Falha ao enviar código de verificação",
    invalidCode: "Código de verificação inválido",
    invalidCodeOrRecoveryCode:
      "Código de verificação ou código de recuperação inválido",
    newDeviceDetected: "Novo dispositivo detectado",
    resendCode: "Reenviar código de verificação",
    sendingCode: "Enviando código de verificação",
    title: "Entrar",
    verify: "Verificar",
  },
  emailPlaceholder: "Endereço de e-mail",
  emailRequired: "Endereço de e-mail é obrigatório",
  enterPassword: {
    inputPlaceholder: "Digite sua senha",
    instruction: "Digite a senha da sua conta",
    submitButton: "Verificar",
    title: "Digite a senha",
    wrongPassword: "Senha incorreta",
  },
  invalidEmail: "Endereço de e-mail inválido",
  invalidPhone: "Número de telefone inválido",
  linkWallet: "Vincular uma carteira",
  loginAsGuest: "Continuar como convidado",
  maxAccountsExceeded:
    "Número máximo de contas excedido. Por favor, notifique o desenvolvedor do aplicativo.",
  or: "ou",
  passkey: "Chave de acesso",
  phonePlaceholder: "Número de telefone",
  phoneRequired: "Número de telefone é obrigatório",
  signIn: "Entrar",
  signInWithApple: "Apple",
  signInWithDiscord: "Discord",
  signInWithEmail: "Entrar com e-mail",
  signInWithFacebook: "Facebook",
  signInWithGoogle: "Google",
  signInWithPhone: "Entrar com número de telefone",
  signInWithWallet: "Entrar com carteira",
  socialLoginScreen: {
    failed: "Falha ao entrar",
    instruction: "Faça login na sua conta no pop-up",
    retry: "Tentar novamente",
    title: "Entrar",
  },
  submitEmail: "Continuar",
} satisfies InAppWalletLocale;
