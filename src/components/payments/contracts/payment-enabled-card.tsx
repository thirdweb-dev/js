import { Flex, LinkBox, LinkOverlay, Skeleton } from "@chakra-ui/react";
import { Card, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { useChainSlug } from "hooks/chains/chainSlug";
import { getContract } from "thirdweb";
import { defineDashboardChain, thirdwebClient } from "lib/thirdweb-client";
import { useReadContract } from "thirdweb/react";
import { getContractMetadata } from "thirdweb/extensions/common";

interface PaymentEnabledCardProps {
  contract: {
    id: string;
    address: string;
    chain: string;
    display_name: string;
  };
  chainId: number;
}

export const PaymentEnabledCard: React.FC<PaymentEnabledCardProps> = ({
  contract: { chain, address, display_name, id },
  chainId,
}) => {
  const chainSlug = useChainSlug(chainId);

  const contract = getContract({
    client: thirdwebClient,
    address,
    chain: defineDashboardChain(chainId),
  });

  const { data: contractMetadata, isSuccess } = useReadContract(
    getContractMetadata,
    {
      contract,
    },
  );

  return (
    <LinkBox>
      <Card
        p={6}
        as={Flex}
        flexDir="column"
        gap={4}
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
        }}
      >
        <Flex flexDir="column">
          <Text color="bgBlack">
            <LinkOverlay href={`/${chainSlug}/${address}/payments`}>
              <Skeleton isLoaded={isSuccess}>
                {contractMetadata?.name || display_name}
              </Skeleton>
            </LinkOverlay>
          </Text>
          <Text>{chain}</Text>
        </Flex>
        <Flex gap={6}>
          <Flex flexDir="column" gap={1}>
            <Text>Contract ID</Text>
            <AddressCopyButton address={id} size="xs" title="contract ID" />
          </Flex>
          <Flex flexDir="column" gap={1}>
            <Text>Contract Address</Text>
            <AddressCopyButton address={address} size="xs" />
          </Flex>
        </Flex>
      </Card>
    </LinkBox>
  );
};
