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
      address: params.address,
      domain: "",
      expiration_time: "",
      invalid_before: "",
      issued_at: "",
      nonce: "",
      statement: "",
      version: "",
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
      auth: enableAuth ? playgroundAuth : undefined,
      client: THIRDWEB_CLIENT,
    });
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account && wallet ? (
        <>
          <p className="py-4">Connected as {shortenAddress(account.address)}</p>
          <Button onClick={() => disconnect(wallet)} variant="outline">
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={connect} variant="default">
          Sign in
        </Button>
      )}
    </div>
  );
}
