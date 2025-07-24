"use client";

import {
  type SiweAuthOptions,
  useActiveWallet,
  useConnectModal,
  useSiweAuth,
} from "thirdweb/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/wallets/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

const auth: SiweAuthOptions = {
  doLogin: (params) => login(params),
  doLogout: () => logout(),
  getLoginPayload: ({ address }) =>
    generatePayload({ address, chainId: 84532 }),
  isLoggedIn: (address) => isLoggedIn(address),
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
        auth,
        client: THIRDWEB_CLIENT,
      });
    }
  };

  return (
    <Button onClick={onClick} type="button">
      {isLoggedIn ? "Sign out" : "Sign in"}
    </Button>
  );
}
