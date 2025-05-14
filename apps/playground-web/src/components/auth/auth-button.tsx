"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export function AuthButton() {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      wallets={[
        inAppWallet({
          auth: {
            options: ["google", "telegram", "github"],
            mode: "redirect",
          },
        }),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("io.zerion.wallet"),
      ]}
      auth={{
        isLoggedIn: (address) => isLoggedIn(address),
        doLogin: (params) => login(params),
        getLoginPayload: ({ address }) =>
          generatePayload({ address, chainId: 84532 }),
        doLogout: () => logout(),
      }}
    />
  );
}
