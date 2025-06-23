"use client";
import { LinkButton } from "chakra/button";
import { Card } from "chakra/card";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
import type { ThirdwebContract } from "thirdweb";
import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenBurnButton } from "./components/burn-button";
import { TokenClaimButton } from "./components/claim-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenDetailsCard } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";

interface ContractTokenPageProps {
  contract: ThirdwebContract;
  isERC20: boolean;
  isMintToSupported: boolean;
  isClaimToSupported: boolean;
  isLoggedIn: boolean;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contract,
  isERC20,
  isMintToSupported,
  isClaimToSupported,
  isLoggedIn,
}) => {
  if (!isERC20) {
    return (
      <Card className="flex flex-col gap-3">
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Token extension enabled</Heading>
        <Text>
          To enable Token features you will have to extend an ERC20 interface in
          your contract.
        </Text>
        <div>
          <LinkButton
            colorScheme="purple"
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20"
            isExternal
          >
            Learn more
          </LinkButton>
        </div>
      </Card>
    );
  }

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
};
