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
import { PaperConfig, PaperLoginType, RecoveryShareManagement } from "./types";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
import { reservedScreens } from "../../ConnectWallet/constants";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { PaperGoogleLogin } from "./PaperGoogleLogin";
import { emailIcon } from "../../ConnectWallet/icons/dataUris";

export const paperWallet = (
  config?: PaperConfig,
): WalletConfig<PaperWallet> => {
  const defaultRecovery = "AWS_MANAGED";

  return {
    category: "socialLogin",
    isHeadless: true,
    id: PaperWallet.id,
    recommended: config?.recommended,
    meta: {
      ...PaperWallet.meta,
      name: "Email",
      iconURL: emailIcon,
    },
    create(options: WalletOptions) {
      return new PaperWallet({
        ...options,
        ...config,
        advancedOptions: {
          recoveryShareManagement: "AWS_MANAGED",
          ...config?.advancedOptions,
        },
      });
    },
    selectUI(props) {
      return (
        <PaperSelectionUI
          {...props}
          recoveryShareManagement={
            config?.advancedOptions?.recoveryShareManagement || defaultRecovery
          }
        />
      );
    },
    connectUI(props) {
      return (
        <PaperConnectUI
          {...props}
          recoveryShareManagement={
            config?.advancedOptions?.recoveryShareManagement || defaultRecovery
          }
        />
      );
    },
  };
};

const PaperSelectionUI: React.FC<
  SelectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
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
        googleLoginSupported={props.recoveryShareManagement !== "USER_MANAGED"}
        onSelect={props.onSelect}
      />
    </div>
  );
};

const PaperConnectUI = (
  props: ConnectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
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
      googleLoginSupported={props.recoveryShareManagement !== "USER_MANAGED"}
      modalSize={props.modalSize}
      onSelect={(_loginType) => {
        setLoginType(_loginType);
      }}
      onBack={props.goBack}
    />
  );
};
