import { PaperWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  WalletOptions,
  SelectUIProps,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Spacer } from "../../../components/Spacer";
import { TextDivider } from "../../../components/TextDivider";
import { Button } from "../../../components/buttons";
import { spacing } from "../../../design-system";
import { PaperFormUI, PaperFormUIScreen } from "./PaperFormUI";
import { PaperOTPLoginUI } from "./PaperOTPLoginUI";
import { PaperConfig, RecoveryShareManagement } from "./PaperConfig";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const paperWallet = (config: PaperConfig): WalletConfig<PaperWallet> => {
  return {
    category: "socialLogin",
    id: PaperWallet.id,
    meta: {
      ...PaperWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMwMjEwMTMiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzFfODMpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01MyAyNC4zMTE1QzUzIDIzLjczODEgNTIuNjMzMSAyMy4yMzA3IDUyLjA5MzEgMjMuMDU3M0wyNyAxNVYyNy4wMzdMNDEuODU3MiAzMS42MDgyTDI5Ljc4NTcgNDBWNTAuMTg1MUwzMi42MDYxIDUzLjEzOTVMMzAuMjEwMSA1NS4zNDkzQzI5LjkzOTggNTUuNTk4NyAyOS43ODU3IDU1Ljk1MTcgMjkuNzg1NyA1Ni4zMjE4VjY1TDM4LjE0MjkgNTguNTE4NlY0OC4zMzMzTDM1LjY0MjQgNDYuMTQzNkw1MyAzNS4zNzA0VjI0LjMxMTVaIiBmaWxsPSIjMTlBOEQ2Ii8+CjxwYXRoIGQ9Ik01MyAyNC4zMTE1QzUzIDIzLjczODEgNTIuNjMzMSAyMy4yMzA3IDUyLjA5MzEgMjMuMDU3M0wyNyAxNVYyNy4wMzdMNTMgMzUuMzcwNFYyNC4zMTE1WiIgZmlsbD0iIzM5RDBGRiIvPgo8cGF0aCBkPSJNMzguMTQyOCA0OC4zMzMzTDI5Ljc4NTcgNDBWNTAuMTg1MUwzOC4xNDI4IDU4LjUxODZWNDguMzMzM1oiIGZpbGw9IiMzOUQwRkYiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xXzgzIj4KPHJlY3Qgd2lkdGg9IjI2IiBoZWlnaHQ9IjUwIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjcgMTUpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    },
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    selectUI: PaperSelectionUI,
    connectUI(props) {
      return (
        <PaperConnectUI
          {...props}
          recoveryShareManagement={
            config.advancedOptions?.recoveryShareManagement
          }
        />
      );
    },
  };
};

const PaperSelectionUI: React.FC<SelectUIProps<PaperWallet>> = (props) => {
  if (props.modalSize === "wide") {
    return (
      <div>
        <Button
          variant="secondary"
          fullWidth
          onClick={props.onSelect}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          {/* <GoogleIcon size={iconSize.md} /> */}
          Email Login
        </Button>
        <Spacer y="lg" />
        <TextDivider>
          <span> OR </span>
        </TextDivider>
        <Spacer y="md" />
      </div>
    );
  }

  return (
    <PaperFormUI
      showOrSeparator={props.supportedWallets.length > 1}
      onSelect={props.onSelect}
      submitType="button"
    />
  );
};

const PaperConnectUI = (
  props: ConnectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
  },
) => {
  const [email, setEmail] = useState<string | undefined>(props.selectionData);
  const [screen, setScreen] = useState<"base" | "next">(
    props.modalSize === "wide" ? "base" : "next",
  );

  if (screen === "base") {
    return (
      <PaperFormUIScreen
        onEmail={(_email) => {
          setEmail(_email);
          setScreen("next");
        }}
        onBack={props.goBack}
      />
    );
  }

  if (screen === "next") {
    if (email) {
      return (
        <PaperOTPLoginUI
          {...props}
          recoveryShareManagement={props.recoveryShareManagement}
          selectionData={email}
          goBack={() => {
            // go back to base screen
            if (props.modalSize === "wide") {
              setEmail(undefined);
              setScreen("base");
            }

            // go to main screen
            else {
              props.goBack();
            }
          }}
        />
      );
    }

    return <HeadlessConnectUI {...props} />;
  }

  return null;
};
