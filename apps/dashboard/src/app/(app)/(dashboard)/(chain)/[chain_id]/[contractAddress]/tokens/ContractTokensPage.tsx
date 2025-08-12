"use client";

import type { ThirdwebContract } from "thirdweb";
import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenBurnButton } from "./components/burn-button";
import { TokenClaimButton } from "./components/claim-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenDetailsCard } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";

interface ContractTokenPageProps {
  contract: ThirdwebContract;
  isMintToSupported: boolean;
  isClaimToSupported: boolean;
  isLoggedIn: boolean;
}

export function ContractTokensPage({
  contract,
  isMintToSupported,
  isClaimToSupported,
  isLoggedIn,
}: ContractTokenPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">Tokens</h2>
        <div className="flex flex-col gap-3 md:flex-row">
          {isClaimToSupported && (
            <TokenClaimButton contract={contract} isLoggedIn={isLoggedIn} />
          )}
          <TokenBurnButton contract={contract} isLoggedIn={isLoggedIn} />
          <TokenAirdropButton contract={contract} isLoggedIn={isLoggedIn} />
          <TokenTransferButton contract={contract} isLoggedIn={isLoggedIn} />
          {isMintToSupported && (
            <TokenMintButton contract={contract} isLoggedIn={isLoggedIn} />
          )}
        </div>
      </div>

      <TokenDetailsCard contract={contract} />
    </div>
  );
}
