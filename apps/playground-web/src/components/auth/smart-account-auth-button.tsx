"use client";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

export function SmartAccountAuthButton() {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      accountAbstraction={{
        chain: defineChain(17000),
        sponsorGas: true,
      }}
      auth={{
        isLoggedIn: (address) => isLoggedIn(address),
        doLogin: (params) => login(params),
        getLoginPayload: ({ address }) =>
          generatePayload({ address, chainId: 17000 }),
        doLogout: () => logout(),
      }}
    />
  );
}
