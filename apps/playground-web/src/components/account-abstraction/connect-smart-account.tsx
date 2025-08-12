"use client";

import { baseSepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
  useWalletBalance,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { inAppWallet, socialIcons } from "thirdweb/wallets/in-app";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

export function ConnectSmartAccountCustomPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect({
    accountAbstraction: { chain: baseSepolia, sponsorGas: true },
    client: THIRDWEB_CLIENT,
  });
  const { disconnect } = useDisconnect();
  const balanceQuery = useWalletBalance({
    address: account?.address,
    chain: baseSepolia,
    client: THIRDWEB_CLIENT,
  });

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      const adminWallet = inAppWallet();
      await adminWallet.connect({
        chain: baseSepolia,
        client: THIRDWEB_CLIENT,
        strategy: "google",
      });
      return adminWallet;
    });
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account && wallet ? (
        <>
          <div className="py-4">
            <p>Smart Account: {shortenAddress(account.address)}</p>
            <p>
              Balance: {balanceQuery.data?.displayValue}
              {balanceQuery.data?.symbol}
            </p>
          </div>
          <Button onClick={() => disconnect(wallet)} variant="outline">
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          className="rounded-full p-6"
          onClick={connect}
          variant="default"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Google" className="mr-2 h-4 w-4" src={socialIcons.google} />
          Connect with Google
        </Button>
      )}
    </div>
  );
}
