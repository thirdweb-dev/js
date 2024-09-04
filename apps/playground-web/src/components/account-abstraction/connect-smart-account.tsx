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
import { StyledConnectButton } from "../styled-connect-button";
import { Button } from "../ui/button";

export function ConnectSmartAccountPreview() {
  return (
    <div className="flex flex-col">
      <StyledConnectButton
        accountAbstraction={{
          chain: baseSepolia,
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
    accountAbstraction: { chain: baseSepolia, sponsorGas: true },
  });
  const { disconnect } = useDisconnect();
  const balanceQuery = useWalletBalance({
    client: THIRDWEB_CLIENT,
    address: account?.address,
    chain: baseSepolia,
  });

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      const adminWallet = inAppWallet();
      await adminWallet.connect({
        client: THIRDWEB_CLIENT,
        strategy: "google",
        chain: baseSepolia,
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
              Balance: {balanceQuery.data?.displayValue}{" "}
              {balanceQuery.data?.symbol}
            </p>
          </div>
          <Button variant={"outline"} onClick={() => disconnect(wallet)}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          variant={"default"}
          onClick={connect}
          className="p-6 rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={socialIcons.google} alt="Google" className="w-4 h-4 mr-2" />
          Connect with Google
        </Button>
      )}
    </div>
  );
}
