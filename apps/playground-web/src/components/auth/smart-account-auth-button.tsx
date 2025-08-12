"use client";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";

export function SmartAccountAuthButton() {
  return (
    <ConnectButton
      accountAbstraction={{
        chain: defineChain(17000),
        sponsorGas: true,
      }}
      auth={{
        doLogin: (params) => login(params),
        doLogout: () => logout(),
        getLoginPayload: ({ address }) =>
          generatePayload({ address, chainId: 17000 }),
        isLoggedIn: (address) => isLoggedIn(address),
      }}
      client={THIRDWEB_CLIENT}
    />
  );
}
