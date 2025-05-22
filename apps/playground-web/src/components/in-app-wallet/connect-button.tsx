"use client";

import { inAppWallet } from "thirdweb/wallets/in-app";
import { StyledConnectButton } from "../styled-connect-button";

export function InAppConnectEmbed() {
  return (
    <StyledConnectButton
      wallets={[
        inAppWallet({
          auth: {
            options: [
              "google",
              "x",
              "apple",
              "discord",
              "facebook",
              "farcaster",
              "telegram",
              "coinbase",
              "line",
              "email",
              "phone",
              "passkey",
              "guest",
            ],
            required: ["email"],
          },
        }),
      ]}
    />
  );
}
