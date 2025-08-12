"use client";
import { sepolia } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveWallet,
  useCapabilities,
  useWalletInfo,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
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
              chain={sepolia}
              client={THIRDWEB_CLIENT}
              connectButton={{
                label: "Login to view wallet capabilities",
              }}
              wallets={[
                inAppWallet({
                  executionMode: {
                    mode: "EIP7702",
                    sponsorGas: true,
                  },
                }),
                createWallet("io.metamask"),
                createWallet("com.coinbase.wallet"),
              ]}
            />
          </div>
          <p className="text-lg">
            {walletInfo.data?.name || "Wallet"} Capabilities
          </p>
          {capabilities.data ? (
            <CodeClient
              className="max-h-[500px] w-[400px] overflow-y-auto"
              code={JSON.stringify(capabilities.data, null, 2)}
              lang="json"
              loader={<div className="mt-24 w-full">Loading...</div>}
              scrollableClassName="h-full"
              scrollableContainerClassName="h-full"
            />
          ) : null}
        </>
      )}
    </div>
  );
}
