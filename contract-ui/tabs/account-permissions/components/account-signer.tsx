import { Flex, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { useAddress, useSDKChainId } from "@thirdweb-dev/react";
import { SignerWithPermissions } from "@thirdweb-dev/sdk";
import { formatDistance } from "date-fns/formatDistance";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { Badge, Card, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface AccountSignerProps {
  isAdmin?: boolean;
  signer: SignerWithPermissions;
}

export const AccountSigner: React.FC<AccountSignerProps> = ({
  isAdmin,
  signer,
}) => {
  const address = useAddress();
  const chainId = useSDKChainId();
  const configuredChainsRecord = useSupportedChainsRecord();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Card position="relative" p={8}>
      <Flex direction="column" gap={8}>
        <Flex flexDir="column" gap={2} mt={{ base: 4, md: 0 }}>
          <Flex
            gap={3}
            alignItems="center"
            flexDir={{ base: "column", lg: "row" }}
          >
            <Heading size="label.lg">
              <AddressCopyButton
                shortenAddress={isMobile}
                address={signer.signer}
              />
            </Heading>
            <Flex gap={2}>
              {isAdmin ? (
                <Badge borderRadius="lg" p={1.5}>
                  Admin Key
                </Badge>
              ) : (
                <Badge borderRadius="lg" p={1.5}>
                  Scoped key
                </Badge>
              )}
              {signer.signer === address && (
                <Badge colorScheme="green" borderRadius="lg" p={1.5}>
                  Currently connected
                </Badge>
              )}
            </Flex>
          </Flex>
        </Flex>

        {isAdmin ? null : (
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
            <Flex direction="column">
              <Text fontWeight="bold">Maximum value per transaction</Text>
              <Text textTransform="capitalize">
                {signer.permissions.nativeTokenLimitPerTransaction.toString()}{" "}
                {chain?.nativeCurrency.symbol}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight="bold">Approved targets</Text>
              <Text textTransform="capitalize">
                {signer.permissions.approvedCallTargets.length}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight="bold">Expiration</Text>
              <Text textTransform="capitalize">
                {formatDistance(
                  new Date(signer.permissions.expirationDate),
                  new Date(),
                  { addSuffix: true },
                )}
              </Text>
            </Flex>
          </SimpleGrid>
        )}
      </Flex>
    </Card>
  );
};
