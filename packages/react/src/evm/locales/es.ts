import { DeepPartial, immutableOverride } from "../utils/applyOverrides";
import { ThirdwebLocale } from "./types";

// ...

function extensionAndQRScanScreens(walletName: string) {
  return {
    connectionScreen: {
      inProgress: "Esperando confirmación",
      failed: "Conexión fallida",
      instruction: `Acepta la solicitud de conexión en tu cartera ${walletName}`,
      retry: "Intentar de nuevo",
    },
    getStartedScreen: {
      instruction: `Escanea el código QR para descargar la aplicación ${walletName}`,
    },
    scanScreen: {
      instruction: `Escanea el código QR con la aplicación de cartera ${walletName} para conectarte`,
    },
    getStartedLink: `¿No tienes la cartera ${walletName}?`,
  };
}

export function esDefault(): ThirdwebLocale {
  return {
    connectWallet: {
      signIn: "Iniciar sesión",
      defaultButtonTitle: "Conectar cartera",
      connecting: "Conectando",
      switchNetwork: "Cambiar red",
      switchingNetwork: "Cambiando de red",
      defaultModalTitle: "Conectar",
      recommended: "Recomendado",
      installed: "Instalado",
      continueAsGuest: "Continuar como invitado",
      connectAWallet: "Conectar una cartera",
      newToWallets: "¿Nuevo en carteras?",
      getStarted: "Comenzar",
      guest: "Invitado",
      send: "Enviar",
      receive: "Recibir",
      currentNetwork: "Red actual",
      switchAccount: "Cambiar cuenta",
      requestTestnetFunds: "Solicitar fondos de Testnet",
      transactionHistory: "Historial de transacciones",
      backupWallet: "Respaldar cartera",
      guestWalletWarning:
        "Esta es una cartera de invitado temporal. Haz una copia de seguridad si no quieres perder el acceso a ella",
      switchTo: "Cambiar a",
      connectedToSmartWallet: "Conectado a la cartera inteligente",
      confirmInWallet: "Confirmar en cartera",
      disconnectWallet: "Desconectar cartera",
      copyAddress: "Copiar dirección",
      personalWallet: "Cartera personal",
      smartWallet: "Cartera inteligente",
      or: "O",
      goBackButton: "Atras",
      download: {
        chrome: "Descargar extensión para Chrome",
        android: "Descargar en Google Play",
        iOS: "Descargar en App Store",
      },
      welcomeScreen: {
        defaultTitle: "Tu puerta de entrada al mundo descentralizado",
        defaultSubtitle: "Conecta una cartera para empezar",
      },
      agreement: {
        prefix: "Al conectar, aceptas los",
        termsOfService: "Términos de servicio",
        and: "y",
        privacyPolicy: "Política de privacidad",
      },
      networkSelector: {
        title: "Seleccionar red",
        mainnets: "Redes principales",
        testnets: "Redes de prueba",
        allNetworks: "Todas",
        addCustomNetwork: "Agregar red personalizada",
        inputPlaceholder: "Buscar red o ID de cadena",
        categoryLabel: {
          recentlyUsed: "Usadas recientemente",
          popular: "Populares",
          others: "Todas las redes",
        },
        loading: "Cargando",
        failedToSwitch: "Error al cambiar de red",
      },
      receiveFundsScreen: {
        title: "Recibir fondos",
        instruction:
          "Copia la dirección de la cartera para enviar fondos a esta cartera",
      },
      sendFundsScreen: {
        title: "Enviar fondos",
        submitButton: "Enviar",
        token: "Token",
        sendTo: "Enviar a",
        amount: "Cantidad",
        successMessage: "Transacción exitosa",
        invalidAddress: "Dirección inválida",
        noTokensFound: "No se encontraron tokens",
        searchToken: "Buscar o pegar la dirección del token",
        transactionFailed: "Transacción fallida",
        transactionRejected: "Transacción rechazada",
        insufficientFunds: "Fondos insuficientes",
        selectTokenTitle: "Seleccione un Token",
        sending: "Enviando",
      },
      signatureScreen: {
        instructionScreen: {
          title: "Iniciar sesión",
          instruction:
            "Por favor, firma la solicitud de mensaje en tu cartera para continuar",
          signInButton: "Iniciar sesión",
          disconnectWallet: "Desconectar cartera",
        },
        signingScreen: {
          title: "Iniciando sesión",
          prompt: "Firma la solicitud de firma en tu cartera",
          promptForSafe:
            "Firma la solicitud de firma en tu cartera y aprueba la transacción en Safe",
          approveTransactionInSafe: "Aprobar transacción en Safe",
          tryAgain: "Intentar de nuevo",
          failedToSignIn: "Error al iniciar sesión",
          inProgress: "Esperando confirmación",
        },
      },
    },
    wallets: {
      walletConnect: {
        scanInstruction:
          "Escanea esto con tu aplicación de cartera para conectar",
      },
      smartWallet: {
        connecting: "Conectando a Smart Wallet",
        failedToConnect: "Error al conectar con Smart Wallet",
        wrongNetworkScreen: {
          title: "Red incorrecta",
          subtitle: "Tu cartera no está conectada a la red requerida",
          failedToSwitch: "Error al cambiar de red",
        },
      },
      safeWallet: {
        connectWalletScreen: {
          title: "Vincular cartera personal",
          subtitle: "Conecta tu cartera personal para usar Safe",
          learnMoreLink: "Saber más",
        },
        accountDetailsScreen: {
          title: "Introduce los detalles de tu safe",
          findSafeAddressIn: "Puedes encontrar tu dirección de safe en",
          dashboardLink: "Tablero de Safe",
          network: "Red de Safe",
          selectNetworkPlaceholder: "Red a la que se ha desplegado tu safe",
          invalidChainConfig:
            "No se puede usar Safe: No hay cadenas compatibles con Safe configuradas en la aplicación",
          failedToConnect:
            "No se pudo conectar con Safe. Asegúrate de que la dirección y red del safe son correctas",
          failedToSwitch: "Error al cambiar de red",
          switchNetwork: "Cambiar de red",
          switchingNetwork: "Cambiando de red",
          connectToSafe: "Conectar a Safe",
          connecting: "Conectando",
          mainnets: "Redes principales",
          testnets: "Redes de prueba",
          safeAddress: "Dirección de Safe",
        },
      },
      coinbaseWallet: extensionAndQRScanScreens("Coinbase"),
      metamaskWallet: extensionAndQRScanScreens("MetaMask"),
      okxWallet: extensionAndQRScanScreens("OKX"),
      coreWallet: extensionAndQRScanScreens("Core"),
      coin98Wallet: extensionAndQRScanScreens("Coin98"),
      phantomWallet: extensionAndQRScanScreens("Phantom"),
      xdefiWallet: extensionAndQRScanScreens("XDEFI"),
      rainbowWallet: extensionAndQRScanScreens("Rainbow"),
      trustWallet: extensionAndQRScanScreens("Trust"),
      zerionWallet: extensionAndQRScanScreens("Zerion"),
      oneKeyWallet: extensionAndQRScanScreens("OneKey"),
      cryptoDefiWallet: extensionAndQRScanScreens("Crypto Defi"),
      rabbyWallet: extensionAndQRScanScreens("Rabby"),
      paperWallet: {
        signIn: "Iniciar sesión",
        signInWithGoogle: "Iniciar sesión con Google",
        emailPlaceholder: "Ingresa tu dirección de correo electrónico",
        submitEmail: "Continuar",
        invalidEmail: "Dirección de correo electrónico inválida",
        emailRequired: "Se requiere dirección de correo electrónico",
        googleLoginScreen: {
          title: "Iniciar sesión",
          instruction: "Selecciona tu cuenta de Google en la ventana emergente",
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
      },
      embeddedWallet: {
        signInWithGoogle: "Iniciar sesión con Google",
        signInWithFacebook: "Iniciar sesión con Facebook",
        signInWithApple: "Iniciar sesión con Apple",
        emailPlaceholder: "Ingresa tu dirección de correo electrónico",
        submitEmail: "Continuar",
        signIn: "Iniciar sesión",
        emailRequired: "Se requiere dirección de correo electrónico",
        invalidEmail: "Dirección de correo electrónico inválida",
        maxAccountsExceeded: "Número máximo de cuentas alcanzado",
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
      },
      magicLink: {
        signIn: "Iniciar sesión",
        loginWith: "Iniciar sesión con",
        submitEmail: "Continuar",
        loginWithEmailOrPhone:
          "Iniciar sesión con correo electrónico o número de teléfono",
        emailOrPhoneRequired:
          "Se requiere correo electrónico o número de teléfono",
        loginWithPhone: "Iniciar sesión con número de teléfono",
        phoneRequired: "Se requiere número de teléfono",
        invalidEmail: "Dirección de correo electrónico inválida",
        invalidPhone: "Número de teléfono inválido",
        invalidEmailOrPhone:
          "Dirección de correo electrónico o número de teléfono inválido",
        countryCodeMissing:
          "El número de teléfono debe comenzar con un código de país",
        emailPlaceholder: "Ingresa tu dirección de correo electrónico",
        emailRequired: "Se requiere dirección de correo electrónico",
      },
      localWallet: {
        passwordLabel: "Contraseña",
        confirmPasswordLabel: "Confirmar contraseña",
        enterYourPassword: "Ingresa tu contraseña",
        warningScreen: {
          title: "Advertencia",
          warning:
            "Tu cartera actual se eliminará si creas una nueva. Haz una copia de seguridad de la cartera en tu dispositivo antes de crear una nueva",
          backupWallet: "Copia de seguridad de la cartera",
        },
        reconnectScreen: {
          title: "Conectar a cartera guardada",
          savedWallet: "Cartera guardada",
          continue: "Continuar",
          createNewWallet: "Crear una nueva cartera",
        },
        createScreen: {
          instruction:
            "Elige una contraseña para tu cartera. Podrás acceder y exportar esta cartera con la misma contraseña",
          importWallet: "Importar cartera",
          createNewWallet: "Crear nueva cartera",
          connecting: "Conectando",
        },
        exportScreen: {
          description1:
            "Esto descargará un archivo JSON que contiene la información de la cartera en tu dispositivo cifrado con la contraseña",
          description2:
            "Puedes usar este archivo JSON para importar la cuenta en MetaMask usando la misma contraseña",
          walletAddress: "Dirección de la cartera",
          download: "Descargar",
          title: "Respaldar cartera",
        },
        importScreen: {
          title: "Importar cartera",
          description1:
            "La aplicación puede autorizar cualquier transacción en nombre de la cartera sin ninguna aprobación",
          description2:
            "Recomendamos conectar solo con aplicaciones de confianza",
          import: "Importar",
          uploadJSON: "Por favor sube un archivo JSON",
          uploadedSuccessfully: "Subido con éxito",
        },
      },
      frameWallet: {
        ...extensionAndQRScanScreens("Frame"),
        connectionFailedScreen: {
          title: "Fallo al conectar con Frame",
          description:
            "Asegúrate de que la aplicación de escritorio esté instalada y en funcionamiento. Puedes descargar Frame desde el enlace de abajo. Asegúrate de actualizar esta página una vez que Frame esté funcionando.",
          downloadFrame: "Descargar Frame",
          supportLink: "¿Sigues teniendo problemas para conectar?",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default Spanish locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 *
 * @example
 * ### Use default Locale
 * ```tsx
 * const spanish = es();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const spanish = es({
 *  connectWallet: {
 *    signIn: "Iniciar sesión"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={spanish}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 *
 * @locale
 */
export function es(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = esDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
