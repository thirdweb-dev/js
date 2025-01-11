"use client";

import {
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

export function ModalPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnectModal();
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect({ client: THIRDWEB_CLIENT });
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
