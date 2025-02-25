"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/server/actions/auth";
import {
  type SiweAuthOptions,
  useActiveWallet,
  useConnectModal,
  useSiweAuth,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

const auth: SiweAuthOptions = {
  isLoggedIn: (address) => isLoggedIn(address),
  doLogin: (params) => login(params),
  getLoginPayload: ({ address }) =>
    generatePayload({ address, chainId: 84532 }),
  doLogout: () => logout(),
};

export function AuthHook() {
  const { connect } = useConnectModal();
  const wallet = useActiveWallet();
  const { isLoggedIn, doLogout } = useSiweAuth(
    wallet,
    wallet?.getAccount(),
    auth,
  );

  const onClick = async () => {
    if (isLoggedIn) {
      await doLogout();
    } else {
      await connect({
        client: THIRDWEB_CLIENT,
        auth,
      });
    }
  };

  return (
    <Button type="button" onClick={onClick}>
      {isLoggedIn ? "Sign out" : "Sign in"}
    </Button>
  );
}
