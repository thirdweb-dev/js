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
  "phone",
  "email",
  "google",
  "apple",
  "facebook",
];

/**
 * A wallet configurator for [Embedded Wallet](https://portal.thirdweb.com/wallet/embedded-wallet) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * You can also connect this wallet using the [`useEmbeddedWallet`](https://portal.thirdweb.com/references/react/v4/useEmbeddedWallet) hook
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
  const authOptions = options?.auth?.options ?? DEFAULT_AUTH_OPTIONS;

  const isEmailEnabled = authOptions.indexOf("email") !== -1;
  const isPhoneEnabled = authOptions.indexOf("phone") !== -1;
  const isSocialsEnabled = authOptions.some(
    (x) => x !== "email" && x !== "phone",
  );

  function getName() {
    // only email
    if (isEmailEnabled && !isPhoneEnabled && !isSocialsEnabled) {
      return "Email";
    }

    // only phone
    if (isPhoneEnabled && !isEmailEnabled && !isSocialsEnabled) {
      return "Phone";
    }

    // only phone + email
    if (isPhoneEnabled && isEmailEnabled && !isSocialsEnabled) {
      return "Email & Phone";
    }

    // only phone + socials
    if (isPhoneEnabled && isSocialsEnabled && !isEmailEnabled) {
      return "Phone & Socials";
    }

    // only email + socials
    if (isEmailEnabled && isSocialsEnabled && !isPhoneEnabled) {
      return "Email & Socials";
    }

    return "Social Login";
  }

  const name = getName();

  return {
    category: "socialLogin",
    isHeadless: true,
    id: EmbeddedWallet.id,
    recommended: options?.recommended,
    meta: {
      ...EmbeddedWallet.meta,
      name,
      iconURL: emailIcon,
    },
    create(walletOptions: WalletOptions) {
      return new EmbeddedWallet({
        ...walletOptions,
        clientId: walletOptions?.clientId ?? "",
      });
    },
    selectUI(props) {
      return <EmbeddedWalletSelectionUI {...props} authOptions={authOptions} />;
    },
    connectUI(props) {
      return <EmbeddedWalletConnectUI {...props} authOptions={authOptions} />;
    },
  };
};

const EmbeddedWalletSelectionUI: React.FC<
  SelectUIProps<EmbeddedWallet> & {
    authOptions: AuthOption[];
  }
> = (props) => {
  const { screen } = useScreenContext();

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
        createWalletInstance={props.createWalletInstance}
        setConnectedWallet={props.setConnectedWallet}
        setConnectionStatus={props.setConnectionStatus}
        modalSize={props.modalSize}
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
          userInfo={loginType}
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
      createWalletInstance={props.createWalletInstance}
      setConnectedWallet={props.setConnectedWallet}
      setConnectionStatus={props.setConnectionStatus}
    />
  );
};
