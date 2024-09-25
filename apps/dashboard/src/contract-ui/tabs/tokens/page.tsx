import { ButtonGroup, Flex } from "@chakra-ui/react";
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
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contract,
  isERC20,
  isMintToSupported,
  isClaimToSupported,
}) => {
  if (!isERC20) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
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
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          {isClaimToSupported && <TokenClaimButton contract={contract} />}
          <TokenBurnButton contract={contract} />

          <TokenAirdropButton contract={contract} />

          <TokenTransferButton contract={contract} />
          {/* TODO: show skeleton or disabled while loading? */}
          {isMintToSupported && <TokenMintButton contract={contract} />}
        </ButtonGroup>
      </Flex>

      <TokenSupply contract={contract} />
    </Flex>
  );
};
