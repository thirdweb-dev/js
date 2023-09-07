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
import { PaperConfig, RecoveryShareManagement } from "./PaperConfig";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
import { Spacer } from "../../../components/Spacer";
import { FloatingPlane } from "./FloatingPlane";
import { useScreenContext } from "../../ConnectWallet/ConnectModal";
import { reservedScreens } from "../../ConnectWallet/constants";

export const paperWallet = (config: PaperConfig): WalletConfig<PaperWallet> => {
  return {
    category: "socialLogin",
    id: PaperWallet.id,
    meta: {
      ...PaperWallet.meta,
      name: "Email",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM0ODVfMTM4MDIpIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzM0ODVfMTM4MDIpIi8+CjxyZWN0IHg9Ii0xIiB5PSItMSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iOS44IiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMzQ4NV8xMzgwMikiLz4KPHBhdGggZD0iTTI0IDMyQzI0Ljg5NDQgMzIgMjUuNzg4OCAzMS42Njg0IDI2LjIzNiAzMS4zMzY4TDQwLjk5MzggMjAuMzkzOEM0Mi4zMzU0IDE5LjM5OSA0Mi4zMzU0IDE3Ljc0MDkgNDAuOTkzOCAxNi43NDYxQzM5LjY1MjIgMTUuNzUxMyAzNy40MTYyIDE1Ljc1MTMgMzYuMDc0NSAxNi43NDYxTDI0IDI1LjY5OTVMMTEuOTI1NSAxNi43NDYxQzEwLjU4MzkgMTUuNzUxMyA4LjM0NzgzIDE1Ljc1MTMgNy4wMDYyMSAxNi43NDYxQzUuNjY0NiAxNy43NDA5IDUuNjY0NiAxOS4zOTkgNy4wMDYyMSAyMC4zOTM4TDIxLjMxNjggMzEuMDA1MkMyMi4yMTEyIDMxLjY2ODQgMjMuMTA1NiAzMiAyNCAzMloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zNDg1XzEzODAyIiB4MT0iMjUuNSIgeTE9Ii02LjI5NTcyZS0wNiIgeDI9IjMwLjIwMTYiIHkyPSI0Ny41MzUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzgzNThCQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QjFDRjciLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzM0ODVfMTM4MDIiIHgxPSIyNS41NjI1IiB5MT0iLTEuMDAwMDEiIHgyPSIzMC40NiIgeTI9IjQ4LjUxNTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzgzNThCQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QjFDRjciLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zNDg1XzEzODAyIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
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
  const screen = useScreenContext();

  if (
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact")
  ) {
    return (
      <div>
        <WalletEntryButton
          walletConfig={props.walletConfig}
          selectWallet={() => {
            props.onSelect(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <FloatingPlane size={100} />
      <Spacer y="lg" />
      <PaperFormUI
        showOrSeparator={props.supportedWallets.length > 1}
        onSelect={props.onSelect}
        submitType="button"
      />
    </div>
  );
};

const PaperConnectUI = (
  props: ConnectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
  },
) => {
  const [email, setEmail] = useState<string | undefined>(props.selectionData);
  const screenCtx = useScreenContext();

  const [screen, setScreen] = useState<"base" | "next">(
    props.modalSize === "wide" ||
      (props.modalSize === "compact" && screenCtx !== reservedScreens.main)
      ? "base"
      : "next",
  );

  if (screen === "base") {
    return (
      <PaperFormUIScreen
        modalSize={props.modalSize}
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
