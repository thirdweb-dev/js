import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Flex, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { formatDistance } from "date-fns/formatDistance";
import { useAllChainsData } from "hooks/chains/allChains";
import { useActiveAccount } from "thirdweb/react";
import { Card, Heading, Text } from "tw-components";

export type AccountSignerType = {
  signer: string;
  isAdmin?: boolean;
  approvedTargets: readonly string[];
  nativeTokenLimitPerTransaction: bigint;
  endTimestamp: bigint;
};
interface AccountSignerProps {
  item: AccountSignerType;
  contractChainId: number;
}

export const AccountSigner: React.FC<AccountSignerProps> = ({
  item,
  contractChainId,
}) => {
  const address = useActiveAccount()?.address;
  const { idToChain } = useAllChainsData();
  const chain = contractChainId ? idToChain.get(contractChainId) : undefined;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    isAdmin,
    signer,
    nativeTokenLimitPerTransaction,
    approvedTargets,
    endTimestamp,
  } = item;
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
              <WalletAddress shortenAddress={isMobile} address={signer} />
            </Heading>
            <div className="flex flex-row gap-2">
              {isAdmin ? <Badge>Admin Key</Badge> : <Badge>Scoped key</Badge>}
              {signer === address && (
                <Badge variant="success">Currently connected</Badge>
              )}
            </div>
          </Flex>
        </Flex>

        {isAdmin ? null : (
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
            <div className="flex flex-col">
              <Text fontWeight="bold">Maximum value per transaction</Text>
              <Text textTransform="capitalize">
                {nativeTokenLimitPerTransaction.toString()}{" "}
                {chain?.nativeCurrency.symbol}
              </Text>
            </div>
            <div className="flex flex-col">
              <Text fontWeight="bold">Approved targets</Text>
              <Text textTransform="capitalize">{approvedTargets.length}</Text>
            </div>
            <div className="flex flex-col">
              <Text fontWeight="bold">Expiration</Text>
              <Text>
                {formatDistance(
                  new Date(new Date(Number(endTimestamp * 1000n))),
                  new Date(),
                  {
                    addSuffix: true,
                  },
                )}
              </Text>
            </div>
          </SimpleGrid>
        )}
      </Flex>
    </Card>
  );
};
