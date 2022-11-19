import { Flex, Skeleton } from "@chakra-ui/react";
import { RequiredParam } from "@thirdweb-dev/react";
import { useEns } from "components/contract-components/hooks";
import { ReleaserAvatar } from "components/contract-components/releaser/masked-avatar";
import { Heading, Link } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ContractPublisherProps {
  addressOrEns: RequiredParam<string>;
  showSkeleton?: boolean;
}

export const ContractPublisher: React.FC<ContractPublisherProps> = ({
  addressOrEns,
  showSkeleton,
}) => {
  const ensQuery = useEns(addressOrEns || undefined);

  return (
    <Flex
      as={Link}
      gap={1.5}
      align="center"
      flexShrink={0}
      noMatch
      href={replaceDeployerAddress(
        `/${ensQuery.data?.ensName || ensQuery.data?.address || addressOrEns}`,
      )}
    >
      <ReleaserAvatar
        isLoading={showSkeleton}
        boxSize={5}
        address={addressOrEns || ""}
      />

      <Skeleton
        isLoaded={
          ensQuery.isSuccess && !ensQuery.isPlaceholderData && !showSkeleton
        }
      >
        <Heading size="subtitle.xs" lineHeight={1} as="h4">
          {treatAddress(
            ensQuery.data?.ensName ||
              ensQuery.data?.address ||
              addressOrEns ||
              "",
          )}
        </Heading>
      </Skeleton>
    </Flex>
  );
};

export function replaceDeployerAddress(address: string) {
  return address.replace("deployer.thirdweb.eth", "thirdweb.eth");
}

export function treatAddress(address: string) {
  return shortenIfAddress(replaceDeployerAddress(address));
}
