"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { ConnectButton } from "thirdweb/react";

export function AuthButton() {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      auth={{
        isLoggedIn: (address) => isLoggedIn(address),
        doLogin: (params) => login(params),
        getLoginPayload: ({ address }) => generatePayload({ address }),
        doLogout: () => logout(),
      }}
    />
  );
}
