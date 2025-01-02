"use client";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenBurnButton } from "./components/burn-button";
import { TokenClaimButton } from "./components/claim-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenSupply } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";

interface ContractTokenPageProps {
  contract: ThirdwebContract;
  isERC20: boolean;
  isMintToSupported: boolean;
  isClaimToSupported: boolean;
  twAccount: Account | undefined;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contract,
  isERC20,
  isMintToSupported,
  isClaimToSupported,
  twAccount,
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
            isExternal
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20"
            colorScheme="purple"
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
        <Heading size="title.sm">Contract Tokens</Heading>
        <div className="flex flex-col gap-3 md:flex-row">
          {isClaimToSupported && (
            <TokenClaimButton contract={contract} twAccount={twAccount} />
          )}
          <TokenBurnButton contract={contract} twAccount={twAccount} />
          <TokenAirdropButton contract={contract} twAccount={twAccount} />
          <TokenTransferButton contract={contract} twAccount={twAccount} />
          {isMintToSupported && (
            <TokenMintButton contract={contract} account={twAccount} />
          )}
        </div>
      </div>

      <TokenSupply contract={contract} />
    </div>
  );
};
