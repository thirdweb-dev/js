import { PaperWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  WalletOptions,
  SelectUIProps,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { PaperFormUI, PaperFormUIScreen } from "./PaperFormUI";
import { PaperOTPLoginUI } from "./PaperOTPLoginUI";
import {
  OAuthProvider,
  PaperWalletConfigOptions,
  PaperLoginType,
  RecoveryShareManagement,
} from "./types";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
import { reservedScreens } from "../../ConnectWallet/constants";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { PaperGoogleLogin } from "./PaperGoogleLogin";
import { emailIcon } from "../../ConnectWallet/icons/dataUris";

/**
 * A wallet configurator for [Paper Wallet](https://withpaper.com/) which allows integrating the wallet with React.
 *
 * @deprecated We have deprecated PaperWallet in favor of our {@link EmbeddedWallet} which adds support for more sign in methods.
 * Learn more here: https://portal.thirdweb.com/embedded-wallet
 *
 * @wallet
 * @internal
 */
export const paperWallet = (
  options?: PaperWalletConfigOptions,
): WalletConfig<PaperWallet> => {
  const defaultRecovery = "AWS_MANAGED";

  const defaultConfig: PaperWalletConfigOptions = {
    oauthOptions: {
      providers: ["google"],
    },
  };

  const finalOptions: PaperWalletConfigOptions = options
    ? { ...defaultConfig, ...options }
    : defaultConfig;

  const { oauthOptions } = finalOptions;

  return {
    category: "socialLogin",
    isHeadless: true,
    id: PaperWallet.id,
    recommended: finalOptions?.recommended,
    meta: {
      ...PaperWallet.meta,
      name: "Email",
      iconURL: emailIcon,
    },
    create(walletOptions: WalletOptions) {
      return new PaperWallet({
        ...walletOptions,
        ...finalOptions,
        advancedOptions: {
          recoveryShareManagement: "AWS_MANAGED",
          ...finalOptions?.advancedOptions,
        },
      });
    },
    selectUI(props) {
      return (
        <PaperSelectionUI
          {...props}
          recoveryShareManagement={
            finalOptions?.advancedOptions?.recoveryShareManagement ||
            defaultRecovery
          }
          providers={oauthOptions ? oauthOptions?.providers : undefined}
        />
      );
    },
    connectUI(props) {
      return (
        <PaperConnectUI
          {...props}
          recoveryShareManagement={
            finalOptions?.advancedOptions?.recoveryShareManagement ||
            defaultRecovery
          }
          providers={oauthOptions ? oauthOptions?.providers : undefined}
        />
      );
    },
  };
};

const PaperSelectionUI: React.FC<
  SelectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
    providers?: OAuthProvider[];
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
      <PaperFormUI
        walletConfig={props.walletConfig}
        googleLoginSupported={
          props.recoveryShareManagement !== "USER_MANAGED" &&
          !!props.providers?.includes("google")
        }
        onSelect={props.onSelect}
        createWalletInstance={props.createWalletInstance}
        setConnectedWallet={props.setConnectedWallet}
        setConnectionStatus={props.setConnectionStatus}
      />
    </div>
  );
};

const PaperConnectUI = (
  props: ConnectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
    providers?: OAuthProvider[];
  },
) => {
  const [loginType, setLoginType] = useState<PaperLoginType | undefined>(
    props.selectionData as PaperLoginType,
  );

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

    if ("email" in loginType) {
      return (
        <PaperOTPLoginUI
          {...props}
          recoveryShareManagement={props.recoveryShareManagement}
          selectionData={loginType.email}
          goBack={handleBack}
        />
      );
    }

    // google
    else {
      return <PaperGoogleLogin {...props} goBack={handleBack} />;
    }
  }

  return (
    <PaperFormUIScreen
      walletConfig={props.walletConfig}
      googleLoginSupported={
        props.recoveryShareManagement !== "USER_MANAGED" &&
        !!props.providers?.includes("google")
      }
      modalSize={props.modalSize}
      onSelect={(_loginType) => {
        setLoginType(_loginType);
      }}
      onBack={props.goBack}
      createWalletInstance={props.createWalletInstance}
      setConnectedWallet={props.setConnectedWallet}
      setConnectionStatus={props.setConnectionStatus}
    />
  );
};
