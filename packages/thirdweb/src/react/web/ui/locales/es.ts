import {
  type DeepPartial,
  immutableOverride,
} from "../../../core/utils/applyOverrides.js";
import type { ThirdwebLocale } from "./types.js";

/**
 * @internal
 */
export function esDefault(): ThirdwebLocale {
  return {
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
          // TODO: translate
          skip: "Skip",
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
          // TODO: translate
          downloadMessage:
            "This will download a text file containing the wallet private key onto your device",
          decryptMessage:
            "Enter the password of this wallet to decrypt the private key",
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
          // TODO: translate
          passwordDescription:
            "Choose a password to encrypt the private key. Encrypted private key will be stored in browser",
          import: "Importar",
          uploadJSON: "Por favor sube un archivo JSON",
          uploadedSuccessfully: "Subido con éxito",
          // TODO
          invalidPrivateKey: "Invalid Private Key",
        },
      },
    },
  };
}

/**
 * Calling this function will return the default Spanish locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 * @param overrides - Locale object to override the default locale object
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
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
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
 * @returns ThirdwebLocale object
 * @locale
 */
export function es(overrides?: DeepPartial<ThirdwebLocale>) {
  const defaultObj = esDefault();
  if (!overrides) {
    return defaultObj;
  }

  return immutableOverride(defaultObj, overrides);
}
