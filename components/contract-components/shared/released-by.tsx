import { Flex, Link } from "@chakra-ui/react";
import {
  ens,
  useReleasesFromDeploy,
} from "components/contract-components/hooks";
import { LinkButton, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ReleasedByProps {
  contractAddress: string;
}

export const ReleasedBy: React.FC<ReleasedByProps> = ({ contractAddress }) => {
  const ensQuery = ens.useQuery(contractAddress);
  const releasesFromDeploy = useReleasesFromDeploy(
    ensQuery.data?.address || undefined,
  );

  const lastRelease = releasesFromDeploy?.data?.length
    ? releasesFromDeploy.data[releasesFromDeploy.data.length - 1]
    : undefined;

  const releaserAddress = ensQuery.data?.ensName || lastRelease?.publisher;
  return lastRelease ? (
    <Flex flexDir="column" gap={3} alignItems="end">
      <LinkButton
        href={`/contracts/${releaserAddress}/${lastRelease?.name}/${lastRelease?.version}`}
        noMatch
        size="sm"
        variant="outline"
      >
        {lastRelease?.name} v{lastRelease?.version}
      </LinkButton>
      <Link href={`/${releaserAddress}`}>
        <Text size="label.sm" textAlign="center">
          Released by {shortenIfAddress(releaserAddress)}
        </Text>
      </Link>
    </Flex>
  ) : null;
};
