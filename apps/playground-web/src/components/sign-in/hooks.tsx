"use client";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

export function HooksPreview() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const connectMutation = useConnect();
  const { disconnect } = useDisconnect();

  const connect = async () => {
    const wallet = await connectMutation.connect(async () => {
      const adminWallet = createWallet("io.metamask");
      await adminWallet.connect({
        client: THIRDWEB_CLIENT,
        ...(injectedProvider("io.metamask")
          ? {}
          : {
              walletConnect: {
                showQrModal: true,
                onCancel: () => {
                  console.log("onCancel");
                  connectMutation.cancelConnection();
                },
              },
            }),
      });
      return adminWallet;
    });
    return wallet;
  };

  return (
    <div className="flex flex-col">
      {account ? (
        <>
          <p className="py-4">Connected: {shortenAddress(account.address)}</p>
          {wallet && (
            <Button onClick={() => disconnect(wallet)} variant="outline">
              Disconnect
            </Button>
          )}
        </>
      ) : (
        <Button onClick={connect} variant="default">
          {connectMutation.isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  );
}
