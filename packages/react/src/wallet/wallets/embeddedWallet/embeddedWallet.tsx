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
 * It returns a `WalletConfig` object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or `useConnect` hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * You can also connect this wallet using the `useEmbeddedWallet` hook
 *
 * @example
 * ```ts
 * embeddedWallet({
 *   auth: {
 *     options: ["email", "google", "facebook", "apple"],
 *   },
 *   recommended: true,
 * });
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * ### auth (optional)
 * Choose which auth providers to show in the wallet connection UI
 *
 * By default, all auth methods are enabled, which is equivalent to setting the following:
 * ```ts
 * {
 *  options: ["email", "google", "apple", "facebook"]
 * }
 * ```
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * ### onAuthSuccess (optional)
 * A callback function that will be called when the user successfully authenticates with the wallet. The callback is called with the `authResult` object
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
