"use client";

import { useState } from "react";
import { arbitrum, base, ethereum } from "thirdweb/chains";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { TokenSelector } from "@/components/ui/TokenSelector";
import { THIRDWEB_CLIENT } from "@/lib/client";
import type { TokenMetadata } from "@/lib/types";

export default function TokenSelectorDemo() {
  const [selectedToken, setSelectedToken] = useState<
    { chainId: number; address: string } | undefined
  >(undefined);

  const [selectedChain, setSelectedChain] = useState<number>(ethereum.id);

  const chains = [
    { id: ethereum.id, name: "Ethereum" },
    { id: base.id, name: "Base" },
    { id: arbitrum.id, name: "Arbitrum" },
  ];

  return (
    <ThirdwebProvider>
      <PageLayout
        description="Demo of the TokenSelector component ported from dashboard"
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain?utm_source=playground"
        title="Token Selector Demo"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Chain</h2>
            <select
              className="rounded border border-border bg-background p-2"
              onChange={(e) => {
                setSelectedChain(Number(e.target.value));
                setSelectedToken(undefined); // Reset token when chain changes
              }}
              value={selectedChain}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Token</h2>
            <div className="max-w-md">
              <TokenSelector
                addNativeTokenIfMissing={true}
                chainId={selectedChain}
                client={THIRDWEB_CLIENT}
                enabled={true}
                onChange={(token: TokenMetadata) => {
                  setSelectedToken({
                    address: token.address,
                    chainId: token.chainId,
                  });
                }}
                placeholder="Select a token"
                selectedToken={selectedToken}
              />
            </div>
          </div>

          {selectedToken && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Selected Token</h2>
              <div className="rounded border border-border bg-muted p-4">
                <p>
                  <strong>Chain ID:</strong> {selectedToken.chainId}
                </p>
                <p>
                  <strong>Address:</strong> {selectedToken.address}
                </p>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
