"use client";
import { sepolia } from "thirdweb/chains";
import {} from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  useActiveWallet,
  useCapabilities,
  useWalletInfo,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import CodeClient from "../code/code.client";

export function Eip5792GetCapabilitiesPreview() {
  const capabilities = useCapabilities();
  const activeWallet = useActiveWallet();
  const walletInfo = useWalletInfo(activeWallet?.id);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {capabilities.isLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={sepolia}
              wallets={[
                createWallet("io.metamask"),
                createWallet("com.coinbase.wallet"),
              ]}
              connectButton={{
                label: "Login to view wallet capabilities",
              }}
            />
          </div>
          <p className="text-lg">
            {walletInfo.data?.name || "Wallet"} Capabilities
          </p>
          {capabilities.data ? (
            <CodeClient
              code={JSON.stringify(capabilities.data, null, 2)}
              lang="json"
              loader={<div className="mt-24 w-full">Loading...</div>}
              className="max-h-[500px] w-[400px] overflow-y-auto"
              scrollableContainerClassName="h-full"
              scrollableClassName="h-full"
            />
          ) : null}
        </>
      )}
    </div>
  );
}
