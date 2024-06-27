import type { InAppWalletLocale } from "./types.js";

export default {
  signInWithGoogle: "Googleでサインイン",
  signInWithFacebook: "Facebookでサインイン",
  signInWithApple: "Appleでサインイン",
  emailPlaceholder: "メールアドレスを入力してください",
  submitEmail: "続ける",
  emailRequired: "メールアドレスが必要です",
  invalidEmail: "無効なメールアドレス",
  signIn: "サインイン",
  maxAccountsExceeded: "アカウントの最大数を超えました",
  or: "または",
  socialLoginScreen: {
    title: "サインイン",
    instruction: "ポップアップウィンドウでアカウントにサインインします", // TODO: check if this is correct
    failed: "サインインに失敗しました",
    retry: "再試行",
  },
  emailLoginScreen: {
    title: "サインイン",
    enterCodeSendTo: "送信された確認コードを入力してください",
    newDeviceDetected: "新しいデバイスが検出されました",
    enterRecoveryCode:
      "初回サインアップ時にメールで送信されたリカバリーコードを入力してください",
    invalidCode: "無効な確認コード",
    invalidCodeOrRecoveryCode: "無効な確認コードまたはリカバリーコード",
    verify: "確認",
    failedToSendCode: "確認コードの送信に失敗しました",
    sendingCode: "確認コードを送信中",
    resendCode: "確認コードを再送",
  },
  createPassword: {
    title: "パスワードを作成",
    instruction:
      "アカウントのパスワードを設定してください。新しいデバイスから接続する際にこのパスワードが必要となります。",
    saveInstruction: "パスワードは必ず保存してください。",
    inputPlaceholder: "パスワードを入力してください",
    confirmation: "パスワードを保存しました。",
    submitButton: "パスワードを設定",
    failedToSetPassword: "パスワードの設定に失敗しました。",
  },
  enterPassword: {
    title: "パスワードを入力",
    instruction: "アカウントのパスワードを入力してください",
    inputPlaceholder: "パスワードを入力してください",
    submitButton: "確認",
    wrongPassword: "パスワードが違います",
  },
  invalidPhone: "無効な電話番号",
  signInWithEmail: "電子メールでサインインする",
  phonePlaceholder: "電話番号を入力してください",
  signInWithPhone: "電話番号でログイン",
  phoneRequired: "電話番号が必要です",
} satisfies InAppWalletLocale;
