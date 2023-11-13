import { DeepPartial, immutableOverride } from "../utils/applyOverrides";
import { ThirdwebLocale } from "./en";

// wallets that connect via extension and QR scan
function extensionAndQRScanScreens(walletName: string) {
  return {
    connectionScreen: {
      inProgress: "確認待ち",
      failed: "接続に失敗しました",
      instruction: `${walletName}のウォレットで接続リクエストを承認してください`,
      retry: "再試行",
    },
    getStartedScreen: {
      instruction: `QRコードをスキャンして${walletName}アプリをダウンロードしてください`,
    },
    scanScreen: {
      instruction: `${walletName}のウォレットアプリでQRコードをスキャンして接続してください`,
    },
    getStartedLink: `${walletName}のウォレットを持っていませんか？`,
  };
}

export function jaDefault(): ThirdwebLocale {
  return {
    connectWallet: {
      signIn: "サインイン",
      defaultButtonTitle: "ウォレット接続",
      connecting: "接続中",
      switchNetwork: "ネットワークを切り替える",
      switchingNetwork: "ネットワークの切替中",
      defaultModalTitle: "接続",
      recommended: "推奨",
      installed: "インストール済み",
      continueAsGuest: "ゲストとして続ける",
      connectAWallet: "ウォレットを接続する",
      newToWallets: "ウォレットは初めてですか？",
      getStarted: "始める",
      guest: "ゲスト",
      send: "送る",
      receive: "受け取る",
      currentNetwork: "現在のネットワーク",
      switchAccount: "アカウントを切り替える",
      requestTestnetFunds: "テストネットの資金をリクエストする",
      transactionHistory: "取引履歴",
      backupWallet: "ウォレットのバックアップ",
      guestWalletWarning:
        "これは一時的なゲストウォレットです。アクセスできなくなることを防ぐため、バックアップをしてください",
      switchTo: "切り替え先", // Used in "Switch to <Wallet-Name>"
      connectedToSmartWallet: "スマートウォレットに接続済み",
      confirmInWallet: "ウォレットで確認",
      disconnectWallet: "ウォレットの切断",
      copyAddress: "アドレスをコピー",
      personalWallet: "パーソナルウォレット",
      smartWallet: "スマートウォレット",
      or: "または",
      download: {
        chrome: "Chrome拡張をダウンロード",
        android: "Google Playでダウンロード",
        iOS: "App Storeでダウンロード",
      },
      welcomeScreen: {
        defaultTitle: "分散型世界へのゲートウェイ",
        defaultSubtitle: "始めるためにウォレットを接続してください",
      },
      agreement: {
        prefix: "接続することで、以下に同意したことになります：",
        termsOfService: "利用規約",
        and: "および",
        privacyPolicy: "プライバシーポリシー",
      },
      networkSelector: {
        title: "ネットワークの選択",
        mainnets: "メインネット",
        testnets: "テストネット",
        allNetworks: "すべて",
        addCustomNetwork: "カスタムネットワークを追加",
        inputPlaceholder: "ネットワーク名またはチェーンIDを検索",
        categoryLabel: {
          recentlyUsed: "最近使用したもの",
          popular: "人気",
          others: "全てのネットワーク",
        },
        loading: "読み込み中",
        failedToSwitch: "ネットワークの切替に失敗しました",
      },
      receiveFundsScreen: {
        title: "資金を受け取る",
        instruction:
          "このウォレットに資金を送るためのウォレットアドレスをコピーしてください",
      },
      sendFundsScreen: {
        title: "資金の送付",
        submitButton: "送信",
        token: "トークン",
        sendTo: "送信先",
        amount: "金額",
        successMessage: "取引成功",
        invalidAddress: "無効なアドレス",
        noTokensFound: "トークンが見つかりません",
        searchToken: "トークンのアドレスを検索するか、貼り付けてください",
        transactionFailed: "取引に失敗しました",
        transactionRejected: "取引が拒否されました",
        insufficientFunds: "資金が不足しています",
        selectTokenTitle: "トークンを選択",
        sending: "送信中",
      },
      signatureScreen: {
        instructionScreen: {
          title: "サインイン",
          instruction:
            "続行するためにウォレットでメッセージリクエストにサインしてください",
          signInButton: "サインイン",
        },
        signingScreen: {
          title: "サインイン中",
          prompt: "ウォレットで署名リクエストにサインしてください",
          promptForSafe:
            "ウォレットで署名リクエストにサインし、Safeで取引を承認してください",
          approveTransactionInSafe: "Safeで取引を承認",
          tryAgain: "再試行",
          failedToSignIn: "サインインに失敗しました",
        },
      },
    },
    wallets: {
      walletConnect: {
        scanInstruction:
          "接続するためにウォレットアプリでこちらをスキャンしてください",
      },
      smartWallet: {
        connecting: "スマートウォレットに接続中",
        failedToConnect: "スマートウォレットに接続できませんでした",
        wrongNetworkScreen: {
          title: "異なるネットワーク",
          subtitle: "ウォレットが必要なネットワークに接続されていません",
          failedToSwitch: "ネットワークの切り替えに失敗しました",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "パーソナルウォレットのリンク",
          subtitle:
            "Safeを使用するためにパーソナルウォレットを接続してください。",
          learnMoreLink: "もっと詳しく",
        },
        accountDetailsScreen: {
          title: "Safeの詳細を入力してください",
          findSafeAddressIn: "Safeのアドレスは以下で見つけることができます", // You can find your safe address in + <dashboardLink>
          dashboardLink: "Safeダッシュボード", // <dashboardLink>
          network: "Safeネットワーク",
          selectNetworkPlaceholder: "Safeがデプロイされているネットワーク",
          invalidChainConfig:
            "アプリにSafeをサポートするチェーンが設定されていないため、Safeを使用できません",
          failedToConnect:
            "Safeに接続できませんでした。Safeアドレスとネットワークが正しいことを確認してください。",
          failedToSwitch: "ネットワークの切り替えに失敗しました",
          switchNetwork: "ネットワークを切り替える",
          switchingNetwork: "ネットワークを切り替え中",
          connectToSafe: "Safeに接続",
          connecting: "接続中",
          mainnets: "メインネット",
          testnets: "テストネット",
          safeAddress: "Safeアドレス",
        },
      },
      coinbaseWallet: extensionAndQRScanScreens("Coinbase"),
      metamaskWallet: extensionAndQRScanScreens("MetaMask"),
      okxWallet: extensionAndQRScanScreens("OKX"),
      coreWallet: extensionAndQRScanScreens("Core"),
      coin98Wallet: extensionAndQRScanScreens("Coin98"),
      phantomWallet: extensionAndQRScanScreens("Phantom"),
      rainbowWallet: extensionAndQRScanScreens("Rainbow"),
      trustWallet: extensionAndQRScanScreens("Trust"),
      zerionWallet: extensionAndQRScanScreens("Zerion"),
      paperWallet: {
        signIn: "サインイン",
        signInWithGoogle: "Googleでサインイン",
        emailPlaceholder: "メールアドレスを入力してください",
        submitEmail: "続ける",
        invalidEmail: "無効なメールアドレス",
        emailRequired: "メールアドレスが必要です",
        googleLoginScreen: {
          title: "サインイン",
          instruction: "ポップアップ内でGoogleアカウントを選択してください",
          failed: "サインインに失敗しました",
          retry: "再試行",
        },
        emailLoginScreen: {
          title: "サインイン",
          enterCodeSendTo: "送信された確認コードを入力してください", // Enter the verification code sent to + <email>
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
      },
      embeddedWallet: {
        signInWithGoogle: "Googleでサインイン",
        signInWithFacebook: "Facebookでサインイン",
        signInWithApple: "Appleでサインイン",
        emailPlaceholder: "メールアドレスを入力してください",
        submitEmail: "続ける",
        emailRequired: "メールアドレスが必要です",
        invalidEmail: "無効なメールアドレス",
        signIn: "サインイン",
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
      },
      magicLink: {
        signIn: "サインイン",
        loginWith: "次でログイン：",
        submitEmail: "続ける",
        loginWithEmailOrPhone: "メールアドレスまたは電話番号でログイン",
        emailOrPhoneRequired: "メールアドレスまたは電話番号が必要です",
        loginWithPhone: "電話番号でログイン",
        phoneRequired: "電話番号が必要です",
        invalidEmail: "無効なメールアドレス",
        invalidPhone: "無効な電話番号",
        invalidEmailOrPhone: "無効なメールアドレスまたは電話番号",
        countryCodeMissing: "電話番号は国コードから始める必要があります",
        emailPlaceholder: "メールアドレスを入力してください",
        emailRequired: "メールアドレスが必要です",
      },
      localWallet: {
        passwordLabel: "パスワード",
        confirmPasswordLabel: "パスワードを確認",
        enterYourPassword: "パスワードを入力してください",
        warningScreen: {
          title: "警告",
          warning:
            "新しいウォレットを作成すると、現在のウォレットは削除されます。新しいウォレットを作成する前に、ウォレットのバックアップをデバイスに保存してください",
          backupWallet: "ウォレットのバックアップ",
        },
        reconnectScreen: {
          title: "保存されたウォレットへの接続",
          savedWallet: "保存されたウォレット",
          continue: "続ける",
          createNewWallet: "新しいウォレットを作成",
        },
        createScreen: {
          instruction:
            "ウォレットのパスワードを選択してください。このパスワードで、このウォレットにアクセスしたり、同じパスワードでエクスポートすることができます",
          importWallet: "ウォレットをインポート",
          createNewWallet: "新しいウォレットを作成",
          connecting: "接続中",
        },
        exportScreen: {
          description1:
            "この操作は、ウォレット情報を含む、パスワードで暗号化されたJSONファイルをデバイスにダウンロードします",
          description2:
            "このJSONファイルを使用して、同じパスワードでMetaMaskにアカウントをインポートすることができます",
          walletAddress: "ウォレットアドレス",
          download: "ダウンロード",
          title: "ウォレットのバックアップ",
        },
        importScreen: {
          title: "ウォレットをインポート",
          description1:
            "アプリケーションは、ウォレットの代わりに任意の取引を承認なしで認証することができます",
          description2:
            "信頼できるアプリケーションにのみ接続することをお勧めします",
          import: "インポート",
          uploadJSON: "JSONファイルをアップロードしてください",
          uploadedSuccessfully: "正常にアップロードされました",
        },
      },
      frameWallet: {
        ...extensionAndQRScanScreens("Frame"),
        connectionFailedScreen: {
          title: "Frameに接続できませんでした",
          description:
            "デスクトップアプリがインストールされていて実行中であることを確認してください。以下のリンクからFrameをダウンロードすることができます。Frameが実行されている場合は、このページをリフレッシュしてください。",
          downloadFrame: "Frameをダウンロード",
          supportLink: "まだ接続に問題がありますか？",
        },
      },
    },
  };
}

export function ja(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = jaDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
