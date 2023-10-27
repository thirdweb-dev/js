import { SafeWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useDisconnect,
  useWallet,
} from "@thirdweb-dev/react-core";
import { defaultWallets } from "../defaultWallets";
import { useState } from "react";
import { SelectpersonalWallet } from "./SelectPersonalWallet";
import type { SafeWalletConfigOptions, SafeWalletConfig } from "./types";
import { SelectAccount } from "./SelectAccount";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const safeWallet = (
  config?: SafeWalletConfigOptions & {
    /**
     * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
     */
    recommended?: boolean;
  },
): SafeWalletConfig => {
  const personalWallets = config?.personalWallets || defaultWallets;
  return {
    id: SafeWallet.id,
    recommended: config?.recommended,
    meta: {
      ...SafeWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxMkZGODAiLz4KPG1hc2sgaWQ9Im1hc2swXzFfNDgiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIxMiIgeT0iMTIiIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiI+CjxwYXRoIGQ9Ik00MCA2OEM1NS40NjQgNjggNjggNTUuNDY0IDY4IDQwQzY4IDI0LjUzNiA1NS40NjQgMTIgNDAgMTJDMjQuNTM2IDEyIDEyIDI0LjUzNiAxMiA0MEMxMiA1NS40NjQgMjQuNTM2IDY4IDQwIDY4WiIgZmlsbD0id2hpdGUiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzFfNDgpIj4KPHBhdGggZD0iTTY4LjEzNzUgNy40MjY3Nkg5LjMzNzUyVjcxLjk5NDhINjguMTM3NVY3LjQyNjc2WiIgZmlsbD0iIzEyRkY4MCIvPgo8L2c+CjxwYXRoIGQ9Ik01NS42NjgzIDQwLjAwNDZINTEuODQyOUM1MC43MDA1IDQwLjAwNDYgNDkuNzc0OCA0MC45MzA5IDQ5Ljc3NDggNDIuMDcyN1Y0Ny42MjQ2QzQ5Ljc3NDggNDguNzY3IDQ4Ljg0ODYgNDkuNjkyNyA0Ny43MDY4IDQ5LjY5MjdIMzIuNDg3NkMzMS4zNDUyIDQ5LjY5MjcgMzAuNDE5NiA1MC42MTg5IDMwLjQxOTYgNTEuNzYwN1Y1NS41ODYxQzMwLjQxOTYgNTYuNzI4NSAzMS4zNDU4IDU3LjY1NDIgMzIuNDg3NiA1Ny42NTQySDQ4LjU4NzZDNDkuNzMgNTcuNjU0MiA1MC42NDM0IDU2LjcyNzkgNTAuNjQzNCA1NS41ODYxVjUyLjUxNzNDNTAuNjQzNCA1MS4zNzQ5IDUxLjU2OTYgNTAuNTY0IDUyLjcxMTUgNTAuNTY0SDU1LjY2ODNDNTYuODEwNyA1MC41NjQgNTcuNzM2NCA0OS42Mzc4IDU3LjczNjQgNDguNDk1OVY0Mi4wNDgxQzU3LjczNjQgNDAuOTA1NyA1Ni44MTAxIDQwLjAwNDEgNTUuNjY4MyA0MC4wMDQxVjQwLjAwNDZaIiBmaWxsPSIjMTIxMzEyIi8+CjxwYXRoIGQ9Ik0zMC40MjQgMzIuMzk5N0MzMC40MjQgMzEuMjU3MyAzMS4zNTAzIDMwLjMzMTYgMzIuNDkyMSAzMC4zMzE2SDQ3LjcwMTdDNDguODQ0MSAzMC4zMzE2IDQ5Ljc2OTggMjkuNDA1NCA0OS43Njk4IDI4LjI2MzZWMjQuNDM4MkM0OS43Njk4IDIzLjI5NTggNDguODQzNiAyMi4zNzAxIDQ3LjcwMTcgMjIuMzcwMUgzMS42MTA3QzMwLjQ2ODMgMjIuMzcwMSAyOS41NDI2IDIzLjI5NjQgMjkuNTQyNiAyNC40MzgyVjI3LjM4NTVDMjkuNTQyNiAyOC41Mjc5IDI4LjYxNjQgMjkuNDUzNiAyNy40NzQ1IDI5LjQ1MzZIMjQuNTMwNkMyMy4zODgyIDI5LjQ1MzYgMjIuNDYyNSAzMC4zNzk4IDIyLjQ2MjUgMzEuNTIxNlYzNy45NzYyQzIyLjQ2MjUgMzkuMTE4NiAyMy4zOTIxIDM5Ljk5NzggMjQuNTM0NSAzOS45OTc4SDI4LjM1OTlDMjkuNTAyMyAzOS45OTc4IDMwLjQyOCAzOS4wNzE2IDMwLjQyOCAzNy45Mjk3TDMwLjQyNDYgMzIuNDAwM0wzMC40MjQgMzIuMzk5N1oiIGZpbGw9IiMxMjEzMTIiLz4KPHBhdGggZD0iTTM4LjI5MjkgMzUuOTc1SDQxLjk2NzZDNDMuMTY0OSAzNS45NzUgNDQuMTM3MSAzNi45NDcxIDQ0LjEzNzEgMzguMTQ0NFY0MS44MTkxQzQ0LjEzNzEgNDMuMDE2NCA0My4xNjQ5IDQzLjk4ODYgNDEuOTY3NiA0My45ODg2SDM4LjI5MjlDMzcuMDk1NiA0My45ODg2IDM2LjEyMzUgNDMuMDE2NCAzNi4xMjM1IDQxLjgxOTFWMzguMTQ0NEMzNi4xMjM1IDM2Ljk0NzEgMzcuMDk1NiAzNS45NzUgMzguMjkyOSAzNS45NzVaIiBmaWxsPSIjMTIxMzEyIi8+Cjwvc3ZnPgo=",
    },
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
    connectUI(props) {
      return <SafeConnectUI {...props} personalWallets={personalWallets} />;
    },
    isInstalled() {
      return false;
    },
    personalWallets: personalWallets,
  };
};

export const SafeConnectUI = (
  props: ConnectUIProps<SafeWallet> & { personalWallets: WalletConfig[] },
) => {
  const activeWallet = useWallet();
  const [personalWalletConfig, setPersonalWalletConfig] = useState<
    WalletConfig | undefined
  >();
  const disconnect = useDisconnect();

  if (personalWalletConfig) {
    const _props: ConnectUIProps = {
      goBack: () => {
        setPersonalWalletConfig(undefined);
      },
      connected() {
        setPersonalWalletConfig(undefined);
      },
      isOpen: props.isOpen,
      hide: props.hide,
      show: props.show,
      theme: props.theme,
      walletConfig: personalWalletConfig,
      supportedWallets: props.personalWallets,
      selectionData: props.selectionData,
      setSelectionData: props.setSelectionData,
      modalSize: props.modalSize,
    };

    if (personalWalletConfig.connectUI) {
      return <personalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  if (!activeWallet) {
    return (
      <SelectpersonalWallet
        personalWallets={props.personalWallets}
        onBack={props.goBack}
        safeWallet={props.walletConfig}
        selectWallet={setPersonalWalletConfig}
        renderBackButton={props.supportedWallets.length > 1}
      />
    );
  }

  return (
    <SelectAccount
      renderBackButton={props.supportedWallets.length > 1}
      onBack={() => {
        disconnect();
        props.goBack();
      }}
      onConnect={props.connected}
      safeWalletConfig={props.walletConfig}
    />
  );
};
