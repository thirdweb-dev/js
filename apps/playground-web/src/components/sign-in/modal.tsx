"use client";

import {
  type ConnectButtonProps,
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

const playgroundAuth: ConnectButtonProps["auth"] = {
  async doLogin() {
    try {
      localStorage.setItem("playground-loggedin", "true");
    } catch {
      // ignore
    }
  },
  async doLogout() {
    localStorage.removeItem("playground-loggedin");
  },
  async getLoginPayload(params) {
    return {
      domain: "",
      address: params.address,
      statement: "",
      version: "",
      nonce: "",
      issued_at: "",
      expiration_time: "",
      invalid_before: "",
    };
  },
  async isLoggedIn() {
    try {
      return !!localStorage.getItem("playground-loggedin");
    } catch {
      return false;
    }
  },
};

export function ModalPreview({ enableAuth }: { enableAuth?: boolean }) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnectModal();
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect({
      client: THIRDWEB_CLIENT,
      auth: enableAuth ? playgroundAuth : undefined,
    });
    console.log("connected", wallet);
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account && wallet ? (
        <>
          <p className="py-4">Connected as {shortenAddress(account.address)}</p>
          <Button variant="outline" onClick={() => disconnect(wallet)}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="default" onClick={connect}>
          Sign in
        </Button>
      )}
    </div>
  );
}
