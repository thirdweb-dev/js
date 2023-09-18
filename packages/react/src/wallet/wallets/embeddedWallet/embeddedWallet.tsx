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
import { PaperLoginType } from "../paper/types";
import {
  EmbeddedWalletFormUI,
  EmbeddedWalletFormUIScreen,
} from "./EmbeddedWalletFormUI";
import { EmbeddedWalletGoogleLogin } from "./EmbeddedWalletGoogleLogin";
import { EmbeddedWalletOTPLoginUI } from "./EmbeddedWalletOTPLoginUI";
import { EmbeddedWalletConfig } from "./types";

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  return {
    category: "socialLogin",
    id: EmbeddedWallet.id,
    recommended: config?.recommended,
    meta: {
      ...EmbeddedWallet.meta,
      name: "Email",
      iconURL: emailIcon,
    },
    create(options: WalletOptions) {
      return new EmbeddedWallet({
        ...options,
        ...config,
        clientId: options?.clientId ?? "",
      });
    },
    selectUI(props) {
      return <EmbeddedWalletSelectionUI {...props} />;
    },
    connectUI(props) {
      return <EmbeddedWalletConnectUI {...props} />;
    },
  };
};

const EmbeddedWalletSelectionUI: React.FC<SelectUIProps<EmbeddedWallet>> = (
  props,
) => {
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
        // props.recoveryShareManagement !== "USER_MANAGED"
        googleLoginSupported={false}
        showOrSeparator={props.supportedWallets.length > 1}
        onSelect={props.onSelect}
      />
    </div>
  );
};

const EmbeddedWalletConnectUI = (props: ConnectUIProps<EmbeddedWallet>) => {
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
        <EmbeddedWalletOTPLoginUI
          {...props}
          selectionData={loginType.email}
          goBack={handleBack}
        />
      );
    }

    // google
    else {
      return <EmbeddedWalletGoogleLogin {...props} goBack={handleBack} />;
    }
  }

  return (
    <EmbeddedWalletFormUIScreen
      googleLoginSupported={true}
      modalSize={props.modalSize}
      onSelect={(_loginType) => {
        setLoginType(_loginType);
      }}
      onBack={props.goBack}
    />
  );
};
