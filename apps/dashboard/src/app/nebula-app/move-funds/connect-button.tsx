"use client";

import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { getSDKTheme } from "../../(app)/components/sdk-component-theme";
import { getClientThirdwebClient } from "../../../@/constants/thirdweb-client.client";
import { nebulaAAOptions } from "../login/account-abstraction";

// use dashboard client to allow users to connect to their original wallet and move funds to a different wallet
const dashboardClient = getClientThirdwebClient();

// since only the inApp and smart wallets were affected, only show in-app option
const loginOptions = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "github",
        "email",
        "phone",
        "passkey",
      ],
    },
  }),
];

// Note: This component has autoConnect enabled
export function MoveFundsConnectButton(props: {
  btnClassName?: string;
  connectLabel?: string;
}) {
  const { theme } = useTheme();

  return (
    <ConnectButton
      wallets={loginOptions}
      client={dashboardClient}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
      accountAbstraction={nebulaAAOptions}
      connectButton={{
        className: props.btnClassName,
        label: props.connectLabel,
      }}
      detailsButton={{
        className: props.btnClassName,
      }}
    />
  );
}
