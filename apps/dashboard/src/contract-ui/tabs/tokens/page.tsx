import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenBurnButton } from "./components/burn-button";
import { TokenClaimButton } from "./components/claim-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenSupply } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";

interface ContractTokenPageProps {
  contractAddress?: string;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const chainId = contractQuery.contract?.chainId;

  if (
    contractQuery.isLoading ||
    !contractQuery?.contract ||
    !contractAddress ||
    !chainId
  ) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  const isERC20 = detectFeatures(contractQuery.contract, ["ERC20"]);

  const isERC20Mintable = detectFeatures(contractQuery.contract, [
    "ERC20Mintable",
  ]);

  const isERC20Claimable = detectFeatures(contractQuery.contract, [
    "ERC20ClaimConditionsV1",
    "ERC20ClaimConditionsV2",
    "ERC20ClaimPhasesV1",
    "ERC20ClaimPhasesV2",
  ]);

  if (!isERC20) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Token extension enabled</Heading>
        <Text>
          To enable Token features you will have to extend an ERC20 interface in
          your contract.
        </Text>
        <Box>
          <LinkButton
            isExternal
            href="https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20"
            colorScheme="purple"
          >
            Learn more
          </LinkButton>
        </Box>
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
          {isERC20Claimable && contractQuery.contract && (
            <TokenClaimButton
              contractAddress={contractQuery.contract.getAddress()}
              chainId={contractQuery.contract.chainId}
            />
          )}
          <TokenBurnButton
            contractAddress={contractAddress}
            chainId={chainId}
          />

          <TokenAirdropButton
            contractAddress={contractAddress}
            chainId={chainId}
          />

          <TokenTransferButton
            contractAddress={contractAddress}
            chainId={chainId}
          />
          {isERC20Mintable && contractQuery.contract && (
            <TokenMintButton
              contractAddress={contractQuery.contract.getAddress()}
              chainId={contractQuery.contract.chainId}
            />
          )}
        </ButtonGroup>
      </Flex>

      <TokenSupply contractAddress={contractAddress} chainId={chainId} />
    </Flex>
  );
};
