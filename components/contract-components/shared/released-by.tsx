import { Flex } from "@chakra-ui/react";
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
  return lastRelease ? (
    <Flex flexDir="column" gap={3}>
      <LinkButton
        href={`/contracts/${lastRelease?.publisher}/${lastRelease?.name}/${lastRelease?.version}`}
        noMatch
        size="sm"
      >
        {lastRelease?.name} | {lastRelease?.version}
      </LinkButton>
      <Text size="label.sm" textAlign="center">
        Released by{" "}
        {shortenIfAddress(ensQuery.data?.ensName || lastRelease?.publisher)}
      </Text>
    </Flex>
  ) : null;
};
