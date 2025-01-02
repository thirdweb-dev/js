"use client";

import { inAppWallet } from "thirdweb/wallets/in-app";
import { StyledConnectEmbed } from "../styled-connect-embed";

export function InAppConnectEmbed() {
  return (
    <StyledConnectEmbed
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
          },
        }),
      ]}
    />
  );
}
