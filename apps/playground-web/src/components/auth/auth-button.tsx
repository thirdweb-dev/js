"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { defineChain } from "thirdweb";

export function AuthButton() {
  return (
    <ConnectButton
      auth={{
        doLogin: (params) => login(params),
        doLogout: () => logout(),
        getLoginPayload: ({ address }) =>
          generatePayload({ address, chainId: 50104 }),
        isLoggedIn: (address) => isLoggedIn(address),
      }}
      client={THIRDWEB_CLIENT}
      chain={defineChain(50104)}
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
