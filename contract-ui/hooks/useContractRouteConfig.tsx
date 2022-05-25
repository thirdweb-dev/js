import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { Route } from "@tanstack/react-location";
import { useContract } from "@thirdweb-dev/react";
import {
  Erc20,
  Erc721,
  Erc1155,
  SmartContract,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

export type EnhancedRoute = Route & {
  title: string;
  path: string;
  isEnabled?: boolean;
};

export function useContractRouteConfig(
  contractAddress?: string,
): EnhancedRoute[] {
  const contract = useContract(contractAddress);

  const nftContract =
    detectErc721Instance(contract.contract) ||
    detectErc1155Instance(contract.contract);

  const tokenContract = detectErc20Instance(contract.contract);

  return [
    {
      title: "Overview",
      path: "/",
      element: () =>
        import("../tabs/overview/page").then(
          ({ CustomContractOverviewPage }) => (
            <CustomContractOverviewPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Code",
      path: "code",
      element: () =>
        import("../tabs/code/page").then(({ CustomContractCodeTab }) => (
          <CustomContractCodeTab contractAddress={contractAddress} />
        )),
    },
    {
      title: "NFTs",
      path: "nfts",
      isEnabled: !!nftContract,
      element: nftContract ? (
        () =>
          import("../tabs/nfts/page").then(({ ContractNFTPage }) => (
            <ContractNFTPage contract={nftContract} />
          ))
      ) : (
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">No NFT extension enabled</Heading>
          <Text>
            To enable NFT features you will have to extend the required
            interfaces in your contract.
          </Text>

          <Divider my={1} borderColor="borderColor" />
          <Flex gap={4} align="center">
            <Heading size="label.md">Learn more: </Heading>
            <ButtonGroup colorScheme="purple" size="sm" variant="solid">
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc721"
              >
                ERC721
              </LinkButton>
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc1155"
              >
                ERC1155
              </LinkButton>
            </ButtonGroup>
          </Flex>
        </Card>
      ),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: !!tokenContract,
      element: tokenContract ? (
        () =>
          import("../tabs/tokens/page").then(({ ContractTokensPage }) => (
            <ContractTokensPage contract={tokenContract} />
          ))
      ) : (
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">No Token extension enabled</Heading>
          <Text>
            To enable Token features you will have to extend the required
            interfaces in your contract.
          </Text>

          <Divider my={1} borderColor="borderColor" />
          <Flex gap={4} align="center">
            <Heading size="label.md">Learn more: </Heading>
            <ButtonGroup colorScheme="purple" size="sm" variant="solid">
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc20"
              >
                ERC20
              </LinkButton>
            </ButtonGroup>
          </Flex>
        </Card>
      ),
    },
    {
      title: "Settings",
      path: "settings",
      element: () =>
        import("../tabs/settings/page").then(
          ({ CustomContractSettingsTab }) => (
            <CustomContractSettingsTab contractAddress={contractAddress} />
          ),
        ),
    },
  ];
}
// quick utils
// TODO move these to utils

function detectErc721Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc721) {
    return contract;
  }
  if ("nft" in contract && contract.nft instanceof Erc721) {
    return contract.nft;
  }
  return undefined;
}

function detectErc1155Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc1155) {
    return contract;
  }
  if ("edition" in contract && contract.edition instanceof Erc1155) {
    return contract.edition;
  }
  return undefined;
}

function detectErc20Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc20) {
    return contract;
  }
  if ("token" in contract && contract.token instanceof Erc20) {
    return contract.token;
  }
  return undefined;
}
