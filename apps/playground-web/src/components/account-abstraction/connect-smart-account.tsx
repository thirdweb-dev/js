"use client";

import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";
import { Button } from "../ui/button";
import { chain } from "./constants";

export function ConnectSmartAccountPreview() {
  // force disconnect if not smart wallet already
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && wallet.id !== "smart") {
      disconnect(wallet);
    }
  }, [wallet, disconnect]);
  return (
    <div className="flex flex-col">
      <StyledConnectButton
        accountAbstraction={{
          chain,
          sponsorGas: true,
        }}
      />
    </div>
  );
}

export function ConnectSmartAccountCustomPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect({
    client: THIRDWEB_CLIENT,
    accountAbstraction: { chain, sponsorGas: true },
  });
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      const adminWallet = createWallet("io.metamask");
      await adminWallet.connect({
        client: THIRDWEB_CLIENT,
      });
      return adminWallet;
    });
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account && wallet ? (
        <>
          <p className="py-4">Connected as {shortenAddress(account.address)}</p>
          <Button variant={"outline"} onClick={() => disconnect(wallet)}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant={"default"} onClick={connect}>
          Connect (metamask)
        </Button>
      )}
    </div>
  );
}
