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
import { EmbeddedWalletConfig, AuthOption } from "./types";

const DEFAULT_AUTH_OPTIONS: AuthOption[] = ["email", "google"];

export const embeddedWallet = (
  _config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  const defaultConfig: EmbeddedWalletConfig = {
    auth: {
      options: DEFAULT_AUTH_OPTIONS,
    },
  };

  const config: EmbeddedWalletConfig = _config
    ? { ...defaultConfig, ..._config }
    : defaultConfig;

  const { auth } = config;

  return {
    category: "socialLogin",
    isHeadless: true,
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
    else if (props.authOptions?.includes("google")) {
      return <EmbeddedWalletGoogleLogin {...props} goBack={handleBack} />;
    }

    return null;
  }

  return (
    <EmbeddedWalletFormUIScreen
      modalSize={props.modalSize}
      onSelect={(_loginType) => {
        setLoginType(_loginType);
      }}
      walletConfig={props.walletConfig}
      onBack={props.goBack}
      authOptions={props.authOptions}
    />
  );
};
