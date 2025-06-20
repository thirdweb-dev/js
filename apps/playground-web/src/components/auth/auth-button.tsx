"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";

export function AuthButton() {
  return (
    <ConnectButton
      auth={{
        doLogin: (params) => login(params),
        doLogout: () => logout(),
        getLoginPayload: ({ address }) =>
          generatePayload({ address, chainId: 84532 }),
        isLoggedIn: (address) => isLoggedIn(address),
      }}
      client={THIRDWEB_CLIENT}
      wallets={[
        inAppWallet({
          auth: {
            mode: "redirect",
            options: ["google", "telegram", "github"],
          },
        }),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("io.zerion.wallet"),
      ]}
    />
  );
}
