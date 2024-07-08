"use client";

import { useEffect } from "react";
import { baseSepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { createWallet, generateAccount, smartWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";
import { Button } from "../ui/button";
import { chain } from "./constants";

export function PasskeySignerPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect({
    client: THIRDWEB_CLIENT,
    accountAbstraction: { chain, sponsorGas: true },
  });
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      // const adminWallet = createWallet("io.metamask");
      const wallet = smartWallet({
        chain: baseSepolia,
        sponsorGas: true,
      });
      await wallet.connect({
        client: THIRDWEB_CLIENT,
        personalAccount: await generateAccount({ client: THIRDWEB_CLIENT }),
        passkeySigner: {},
      });
      return wallet;
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
          Connect (passkey)
        </Button>
      )}
    </div>
  );
}
