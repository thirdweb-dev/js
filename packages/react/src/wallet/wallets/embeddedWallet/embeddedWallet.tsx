import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { useState } from "react";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
import { reservedScreens } from "../../ConnectWallet/constants";
import { emailIcon } from "../../ConnectWallet/icons/dataUris";
import {
  EmbeddedWalletFormUI,
  EmbeddedWalletFormUIScreen,
} from "./EmbeddedWalletFormUI";
import { EmbeddedWalletSocialLogin } from "./EmbeddedWalletSocialLogin";
import { EmbeddedWalletOTPLoginUI } from "./EmbeddedWalletOTPLoginUI";
import {
  AuthOption,
  EmbeddedWalletConfigOptions,
  EmbeddedWalletLoginType,
} from "./types";

const DEFAULT_AUTH_OPTIONS: AuthOption[] = [
  "email",
  "google",
  "apple",
  "facebook",
];

/**
 * A wallet configurator for [Embedded Wallet](https://portal.thirdweb.com/wallet/embedded-wallet) which allows integrating the wallet with React.
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to app via `ConnectWallet` component or `useConnect` hook.
 *
 * @example
 *
 * ### Usage with ConnectWallet
 *
 * To allow users to connect to this wallet using the `ConnectWallet` component, you can add it to `ThirdwebProvider`'s supportedWallets prop.
 *
 * ```tsx
 * <ThirdwebProvider supportedWallets={[embeddedWallet()]}>
 *  <App />
 * </ThirdwebProvider>
 * ```
 *
 * ### Usage with useEmbeddedWallet
 *
 * you can use the `useConnect` hook to programmatically connect to the wallet without using the `ConnectWallet` component.
 *
 * The hook will return all the necessary functions you'll need to authenticate and connect to the embedded wallet.
 *
 * ### Connect with Google/Facebook/Apple sign in
 *
 * ```tsx
 * import { useEmbeddedWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { connect } = useEmbeddedWallet();
 *
 *   async function handleConnect() {
 *     const wallet = await connect({
 *       strategy: "google", // or "facebook" or "apple"
 *     });
 *
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
 *
 * ### Connect with Email verification
 *
 * ```tsx
 * function App() {
 *   const { connect, sendVerificationEmail } = useEmbeddedWallet();
 *
 *   const preLogin = async (email: string) => {
 *     // send email verification code
 *     await sendVerificationEmail({ email });
 *   };
 *
 *   const handleLogin = async (email: string, verificationCode: string) => {
 *     // verify email and connect
 *     await connect({
 *       strategy: "email_verification",
 *       email,
 *       verificationCode,
 *     });
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
 *
 * ### Connecting with Iframe
 *
 * ```tsx
 * function App() {
 *   const { connect } = useEmbeddedWallet();
 *
 *   const handleConnect = async () => {
 *     await connect({
 *       strategy: "iframe",
 *     });
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
 *
 * ### Connect with your own auth with JWT
 *
 * ```tsx
 *  function App() {
 *   const { connect } = useEmbeddedWallet();
 *
 *   async function handleConnect() {
 *     const wallet = await connect({
 *       strategy: "jwt",
 *       jwt: "your_jwt_token",
 *     });
 *
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
 *
 * @wallet
 */
export const embeddedWallet = (
  options?: EmbeddedWalletConfigOptions,
): WalletConfig<EmbeddedWallet> => {
  const defaultConfig: EmbeddedWalletConfigOptions = {
    auth: {
      options: DEFAULT_AUTH_OPTIONS,
    },
  };

  const finalOptions: EmbeddedWalletConfigOptions = options
    ? { ...defaultConfig, ...options }
    : defaultConfig;

  const { auth } = finalOptions;

  return {
    category: "socialLogin",
    isHeadless: true,
    id: EmbeddedWallet.id,
    recommended: finalOptions?.recommended,
    meta: {
      ...EmbeddedWallet.meta,
      name: "Email",
      iconURL: emailIcon,
    },
    create(walletOptions: WalletOptions) {
      return new EmbeddedWallet({
        ...walletOptions,
        ...finalOptions,
        clientId: walletOptions?.clientId ?? "",
      });
    },
    selectUI(props) {
      return (
        <EmbeddedWalletSelectionUI
          {...props}
          authOptions={auth ? auth?.options : DEFAULT_AUTH_OPTIONS}
        />
      );
    },
    connectUI(props) {
      return (
        <EmbeddedWalletConnectUI
          {...props}
          authOptions={auth ? auth?.options : DEFAULT_AUTH_OPTIONS}
        />
      );
    },
  };
};

const EmbeddedWalletSelectionUI: React.FC<
  SelectUIProps<EmbeddedWallet> & {
    authOptions: AuthOption[];
  }
> = (props) => {
  const screen = useScreenContext();

  // show the icon + text if
  // wide -
  // compact + not main screen (safe/smart wallet list screen)
  if (
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact")
  ) {
    return (
      <WalletEntryButton
        walletConfig={props.walletConfig}
        selectWallet={() => {
          props.onSelect(undefined);
        }}
      />
    );
  }

  return (
    <div>
      <EmbeddedWalletFormUI
        onSelect={props.onSelect}
        walletConfig={props.walletConfig}
        authOptions={props.authOptions}
      />
    </div>
  );
};

const EmbeddedWalletConnectUI = (
  props: ConnectUIProps<EmbeddedWallet> & {
    authOptions: AuthOption[];
  },
) => {
  const [loginType, setLoginType] = useState<
    EmbeddedWalletLoginType | undefined
  >(props.selectionData as EmbeddedWalletLoginType);

  if (loginType) {
    const handleBack = () => {
      // go back to base screen
      if (props.modalSize === "wide") {
        setLoginType(undefined);
      }

      // go to main screen
      else {
        props.goBack();
      }
    };

    if (typeof loginType !== "string") {
      return (
        <EmbeddedWalletOTPLoginUI
          {...props}
          selectionData={loginType.email}
          goBack={handleBack}
        />
      );
    }

    return (
      <EmbeddedWalletSocialLogin
        {...props}
        goBack={handleBack}
        strategy={loginType}
      />
    );
  }

  return (
    <EmbeddedWalletFormUIScreen
      modalSize={props.modalSize}
      onSelect={setLoginType}
      walletConfig={props.walletConfig}
      onBack={props.goBack}
      authOptions={props.authOptions}
    />
  );
};
